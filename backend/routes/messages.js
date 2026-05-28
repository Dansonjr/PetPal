const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

// Get conversation with another user
router.get('/:userId', auth, async (req, res) => {
  try {
    const otherUserId = parseInt(req.params.userId);
    if (isNaN(otherUserId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const messages = await Message.getConversation(
      req.userId,
      otherUserId,
      limit,
      offset
    );
    
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark messages from a specific sender as read
router.put('/read/:senderId', auth, async (req, res) => {
  try {
    const senderId = parseInt(req.params.senderId);
    if (isNaN(senderId)) {
      return res.status(400).json({ error: 'Invalid sender ID' });
    }
    
    const updated = await Message.markAsRead(req.userId, senderId);
    res.json({ success: true, count: updated.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get unread message count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Message.getUnreadCount(req.userId);
    res.json({ unread_count: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
