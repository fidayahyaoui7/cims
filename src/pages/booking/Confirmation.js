import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFileAlt, FaHospital } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useBooking } from '../../contexts/BookingContext';
import { appointmentService } from '../../services/appointmentService';
import './booking.css';

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingData, resetBooking } = useBooking();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const { t } = useTranslation();
  
  // Get data from booking context or fallback to localStorage
  const data = bookingData || {
    center: JSON.parse(localStorage.getItem('selectedCenter') || '{}'),
    dateTime: JSON.parse(localStorage.getItem('selectedDateTime') || '{}'),
    patientInfo: JSON.parse(localStorage.getItem('patientInfo') || '{}'),
    selectedExam: localStorage.getItem('selectedExam') || t('general_consultation')
  };

  useEffect(() => {
    const checkBookingData = () => {
      try {
        // Check if we have enough data to show confirmation
        const hasRequiredData = data.center && data.dateTime && data.patientInfo;
        
        if (!hasRequiredData) {
          // If we don't have enough data, redirect back to the first booking step
          navigate('/book/exam-type');
          return;
        }
        
        // Set loading to false once we've checked the data
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading booking data:', error);
        navigate('/book/exam-type');
      }
    };
    
    checkBookingData();
  }, [navigate, data]);

  const handleConfirm = async () => {
    if (!data) {
      navigate('/book');
      return;
    }
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      // Format the appointment data
      const appointmentData = {
        patientName: data.patientInfo.fullName,
        patientEmail: data.patientInfo.email,
        patientPhone: data.patientInfo.phone,
        centerId: data.center.id,
        centerName: data.center.name,
        examType: data.selectedExam,
        appointmentDate: data.dateTime?.date || data.dateTime,
        appointmentTime: data.dateTime?.time || '10:00',
        status: 'confirmed',
        notes: ''
      };
      
      // Save the appointment
      const savedAppointment = await appointmentService.bookAppointment(appointmentData);
      
      // Clear the booking data
      resetBooking();
      localStorage.removeItem('selectedCenter');
      localStorage.removeItem('selectedDateTime');
      localStorage.removeItem('patientInfo');
      localStorage.removeItem('selectedExam');
      
      // Show success message
      toast.success(t('appointment_confirmed'));
      
      // Navigate to success page with appointment details
      navigate('/booking/success', { 
        state: { 
          appointment: {
            ...savedAppointment,
            reference: savedAppointment.id || `APP-${Date.now()}`
          } 
        } 
      });
    } catch (error) {
      console.error('Error saving appointment:', error);
      setSaveError(t('appointment_save_error', 'Failed to save appointment. Please try again.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="confirmation-container loading">
        <div className="spinner"></div>
        <p>{t('loading', 'Loading...')}</p>
      </div>
    );
  }

  if (!data || !data.patientInfo || !data.center) {
    return (
      <div className="confirmation-container error">
        <h2>{t('incomplete_booking', 'Incomplete Booking Data')}</h2>
        <p>{t('please_complete_booking', 'Please complete the booking process from the beginning.')}</p>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/book/exam-type')}
        >
          {t('start_booking', 'Start Booking')}
        </button>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-header">
        <h1>{t('confirm_appointment') || 'Confirm Your Appointment'}</h1>
        <p>{t('review_details') || 'Please review your appointment details before confirming.'}</p>
      </div>
      
      {saveError && (
        <div className="alert alert-danger">
          {saveError}
        </div>
      )}
      
      <div className="confirmation-details">
        <h4>{t('appointment_details') || 'Appointment Details'}</h4>
        
        <div className="detail-row">
          <div className="detail-icon"><FaUser /></div>
          <div className="detail-content">
            <span className="detail-label">{t('patient_name') || 'Patient Name'}</span>
            <span className="detail-value">{data.patientInfo?.fullName || 'N/A'}</span>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-icon"><FaCalendarAlt /></div>
          <div className="detail-content">
            <span className="detail-label">{t('date') || 'Date'}</span>
            <span className="detail-value">{data.dateTime?.date || 'N/A'}</span>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-icon"><FaClock /></div>
          <div className="detail-content">
            <span className="detail-label">{t('time') || 'Time'}</span>
            <span className="detail-value">{data.dateTime?.time || 'N/A'}</span>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-icon"><FaMapMarkerAlt /></div>
          <div className="detail-content">
            <span className="detail-label">{t('location') || 'Location'}</span>
            <span className="detail-value">
              {data.center?.name || 'N/A'}<br />
              <small className="text-muted">{data.center?.address || ''}</small>
            </span>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-icon"><FaPhone /></div>
          <div className="detail-content">
            <span className="detail-label">{t('contact_number') || 'Contact'}</span>
            <span className="detail-value">{data.patientInfo?.phone || 'N/A'}</span>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-icon"><FaEnvelope /></div>
          <div className="detail-content">
            <span className="detail-label">Email</span>
            <span className="detail-value">{data.patientInfo?.email || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="confirmation-actions">
        <button 
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
          disabled={isSaving}
        >
          {t('back', 'Back')}
        </button>
        <button 
          className="btn btn-primary"
          onClick={handleConfirm}
          disabled={isSaving}
        >
          {isSaving ? (
            <>{t('saving', 'Saving...')}</>
          ) : (
            <>{t('confirm_booking', 'Confirm Booking')}</>
          )}
        </button>
      </div>
    </div>
  );
}

export default Confirmation;
