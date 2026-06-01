import React from 'react';

const MessageBubble = ({ message, isOwn }) => {
  const date = new Date(message.created_at);
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{
      display: 'flex',
      justifyContent: isOwn ? 'flex-end' : 'flex-start',
      marginBottom: '12px'
    }}>
      <div style={{
        maxWidth: '70%',
        padding: '10px 14px',
        borderRadius: '12px',
        background: isOwn ? '#667eea' : '#f0f0f0',
        color: isOwn ? 'white' : '#333',
        wordWrap: 'break-word'
      }}>
        <div>{message.content}</div>
        <div style={{
          fontSize: '10px',
          marginTop: '4px',
          color: isOwn ? '#d0d0d0' : '#999',
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
