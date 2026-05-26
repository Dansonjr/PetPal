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

io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected`);
  socket.join(`user_${socket.userId}`);

  socket.on('private message', async ({ receiverId, content }) => {
    // TODO: Save to DB later
    io.to(`user_${receiverId}`).emit('private message', {
      senderId: socket.userId,
      content,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server on port ${PORT}`));
