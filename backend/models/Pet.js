const db = require('../config/db');

class Pet {
  // Create a new pet
  static async create(userId, { name, species, breed, age, photo_url }) {
    const result = await db.query(
      `INSERT INTO pets (user_id, name, species, breed, age, photo_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, name, species, breed, age, photo_url || null]
    );
    return result.rows[0];
  }

  // Get all pets for a user
  static async getByUser(userId) {
    const result = await db.query(
      `SELECT * FROM pets WHERE user_id = $1 ORDER BY id`,
      [userId]
    );
    return result.rows;
  }

  // Get a single pet by id (with owner check)
  static async getById(petId) {
    const result = await db.query(`SELECT * FROM pets WHERE id = $1`, [petId]);
    return result.rows[0];
  }

  // Update a pet (owner validation done in route)
  static async update(petId, { name, species, breed, age, photo_url }) {
    const result = await db.query(
      `UPDATE pets 
       SET name = COALESCE($1, name),
           species = COALESCE($2, species),
           breed = COALESCE($3, breed),
           age = COALESCE($4, age),
           photo_url = COALESCE($5, photo_url)
       WHERE id = $6
       RETURNING *`,
      [name, species, breed, age, photo_url, petId]
    );
    return result.rows[0];
  }

  // Delete a pet
  static async delete(petId) {
    const result = await db.query(`DELETE FROM pets WHERE id = $1 RETURNING *`, [petId]);
    return result.rows[0];
  }

  // Find nearby pets (simplistic: all pets except owner's)
  static async findNearby(userId, limit = 20) {
    const result = await db.query(
      `SELECT p.*, u.name as owner_name, u.id as owner_id
       FROM pets p
       JOIN users u ON p.user_id = u.id
       WHERE u.id != $1
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  }
}

module.exports = Pet;
