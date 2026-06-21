const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class User {
  static async create({ email, password, name }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT u.id, u.email, u.name, u.location, u.bio, u.profile_photo_url, u.created_at,
              COALESCE(json_agg(p.*) FILTER (WHERE p.id IS NOT NULL), '[]') as pets
       FROM users u
       LEFT JOIN pets p ON u.id = p.user_id
       WHERE u.id = $1
       GROUP BY u.id`,
      [id]
    );
    return result.rows[0];
  }

  static generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return null;
    }
  }

  // Update user location
  static async updateLocation(userId, latitude, longitude) {
    const result = await db.query(
      `UPDATE users 
       SET latitude = $1, longitude = $2, location_updated_at = NOW()
       WHERE id = $3
       RETURNING id, name, latitude, longitude`,
      [latitude, longitude, userId]
    );
    return result.rows[0];
  }

  // Get nearby users
  static async getNearbyUsers(userId, maxDistance = 50, limit = 20) {
    const user = await this.findById(userId);
    if (!user || !user.latitude || !user.longitude) {
      throw new Error('User location not set');
    }
    
    const result = await db.query(
      `SELECT id, name, email, latitude, longitude,
              (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * 
              cos(radians(longitude) - radians($2)) + sin(radians($1)) * 
              sin(radians(latitude)))) AS distance
       FROM users
       WHERE id != $3 AND latitude IS NOT NULL AND longitude IS NOT NULL
       ORDER BY distance
       LIMIT $4`,
      [user.latitude, user.longitude, userId, limit]
    );
    return result.rows;
  }
}

module.exports = User;
