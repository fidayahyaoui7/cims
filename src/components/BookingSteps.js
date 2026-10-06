import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaCalendarAlt, FaUserMd, FaClock, FaCheckCircle } from 'react-icons/fa';

const BookingSteps = ({ currentStep = 1, onStepClick }) => {
  const { t } = useTranslation();
  
  const steps = [
    { id: 1, label: t('select_service'), icon: <FaUserMd /> },
    { id: 2, label: t('select_date'), icon: <FaCalendarAlt /> },
    { id: 3, label: t('your_info'), icon: <FaUserMd /> },
    { id: 4, label: t('confirmation'), icon: <FaCheckCircle /> },
  ];

  return (
    <div className="booking-steps-container">
      <h3 className="booking-steps-title">{t('book_appointment')}</h3>
      <div className="booking-steps">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div 
                className={`booking-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                onClick={() => onStepClick && onStepClick(step.id)}
              >
                <div className="step-icon">
                  {isCompleted ? <FaCheck /> : step.icon}
                </div>
                <span className="step-label">{step.label}</span>
              </div>
              
              {!isLast && (
                <div className={`step-connector ${isCompleted ? 'completed' : ''}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default BookingSteps;
