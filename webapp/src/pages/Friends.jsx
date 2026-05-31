import React, { useState, useEffect } from 'react';
import api from '../services/api';
import FriendCard from '../components/friends/FriendCard';
import FriendRequestCard from '../components/friends/FriendRequestCard';
import SearchUsers from '../components/friends/SearchUsers';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('friends');

  useEffect(() => {
    fetchFriends();
    fetchRequests();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await api.get('/friends');
      setFriends(response.data);
    } catch (err) {
      console.error('Failed to fetch friends:', err);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await api.get('/friends/requests');
      setRequests(response.data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = (requestId) => {
    setRequests(requests.filter(r => r.id !== requestId));
    fetchFriends(); // Refresh friends list
  };

  const handleReject = (requestId) => {
    setRequests(requests.filter(r => r.id !== requestId));
  };

  const handleSendRequest = () => {
    // Refresh requests after sending
    fetchRequests();
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e0e0e0' }}>
        <button
          onClick={() => setActiveTab('friends')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'friends' ? '#667eea' : 'transparent',
            color: activeTab === 'friends' ? 'white' : '#666',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0'
          }}
        >
          Friends ({friends.length})
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
          Requests ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('search')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'search' ? '#667eea' : 'transparent',
            color: activeTab === 'search' ? 'white' : '#666',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '8px 8px 0 0'
          }}
        >
          Find Friends
        </button>
      </div>

      {activeTab === 'friends' && (
        <div className="card">
          <h2>My Friends</h2>
          {friends.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>No friends yet. Search and add friends!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {friends.map(friend => (
                <FriendCard key={friend.id} friend={friend} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="card">
          <h2>Friend Requests</h2>
          {requests.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>No pending requests</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {requests.map(request => (
                <FriendRequestCard
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

      {activeTab === 'search' && (
        <SearchUsers onSendRequest={handleSendRequest} />
      )}
    </div>
  );
};

export default Friends;
