import React, { useState } from 'react';
import api from '../../services/api';

const MatchRequestCard = ({ request, onAccept, onReject }) => {
  const [processing, setProcessing] = useState(false);

  const handleAccept = async () => {
    setProcessing(true);
    try {
      await api.put(`/pet-matches/${request.id}`, { action: 'accept' });
      onAccept(request.id);
      alert('Play date request accepted!');
    } catch (err) {
      alert('Failed to accept request');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    setProcessing(true);
    try {
      await api.put(`/pet-matches/${request.id}`, { action: 'reject' });
      onReject(request.id);
      alert('Request rejected');
    } catch (err) {
      alert('Failed to reject request');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="pet-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0 }}>🐕 {request.requester_pet_name}</h3>
        <p style={{ margin: '5px 0', color: '#666' }}>
          wants to play with <strong>{request.target_pet_name}</strong>
        </p>
        <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
          Requested: {new Date(request.created_at).toLocaleDateString()}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={handleAccept} 
          className="btn btn-success" 
          disabled={processing}
        >
          Accept
        </button>
        <button 
          onClick={handleReject} 
          className="btn btn-danger" 
          disabled={processing}
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default MatchRequestCard;
