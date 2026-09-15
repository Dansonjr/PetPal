const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Pet = require('../models/Pet');
const User = require('../models/User');

// Add a new pet
router.post('/', auth, async (req, res) => {
  try {
    const { name, species, breed, age, photo_url } = req.body;
    if (!name) return res.status(400).json({ error: 'Pet name is required' });
    
    const pet = await Pet.create(req.userId, { name, species, breed, age, photo_url });
    res.status(201).json(pet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user's pets
router.get('/', auth, async (req, res) => {
  try {
    const pets = await Pet.getByUser(req.userId);
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a pet (owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const petId = parseInt(req.params.id);
    const pet = await Pet.getById(petId);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    if (pet.user_id !== req.userId) return res.status(403).json({ error: 'Not your pet' });
    
    const updated = await Pet.update(petId, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a pet
router.delete('/:id', auth, async (req, res) => {
  try {
    const petId = parseInt(req.params.id);
    const pet = await Pet.getById(petId);
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    if (pet.user_id !== req.userId) return res.status(403).json({ error: 'Not your pet' });
    
    await Pet.delete(petId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Find nearby pets (for matching)
router.get('/nearby', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user && user.latitude && user.longitude) {
      const nearby = await Pet.findNearbyWithDistance(
        req.userId,
        user.latitude,
        user.longitude
      );
      return res.json(nearby);
    }

    const nearby = await Pet.findNearby(req.userId);
    res.json(nearby);
  } catch (err) {
    console.error('Nearby pets error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
