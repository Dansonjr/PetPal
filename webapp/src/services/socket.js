import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (token) => {
  if (socket && socket.connected) return socket;

  const baseUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
  socket = io(baseUrl.replace(/\/$/, ''), {
    auth: { token },
    transports: ['websocket'],
    reconnectionAttempts: 3,
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connect error:', err.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
