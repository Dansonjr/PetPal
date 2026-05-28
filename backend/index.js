const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

const friendRoutes = require('./routes/friends');
friendRoutes.setIo(io);
app.use('/api/friends', friendRoutes.router);

app.use('/api/pets', require('./routes/pets'));
app.use('/api/pet-matches', require('./routes/petmatches'));

// Message routes (will add in step 4)
app.use('/api/messages', require('./routes/messages'));

app.get('/', (req, res) => res.send('PetPal API running'));

// Socket.io authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

// Import Message model for database saving
const Message = require('./models/Message');

io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected`);
  socket.join(`user_${socket.userId}`);

  // Handle sending a private message (NOW WITH DATABASE SAVE)
  socket.on('private message', async ({ receiverId, content }, callback) => {
    try {
      // Save to database
      const savedMessage = await Message.create({
        senderId: socket.userId,
        receiverId: receiverId,
        content: content
      });
      
      // Emit to receiver's room
      io.to(`user_${receiverId}`).emit('private message', {
        id: savedMessage.id,
        senderId: socket.userId,
        receiverId: receiverId,
        content: content,
        is_read: false,
        created_at: savedMessage.created_at
      });
      
      // Send acknowledgment to sender
      if (callback) callback({ success: true, messageId: savedMessage.id });
    } catch (err) {
      console.error('Error saving message:', err);
      if (callback) callback({ success: false, error: 'Database error' });
    }
  });

  // Handle mark as read
  socket.on('mark read', async ({ senderId }) => {
    try {
      await Message.markAsRead(socket.userId, senderId);
      // Notify sender that messages were read
      io.to(`user_${senderId}`).emit('messages read', {
        byUserId: socket.userId
      });
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server on port ${PORT}`));
