import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { connectSocket, getSocket, disconnectSocket } from '../services/socket';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';

const Chat = () => {
  const { user, token } = useAuth();
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
    <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 200px)' }}>
      <div style={{ flex: '0.4' }}>
        <ChatList onSelectChat={handleSelectChat} selectedUserId={selectedChat?.id} />
      </div>
      <div style={{ flex: '0.6' }}>
        <ChatWindow friend={selectedChat} userId={user?.id} />
      </div>
    </div>
  );
};

export default Chat;
