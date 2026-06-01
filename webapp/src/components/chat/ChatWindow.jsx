import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { getSocket } from '../../services/socket';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ friend, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = getSocket();

  useEffect(() => {
    if (friend) {
      fetchMessages();
      markAsRead();
      
      // Join room for this chat
      if (socket) {
        socket.emit('join chat', friend.id);
      }
    }
  }, [friend]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (msg.senderId === friend?.id || msg.receiverId === friend?.id) {
        setMessages(prev => [...prev, msg]);
        if (msg.senderId === friend?.id) {
          markAsRead();
        }
      }
    };

    const handleTyping = (data) => {
      if (data.userId === friend?.id) {
        setOtherUserTyping(data.isTyping);
      }
    };

    socket.on('private message', handleNewMessage);
    socket.on('user typing', handleTyping);

    return () => {
      socket.off('private message', handleNewMessage);
      socket.off('user typing', handleTyping);
    };
  }, [socket, friend]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/messages/${friend.id}`);
      setMessages(response.data.reverse()); // Oldest first
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await api.put(`/messages/read/${friend.id}`);
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const messageContent = newMessage;
    setNewMessage('');

    socket.emit('private message', {
      receiverId: friend.id,
      content: messageContent
    }, (response) => {
      if (response && response.success) {
        // Message saved on server, will be received via socket
        console.log('Message sent', response);
      }
    });
  };

  const handleTypingStart = () => {
    if (!typing && socket) {
      setTyping(true);
      socket.emit('typing', { receiverId: friend.id, isTyping: true });
    }
  };

  const handleTypingStop = () => {
    if (typing && socket) {
      setTyping(false);
      socket.emit('typing', { receiverId: friend.id, isTyping: false });
    }
  };

  if (!friend) {
    return (
      <div className="card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#666' }}>Select a friend to start chatting</p>
      </div>
    );
  }

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '15px', borderBottom: '2px solid #e0e0e0', background: '#f9f9f9' }}>
        <h3 style={{ margin: 0 }}>Chat with {friend.name}</h3>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', minHeight: '400px' }}>
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>No messages yet. Say hello!</p>
        ) : (
          messages.map(msg => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender_id === userId}
            />
          ))
        )}
        {otherUserTyping && (
          <div style={{ color: '#666', fontSize: '12px', fontStyle: 'italic' }}>
            {friend.name} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={{ padding: '15px', borderTop: '2px solid #e0e0e0', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleTypingStart}
          onKeyUp={handleTypingStop}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '2px solid #e0e0e0' }}
        />
        <button type="submit" className="btn btn-primary">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
