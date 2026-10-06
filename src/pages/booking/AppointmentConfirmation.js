import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaCheckCircle, 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaCheck, 
  FaExclamationCircle,
  FaArrowLeft
} from 'react-icons/fa';
import { appointmentService } from '../../services/appointmentService';
import './booking.css';

// Success Modal Component
const SuccessModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`}>
      <div className="modal-content">
        <div className="modal-icon">
          <FaCheck />
        </div>
        <h3 className="modal-title">
          {t('appointment_confirmed') || 'Appointment Confirmed!'}
        </h3>
        <p className="modal-message">
          {t('appointment_confirmation_message') || 'Your appointment has been successfully scheduled.'}
        </p>
        <div className="modal-actions">
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/');
            }}
            className="modal-btn primary"
          >
            {t('okay') || 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AppointmentConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    try {
      if (location.state?.patientInfo && location.state?.appointmentDetails) {
        const { patientInfo, appointmentDetails } = location.state;
        const center = JSON.parse(localStorage.getItem('selectedCenter') || '{}');
        const selectedExam = localStorage.getItem('selectedExam') || t('general_consultation');
        
        setData({
          center,
          dateTime: appointmentDetails,
          patientInfo,
          selectedExam
        });
      } else {
        const center = JSON.parse(localStorage.getItem('selectedCenter') || '{}');
        const dateTime = JSON.parse(localStorage.getItem('selectedDateTime') || '{}');
        const patientInfo = JSON.parse(localStorage.getItem('patientInfo') || '{}');
        const selectedExam = localStorage.getItem('selectedExam') || t('general_consultation');

        if (center && dateTime && patientInfo) {
          setData({
            center,
            dateTime,
            patientInfo,
            selectedExam
          });
        } else {
          navigate('/booking');
          return;
        }
      }
    } catch (error) {
      console.error('Error loading booking data:', error);
      navigate('/booking');
    } finally {
      setIsLoading(false);
    }
  }, [location.state, navigate, t]);

  const handleConfirm = async () => {
    if (!data || !data.patientInfo || !data.dateTime || !data.center?.id) {
      setSaveError(t('incomplete_booking_data') || 'Incomplete booking information. Please check your details and try again.');
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'phone', 'email'];
      const missingFields = requiredFields.filter(field => !data.patientInfo[field]);
      
      if (missingFields.length > 0) {
        throw new Error(t('missing_required_fields') || `Missing required fields: ${missingFields.join(', ')}`);
      }

      // Make API call to confirm the appointment
      const appointmentData = {
        ...data.patientInfo,
        ...data.dateTime,
        centerId: data.center.id,
        examType: data.selectedExam,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      await appointmentService.createAppointment(appointmentData);
      
      // Clear booking data from localStorage
      ['selectedCenter', 'selectedDateTime', 'patientInfo', 'selectedExam'].forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Show success modal
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Error confirming appointment:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          t('booking_confirmation_error') || 
                          'Failed to confirm appointment. Please try again.';
      
      setSaveError(errorMessage);
      
      // Scroll to error message
      setTimeout(() => {
        const errorElement = document.querySelector('.error-message');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="booking-page">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="booking-page">
        <div className="error-message">
          <FaExclamationCircle />
          {t('booking_data_missing') || 'Unable to load booking details. Please try again.'}
        </div>
        <button 
          onClick={() => navigate('/booking')}
          className="btn primary"
        >
          {t('back_to_booking') || 'Back to Booking'}
        </button>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
      
      <div className="confirmation-header">
        <h1>{t('booking_confirmation_title') || 'Confirm Your Appointment'}</h1>
        <p>
          {t('booking_confirmation_subtitle') || 'Please review your appointment details before confirming'}
        </p>
      </div>

      {saveError && (
        <div className="error-message">
          <FaExclamationCircle />
          {saveError}
        </div>
      )}

      <div className="confirmation-details">
        <h3>{t('appointment_scheduled') || 'Appointment Scheduled'}</h3>
        <p className="text-muted">
          {t('appointment_confirmation_message') || 'Your appointment has been scheduled successfully'}
        </p>
      </div>

      <div className="confirmation-details">
        <h4>{t('appointment_details') || 'Appointment Details'}</h4>
          
          <div className="detail-row">
            <div className="detail-icon"><FaUser /></div>
            <div className="detail-content">
              <span className="detail-label">{t('patient_name') || 'Patient Name'}</span>
              <span className="detail-value">{data?.patientInfo?.fullName || 'N/A'}</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon"><FaCalendarAlt /></div>
            <div className="detail-content">
              <span className="detail-label">{t('date') || 'Date'}</span>
              <span className="detail-value">{data?.dateTime?.date || 'N/A'}</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon"><FaClock /></div>
            <div className="detail-content">
              <span className="detail-label">{t('time') || 'Time'}</span>
              <span className="detail-value">{data?.dateTime?.time || 'N/A'}</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon"><FaMapMarkerAlt /></div>
            <div className="detail-content">
              <span className="detail-label">{t('location') || 'Location'}</span>
              <span className="detail-value">
                {data?.center?.name || 'N/A'}<br />
                <small className="text-muted">{data?.center?.address || ''}</small>
              </span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon"><FaPhone /></div>
            <div className="detail-content">
              <span className="detail-label">{t('contact_number') || 'Contact'}</span>
              <span className="detail-value">{data?.patientInfo?.phone || 'N/A'}</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon"><FaEnvelope /></div>
            <div className="detail-content">
              <span className="detail-label">Email</span>
              <span className="detail-value">{data?.patientInfo?.email || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <button 
            className="btn secondary" 
            onClick={handleBack}
            disabled={isSaving}
          >
            <FaArrowLeft className="me-2" />
            {t('back') || 'Back'}
          </button>
          <button 
            className="btn primary" 
            onClick={handleConfirm}
            disabled={isSaving || !data}
          >
            {isSaving ? (
              <>
                <span className="loading-spinner me-2"></span>
                {t('saving') || 'Saving...'}
              </>
            ) : (
              t('confirm') || 'Confirm'
            )}
          </button>
        </div>
      </div>
    );
};

export default AppointmentConfirmation;
