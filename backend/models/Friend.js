const db = require('../config/db');

class Friend {
  // Send a friend request
  static async sendRequest(requesterId, addresseeId) {
    // Check if request already exists
    const existing = await db.query(
      `SELECT * FROM friendships 
       WHERE (requester_id = $1 AND addressee_id = $2)
          OR (requester_id = $2 AND addressee_id = $1)`,
      [requesterId, addresseeId]
    );
    if (existing.rows.length > 0) {
      throw new Error('Friend request already exists');
    }
    const result = await db.query(
      `INSERT INTO friendships (requester_id, addressee_id, status)
       VALUES ($1, $2, 'pending') RETURNING *`,
      [requesterId, addresseeId]
    );
    return result.rows[0];
  }

  // Get pending requests for a user (incoming)
  static async getPendingRequests(userId) {
    const result = await db.query(
      `SELECT f.*, 
              u.id as sender_id, u.name as sender_name, u.email as sender_email, u.profile_photo_url as sender_photo
       FROM friendships f
       JOIN users u ON f.requester_id = u.id
       WHERE f.addressee_id = $1 AND f.status = 'pending'`,
      [userId]
    );
    return result.rows;
  }

  // Accept a friend request
  static async acceptRequest(requestId, userId) {
    // Verify the request is for this user
    const check = await db.query(
      `SELECT * FROM friendships WHERE id = $1 AND addressee_id = $2 AND status = 'pending'`,
      [requestId, userId]
    );
    if (check.rows.length === 0) {
      throw new Error('Request not found or not pending');
    }
    const result = await db.query(
      `UPDATE friendships SET status = 'accepted' WHERE id = $1 RETURNING *`,
      [requestId]
    );
    return result.rows[0];
  }

  // Reject a friend request
  static async rejectRequest(requestId, userId) {
    const check = await db.query(
      `SELECT * FROM friendships WHERE id = $1 AND addressee_id = $2 AND status = 'pending'`,
      [requestId, userId]
    );
    if (check.rows.length === 0) {
      throw new Error('Request not found or not pending');
    }
    const result = await db.query(
      `UPDATE friendships SET status = 'rejected' WHERE id = $1 RETURNING *`,
      [requestId]
    );
    return result.rows[0];
  }

  // Get list of accepted friends for a user
  static async getFriends(userId) {
    const result = await db.query(
      `SELECT u.id, u.name, u.email, u.profile_photo_url
       FROM friendships f
       JOIN users u ON (u.id = f.requester_id OR u.id = f.addressee_id)
       WHERE (f.requester_id = $1 OR f.addressee_id = $1)
         AND f.status = 'accepted'
         AND u.id != $1`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = Friend;
