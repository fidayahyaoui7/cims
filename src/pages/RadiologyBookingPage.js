import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../contexts/BookingContext';
import BookingSteps from '../components/BookingSteps';
import TypeSelection from '../components/booking/steps/TypeSelection';
import RegionSelection from '../components/booking/steps/RegionSelection';
import CenterSelection from '../components/booking/steps/CenterSelection';
import DateTimeSelection from '../components/booking/steps/DateTimeSelection';
import PatientInfo from '../components/booking/steps/PatientInfo';
import Confirmation from '../components/booking/steps/Confirmation';

const RadiologyBookingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { bookingData, updateBookingData, nextStep, prevStep, resetBooking } = useBooking();
  const [currentStep, setCurrentStep] = useState(bookingData?.step || 1);

  const handleStepClick = (step) => {
    // Only allow going to previous steps or current step
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const handleNext = (data = {}) => {
    updateBookingData({
      ...bookingData,
      ...data,
      step: currentStep + 1
    });
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleComplete = () => {
    // Handle booking completion
    resetBooking();
    navigate('/booking-confirmation');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <TypeSelection onNext={handleNext} />;
      case 2:
        return <RegionSelection onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <CenterSelection onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <DateTimeSelection onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <PatientInfo onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <Confirmation onComplete={handleComplete} onBack={handleBack} />;
      default:
        return <TypeSelection onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('book_radiology_appointment')}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {t('book_radiology_appointment_description')}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <BookingSteps 
            currentStep={currentStep} 
            onStepClick={handleStepClick} 
          />
        </div>

        {/* Current Step Content */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default RadiologyBookingPage;
