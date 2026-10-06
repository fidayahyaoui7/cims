import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Schedule = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Manage Schedule</h1>
        <div className="user-info">
          <span>Doctor Schedule Management</span>
          <div className="header-actions">
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="appointments-section">
          <div className="section-header">
            <h3>Your Availability</h3>
            <button className="btn-primary">+ Add Time Slot</button>
          </div>
          
          {/* Schedule management content would go here */}
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Schedule management interface would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;