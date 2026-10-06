import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import fr from 'date-fns/locale/fr';
import ar from 'date-fns/locale/ar-SA';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaMapMarkerAlt, 
  FaSearch, 
  FaFilter, 
  FaCalendarPlus, 
  FaUserMd, 
  FaStarHalfAlt, 
  FaDirections, 
  FaEnvelope, 
  FaChevronLeft, 
  FaInfoCircle, 
  FaFileAlt, 
  FaPhone, 
  FaCheck, 
  FaExclamationCircle, 
  FaSpinner,
  FaCheckCircle
} from 'react-icons/fa';
import { centersAPI, appointmentsAPI } from '../services/api';
import { getCurrentUser } from '../services/authService';
import '../styles/AppointmentPage.css';

// Register date-fns locales
registerLocale('fr', fr);
registerLocale('ar', ar);

const AppointmentPage = () => {
  const { t, i18n } = useTranslation();
  const { centerId } = useParams();
  const navigate = useNavigate();
  const [center, setCenter] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [notes, setNotes] = useState('');
  const isRTL = i18n.language === 'ar';

  // Fetch center details
  useEffect(() => {
    const fetchCenter = async () => {
      try {
        setIsLoading(true);
        const centerData = await centersAPI.getById(centerId);
        setCenter(centerData);
        // Generate sample available slots (replace with actual API call)
        const slots = [];
        for (let i = 9; i < 18; i++) {
          if (i !== 12) { // Skip lunch time
            slots.push(`${i < 10 ? '0' + i : i}:00`);
          }
        }
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error fetching center:', error);
        toast.error(t('error_loading_center'));
      } finally {
        setIsLoading(false);
      }
    };

    if (centerId) {
      fetchCenter();
    }
  }, [centerId, t]);

  const handleBookAppointment = async () => {
    if (!selectedTime) {
      toast.error(t('select_time_slot'));
      return;
    }

    const user = getCurrentUser();
    if (!user) {
      navigate('/login', { state: { from: `/appointment/${centerId}` } });
      return;
    }

    try {
      setIsBooking(true);
      const appointmentData = {
        centerId,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        notes,
        userId: user.id,
        userName: user.name,
        userEmail: user.email
      };

      await appointmentsAPI.create(appointmentData);
      toast.success(t('appointment_booked'));
      navigate('/appointments');
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error(error.response?.data?.message || t('booking_error'));
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner">
          <FaSpinner className="spinner-icon" spin />
        </div>
        <p>{t('loading')}...</p>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="error-container">
        <h2>{t('error_loading_center')}</h2>
        <div className="button-group">
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            {t('try_again')}
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-secondary"
          >
            {t('back_to_home')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container">
        <button 
          className="back-button" 
          onClick={() => navigate(-1)}
          aria-label={t('back')}
        >
          <FaArrowLeft /> {t('back')}
        </button>
        
        <h1 className="page-title">{t('book_appointment')}</h1>
        
        <div className="appointment-container">
          <div className="appointment-form">
            <h2 className="section-title">{t('appointment_details')}</h2>
            
            <div className="form-group">
              <label htmlFor="date">{t('select_date')}</label>
              <div className="date-picker-wrapper">
                <FaCalendarAlt className="input-icon" />
                <DatePicker
                  id="date"
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  minDate={new Date()}
                  className="form-control"
                  dateFormat="P"
                  locale={i18n.language}
                  showPopperArrow={false}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>{t('available_time_slots')}</label>
              <div className="time-slots">
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot) => (
                    <button
                      key={slot}
                      className={`time-slot ${selectedTime === slot ? 'selected' : ''}`}
                      onClick={() => setSelectedTime(slot)}
                      type="button"
                      aria-label={`${t('select_time')} ${slot}`}
                    >
                      <FaClock /> {slot}
                    </button>
                  ))
                ) : (
                  <p className="no-slots">
                    <FaExclamationCircle /> {t('no_available_slots')}
                  </p>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">
                {t('additional_notes')} <span className="optional">({t('optional')})</span>
              </label>
              <textarea
                id="notes"
                className="form-control"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('any_special_requirements')}
                rows="4"
                aria-label={t('additional_notes')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            
            <div className="appointment-summary">
              <h3 className="summary-title">{t('appointment_summary')}</h3>
              <div className="summary-item">
                <span className="label">{t('center')}:</span>
                <span className="value">{center?.name}</span>
              </div>
              <div className="summary-item">
                <span className="label">{t('date')}:</span>
                <span className="value">
                  {selectedDate.toLocaleDateString(i18n.language, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {selectedTime && (
                <div className="summary-item">
                  <span className="label">{t('time')}:</span>
                  <span className="value">{selectedTime}</span>
                </div>
              )}
            </div>
            
            <button
              className="btn btn-primary btn-block"
              onClick={handleBookAppointment}
              disabled={isBooking || !selectedTime}
              aria-busy={isBooking}
            >
              {isBooking ? (
                <>
                  <FaSpinner className="spinner-icon" spin /> {t('booking')}...
                </>
              ) : (
                <>
                  <FaCheckCircle /> {t('confirm_booking')}
                </>
              )}
            </button>
          </div>
          
          {center && (
            <div className="center-details">
              <div className="center-image">
                <img 
                  src={center.image || '/images/medical-center-placeholder.jpg'} 
                  alt={center.name} 
                  className="img-fluid"
                />
              </div>
              <div className="center-info">
                <h2 className="center-name">{center.name}</h2>
                
                {center.address && (
                  <p className="address">
                    <FaMapMarkerAlt className="info-icon" /> {center.address}
                  </p>
                )}
                
                <div className="contact-info">
                  {center.phone && (
                    <p>
                      <FaPhone className="info-icon" /> 
                      <a href={`tel:${center.phone}`} className="contact-link">
                        {center.phone}
                      </a>
                    </p>
                  )}
                  
                  {center.email && (
                    <p>
                      <FaEnvelope className="info-icon" /> 
                      <a href={`mailto:${center.email}`} className="contact-link">
                        {center.email}
                      </a>
                    </p>
                  )}
                </div>
                
                {center.services && center.services.length > 0 && (
                  <div className="services-section">
                    <h3 className="section-title">
                      <FaInfoCircle className="section-icon" /> {t('services_offered')}
                    </h3>
                    <ul className="services-list">
                      {center.services.map((service, index) => (
                        <li key={index} className="service-item">
                          <FaCheck className="check-icon" /> {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
