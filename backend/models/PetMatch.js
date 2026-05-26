const db = require('../config/db');

class PetMatch {
  // Create a play date request
  static async create(requesterPetId, targetPetId) {
    // Check if request already exists
    const existing = await db.query(
      `SELECT * FROM pet_matches 
       WHERE (requester_pet_id = $1 AND target_pet_id = $2)
          OR (requester_pet_id = $2 AND target_pet_id = $1)`,
      [requesterPetId, targetPetId]
    );
    if (existing.rows.length > 0) {
      throw new Error('Match request already exists');
    }
    const result = await db.query(
      `INSERT INTO pet_matches (requester_pet_id, target_pet_id, status)
       VALUES ($1, $2, 'pending') RETURNING *`,
      [requesterPetId, targetPetId]
    );
    return result.rows[0];
  }

  // Get incoming match requests for a user (based on their pets)
  static async getIncoming(userId) {
    const result = await db.query(
      `SELECT pm.*, 
              p1.name as requester_pet_name, p1.user_id as requester_user_id,
              p2.name as target_pet_name
       FROM pet_matches pm
       JOIN pets p1 ON pm.requester_pet_id = p1.id
       JOIN pets p2 ON pm.target_pet_id = p2.id
       WHERE p2.user_id = $1 AND pm.status = 'pending'`,
      [userId]
    );
    return result.rows;
  }

  // Accept or reject a match request
  static async updateStatus(matchId, userId, action) {
    // Verify the match involves a pet owned by this user
    const check = await db.query(
      `SELECT pm.*, p.user_id as owner_id
       FROM pet_matches pm
       JOIN pets p ON pm.target_pet_id = p.id
       WHERE pm.id = $1 AND p.user_id = $2 AND pm.status = 'pending'`,
      [matchId, userId]
    );
    if (check.rows.length === 0) {
      throw new Error('Match not found or not pending');
    }
    const newStatus = action === 'accept' ? 'accepted' : 'rejected';
    const result = await db.query(
      `UPDATE pet_matches SET status = $1 WHERE id = $2 RETURNING *`,
      [newStatus, matchId]
    );
    return result.rows[0];
  }
}

module.exports = PetMatch;
