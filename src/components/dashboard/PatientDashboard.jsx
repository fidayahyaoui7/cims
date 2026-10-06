import React, { useState } from 'react';
import { 
  FaCalendarAlt, 
  FaUser, 
  FaComments, 
  FaEye,
  FaCalendarCheck,
  FaBell,
  FaUserMd
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import ChatThread from './ChatThread';
import ViewerPage from './ViewerPage';
import './PatientDashboard.styles.css';

export default function PatientDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [openChat, setOpenChat] = useState(false);
  const [openViewer, setOpenViewer] = useState(false);

  // Example study UID - in a real app, this would come from your API
  const studyUID = '1.2.840.113619.2.55.3.604688437.783.1599760910.467';

  // Mock data - replace with actual API calls
  const userData = {
    display_name: user?.name || 'User',
    upcomingAppointments: 2,
    pendingRequests: 1,
    completedSessions: 5,
    medicalDocuments: 3
  };

  return (
    <div className="patient-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Welcome back, {userData.display_name}!</h1>
        <p className="subtitle">Here's what's happening with your patient account today.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><FaCalendarCheck /></div>
          <div className="stat-value">{userData.upcomingAppointments}</div>
          <div className="stat-label">Upcoming Appointments</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaBell /></div>
          <div className="stat-value">{userData.pendingRequests}</div>
          <div className="stat-label">Pending Requests</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaUserMd /></div>
          <div className="stat-value">{userData.completedSessions}</div>
          <div className="stat-label">Completed Sessions</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions">
          <button className="action-btn primary">
            <FaCalendarAlt className="icon" />
            Book Appointment
          </button>
          <button className="action-btn secondary">
            <FaCalendarAlt className="icon" />
            View Schedule
          </button>
          <button className="action-btn">
            <FaUser className="icon" />
            Complete Profile
          </button>
          <button 
            onClick={() => setOpenChat(true)}
            className="action-btn accent"
          >
            <FaComments className="icon" />
            Chat with Medical Team
          </button>
          <button 
            onClick={() => setOpenViewer(true)}
            className="action-btn"
          >
            <FaEye className="icon" />
            View My Images
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="section">
        <h2 className="section-title">Recent Activity</h2>
        <ul className="activity-list">
          <li className="activity-item">
            <div className="activity-icon">
              <FaCalendarAlt />
            </div>
            <div className="activity-content">
              <p>Appointment confirmed with Dr. Smith for tomorrow at 10:00 AM</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </li>
          <li className="activity-item">
            <div className="activity-icon">
              <FaComments />
            </div>
            <div className="activity-content">
              <p>New message from Dr. Jones</p>
              <span className="activity-time">1 day ago</span>
            </div>
          </li>
        </ul>
      </div>

      {/* Chat Modal */}
      {openChat && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              onClick={() => setOpenChat(false)}
              className="modal-close"
              aria-label="Close chat"
            >
              ✕
            </button>
            <div className="modal-header">
              <h3>Chat with Medical Team</h3>
            </div>
            <div className="modal-content">
              <ChatThread threadId={user?.id} />
            </div>
          </div>
        </div>
      )}

      {/* OHIF Viewer Modal */}
      {openViewer && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              onClick={() => setOpenViewer(false)}
              className="modal-close"
              aria-label="Close viewer"
            >
              ✕
            </button>
            <div className="modal-header">
              <h3>DICOM Image Viewer</h3>
            </div>
            <div className="viewer-container">
              <ViewerPage studyUID={studyUID} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
