import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Reports = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Generate Reports</h1>
        <div className="user-info">
          <span>Create and view practice reports</span>
          <div className="header-actions">
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="overview-section">
          <div className="quick-actions">
            <h3>Report Types</h3>
            <div className="action-buttons">
              <button className="btn-secondary">Patient Statistics</button>
              <button className="btn-secondary">Appointment Summary</button>
              <button className="btn-secondary">Billing Report</button>
              <button className="btn-secondary">Treatment Analysis</button>
            </div>
          </div>
          
          {/* Report generation would go here */}
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Report generation interface would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;