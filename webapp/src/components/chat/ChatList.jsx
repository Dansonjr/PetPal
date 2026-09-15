import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';

const ChatList = ({ onSelectChat, selectedUserId }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/friends');
      const convos = response.data.map(friend => ({
        ...friend,
        lastMessage: 'Say hello!',
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

  const filteredConvos = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: `1px solid ${darkMode ? '#444' : '#e0e0e0'}`,
        background: darkMode ? '#2a2a2a' : 'white'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: darkMode ? '#fff' : '#333' }}>Messages</h3>
        <input
          type="text"
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: `1px solid ${darkMode ? '#444' : '#ddd'}`,
            borderRadius: '8px',
            fontSize: '13px',
            background: darkMode ? '#1a1a1a' : '#f5f5f5',
            color: darkMode ? '#fff' : '#333'
          }}
        />
      </div>

      {/* Conversations List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px'
      }}>
        {filteredConvos.length === 0 ? (
          <div style={{
            padding: '16px',
            textAlign: 'center',
            color: darkMode ? '#888' : '#999',
            fontSize: '13px'
          }}>
            {conversations.length === 0 ? 'No friends yet' : 'No matches found'}
          </div>
        ) : (
          filteredConvos.map(convo => (
            <div
              key={convo.id}
              onClick={() => onSelectChat(convo)}
              style={{
                padding: '12px',
                marginBottom: '6px',
                background: selectedUserId === convo.id
                  ? '#667eea20'
                  : (darkMode ? '#1a1a1a' : '#f9f9f9'),
                borderLeft: selectedUserId === convo.id ? '3px solid #667eea' : '3px solid transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: `1px solid ${selectedUserId === convo.id ? '#667eea' : (darkMode ? '#444' : '#e0e0e0')}`,
                borderLeft: selectedUserId === convo.id ? '3px solid #667eea' : `1px solid ${darkMode ? '#444' : '#e0e0e0'}`
              }}
              onMouseEnter={(e) => e.target.style.background = darkMode ? '#333' : '#f0f0f0'}
              onMouseLeave={(e) => e.target.style.background = selectedUserId === convo.id ? '#667eea20' : (darkMode ? '#1a1a1a' : '#f9f9f9')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1
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
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: 500,
                      color: darkMode ? '#fff' : '#333',
                      fontSize: '14px'
                    }}>
                      {convo.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: darkMode ? '#999' : '#999',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {convo.lastMessage}
                    </div>
                  </div>
                </div>
                {convo.unreadCount > 0 && (
                  <span style={{
                    background: '#e53e3e',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {convo.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
