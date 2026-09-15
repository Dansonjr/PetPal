import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { connectSocket, getSocket } from '../services/socket';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import { useTheme } from '../contexts/ThemeContext';

const Chat = () => {
  const { user, token } = useAuth();
  const { darkMode } = useTheme();
  const [selectedChat, setSelectedChat] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token && !getSocket()) {
      const newSocket = connectSocket(token);
      setSocket(newSocket);
    }

    return () => {
      // Don't disconnect on unmount, keep for other components
    };
  }, [token]);

  const handleSelectChat = (friend) => {
    setSelectedChat(friend);
  };

  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      height: 'calc(100vh - 180px)',
      background: darkMode ? '#1a1a1a' : '#f5f7fa'
    }}>
      {/* Chat List */}
      <div style={{
        width: '320px',
        background: darkMode ? '#2a2a2a' : 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <ChatList onSelectChat={handleSelectChat} selectedUserId={selectedChat?.id} />
      </div>

      {/* Chat Window */}
      <div style={{
        flex: 1,
        background: darkMode ? '#2a2a2a' : 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {selectedChat ? (
          <ChatWindow friend={selectedChat} userId={user?.id} />
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: darkMode ? '#888' : '#ccc',
            fontSize: '16px',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ fontSize: '48px' }}>💬</div>
            <p>Select a friend to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
