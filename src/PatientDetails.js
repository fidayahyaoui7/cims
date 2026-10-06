import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Dashboard.css';

const PatientDetails = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Patient Details</h1>
        <div className="user-info">
          <span>Viewing patient ID: {patientId}</span>
          <div className="header-actions">
            <button className="btn-secondary" onClick={() => navigate('/patients')}>Back to Patients</button>
            <button className="btn-primary">Edit Patient</button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="profile-section">
          {/* Patient details would go here */}
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Detailed patient information would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;