import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faUser, 
  faCalendarAlt, 
  faComments,
  faFileMedical,
  faSignOutAlt,
  faBell,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import DashboardHome from './sections/DashboardHome';
import ProfileSection from './sections/ProfileSection';
import AppointmentsSection from './sections/AppointmentsSection';
import MessagesSection from './sections/MessagesSection';
import MedicalRecordsSection from './sections/MedicalRecordsSection';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', icon: faHome, label: 'Dashboard' },
    { id: 'profile', icon: faUser, label: 'Profile' },
    { id: 'appointments', icon: faCalendarAlt, label: 'Appointments' },
    { id: 'messages', icon: faComments, label: 'Messages' },
    { id: 'medical', icon: faFileMedical, label: 'Medical Records' },
  ];

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Handle notification click
  const handleNotificationClick = () => {
    // Implement notification logic here
    console.log('Notifications clicked');
  };

  // Handle settings click
  const handleSettingsClick = () => {
    // Implement settings logic here
    console.log('Settings clicked');
  };

  // Handle logout
  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logout clicked');
    // Example: Redirect to login
    // history.push('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome />;
      case 'profile':
        return <ProfileSection />;
      case 'appointments':
        return <AppointmentsSection />;
      case 'messages':
        return <MessagesSection />;
      case 'medical':
        return <MedicalRecordsSection />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <FontAwesomeIcon icon={faFileMedical} className={styles.logoIcon} />
          <span>Medical Dashboard</span>
        </div>
        <nav className={styles.nav}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.navButton} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => handleTabChange(tab.id)}
              aria-label={tab.label}
            >
              <FontAwesomeIcon icon={tab.icon} className={styles.navIcon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className={styles.footer}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </button>
        </div>
      </div>
      <div className={styles.main}>
        <header className={styles.header}>
          <h1>{tabs.find(tab => tab.id === activeTab)?.label}</h1>
          <div className={styles.headerActions}>
            <button 
              className={styles.notificationButton} 
              onClick={handleNotificationClick}
              aria-label="Notifications"
            >
              <FontAwesomeIcon icon={faBell} />
              <span className={styles.notificationBadge}>3</span>
            </button>
            <button 
              className={styles.settingsButton} 
              onClick={handleSettingsClick}
              aria-label="Settings"
            >
              <FontAwesomeIcon icon={faCog} />
            </button>
          </div>
        </header>
        <div className={styles.content}>
          {activeTab === 'dashboard' && <DashboardHome />}
          {activeTab === 'profile' && <ProfileSection />}
          {activeTab === 'appointments' && <AppointmentsSection />}
          {activeTab === 'messages' && <MessagesSection />}
          {activeTab === 'medical' && <MedicalRecordsSection />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
