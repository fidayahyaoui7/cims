import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBooking } from '../../contexts/BookingContext';
import { FaChevronLeft, FaCheck, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaFileAlt } from 'react-icons/fa';
import ToastNotification from '../ui/ToastNotification';
import '../../styles/BookingFlow.css';
import '../../styles/BookingFlowComponents.css';

// Import steps
import TypeSelection from './steps/TypeSelection';
import RegionSelection from './steps/RegionSelection';
import DateTimeSelection from './steps/DateTimeSelection';
import Confirmation from './steps/Confirmation';

const BookingFlow = () => {
  const { t } = useTranslation('booking');
  const { bookingData, nextStep, prevStep, updateBookingData } = useBooking();
  const navigate = useNavigate();
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);

  // Check for pre-selected center in route state
  useEffect(() => {
    if (location.state?.center) {
      updateBookingData({
        center: location.state.center,
        step: 2, // Go to date & time selection
        region: location.state.center.region || 'Tunis'
      });
    }
  }, [location.state, updateBookingData]);

  // Get step icon based on step number
  const getStepIcon = (step) => {
    switch(step) {
      case 1: return <FaFileAlt className="step-icon" />;
      case 2: return <FaMapMarkerAlt className="step-icon" />;
      case 3: return <FaCalendarAlt className="step-icon" />;
      case 4: return <FaUser className="step-icon" />;
      case 5: return <FaCheck className="step-icon" />;
      default: return null;
    }
  };

  // Get step name for translation
  const getStepName = (step) => {
    const steps = t('steps', { returnObjects: true });
    switch(step) {
      case 1: return steps.type || 'Type';
      case 2: return steps.region || 'Region';
      case 3: return steps.datetime || 'Date & Time';
      case 4: return 'Patient Info';
      case 5: return 'Confirmation';
      default: return '';
    }
  };

  const handleBack = useCallback(() => {
    prevStep();
  }, [prevStep]);

  const handleComplete = useCallback(() => {
    console.log('Booking completed:', bookingData);
    
    // Show toast notification
    setShowToast(true);
    
    // Reset the booking data after a short delay
    setTimeout(() => {
      updateBookingData({
        step: 1,
        center: null,
        date: null,
        time: null,
        patientInfo: null
      });
      
      // Navigate back to home after showing the toast
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }, 3000);
  }, [bookingData, updateBookingData, navigate]);

  const renderStep = () => {
    switch (bookingData.step) {
      case 1:
        return <TypeSelection onNext={nextStep} />;
      case 2:
        return <RegionSelection onNext={nextStep} onBack={handleBack} />;
      case 3:
        return <DateTimeSelection onNext={nextStep} onBack={handleBack} />;
      case 4:
        return <PatientInfo onNext={nextStep} onBack={handleBack} />;
      case 5:
        return <Confirmation onComplete={handleComplete} onBack={handleBack} />;
      default:
        return <TypeSelection onNext={nextStep} />;
    }
  };

  // Format the confirmation message
  const confirmationMessage = bookingData?.center && bookingData?.date && bookingData?.time 
    ? `Appointment confirmed at ${bookingData.center.name} on ${new Date(bookingData.date).toLocaleDateString()} at ${bookingData.time}`
    : 'Appointment confirmed!';

  return (
    <div className="booking-container">
      <ToastNotification 
        message={confirmationMessage} 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        duration={3000}
      />
      <div className="booking-header text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('subtitle')}</p>
      </div>

      {/* Progress Bar */}
      <div className="booking-progress">
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ 
              width: `${((bookingData.step - 1) / 4) * 100}%`,
              transition: 'width 0.4s ease'
            }}
          />
        </div>
        <div className="steps">
          {[1, 2, 3, 4, 5].map((step) => (
            <div 
              key={step} 
              className={`step ${bookingData.step === step ? 'active' : ''} ${bookingData.step > step ? 'completed' : ''}`}
            >
              <div className="step-number">
                {bookingData.step > step ? <FaCheck size={14} /> : getStepIcon(step) || step}
              </div>
              <div className="step-label">{getStepName(step)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="step-content">
        {renderStep()}
      </div>
    </div>
  );
};

export default BookingFlow;
