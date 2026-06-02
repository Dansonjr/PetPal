import React, { useState } from 'react';
import api from '../../services/api';

const MatchPetCard = ({ pet, onMatchSent }) => {
  const [sending, setSending] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const handleSendMatchRequest = async () => {
    setSending(true);
    try {
      // Get user's pets first (need a pet ID to send from)
      const userPetsResponse = await api.get('/pets');
      const userPets = userPetsResponse.data;
      
      if (userPets.length === 0) {
        alert('Please add a pet first before sending match requests!');
        setSending(false);
        return;
      }
      
      // Use the first pet as requester (simplified - in production, let user choose)
      const requesterPetId = userPets[0].id;
      
      await api.post('/pet-matches', {
        requesterPetId: requesterPetId,
        targetPetId: pet.id
      });
      
      setRequestSent(true);
      if (onMatchSent) onMatchSent(pet.id);
      alert('Play date request sent!');
    } catch (err) {
      if (err.response?.data?.error === 'Match request already exists') {
        alert('Match request already sent!');
      } else {
        alert('Failed to send match request');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pet-card">
      {pet.photo_url ? (
        <img 
          src={pet.photo_url} 
          alt={pet.name}
          style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
        />
      ) : (
        <div style={{ 
          width: '100%', 
          height: '150px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderRadius: '8px',
          fontSize: '48px'
        }}>
          🐾
        </div>
      )}
      <h3>{pet.name}</h3>
      <p><strong>Owner:</strong> {pet.owner_name}</p>
      <p><strong>Species:</strong> {pet.species || 'Not specified'}</p>
      <p><strong>Breed:</strong> {pet.breed || 'Not specified'}</p>
      <p><strong>Age:</strong> {pet.age || 'Unknown'}</p>
      {requestSent ? (
        <button className="btn" style={{ background: '#28a745', color: 'white', width: '100%' }} disabled>
          ✓ Request Sent
        </button>
      ) : (
        <button 
          onClick={handleSendMatchRequest} 
          className="btn btn-primary" 
          disabled={sending}
          style={{ width: '100%' }}
        >
          {sending ? 'Sending...' : '🐶 Request Play Date'}
        </button>
      )}
    </div>
  );
};

export default MatchPetCard;
