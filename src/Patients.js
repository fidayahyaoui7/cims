import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Patients = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Patient Management</h1>
        <div className="user-info">
          <span>View and manage all patients</span>
          <div className="header-actions">
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            <button className="btn-primary" onClick={() => navigate('/patients/new')}>
              + Add New Patient
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="patients-section">
          <div className="section-header">
            <h3>All Patients</h3>
            <div className="header-actions">
              <input type="text" placeholder="Search patients..." style={{ padding: '8px', borderRadius: '20px', border: '1px solid #ddd' }} />
            </div>
          </div>
          
          {/* Patients list would go here */}
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Complete patient list would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;