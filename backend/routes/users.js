const express = require('express');
const router = express.Router();

// Get current user (protected route)
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  // Fake token validation
  if (token.startsWith('fake-jwt-token-')) {
    const userId = parseInt(token.split('-').pop());
    return res.json({ 
      id: userId, 
      email: 'alice@example.com', 
      name: 'Alice',
      bio: 'Pet lover',
      location: 'New York'
    });
  }
  
  res.status(401).json({ error: 'Invalid token' });
});

module.exports = router;
