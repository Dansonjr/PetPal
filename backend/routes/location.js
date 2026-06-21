const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Pet = require('../models/Pet');
const locationService = require('../services/locationService');

// Update user location
router.post('/update', auth, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }
    
    const updated = await User.updateLocation(req.userId, latitude, longitude);
    res.json({ success: true, user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Geocode address to coordinates
router.post('/geocode', auth, async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ error: 'Address required' });
    }
    
    const apiKey = process.env.OPENCAGE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Geocoding API key not configured' });
    }
    
    const result = await locationService.geocodeAddress(address, apiKey);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: 'Address not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Geocoding failed' });
  }
});

// Get nearby users
router.get('/nearby-users', auth, async (req, res) => {
  try {
    const maxDistance = parseInt(req.query.maxDistance) || 50;
    const limit = parseInt(req.query.limit) || 20;
    
    const users = await User.getNearbyUsers(req.userId, maxDistance, limit);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to get nearby users' });
  }
});

// Get nearby pets
router.get('/nearby-pets', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.latitude || !user.longitude) {
      return res.status(400).json({ error: 'Your location not set' });
    }
    
    const maxDistance = parseInt(req.query.maxDistance) || 50;
    const limit = parseInt(req.query.limit) || 20;
    
    const pets = await Pet.findNearbyWithDistance(
      req.userId, 
      user.latitude, 
      user.longitude, 
      maxDistance, 
      limit
    );
    res.json(pets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get nearby pets' });
  }
});

module.exports = router;
