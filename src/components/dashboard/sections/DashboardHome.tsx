import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck,
  faCommentMedical,
  faFileMedical,
  faUserMd,
  faCalendarPlus,
  faComments,
  faPrescription,
  faFileDownload
} from '@fortawesome/free-solid-svg-icons';

const DashboardHome: React.FC = () => {
  return (
    <div className="dashboard-home">
      <h2>Welcome back, John!</h2>
      <p>Here's an overview of your medical dashboard.</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faCalendarCheck} />
          </div>
          <div className="stat-value">2</div>
          <div className="stat-label">Upcoming Appointments</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faCommentMedical} />
          </div>
          <div className="stat-value">3</div>
          <div className="stat-label">Unread Messages</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faFileMedical} />
          </div>
          <div className="stat-value">5</div>
          <div className="stat-label">Medical Records</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faUserMd} />
          </div>
          <div className="stat-value">1</div>
          <div className="stat-label">Active Prescriptions</div>
        </div>
      </div>
      
      <h3>Quick Actions</h3>
      <div className="quick-actions">
        <div className="action-btn">
          <FontAwesomeIcon icon={faCalendarPlus} className="action-icon" />
          <span>Book Appointment</span>
        </div>
        <div className="action-btn">
          <FontAwesomeIcon icon={faComments} className="action-icon" />
          <span>Message Doctor</span>
        </div>
        <div className="action-btn">
          <FontAwesomeIcon icon={faPrescription} className="action-icon" />
          <span>Request Prescription</span>
        </div>
        <div className="action-btn">
          <FontAwesomeIcon icon={faFileDownload} className="action-icon" />
          <span>Download Records</span>
        </div>
      </div>
      
      <h3>Recent Activity</h3>
      <ul className="appointment-list">
        <li className="appointment-item">
          <div className="appointment-info">
            <div className="appointment-time">Today, 10:30 AM</div>
            <div>
              <div>Appointment with Dr. Smith</div>
              <div className="badge badge-success">Confirmed</div>
            </div>
          </div>
          <div className="appointment-actions">
            <button className="btn-details">Details</button>
          </div>
        </li>
        <li className="appointment-item">
          <div className="appointment-info">
            <div className="appointment-time">Yesterday, 2:15 PM</div>
            <div>
              <div>Message from Dr. Johnson</div>
              <div className="badge badge-primary">Unread</div>
            </div>
          </div>
          <div className="appointment-actions">
            <button className="btn-details">View</button>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default DashboardHome;
