const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const User = require('./models/User');
const Message = require('./models/Message');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
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
  origin: function (origin, callback) {
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

app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// API ROUTES
// ============================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

const friendRoutes = require('./routes/friends');
friendRoutes.setIo(io);
app.use('/api/friends', friendRoutes.router);

app.use('/api/pets', require('./routes/pets'));
app.use('/api/pet-matches', require('./routes/petmatches')); 
app.use('/api/messages', require('./routes/messages'));
app.use('/api/location', require('./routes/location'));

app.get('/', (req, res) => {
  res.send('PetPal API running');
});

// ============================================
// SOCKET.IO AUTHENTICATION + EVENTS
// ============================================
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication error'));

  const decoded = User.verifyToken(token);
  if (!decoded) return next(new Error('Invalid token'));

  socket.userId = decoded.id;
  next();
});

io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected`);
  socket.join(`user_${socket.userId}`);

  socket.on('private message', async ({ receiverId, content }, callback) => {
    if (!receiverId || !content) {
      return callback?.({ success: false, error: 'receiverId and content are required' });
    }

    try {
      const message = await Message.create({
        senderId: socket.userId,
        receiverId: parseInt(receiverId, 10),
        content
      });

      const payload = {
        ...message,
        senderId: socket.userId,
        receiverId: parseInt(receiverId, 10)
      };

      io.to(`user_${receiverId}`).emit('private message', payload);
      socket.emit('private message', payload);
      callback?.({ success: true, message: payload });
    } catch (error) {
      console.error('Private message error:', error);
      callback?.({ success: false, error: 'Failed to send message' });
    }
  });

  socket.on('typing', ({ receiverId, isTyping }) => {
    if (!receiverId) return;
    io.to(`user_${receiverId}`).emit('user typing', {
      userId: socket.userId,
      isTyping: !!isTyping
    });
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
});
