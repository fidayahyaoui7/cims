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
  FaSpinner,
  FaChevronLeft,
  FaInfoCircle,
  FaUserMd
} from 'react-icons/fa';
import { appointmentService } from '../../services/appointmentService';
import './booking.css';

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    try {
      // Try to get data from location state first
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
        // Fallback to localStorage if no state is passed
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
          // If we don't have enough data, redirect back to the first booking step
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
    if (!data) return;
    
    try {
      setIsSaving(true);
      setSaveError(null);
      
      const appointmentData = {
        examType: data.selectedExam,
        centerId: data.center.id,
        centerName: data.center.name,
        appointmentDate: data.dateTime.date,
        appointmentTime: data.dateTime.time,
        patientName: data.patientInfo.fullName,
        patientEmail: data.patientInfo.email,
        patientPhone: data.patientInfo.phone,
        status: 'confirmed',
        hospitalType: data.center.type || 'general',
        hospitalCity: data.center.city || '',
        hospitalAddress: data.center.address || '',
        hospitalPhone: data.center.phone || '',
        hospitalServices: data.center.services || [],
        emergency: false
      };
      
      // Save the appointment
      await appointmentService.createAppointment(appointmentData);
      
      // Clear local storage
      localStorage.removeItem('selectedCenter');
      localStorage.removeItem('selectedDateTime');
      localStorage.removeItem('patientInfo');
      localStorage.removeItem('selectedExam');
      
      // Navigate to appointments page with success message
      navigate('/appointments', { 
        state: { 
          success: true, 
          message: t('appointment_booked_success') || 'Appointment booked successfully!' 
        } 
      });
      
    } catch (error) {
      console.error('Error saving appointment:', error);
      setSaveError(t('appointment_save_error') || 'Failed to save appointment. Please try again.');
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
        <div className="loading-spinner">
          <FaSpinner className="spinner-icon" />
          <p>{t('loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-header">
        <button 
          className="btn-icon" 
          onClick={handleBack}
          aria-label={t('back')}
        >
          <FaChevronLeft />
        </button>
        <h1>{t('booking_confirmation_title') || 'Confirm Your Appointment'}</h1>
        <p className="text-muted">
          {t('booking_confirmation_subtitle') || 'Please review your appointment details before confirming'}
        </p>
      </div>

      <div className="confirmation-card">
        <div className="confirmation-header">
          <FaCheckCircle className="text-success" size={32} />
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

        {saveError && (
          <div className="error-message">
            <FaInfoCircle /> {saveError}
          </div>
        )}
      </div>

      <div className="confirmation-actions">
        <button 
          className="btn secondary" 
          onClick={handleBack}
          disabled={isSaving}
        >
          {t('back') || 'Back'}
        </button>
        <button 
          className="btn primary" 
          onClick={handleConfirm}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <FaSpinner className="spinner" />
              {t('saving') || 'Saving...'}
            </>
          ) : (
            t('confirm') || 'Confirm Appointment'
          )}
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
