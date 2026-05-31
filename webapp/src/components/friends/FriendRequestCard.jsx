import React from 'react';
import api from '../../services/api';

const FriendRequestCard = ({ request, onAccept, onReject }) => {
  const handleAccept = async () => {
    try {
      await api.put(`/friends/requests/${request.id}`, { action: 'accept' });
      onAccept(request.id);
    } catch (err) {
      alert('Failed to accept request');
    }
  };

  const handleReject = async () => {
    try {
      await api.put(`/friends/requests/${request.id}`, { action: 'reject' });
      onReject(request.id);
    } catch (err) {
      alert('Failed to reject request');
    }
  };

  return (
    <div className="pet-card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <div style={{
        width: '50px',
        height: '50px',
        background: '#ffc107',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px'
      }}>
        👤
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0 }}>{request.sender_name}</h3>
        <p style={{ margin: '5px 0 0', color: '#666', fontSize: '14px' }}>{request.sender_email}</p>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={handleAccept} className="btn btn-success" style={{ padding: '8px 16px' }}>
          Accept
        </button>
        <button onClick={handleReject} className="btn btn-danger" style={{ padding: '8px 16px' }}>
          Reject
        </button>
      </div>
    </div>
  );
};

export default FriendRequestCard;
