import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFileAlt, FaChevronLeft, FaInfoCircle, FaUserMd } from 'react-icons/fa';
import { appointmentService } from '../../services/appointmentService';
import './booking.css';

const ConfirmationPage = () => {
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
        
        setData({
          center: appointmentDetails.center || {},
          dateTime: {
            date: appointmentDetails.date || '',
            time: appointmentDetails.time || ''
          },
          patientInfo: {
            fullName: patientInfo.fullName || '',
            phone: patientInfo.phone || '',
            email: patientInfo.email || '',
            dateOfBirth: patientInfo.dateOfBirth || ''
          },
          radiologyType: appointmentDetails.radiologyType || {},
          selectedExam: localStorage.getItem('selectedExam') || t('general_consultation')
        });
        
        // Also save to localStorage for page refresh
        localStorage.setItem('patientInfo', JSON.stringify(patientInfo));
        if (appointmentDetails.center) {
          localStorage.setItem('selectedCenter', JSON.stringify(appointmentDetails.center));
        }
      } else {
        // Fallback to localStorage if no state is passed
        const center = JSON.parse(localStorage.getItem('selectedCenter') || '{}');
        const patientInfo = JSON.parse(localStorage.getItem('patientInfo') || '{}');
        const selectedExam = localStorage.getItem('selectedExam') || t('general_consultation');
        const dateTime = {
          date: localStorage.getItem('selectedDate') || '',
          time: localStorage.getItem('selectedTime') || ''
        };

        if (center && (dateTime.date || dateTime.time) && patientInfo) {
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
    try {
      setIsSaving(true);
      // Here you would typically make an API call to confirm the appointment
      await appointmentService.createAppointment({
        ...data.patientInfo,
        ...data.dateTime,
        centerId: data.center?.id,
        examType: data.selectedExam
      });
      
      // Clear booking data from localStorage
      ['selectedCenter', 'selectedDateTime', 'patientInfo', 'selectedExam'].forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Navigate to success page or dashboard
      navigate('/appointments', { 
        state: { 
          message: t('booking_confirmation_success') || 'Your appointment has been confirmed!',
          status: 'success'
        } 
      });
    } catch (error) {
      console.error('Error confirming appointment:', error);
      setSaveError(t('booking_confirmation_error') || 'Failed to confirm appointment. Please try again.');
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
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-header">
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
          <div className="section-header">
            <h4>{t('appointment_details') || 'Appointment Details'}</h4>
            <button 
              onClick={() => navigate('/profile')} 
              className="text-sm text-blue-600 hover:underline"
            >
              {t('edit') || 'Edit'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                {t('your_information') || 'Your Information'}
              </h5>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">{t('full_name') || 'Full Name'}</p>
                  <p className="text-gray-900 font-medium">{data?.patientInfo?.fullName || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">{t('phone') || 'Phone'}</p>
                    <p className="text-gray-900">{data?.patientInfo?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('email') || 'Email'}</p>
                    <p className="text-gray-900 break-all">{data?.patientInfo?.email || 'N/A'}</p>
                  </div>
                </div>
                {data?.patientInfo?.dateOfBirth && (
                  <div>
                    <p className="text-xs text-gray-500">{t('date_of_birth') || 'Date of Birth'}</p>
                    <p className="text-gray-900">
                      {new Date(data.patientInfo.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                {t('appointment_details') || 'Appointment Details'}
              </h5>
              <div className="space-y-3">
                {data?.radiologyType && (
                  <div className="flex items-start">
                    <div className="text-blue-500 mr-3 mt-1">
                      <FaFileAlt />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t('examination_type') || 'Examination Type'}</p>
                      <p className="text-gray-900 capitalize">
                        {data.radiologyType.id || 'N/A'}
                        {data.radiologyType.price && (
                          <span className="ml-2 text-sm text-gray-600">
                            ({data.radiologyType.price})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start">
                  <div className="text-blue-500 mr-3 mt-1">
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('date') || 'Date'}</p>
                    <p className="text-gray-900">{data?.dateTime?.date || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-blue-500 mr-3 mt-1">
                    <FaClock />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('time') || 'Time'}</p>
                    <p className="text-gray-900">{data?.dateTime?.time || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-blue-500 mr-3 mt-1">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('location') || 'Location'}</p>
                    <p className="text-gray-900">
                      {data?.center?.name || 'N/A'}
                      {data?.center?.address && (
                        <span className="block text-sm text-gray-600">
                          {data.center.address}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {saveError && (
        <div className="error-message">
          {saveError}
        </div>
      )}

      <div className="confirmation-actions">
        <button 
          className="btn secondary" 
          onClick={handleBack}
          disabled={isSaving}
        >
          ← {t('back') || 'Back'}
        </button>
        <button 
          className="btn primary" 
          onClick={handleConfirm}
          disabled={isSaving || !data}
        >
          {isSaving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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

export default ConfirmationPage;
