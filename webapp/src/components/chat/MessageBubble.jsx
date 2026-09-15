import React from 'react';

const MessageBubble = ({ message, isOwn, darkMode }) => {
  const date = new Date(message.created_at);
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{
      display: 'flex',
      justifyContent: isOwn ? 'flex-end' : 'flex-start',
      marginBottom: '12px',
      gap: '8px'
    }}>
      {!isOwn && (
        <div style={{
          width: '32px',
          height: '32px',
          background: '#667eea',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          color: 'white',
          flexShrink: 0
        }}>
          👤
        </div>
      )}
      <div style={{
        maxWidth: '70%',
        padding: '10px 14px',
        borderRadius: '12px',
        background: isOwn ? '#667eea' : (darkMode ? '#444' : '#e8e8e8'),
        color: isOwn ? 'white' : (darkMode ? '#fff' : '#333'),
        wordWrap: 'break-word',
        lineHeight: '1.4'
      }}>
        <div>{message.content}</div>
        <div style={{
          fontSize: '10px',
          marginTop: '4px',
          color: isOwn ? '#d0d0d0' : (darkMode ? '#999' : '#666'),
          textAlign: 'right'
        }}>
          {timeStr}
          {isOwn && message.is_read && <span> ✓✓</span>}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
