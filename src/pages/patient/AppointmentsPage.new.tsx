import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeartbeat, FaCalendarCheck, FaCommentMedical, FaUser, FaCog, FaPlus, FaFileMedical } from 'react-icons/fa';
import './AppointmentsPage.css';

interface Appointment {
  id: string;
  time: string;
  date?: string;
  doctor: string;
  specialty: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'scheduled';
  notes?: string;
}

export default function AppointmentsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('appointments');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAppointments, setCurrentAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data for current appointments (today)
        const mockCurrentAppointments: Appointment[] = [
          {
            id: '1',
            time: '10:30 AM',
            doctor: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            status: 'confirmed',
            notes: 'Annual checkup'
          },
          {
            id: '2',
            time: '2:15 PM',
            doctor: 'Dr. Michael Chen',
            specialty: 'Dermatology',
            status: 'pending',
            notes: 'Skin condition follow-up'
          }
        ];

        // Mock data for upcoming appointments
        const mockUpcomingAppointments: Appointment[] = [
          {
            id: '3',
            time: '9:00 AM',
            date: 'Aug 30',
            doctor: 'Dr. Emily Rodriguez',
            specialty: 'General Checkup',
            status: 'scheduled',
            notes: 'Routine examination'
          },
          {
            id: '4',
            time: '11:30 AM',
            date: 'Sep 5',
            doctor: 'Dr. Robert Kim',
            specialty: 'Orthopedics',
            status: 'scheduled',
            notes: 'Knee pain consultation'
          }
        ];

        setCurrentAppointments(mockCurrentAppointments);
        setUpcomingAppointments(mockUpcomingAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/patient/${tab}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge badge-primary">Confirmed</span>;
      case 'pending':
        return <span className="badge badge-warning">Pending</span>;
      case 'scheduled':
        return <span className="badge badge-success">Scheduled</span>;
      case 'cancelled':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="appointments-container">
        <div className="loading-spinner">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="appointments-container">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <FaHeartbeat />
            <span>MediSchedule</span>
          </div>
          <div className="user-info">
            <div className="user-avatar">JD</div>
            <div>
              <div>John Doe</div>
              <div style={{ fontSize: '0.9em', opacity: 0.8 }}>patient1@gmail.com</div>
            </div>
          </div>
        </div>
      </header>

      <div className="nav-tabs">
        <Link 
          to="/patient/appointments" 
          className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => handleTabChange('appointments')}
        >
          <FaCalendarCheck /> Appointments
        </Link>
        <Link 
          to="/patient/messages" 
          className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => handleTabChange('messages')}
        >
          <FaCommentMedical /> Messages
        </Link>
        <Link 
          to="/patient/profile" 
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabChange('profile')}
        >
          <FaUser /> Profile
        </Link>
        <Link 
          to="/patient/settings" 
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => handleTabChange('settings')}
        >
          <FaCog /> Settings
        </Link>
      </div>

      <div className="dashboard">
        <div className="sidebar">
          <div className="sidebar-widget">
            <h3>Upcoming</h3>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Today's Appointments</div>
              </div>
              <div className="card-content">
                <p>You have {currentAppointments.length} appointments scheduled for today.</p>
              </div>
            </div>
          </div>

          <div className="sidebar-widget">
            <h3>Quick Actions</h3>
            <div className="card">
              <div className="card-content">
                <Link to="/patient/book-appointment" className="btn btn-primary">
                  <FaPlus /> Book New Appointment
                </Link>
                <button className="btn btn-outline-primary">
                  <FaFileMedical /> Request Prescription
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="main-content">
          <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>My Appointments</h2>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Current Appointments</div>
            </div>
            <div className="card-content">
              <ul className="appointment-list">
                {currentAppointments.length > 0 ? (
                  currentAppointments.map((appointment) => (
                    <li key={appointment.id} className="appointment-item">
                      <div className="appointment-info">
                        <div className="appointment-time">
                          {appointment.time}
                        </div>
                        <div>
                          <div>{appointment.doctor}</div>
                          <div>{appointment.specialty}</div>
                          {appointment.notes && <div className="appointment-notes">{appointment.notes}</div>}
                        </div>
                      </div>
                      <div className="appointment-actions">
                        {getStatusBadge(appointment.status)}
                        <button>Details</button>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="no-appointments">No current appointments</li>
                )}
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Upcoming Appointments</div>
            </div>
            <div className="card-content">
              <ul className="appointment-list">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <li key={appointment.id} className="appointment-item">
                      <div className="appointment-info">
                        <div className="appointment-time">
                          {appointment.date}, {appointment.time}
                        </div>
                        <div>
                          <div>{appointment.doctor}</div>
                          <div>{appointment.specialty}</div>
                          {appointment.notes && <div className="appointment-notes">{appointment.notes}</div>}
                        </div>
                      </div>
                      <div className="appointment-actions">
                        {getStatusBadge(appointment.status)}
                        <button>Details</button>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="no-appointments">No upcoming appointments</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
