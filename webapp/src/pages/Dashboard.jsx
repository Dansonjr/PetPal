import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import ProfileEdit from './profile/ProfileEdit';
import PetManagement from './profile/PetManagement';
import Friends from './Friends';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: '📝 Profile', component: ProfileEdit },
    { id: 'pets', name: '🐾 My Pets', component: PetManagement },
    { id: 'friends', name: '👥 Friends', component: Friends },
    { id: 'matches', name: '🐶 Pet Matches', component: () => <div className="card"><h3>Pet Matching Coming Soon</h3><p>Day 11 will add pet matching UI.</p></div> },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || ProfileEdit;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/dashboard" className="navbar-brand">
            🐾 PetPal
          </Link>
          <div className="navbar-menu">
            <span style={{ color: '#666' }}>Welcome, {user?.name}!</span>
            <button onClick={logout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e0e0e0', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                background: activeTab === tab.id ? '#667eea' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#666',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '8px 8px 0 0',
                transition: 'all 0.3s'
              }}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <ActiveComponent />
      </div>
    </>
  );
};

export default Dashboard;
