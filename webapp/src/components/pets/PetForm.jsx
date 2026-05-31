import React, { useState, useEffect } from 'react';

const PetForm = ({ pet, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    photo_url: '',
  });

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || '',
        species: pet.species || '',
        breed: pet.breed || '',
        age: pet.age || '',
        photo_url: pet.photo_url || '',
      });
    }
  }, [pet]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <h3>{pet ? 'Edit Pet' : 'Add New Pet'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Pet Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Species</label>
          <select name="species" value={formData.species} onChange={handleChange}>
            <option value="">Select...</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Hamster">Hamster</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Breed</label>
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Age (years)</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Photo URL</label>
          <input
            type="text"
            name="photo_url"
            value={formData.photo_url}
            onChange={handleChange}
            placeholder="https://example.com/pet-photo.jpg"
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn btn-primary">
            {pet ? 'Update' : 'Add'} Pet
          </button>
          <button type="button" onClick={onCancel} className="btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PetForm;
