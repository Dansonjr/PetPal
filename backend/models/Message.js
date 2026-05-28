const db = require('../config/db');

class Message {
  // Save a new message to database
  static async create({ senderId, receiverId, content }) {
    const result = await db.query(
      `INSERT INTO messages (sender_id, receiver_id, content, is_read)
       VALUES ($1, $2, $3, FALSE)
       RETURNING *`,
      [senderId, receiverId, content]
    );
    return result.rows[0];
  }

  // Get conversation between two users (paginated, latest first)
  static async getConversation(userId1, userId2, limit = 50, offset = 0) {
    const result = await db.query(
      `SELECT m.*, 
              u_sender.name as sender_name,
              u_receiver.name as receiver_name
       FROM messages m
       JOIN users u_sender ON m.sender_id = u_sender.id
       JOIN users u_receiver ON m.receiver_id = u_receiver.id
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at DESC
       LIMIT $3 OFFSET $4`,
      [userId1, userId2, limit, offset]
    );
    return result.rows;
  }

  // Mark messages as read (for a receiver, from a specific sender)
  static async markAsRead(receiverId, senderId) {
    const result = await db.query(
      `UPDATE messages 
       SET is_read = TRUE 
       WHERE receiver_id = $1 AND sender_id = $2 AND is_read = FALSE
       RETURNING *`,
      [receiverId, senderId]
    );
    return result.rows;
  }

  // Get unread count for a user
  static async getUnreadCount(userId) {
    const result = await db.query(
      `SELECT COUNT(*) as unread_count
       FROM messages
       WHERE receiver_id = $1 AND is_read = FALSE`,
      [userId]
    );
    return parseInt(result.rows[0].unread_count);
  }
}

module.exports = Message;
