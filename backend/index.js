const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// ============================================
// CORS CONFIGURATION - Allow both local and production
// ============================================
const allowedOrigins = [
  'https://luminous-marzipan-2814af.netlify.app',  // Your live Netlify URL
  'http://localhost:5173',                         // Local Vite dev server
  'http://localhost:3000',                         // Alternative local port
  'http://127.0.0.1:5173',                         // Localhost alias
  'https://petpal.netlify.app'                     // Your custom Netlify domain (if any)
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// API ROUTES
// ============================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Friend routes with Socket.io integration
const friendRoutes = require('./routes/friends');
// Set io later when available
app.use('/api/friends', friendRoutes.router);

app.use('/api/pets', require('./routes/pets'));
app.use('/api/pet-matches', require('./routes/petmatches'));
app.use('/api/messages', require('./routes/messages'));

// ============================================
// HEALTH CHECK ROUTE
// ============================================
app.get('/', (req, res) => {
  res.send('PetPal API running');
});

// ============================================
// ERROR HANDLING
// ============================================
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
});
