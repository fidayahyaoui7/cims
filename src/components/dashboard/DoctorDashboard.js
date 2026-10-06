import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Dashboard.css';

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [messages, setMessages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editDoctor, setEditDoctor] = useState({});
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReply, setShowReply] = useState(false);
  const [replyMessage, setReplyMessage] = useState({ receiver_id: '', subject: '', body: '' });
  const [radiologyResults, setRadiologyResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showAddResultForm, setShowAddResultForm] = useState(false);
  const [newResult, setNewResult] = useState({ patient_id: '', appointment_id: '', result_type: '', report_text: '', image_url: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        const profileRes = await api.users.getProfile();
        if (profileRes.user.userType !== 'doctor') {
          navigate('/login');
          return;
        }
        setDoctor(profileRes.user);
        setEditDoctor(profileRes.user);

        const appointmentsRes = await api.users.getDoctorAppointments();
        setAppointments(appointmentsRes.appointments || []);

        // Derive patient list from appointments
        const patientList = appointmentsRes.appointments.reduce((acc, curr) => {
          if (!acc.find(p => p.id === curr.patient_id)) {
            acc.push({ 
              id: curr.patient_id, 
              name: curr.patient_name, 
              // Additional patient details can be added if available in appointment data
            });
          }
          return acc;
        }, []);
        setPatients(patientList);

        const messagesRes = await api.messages.getInbox();
        setMessages(messagesRes.messages || []);

        const radiologyRes = await api.radiology.getDoctorResults(); // Assuming this function will be created
        setRadiologyResults(radiologyRes.results || []);

        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [navigate]);

  const handleViewPatient = (patientId) => {
    navigate(`/patients/${patientId}`);
  };

  const handleUpdateAppointment = async (appointmentId, status) => {
    try {
      await api.appointments.updateStatus(appointmentId, status);
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId ? { ...apt, status } : apt
      ));
    } catch (error) {
      console.error('Failed to update appointment status', error);
      alert('Failed to update appointment status.');
    }
  };

  const handleAddNotes = (appointmentId) => {
    const notes = prompt('Add medical notes:');
    if (notes) {
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId ? { ...apt, notes } : apt
      ));
    }
  };

  const handleEditProfile = () => {
    setEditDoctor({...doctor});
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      const updatedProfile = await api.users.updateProfile(editDoctor);
      setDoctor(updatedProfile.user);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleRescheduleAppointment = (appointmentId) => {
    // TODO: Implement rescheduling logic
    alert(`Reschedule functionality for appointment ${appointmentId} is coming soon.`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditDoctor(prev => ({ ...prev, [name]: value }));
  };

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    setShowReply(false);
    if (!message.is_read && message.receiver_id === doctor.id) {
      try {
        await api.messages.markAsRead(message.id);
        setMessages(messages.map(m => m.id === message.id ? { ...m, is_read: true } : m));
      } catch (err) {
        console.error("Failed to mark message as read", err);
      }
    }
  };

  const handleReply = (message) => {
    setSelectedMessage(message);
    setShowReply(true);
    setReplyMessage({
      receiver_id: message.sender_id,
      subject: `Re: ${message.subject}`,
      body: ''
    });
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    try {
      await api.messages.sendMessage(replyMessage);
      setShowReply(false);
      setSelectedMessage(null);
      setReplyMessage({ receiver_id: '', subject: '', body: '' });
      const messagesRes = await api.messages.getInbox();
      setMessages(messagesRes.messages || []);
      alert('Reply sent successfully!');
    } catch (err) {
      setError('Failed to send reply. Please try again.');
      console.error(err);
    }
  };

  const handleViewRadiologyResult = (result) => {
    setSelectedResult(result);
    setShowAddResultForm(false);
  };

  const handleAddResult = () => {
    setSelectedResult(null);
    setShowAddResultForm(true);
    setNewResult({ patient_id: '', appointment_id: '', result_type: '', report_text: '', image_url: '' });
  };

  const handleNewResultChange = (e) => {
    const { name, value } = e.target;
    setNewResult(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateAppointmentStatus = async (appointmentId, status) => {
    try {
      await api.appointments.updateStatus(appointmentId, status);
      setAppointments(appointments.map(appt => 
        appt.id === appointmentId ? { ...appt, status } : appt
      ));
      alert(`Appointment status updated to ${status}.`);
    } catch (err) {
      setError('Failed to update appointment status.');
      console.error(err);
    }
  };

  const handleSaveNewResult = async (e) => {
    e.preventDefault();
    try {
      await api.radiology.addResult(newResult);
      setShowAddResultForm(false);
      const radiologyRes = await api.radiology.getDoctorResults();
      setRadiologyResults(radiologyRes.results || []);
      alert('Radiology result added successfully!');
    } catch (err) {
      setError('Failed to add radiology result.');
      console.error(err);
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) return <div className="loading-container">Loading dashboard...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!doctor) return <div>No doctor data available.</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        <div className="header-actions">
          <span className="user-info">Welcome, Dr. {doctor.name}</span>
          <button className="btn btn-primary" onClick={() => navigate('/schedule')}>
            Manage Schedule
          </button>
          <button className="btn btn-secondary" onClick={() => { localStorage.removeItem('user'); navigate('/login'); }}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>Appointments</button>
        <button className={`tab ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}>Patients</button>
        <button className={`tab ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>Messages</button>
        <button className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
      </div>

      <main className="dashboard-content">
        {activeTab === 'overview' && (
          <section id="overview">
            <div className="section-header"><h2>Daily Summary</h2></div>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Today's Appointments</h3>
                <p className="stat-number">{appointments.filter(a => new Date(a.appointment_date).toDateString() === new Date().toDateString()).length}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Requests</h3>
                <p className="stat-number">{appointments.filter(a => a.status === 'pending').length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Patients</h3>
                <p className="stat-number">{patients.length}</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'appointments' && (
          <section id="appointments">
            <div className="section-header"><h2>Manage Appointments</h2></div>
            <div className="card-list">
              {appointments.length > 0 ? appointments.map(apt => (
                <div key={apt.id} className="appointment-card">
                  <div className="appointment-header">
                    <div className="appointment-info">
                      <h4>{apt.patient_name}</h4>
                      <p><strong>Date:</strong> {new Date(apt.appointment_date).toLocaleString()}</p>
                      <p><strong>Notes:</strong> {apt.notes || 'N/A'}</p>
                    </div>
                    <span className={`status-badge status-${apt.status}`}>{getStatusText(apt.status)}</span>
                  </div>
                  <div className="appointment-actions">
                    <button className="btn btn-secondary" onClick={() => handleRescheduleAppointment(apt.id)}>Reschedule</button>
                    {apt.status !== 'completed' && <button className="btn btn-success" onClick={() => handleUpdateAppointmentStatus(apt.id, 'completed')}>Mark as Completed</button>}
                    {apt.status !== 'cancelled' && <button className="btn btn-danger" onClick={() => handleUpdateAppointmentStatus(apt.id, 'cancelled')}>Cancel</button>}
                  </div>
                </div>
              )) : <p>No appointments found.</p>}
            </div>
          </section>
        )}

        {activeTab === 'patients' && (
          <section id="patients">
            <div className="section-header"><h2>Patient List</h2></div>
            <div className="card-list">
              {patients.length > 0 ? patients.map(p => (
                <div key={p.id} className="patient-card">
                    <div className="patient-info">
                        <h4>{p.name}</h4>
                    </div>
                    <div className="patient-actions">
                        <button className="btn btn-primary" onClick={() => handleViewPatient(p.id)}>View History</button>
                    </div>
                </div>
              )) : <p>No patients found.</p>}
            </div>
          </section>
        )}

        {activeTab === 'messages' && (
          <section id="messages">
            <div className="section-header"><h2>Patient Messages</h2></div>
            {selectedMessage && !showReply ? (
              <div className="card">
                <button onClick={() => setSelectedMessage(null)} className="btn btn-secondary" style={{marginBottom: 'var(--space-4)'}}>Back to Inbox</button>
                <h3>{selectedMessage.subject}</h3>
                <p><strong>From:</strong> {selectedMessage.sender_name}</p>
                <p><strong>Date:</strong> {new Date(selectedMessage.created_at).toLocaleString()}</p>
                <hr style={{margin: 'var(--space-3) 0'}} />
                <p>{selectedMessage.body}</p>
                {selectedMessage.sender_id !== doctor.id && (
                  <button onClick={() => handleReply(selectedMessage)} className="btn btn-primary">Reply</button>
                )}
              </div>
            ) : showReply ? (
              <div className="card">
                <h3>Reply to {selectedMessage.sender_name}</h3>
                <form onSubmit={handleSendReply}>
                  <div className="form-group">
                    <label>Subject</label>
                    <input type="text" value={replyMessage.subject} onChange={(e) => setReplyMessage({ ...replyMessage, subject: e.target.value })} required/>
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea value={replyMessage.body} onChange={(e) => setReplyMessage({ ...replyMessage, body: e.target.value })} required rows="5"></textarea>
                  </div>
                  <div style={{display: 'flex', gap: 'var(--space-3)'}}>
                    <button type="submit" className="btn btn-primary">Send Reply</button>
                    <button type="button" className="btn btn-secondary" onClick={() => { setShowReply(false); setSelectedMessage(null); }}>Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="card-list">
                {messages.length > 0 ? (
                  messages.map(msg => (
                    <div key={msg.id} className={`card message-card ${!msg.is_read && msg.receiver_id === doctor.id ? 'unread' : ''}`} onClick={() => handleViewMessage(msg)}>
                      <p><strong>{msg.sender_id === doctor.id ? `To: ${msg.receiver_name}` : `From: ${msg.sender_name}`}</strong></p>
                      <p>{msg.subject}</p>
                      <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>{new Date(msg.created_at).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p>You have no messages.</p>
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === 'profile' && (
          <section id="profile">
            <div className="section-header">
              <h3>Professional Information</h3>
              {isEditing ? (
                <div style={{display: 'flex', gap: 'var(--space-3)'}}>
                  <button className="btn btn-primary" onClick={handleSaveProfile}>Save Changes</button>
                  <button className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                </div>
              ) : (
                <button className="btn btn-primary" onClick={handleEditProfile}>Edit Profile</button>
              )}
            </div>
            
            <div className="profile-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" value={isEditing ? editDoctor.name : doctor.name} onChange={handleInputChange} readOnly={!isEditing} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={doctor.email || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" name="phone" value={isEditing ? editDoctor.phone : doctor.phone} onChange={handleInputChange} readOnly={!isEditing} />
              </div>
              <div className="form-group">
                <label>Specialty</label>
                <input type="text" value={doctor.doctorInfo?.specialty || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Medical Center</label>
                <input type="text" value={doctor.doctorInfo?.center_name || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Years of Experience</label>
                <input type="number" name="experience_years" value={isEditing ? editDoctor.doctorInfo?.experience_years : doctor.doctorInfo?.experience_years} readOnly={!isEditing} onChange={(e) => {
                    const { name, value } = e.target;
                    setEditDoctor(prev => ({ ...prev, doctorInfo: { ...prev.doctorInfo, [name]: value } }));
                  }} />
              </div>
            </div>

            <div className="profile-actions">
              <button className="btn btn-secondary">Update Credentials</button>
              <button className="btn btn-secondary">Change Password</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;