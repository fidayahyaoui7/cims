import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import styles from '../Dashboard.module.css';

const AppointmentsSection: React.FC = () => {
  const appointments = [
    {
      id: 1,
      date: 'Today, 10:30 AM',
      doctor: 'Dr. Sarah Smith',
      specialty: 'Cardiology',
      description: 'Regular checkup and consultation',
      status: 'Confirmed',
      statusClass: 'badge-success'
    },
    {
      id: 2,
      date: 'Sep 15, 2:00 PM',
      doctor: 'Dr. Michael Johnson',
      specialty: 'Dermatology',
      description: 'Skin allergy follow-up',
      status: 'Scheduled',
      statusClass: 'badge-primary'
    },
    {
      id: 3,
      date: 'Sep 22, 11:15 AM',
      doctor: 'Dr. Emily Williams',
      specialty: 'Orthopedics',
      description: 'Knee pain evaluation',
      status: 'Scheduled',
      statusClass: 'badge-primary'
    },
    {
      id: 4,
      date: 'Aug 30, 9:00 AM',
      doctor: 'Dr. Robert Brown',
      specialty: 'General Medicine',
      description: 'Annual physical examination',
      status: 'Completed',
      statusClass: 'badge-warning'
    }
  ];

  return (
    <div className="appointments-section">
      <div className={styles.sectionHeader}>
        <h2>My Appointments</h2>
        <button className={styles.primaryButton}>
          <FontAwesomeIcon icon={faPlus} className={styles.buttonIcon} />
          Book New Appointment
        </button>
      </div>
      
      <div className={styles.appointmentFilters}>
        <button className={`${styles.filterButton} ${styles.active}`}>All</button>
        <button className={styles.filterButton}>Upcoming</button>
        <button className={styles.filterButton}>Past</button>
        <button className={styles.filterButton}>Cancelled</button>
      </div>
      
      <ul className={styles.appointmentList}>
        {appointments.map((appointment) => (
          <li key={appointment.id} className={styles.appointmentItem}>
            <div className={styles.appointmentInfo}>
              <div className={styles.appointmentTime}>
                <FontAwesomeIcon icon={faCalendarAlt} className={styles.calendarIcon} />
                {appointment.date}
              </div>
              <div>
                <div className={styles.appointmentDoctor}>
                  <strong>{appointment.doctor}</strong> - {appointment.specialty}
                </div>
                <div className={styles.appointmentDescription}>
                  {appointment.description}
                </div>
                <span className={`${styles.badge} ${styles[appointment.statusClass]}`}>
                  {appointment.status}
                </span>
              </div>
            </div>
            <div className={styles.appointmentActions}>
              {appointment.status === 'Scheduled' ? (
                <button className={styles.secondaryButton}>Reschedule</button>
              ) : (
                <button className={styles.primaryButton}>View Details</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentsSection;
