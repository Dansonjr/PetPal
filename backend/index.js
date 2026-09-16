const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const User = require('./models/User');
const Message = require('./models/Message');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

// ============================================
// SECURITY MIDDLEWARE
// ============================================
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
});

app.use(limiter);

// ============================================
// CORS CONFIGURATION - Allow both local and production
// ============================================
const allowedOrigins = [
  'https://luminous-marzipan-2814af.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://petpal.netlify.app'
];

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }
});

app.use(cors({
  // ... your CORS middleware config here
}));