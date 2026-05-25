const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Friend = require('../models/Friend');

let io;
function setIo(socketIo) {
  io = socketIo;
}

router.post('/requests', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    if (userId === req.userId) return res.status(400).json({ error: 'Cannot send request to yourself' });
    
    const request = await Friend.sendRequest(req.userId, userId);
    if (io) {
      io.to(`user_${userId}`).emit('friend_request', {
        requestId: request.id,
        fromUserId: req.userId
      });
    }
    res.status(201).json(request);
  } catch (err) {
    if (err.message === 'Friend request already exists') {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/requests', auth, async (req, res) => {
  try {
    const requests = await Friend.getPendingRequests(req.userId);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/requests/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    if (!action || !['accept', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'action must be "accept" or "reject"' });
    }

    let result;
    if (action === 'accept') {
      result = await Friend.acceptRequest(parseInt(id), req.userId);
      if (io && result) {
        io.to(`user_${result.requester_id}`).emit('friend_request_accepted', {
          requestId: result.id,
          byUserId: req.userId
        });
      }
    } else {
      result = await Friend.rejectRequest(parseInt(id), req.userId);
    }
    res.json(result);
  } catch (err) {
    if (err.message === 'Request not found or not pending') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const friends = await Friend.getFriends(req.userId);
    res.json(friends);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = { router, setIo };
