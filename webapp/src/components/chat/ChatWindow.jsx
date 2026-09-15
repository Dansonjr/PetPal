import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { getSocket } from '../../services/socket';
import { useTheme } from '../../contexts/ThemeContext';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ friend, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { darkMode } = useTheme();
  const socket = getSocket();

  useEffect(() => {
    if (friend) {
      fetchMessages();
      markAsRead();
      
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
      setMessages(response.data.reverse());
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

    setSending(true);
    const messageContent = newMessage;
    setNewMessage('');
    setTyping(false);

    socket.emit('private message', {
      receiverId: friend.id,
      content: messageContent
    }, (response) => {
      if (response && response.success) {
        console.log('Message sent');
      }
      setSending(false);
    });
  };

  const handleTypingStart = () => {
    if (!typing && socket) {
      setTyping(true);
      socket.emit('typing', { receiverId: friend.id, isTyping: true });
    }
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      socket.emit('typing', { receiverId: friend.id, isTyping: false });
    }, 2000);
  };

  if (!friend) {
    return null;
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: `1px solid ${darkMode ? '#444' : '#e0e0e0'}`,
        background: darkMode ? '#2a2a2a' : 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: '#667eea',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          color: 'white'
        }}>
          👤
        </div>
        <div>
          <h3 style={{ margin: 0, color: darkMode ? '#fff' : '#333' }}>{friend.name}</h3>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: darkMode ? '#888' : '#999' }}>
            {friend.email}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: darkMode ? '#888' : '#999',
            marginTop: 'auto',
            marginBottom: 'auto'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>👋</div>
            <p>No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map(msg => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender_id === userId}
              darkMode={darkMode}
            />
          ))
        )}
        {otherUserTyping && (
          <div style={{ color: darkMode ? '#888' : '#999', fontSize: '12px', fontStyle: 'italic', marginTop: '8px' }}>
            {friend.name} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form 
        onSubmit={handleSendMessage} 
        style={{
          padding: '16px',
          borderTop: `1px solid ${darkMode ? '#444' : '#e0e0e0'}`,
          background: darkMode ? '#2a2a2a' : 'white',
          display: 'flex',
          gap: '10px'
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleTypingStart}
          placeholder="Type a message..."
          disabled={sending}
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: '8px',
            border: `1px solid ${darkMode ? '#444' : '#ddd'}`,
            fontSize: '14px',
            background: darkMode ? '#1a1a1a' : '#f5f5f5',
            color: darkMode ? '#fff' : '#333'
          }}
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={sending || !newMessage.trim()}
          style={{ padding: '8px 16px' }}
        >
          {sending ? '...' : '📤 Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
