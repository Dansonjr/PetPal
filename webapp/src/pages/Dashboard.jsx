import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to PetPal, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <button onClick={logout} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
        Logout
      </button>
      
      <hr />
      
      <h2>Features Coming Soon:</h2>
      <ul>
        <li>📝 Profile Management</li>
        <li>🐾 Add/Edit Pets</li>
        <li>👥 Friend System</li>
        <li>💬 Real-time Chat</li>
        <li>🐶 Pet Matching</li>
      </ul>
    </div>
  );
};

export default Dashboard;
