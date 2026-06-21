const express = require('express');
const router = express.Router();
const User = require('../models/User');

// In-memory storage (for demo purposes)
const users = [];
let nextId = 1;

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Create user
    const user = { 
      id: nextId++, 
      email, 
      name, 
      password, // In production, hash this!
      bio: null,
      location: null,
      profile_photo_url: null,
      created_at: new Date().toISOString()
    };
    users.push(user);
    
    // Return fake token (for demo)
    const token = 'fake-jwt-token-' + user.id;
    
    res.status(201).json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        bio: user.bio,
        location: user.location,
        profile_photo_url: user.profile_photo_url,
        created_at: user.created_at
      } 
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = 'fake-jwt-token-' + user.id;
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        bio: user.bio,
        location: user.location,
        profile_photo_url: user.profile_photo_url,
        created_at: user.created_at
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
