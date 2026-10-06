import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format, addDays, isToday, isBefore } from 'date-fns';
import { enUS, fr, ar } from 'date-fns/locale';
import { 
  FaChevronLeft, 
  FaMapMarkerAlt,
  FaInfoCircle,
  FaStethoscope,
  FaRegCalendarAlt,
  FaSpinner,
  FaClock
} from 'react-icons/fa';
import './booking.css';

// Map i18n language codes to date-fns locales
const locales = {
  en: enUS,
  fr: fr,
  ar: ar
};

// Sample services data - in a real app, this would come from an API
const sampleServices = [
  { id: 1, name: 'General Consultation', duration: 30, price: 30 },
  { id: 2, name: 'Dental Checkup', duration: 45, price: 50 },
  { id: 3, name: 'Eye Examination', duration: 30, price: 40 },
  { id: 4, name: 'Vaccination', duration: 15, price: 25 },
];

const DateTimeSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  // State management
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get center data from location state or use a default
  const center = location.state?.center || {
    id: 1,
    name: 'Medical Center',
    address: '123 Medical St, City, Country'
  };
  
  // Generate available dates (next 30 days)
  useEffect(() => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      dates.push({
        date,
        formatted: format(date, 'EEE, MMM d', { locale: locales[window.i18n?.language] || enUS }),
        day: format(date, 'd'),
        month: format(date, 'MMM', { locale: locales[window.i18n?.language] || enUS }),
        isToday: isToday(date)
      });
    }
    
    setAvailableDates(dates);
  }, []);
  
  // Generate time slots for the selected date
  useEffect(() => {
    if (!selectedDate) return;
    
    const slots = [];
    const startHour = 8; // 8 AM
    const endHour = 18;  // 6 PM
    const now = new Date();
    const isTodaySelected = isToday(selectedDate);
    
    for (let h = startHour; h < endHour; h++) {
      // Add full hour slot (e.g., 9:00)
      const fullHourTime = `${h.toString().padStart(2, '0')}:00`;
      const fullHourDate = new Date(selectedDate);
      fullHourDate.setHours(h, 0, 0, 0);
      
      const isPast = isTodaySelected && isBefore(fullHourDate, now);
      
      slots.push({
        time: fullHourTime,
        available: !isPast,
        isPast
      });
      
      // Add half hour slot (e.g., 9:30)
      if (h < endHour - 1) {
        const halfHourTime = `${h.toString().padStart(2, '0')}:30`;
        const halfHourDate = new Date(selectedDate);
        halfHourDate.setHours(h, 30, 0, 0);
        
        const isPastHalfHour = isTodaySelected && isBefore(halfHourDate, now);
        
        slots.push({
          time: halfHourTime,
          available: !isPastHalfHour,
          isPast: isPastHalfHour
        });
      }
    }
    
    setAvailableSlots(slots);
  }, [selectedDate]);
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setError('');
  };
  
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setError('');
  };
  
  const handleServiceSelect = (service) => {
    setSelectedService(service.id === selectedService?.id ? null : service);
    setError('');
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleNext = () => {
    if (!selectedTime || !selectedService) {
      setError(t('select_time_and_service') || 'Please select both a time and a service');
      return;
    }
    
    navigate('/booking/patient-info', {
      state: {
        appointmentDetails: {
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
          service: selectedService,
          center: center
        },
        from: location.pathname
      }
    });
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
        <h1>{t('select_date_time') || 'Select Date & Time'}</h1>
        <p>{t('choose_preferred_time') || 'Choose your preferred date and time for the appointment'}</p>
      </div>

      {/* Hospital Info */}
      <div className="booking-card">
        <div className="hospital-info">
          <h3>{center.name}</h3>
          <p className="text-muted">
            <FaMapMarkerAlt /> {center.address}
          </p>
        </div>
      </div>
      
      {/* Service Selection */}
      <div className="booking-card">
        <h2><FaStethoscope /> {t('select_service') || 'Select Service'}</h2>
        <div className="services-grid">
          {sampleServices.map((service) => (
            <div
              key={service.id}
              className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
              onClick={() => handleServiceSelect(service)}
            >
              <h4>{service.name}</h4>
              <div className="service-details">
                <span className="duration">{service.duration} min</span>
                <span className="price">{service.price} TND</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Date Selection */}
      <div className="booking-card">
        <h2><FaRegCalendarAlt /> {t('select_date') || 'Select Date'}</h2>
        <div className="date-picker">
          {availableDates.map((dateItem, index) => (
            <button
              key={index}
              className={`date-option ${
                format(selectedDate, 'yyyy-MM-dd') === format(dateItem.date, 'yyyy-MM-dd') ? 'selected' : ''
              } ${dateItem.isToday ? 'today' : ''}`}
              onClick={() => handleDateSelect(dateItem.date)}
            >
              <span className="day">{dateItem.formatted.split(',')[0]}</span>
              <span className="date">{dateItem.day}</span>
              <span className="month">{dateItem.month}</span>
              {dateItem.isToday && <span className="today-badge">Today</span>}
            </button>
          ))}
        </div>
      </div>
      
      {/* Time Slot Selection */}
      <div className="booking-card">
        <h2><FaClock /> {t('select_time') || 'Select Time'}</h2>
        <div className="time-slots">
          {availableSlots.map((slot, index) => (
            <button
              key={index}
              className={`time-slot ${!slot.available ? 'unavailable' : ''} ${selectedTime === slot.time ? 'selected' : ''}`}
              onClick={() => slot.available && handleTimeSelect(slot.time)}
              disabled={!slot.available}
              title={slot.isPast ? 'This time slot has passed' : !slot.available ? 'Not available' : ''}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="error-message">
          <FaInfoCircle /> {error}
        </div>
      )}
      
      {/* Navigation Buttons */}
      <div className="actions">
        <button 
          className="btn secondary" 
          onClick={handleBack}
        >
          {t('back') || 'Back'}
        </button>
        <button 
          className="btn primary" 
          onClick={handleNext}
          disabled={!selectedTime || !selectedService}
        >
          {t('continue') || 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default DateTimeSelection;
