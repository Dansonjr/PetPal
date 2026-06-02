import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MatchPetCard from '../components/pet-matching/MatchPetCard';
import MatchRequestCard from '../components/pet-matching/MatchRequestCard';

const PetMatching = () => {
  const [nearbyPets, setNearbyPets] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('browse');
  const [loading, setLoading] = useState(true);
  const [hasPet, setHasPet] = useState(true);

  useEffect(() => {
    fetchNearbyPets();
    fetchIncomingRequests();
    checkUserHasPet();
  }, []);

  const checkUserHasPet = async () => {
    try {
      const response = await api.get('/pets');
      if (response.data.length === 0) {
        setHasPet(false);
      }
    } catch (err) {
      console.error('Failed to check pets:', err);
    }
  };

  const fetchNearbyPets = async () => {
    try {
      const response = await api.get('/pets/nearby');
      setNearbyPets(response.data);
    } catch (err) {
      console.error('Failed to fetch nearby pets:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchIncomingRequests = async () => {
    try {
      const response = await api.get('/pet-matches/incoming');
      setIncomingRequests(response.data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
  };

  const handleAccept = (requestId) => {
    setIncomingRequests(incomingRequests.filter(r => r.id !== requestId));
  };

  const handleReject = (requestId) => {
    setIncomingRequests(incomingRequests.filter(r => r.id !== requestId));
  };

  const handleMatchSent = () => {
    // Refresh nearby pets to update any changes
    fetchNearbyPets();
  };

  if (loading) return <div className="spinner"></div>;

  if (!hasPet) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <h2>🐾 Welcome to Pet Matching!</h2>
        <p>You need to add a pet first before you can request play dates.</p>
        <button 
          onClick={() => window.location.href = '/dashboard?tab=pets'}
          className="btn btn-primary"
          style={{ marginTop: '20px' }}
        >
          Add Your First Pet
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e0e0e0' }}>
        <button
          onClick={() => setActiveTab('browse')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'browse' ? '#667eea' : 'transparent',
            color: activeTab === 'browse' ? 'white' : '#666',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0'
          }}
        >
          Browse Pets ({nearbyPets.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'requests' ? '#667eea' : 'transparent',
            color: activeTab === 'requests' ? 'white' : '#666',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0'
          }}
        >
          Incoming Requests ({incomingRequests.length})
        </button>
      </div>

      {activeTab === 'browse' && (
        <div>
          {nearbyPets.length === 0 ? (
            <div className="card" style={{ textAlign: 'center' }}>
              <p>No pets found nearby. Check back later!</p>
            </div>
          ) : (
            <div className="grid">
              {nearbyPets.map(pet => (
                <MatchPetCard 
                  key={pet.id} 
                  pet={pet} 
                  onMatchSent={handleMatchSent}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="card">
          <h3>Play Date Requests</h3>
          {incomingRequests.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>No incoming requests</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {incomingRequests.map(request => (
                <MatchRequestCard
                  key={request.id}
                  request={request}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PetMatching;
