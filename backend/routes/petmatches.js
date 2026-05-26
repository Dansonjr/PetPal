const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Pet = require('../models/Pet');
const PetMatch = require('../models/PetMatch');

// Send a match request from one of your pets to another pet
router.post('/', auth, async (req, res) => {
  try {
    const { requesterPetId, targetPetId } = req.body;
    if (!requesterPetId || !targetPetId) {
      return res.status(400).json({ error: 'requesterPetId and targetPetId required' });
    }
    // Verify requesterPet belongs to current user
    const requesterPet = await Pet.getById(requesterPetId);
    if (!requesterPet || requesterPet.user_id !== req.userId) {
      return res.status(403).json({ error: 'Invalid requester pet' });
    }
    // Verify targetPet exists
    const targetPet = await Pet.getById(targetPetId);
    if (!targetPet) return res.status(404).json({ error: 'Target pet not found' });
    
    const match = await PetMatch.create(requesterPetId, targetPetId);
    res.status(201).json(match);
  } catch (err) {
    if (err.message === 'Match request already exists') {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get incoming match requests (for current user's pets)
router.get('/incoming', auth, async (req, res) => {
  try {
    const matches = await PetMatch.getIncoming(req.userId);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Accept or reject a match request
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    if (!action || !['accept', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'action must be "accept" or "reject"' });
    }
    const updated = await PetMatch.updateStatus(parseInt(id), req.userId, action);
    res.json(updated);
  } catch (err) {
    if (err.message === 'Match not found or not pending') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
