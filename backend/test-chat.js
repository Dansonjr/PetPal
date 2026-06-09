const io = require('socket.io-client');

// REPLACE THESE WITH YOUR ACTUAL TOKENS FROM ABOVE
const ALICE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbGljZUBleGFtcGxlLmNvbSIsImlhdCI6MTc3OTk2MjY2MiwiZXhwIjoxNzgwNTY3NDYyfQ.-nVvj0FKOIyTXSmrZ3AdW7fvGayng6aHluWENMYyFSA';
const BOB_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJib2JAZXhhbXBsZS5jb20iLCJpYXQiOjE3Nzk5NjI2NjIsImV4cCI6MTc4MDU2NzQ2Mn0.URew1fY8AoK1bm9Y2d7T52uh5iC25qwTnLe4C7Z5Dx0';

// Connect as Alice
const aliceSocket = io('http://localhost:5000', {
  auth: { token: ALICE_TOKEN }
});

// Connect as Bob
const bobSocket = io('http://localhost:5000', {
  auth: { token: BOB_TOKEN }
});

aliceSocket.on('connect', () => {
  console.log('✅ Alice connected');
  // Send message to Bob after 1 second
  setTimeout(() => {
    console.log('📤 Alice sending message to Bob...');
    aliceSocket.emit('private message', {
      receiverId: 2,
      content: 'Hello Bob! Want to meet at the park?'
    }, (response) => {
      console.log('📨 Message sent response:', response);
    });
  }, 1000);
});

bobSocket.on('connect', () => {
  console.log('✅ Bob connected');
});

bobSocket.on('private message', (msg) => {
  console.log('💬 Bob received:', msg);
  
  // Mark as read after receiving
  console.log('👀 Bob marking message as read...');
  bobSocket.emit('mark read', { senderId: msg.senderId });
});

aliceSocket.on('messages read', (data) => {
  console.log('✅ Alice: Bob read my messages', data);
});

// Keep alive for 5 seconds then exit
setTimeout(() => {
  console.log('⏹️ Test complete, exiting...');
  process.exit(0);
}, 5000);
