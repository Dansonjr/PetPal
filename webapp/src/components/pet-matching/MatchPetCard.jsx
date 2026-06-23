import React, { useState } from 'react';
import api from '../../services/api';

const MatchPetCard = ({ pet, onMatchSent }) => {
  const [sending, setSending] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const handleSendMatchRequest = async () => {
    setSending(true);
    try {
      const userPetsResponse = await api.get('/pets');
      const userPets = userPetsResponse.data;
      
      if (userPets.length === 0) {
        alert('Please add a pet first before sending match requests!');
        setSending(false);
        return;
      }
      
      const requesterPetId = userPets[0].id;
      
      await api.post('/pet-matches', {
        requesterPetId: requesterPetId,
        targetPetId: pet.id
      });
      
      setRequestSent(true);
      if (onMatchSent) onMatchSent(pet.id);
    } catch (err) {
      if (err.response?.data?.error === 'Match request already exists') {
        setRequestSent(true);
        alert('Match request already sent!');
      } else {
        alert('Failed to send match request');
      }
    } finally {
      setSending(false);
    }
  };

  const getSpeciesEmoji = (species) => {
    const emojiMap = {
      'Dog': '🐕',
      'Cat': '🐈',
      'Bird': '🐦',
      'Rabbit': '🐰',
      'Hamster': '🐹',
      'Fish': '🐠'
    };
    return emojiMap[species] || '🐾';
  };

  return (
    <div className="pet-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'all 0.3s ease'
    }}>
      {/* Image */}
      {pet.photo_url ? (
        <img 
          src={pet.photo_url} 
          alt={pet.name}
          style={{
            width: '100%',
            height: '180px',
            objectFit: 'cover',
            borderRadius: '12px',
            marginBottom: '12px'
          }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '180px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px',
          marginBottom: '12px',
          fontSize: '64px'
        }}>
          {getSpeciesEmoji(pet.species)}
        </div>
      )}

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#667eea' }}>{pet.name}</h3>
          <span style={{ fontSize: '16px' }}>{getSpeciesEmoji(pet.species)}</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          marginBottom: '10px'
        }}>
          {pet.owner_name && (
            <div style={{
              fontSize: '12px',
              color: '#666',
              padding: '6px 10px',
              background: '#f0f0f0',
              borderRadius: '6px'
            }}>
              <strong>👤 {pet.owner_name}</strong>
            </div>
          )}
          {pet.breed && (
            <div style={{
              fontSize: '12px',
              color: '#666',
              padding: '6px 10px',
              background: '#f0f0f0',
              borderRadius: '6px'
            }}>
              <strong>{pet.breed}</strong>
            </div>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          marginBottom: '12px'
        }}>
          {pet.species && (
            <div style={{
              fontSize: '11px',
              background: '#667eea15',
              padding: '6px 10px',
              borderRadius: '6px',
              color: '#667eea'
            }}>
              {pet.species}
            </div>
          )}
          {pet.age && (
            <div style={{
              fontSize: '11px',
              background: '#48bb7815',
              padding: '6px 10px',
              borderRadius: '6px',
              color: '#38a169'
            }}>
              Age: {pet.age} years
            </div>
          )}
        </div>
      </div>

      {/* Action */}
      {requestSent ? (
        <button 
          className="btn" 
          style={{
            background: '#48bb78',
            color: 'white',
            width: '100%',
            padding: '10px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'default'
          }}
          disabled
        >
          ✓ Request Sent
        </button>
      ) : (
        <button 
          onClick={handleSendMatchRequest} 
          className="btn btn-primary" 
          disabled={sending}
          style={{
            width: '100%',
            padding: '10px',
            opacity: sending ? 0.7 : 1
          }}
        >
          {sending ? '⏳ Sending...' : '🐶 Request Play Date'}
        </button>
      )}
    </div>
  );
};

export default MatchPetCard;
