import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const AdminDashboard = ({ user }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>{t('admin_dashboard') || 'Admin Dashboard'}</h1>
        <p>{t('welcome_back') || 'Welcome back'}, {user?.name || 'Admin'}!</p>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-cards">
          {/* Statistics Cards */}
          <div className="dashboard-card">
            <h3>{t('total_users') || 'Total Users'}</h3>
            <p className="stat-number">0</p>
          </div>
          
          <div className="dashboard-card">
            <h3>{t('active_appointments') || 'Active Appointments'}</h3>
            <p className="stat-number">0</p>
          </div>
          
          <div className="dashboard-card">
            <h3>{t('medical_centers') || 'Medical Centers'}</h3>
            <p className="stat-number">0</p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="dashboard-section">
          <h2>{t('quick_actions') || 'Quick Actions'}</h2>
          <div className="action-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/admin/users')}
            >
              {t('manage_users') || 'Manage Users'}
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/admin/centers')}
            >
              {t('manage_centers') || 'Manage Centers'}
            </button>
            <button 
              className="btn btn-tertiary"
              onClick={() => navigate('/admin/settings')}
            >
              {t('system_settings') || 'System Settings'}
            </button>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="dashboard-section">
          <h2>{t('recent_activity') || 'Recent Activity'}</h2>
          <div className="activity-list">
            <p className="no-activity">{t('no_recent_activity') || 'No recent activity'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
