import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt,
  faBirthdayCake,
  faUser,
  faTint,
  faAllergies,
  faProcedures,
  faCapsules,
  faNotesMedical
} from '@fortawesome/free-solid-svg-icons';
import styles from '../Dashboard.module.css';

const ProfileSection: React.FC = () => {
  return (
    <div className="profile-section">
      <h2>My Profile</h2>
      <div className={styles.profileContainer}>
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>JD</div>
            <h3>John Doe</h3>
            <p>Patient</p>
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Email</div>
                <div className={styles.infoValue}>john.doe@example.com</div>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Phone</div>
                <div className={styles.infoValue}>(555) 123-4567</div>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Address</div>
                <div className={styles.infoValue}>123 Main St, Anytown, USA</div>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faBirthdayCake} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Date of Birth</div>
                <div className={styles.infoValue}>January 15, 1985</div>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Gender</div>
                <div className={styles.infoValue}>Male</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${styles.profileCard} ${styles.medicalInfoCard}`}>
          <div className={`${styles.profileHeader} ${styles.medicalHeader}`}>
            <h3>Medical Information</h3>
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faTint} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Blood Type</div>
                <div className={styles.infoValue}>O+</div>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faAllergies} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Allergies</div>
                <div className={styles.infoValue}>Penicillin, Pollen</div>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faProcedures} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Conditions</div>
                <div className={styles.infoValue}>Hypertension, Asthma</div>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faCapsules} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Medications</div>
                <div className={styles.infoValue}>Lisinopril, Albuterol</div>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faNotesMedical} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Last Checkup</div>
                <div className={styles.infoValue}>June 12, 2023</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
