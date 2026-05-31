import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import PetCard from '../../components/pets/PetCard';
import PetForm from '../../components/pets/PetForm';

const PetManagement = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await api.get('/pets');
      setPets(response.data);
    } catch (err) {
      console.error('Failed to fetch pets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = async (petData) => {
    try {
      const response = await api.post('/pets', petData);
      setPets([...pets, response.data]);
      setShowForm(false);
    } catch (err) {
      alert('Failed to add pet');
    }
  };

  const handleUpdatePet = async (petData) => {
    try {
      const response = await api.put(`/pets/${editingPet.id}`, petData);
      setPets(pets.map(p => p.id === editingPet.id ? response.data : p));
      setEditingPet(null);
      setShowForm(false);
    } catch (err) {
      alert('Failed to update pet');
    }
  };

  const handleDeletePet = async (petId) => {
    setPets(pets.filter(p => p.id !== petId));
  };

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPet(null);
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>My Pets</h2>
        <button onClick={() => setShowForm(true)} className="btn btn-success">
          + Add Pet
        </button>
      </div>

      {(showForm || editingPet) && (
        <PetForm
          pet={editingPet}
          onSubmit={editingPet ? handleUpdatePet : handleAddPet}
          onCancel={handleCancel}
        />
      )}

      {pets.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No pets added yet. Click "Add Pet" to get started!</p>
      ) : (
        <div className="grid">
          {pets.map(pet => (
            <PetCard
              key={pet.id}
              pet={pet}
              onDelete={handleDeletePet}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PetManagement;
