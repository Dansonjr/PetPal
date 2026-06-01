import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ChatList = ({ onSelectChat, selectedUserId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      // Get friends list (these are potential chats)
      const response = await api.get('/friends');
      // For each friend, get last message (simplified - we'll enhance later)
      const convos = response.data.map(friend => ({
        ...friend,
        lastMessage: 'Click to start chatting',
        lastMessageTime: new Date(),
        unreadCount: 0
      }));
      setConversations(convos);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="card" style={{ height: '100%', overflowY: 'auto' }}>
      <h3>Messages</h3>
      {conversations.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No friends yet. Add friends to chat!</p>
      ) : (
        conversations.map(convo => (
          <div
            key={convo.id}
            onClick={() => onSelectChat(convo)}
            style={{
              padding: '12px',
              marginBottom: '8px',
              background: selectedUserId === convo.id ? '#667eea20' : 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              border: selectedUserId === convo.id ? '2px solid #667eea' : '1px solid #e0e0e0'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{convo.name}</strong>
              {convo.unreadCount > 0 && (
                <span style={{
                  background: '#e53e3e',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 8px',
                  fontSize: '12px'
                }}>
                  {convo.unreadCount}
                </span>
              )}
            </div>
            <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#666' }}>
              {convo.lastMessage}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatList;
