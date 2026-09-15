import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const LocationSettings = () => {
  const { user, setUser } = useAuth();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdateLocation = async () => {
    if (!address) {
      setMessage('Please enter an address');
      return;
    }
    
    setLoading(true);
    try {
      // Geocode address
      const geoResponse = await api.post('/location/geocode', { address });
      const { latitude, longitude, formatted } = geoResponse.data;
      
      // Update user location
      await api.post('/location/update', { latitude, longitude });
      
      setMessage(`✅ Location updated: ${formatted}`);
      setAddress('');
      if (setUser) {
        setUser(prev => ({
          ...prev,
          latitude,
          longitude,
          location: formatted
        }));
      }
    } catch (err) {
      setMessage('❌ Failed to update location: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>📍 Location Settings</h3>
      <p>Set your location to find nearby pets and friends.</p>
      
      <div className="form-group">
        <label>Enter your address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g., New York, NY or 123 Main St"
        />
      </div>
      
      <button 
        onClick={handleUpdateLocation} 
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Update Location'}
      </button>
      
      {message && <p className="alert alert-info" style={{ marginTop: '12px' }}>{message}</p>}
      
      {user?.latitude && user?.longitude && (
        <p style={{ fontSize: '12px', color: '#666', marginTop: '12px' }}>
          📍 Current location: {user.latitude}, {user.longitude}
        </p>
      )}
    </div>
  );
};

export default LocationSettings;
