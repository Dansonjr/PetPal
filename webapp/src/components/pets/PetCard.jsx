import React from 'react';
import api from '../../services/api';

const PetCard = ({ pet, onDelete, onEdit }) => {
  const handleDelete = async () => {
    if (window.confirm(`Delete ${pet.name}?`)) {
      try {
        await api.delete(`/pets/${pet.id}`);
        onDelete(pet.id);
      } catch (err) {
        alert('Failed to delete pet');
      }
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
      {/* Image Section */}
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

      {/* Info Section */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#667eea' }}>{pet.name}</h3>
          <span style={{ fontSize: '16px' }}>{getSpeciesEmoji(pet.species)}</span>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '12px',
          fontSize: '13px'
        }}>
          {pet.species && (
            <div style={{
              background: '#667eea15',
              padding: '6px 10px',
              borderRadius: '6px',
              color: '#667eea'
            }}>
              <strong>{pet.species}</strong>
            </div>
          )}
          {pet.breed && (
            <div style={{
              background: '#764ba215',
              padding: '6px 10px',
              borderRadius: '6px',
              color: '#764ba2'
            }}>
              <strong>{pet.breed}</strong>
            </div>
          )}
          {pet.age && (
            <div style={{
              background: '#48bb7815',
              padding: '6px 10px',
              borderRadius: '6px',
              color: '#38a169'
            }}>
              <strong>Age: {pet.age}y</strong>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        <button 
          onClick={() => onEdit(pet)} 
          className="btn" 
          style={{
            flex: 1,
            background: '#ffc107',
            color: '#333',
            padding: '8px'
          }}
        >
          ✏️ Edit
        </button>
        <button 
          onClick={handleDelete} 
          className="btn btn-danger"
          style={{
            flex: 1,
            padding: '8px'
          }}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default PetCard;
