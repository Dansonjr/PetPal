import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import ProfileEdit from './profile/ProfileEdit';
import PetManagement from './profile/PetManagement';
import Friends from './Friends';
import Chat from './Chat';
import PetMatching from './PetMatching';
import LocationSettings from './LocationSettings';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) setActiveTab(tab);
  }, [location]);

  const tabs = [
    { id: 'home', name: '🏠 Home', component: ProfileEdit },
    { id: 'pets', name: '🐾 My Pets', component: PetManagement },
    { id: 'friends', name: '👥 Friends', component: Friends },
    { id: 'chat', name: '💬 Chat', component: Chat },
    { id: 'matches', name: '🐶 Matches', component: PetMatching },
    { id: 'location', name: '📍 Location', component: LocationSettings },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || ProfileEdit;

  return (
    <div style={{ display: 'flex', height: '100vh', background: darkMode ? '#1a1a1a' : '#f5f7fa' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '280px' : '70px',
        background: darkMode ? '#2a2a2a' : 'white',
        borderRight: `1px solid ${darkMode ? '#444' : '#e0e0e0'}`,
        transition: 'width 0.3s',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: `1px solid ${darkMode ? '#444' : '#e0e0e0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {sidebarOpen && <h2 style={{ fontSize: '24px', margin: 0 }}>🐾 PetPal</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: darkMode ? '#aaa' : '#666'
            }}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.name}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: activeTab === tab.id 
                  ? (darkMode ? '#667eea40' : '#667eea20')
                  : 'transparent',
                color: activeTab === tab.id ? '#667eea' : (darkMode ? '#aaa' : '#666'),
                border: 'none',
                borderLeft: activeTab === tab.id ? '4px solid #667eea' : '4px solid transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                overflow: 'hidden'
              }}
            >
              <span style={{ fontSize: '18px', minWidth: '20px' }}>{tab.name.split(' ')[0]}</span>
              {sidebarOpen && <span>{tab.name.split(' ').slice(1).join(' ')}</span>}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div style={{
          padding: '16px',
          borderTop: `1px solid ${darkMode ? '#444' : '#e0e0e0'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexDirection: sidebarOpen ? 'row' : 'column'
        }}>
          <button
            onClick={toggleDarkMode}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          {sidebarOpen && <span style={{ color: darkMode ? '#aaa' : '#666', fontSize: '12px' }}>v1.0</span>}
          <button
            onClick={logout}
            style={{
              background: '#e53e3e',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              marginLeft: sidebarOpen ? 'auto' : '0'
            }}
          >
            {sidebarOpen ? 'Logout' : '→'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Top Header */}
        <header style={{
          background: darkMode ? '#2a2a2a' : 'white',
          borderBottom: `1px solid ${darkMode ? '#444' : '#e0e0e0'}`,
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '24px',
            color: darkMode ? '#fff' : '#333'
          }}>
            {tabs.find(t => t.id === activeTab)?.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: darkMode ? '#aaa' : '#666', fontSize: '14px' }}>
              👤 {user?.name}
            </span>
          </div>
        </header>

        {/* Content Area */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px',
          background: darkMode ? '#1a1a1a' : '#f5f7fa'
        }}>
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
