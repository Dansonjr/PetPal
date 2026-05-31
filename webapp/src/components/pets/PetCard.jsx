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
          background: '#e0e0e0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderRadius: '8px'
        }}>
          🐾 No Photo
        </div>
      )}
      <h3>{pet.name}</h3>
      <p><strong>Species:</strong> {pet.species || 'Not specified'}</p>
      <p><strong>Breed:</strong> {pet.breed || 'Not specified'}</p>
      <p><strong>Age:</strong> {pet.age || 'Unknown'}</p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
        <button onClick={() => onEdit(pet)} className="btn" style={{ background: '#ffc107', color: '#333' }}>
          Edit
        </button>
        <button onClick={handleDelete} className="btn btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
};

export default PetCard;
