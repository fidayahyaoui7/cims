import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Records = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Medical Records</h1>
        <div className="user-info">
          <span>View and manage medical records</span>
          <div className="header-actions">
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            <button className="btn-primary">+ Add Record</button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="medical-history-section">
          <div className="section-header">
            <h3>All Medical Records</h3>
            <div className="header-actions">
              <button className="btn-secondary">Export All</button>
            </div>
          </div>
          
          {/* Records list would go here */}
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Complete medical records would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Records;