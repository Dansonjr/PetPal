import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 3 }) => {
  if (type === 'card') {
    return (
      <div className="grid">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="pet-card">
            <div className="loading-skeleton" style={{ height: '150px', borderRadius: '8px', marginBottom: '12px' }}></div>
            <div className="loading-skeleton" style={{ height: '20px', width: '70%', marginBottom: '8px' }}></div>
            <div className="loading-skeleton" style={{ height: '15px', width: '90%', marginBottom: '6px' }}></div>
            <div className="loading-skeleton" style={{ height: '15px', width: '80%', marginBottom: '6px' }}></div>
            <div className="loading-skeleton" style={{ height: '35px', width: '100%', marginTop: '12px' }}></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (type === 'chat') {
    return (
      <div>
        {[...Array(count)].map((_, i) => (
          <div key={i} style={{ display: 'flex', marginBottom: '15px', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end' }}>
            <div className="loading-skeleton" style={{ height: '50px', width: '200px', borderRadius: '12px' }}></div>
          </div>
        ))}
      </div>
    );
  }
  
  return null;
};

export default LoadingSkeleton;
