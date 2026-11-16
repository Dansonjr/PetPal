const io = require('socket.io-client');

const ALICE_TOKEN = process.env.ALICE_TOKEN;
const BOB_TOKEN = process.env.BOB_TOKEN;

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
