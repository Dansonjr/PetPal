import React from 'react';
import { useNavigate } from 'react-router-dom';

const FriendCard = ({ friend }) => {
  const navigate = useNavigate();

  return (
    <div className="pet-card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <div style={{
        width: '60px',
        height: '60px',
        background: '#667eea',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px'
      }}>
        🐾
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0 }}>{friend.name}</h3>
        <p style={{ margin: '5px 0 0', color: '#666', fontSize: '14px' }}>{friend.email}</p>
      </div>
      <button 
        className="btn btn-primary" 
        style={{ padding: '8px 16px' }}
        onClick={() => navigate('/dashboard?tab=chat')}
      >
        💬 Message
      </button>
    </div>
  );
};

export default FriendCard;
