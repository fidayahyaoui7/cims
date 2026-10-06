import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaCalendarAlt, 
  FaComments, 
  FaFileMedicalAlt, 
  FaHeartbeat,
  FaHeart,
  FaUser,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import './PatientLayout.css';

export default function PatientLayout() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/patient', icon: <FaHome />, label: 'dashboard.title' },
    { path: '/patient/appointments', icon: <FaCalendarAlt />, label: 'appointments.title' },
    { path: '/patient/messages', icon: <FaComments />, label: 'messages.title' },
    { path: '/patient/medical-records', icon: <FaFileMedicalAlt />, label: 'medicalRecords.title' },
    { path: '/patient/health-tracker', icon: <FaHeartbeat />, label: 'healthTracker.title' },
    { path: '/patient/favorites', icon: <FaHeart />, label: 'favorites.title' },
  ];

  const accountItems = [
    { path: '/patient/profile', icon: <FaUser />, label: 'profile.title' },
    { path: '/patient/settings', icon: <FaCog />, label: 'settings.title' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="patient-layout">
      <aside className="sidebar">
        <div className="logo">
          <h2>{t('app.name')}</h2>
        </div>
        
        <nav className="nav-section">
          <h3 className="nav-section-title">{t('navigation.main')}</h3>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path} className={`nav-item ${isActive(item.path) ? 'active' : ''}`}>
                <Link to={item.path} className="nav-link">
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{t(item.label)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="nav-section">
          <h3 className="nav-section-title">{t('navigation.account')}</h3>
          <ul className="nav-list">
            {accountItems.map((item) => (
              <li key={item.path} className={`nav-item ${isActive(item.path) ? 'active' : ''}`}>
                <Link to={item.path} className="nav-link">
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{t(item.label)}</span>
                </Link>
              </li>
            ))}
            <li className="nav-item">
              <button onClick={logout} className="nav-link logout-btn">
                <span className="nav-icon"><FaSignOutAlt /></span>
                <span className="nav-label">{t('auth.logout')}</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
