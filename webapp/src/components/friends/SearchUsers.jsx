import React, { useState } from 'react';
import api from '../../services/api';

const SearchUsers = ({ onSendRequest }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await api.get(`/users/search?q=${query}`);
      setResults(response.data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await api.post('/friends/requests', { userId });
      alert('Friend request sent!');
      onSendRequest(userId);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send request');
    }
  };

  return (
    <div className="card">
      <h3>Find Friends</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '2px solid #e0e0e0' }}
        />
        <button onClick={handleSearch} className="btn btn-primary">
          Search
        </button>
      </div>

      {loading && <div className="spinner"></div>}

      {results.length > 0 && (
        <div>
          {results.map(user => (
            <div key={user.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '10px',
              borderBottom: '1px solid #e0e0e0'
            }}>
              <div>
                <strong>{user.name}</strong>
                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{user.email}</p>
              </div>
              <button 
                onClick={() => handleSendRequest(user.id)}
                className="btn btn-primary"
                style={{ padding: '6px 12px' }}
              >
                Add Friend
              </button>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && query && !loading && (
        <p style={{ textAlign: 'center', color: '#666' }}>No users found</p>
      )}
    </div>
  );
};

export default SearchUsers;
