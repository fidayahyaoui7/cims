import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope, FaInfoCircle } from 'react-icons/fa';
import './AppointmentForm.css';

const AppointmentForm = ({ hospital, onClose }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    notes: '',
    distance: '',
    estimatedTime: ''
  });
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
    loading: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, error: t('geolocation_not_supported') }));
      return;
    }

    setLocation(prev => ({ ...prev, loading: true }));
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false
        });
        calculateDistance(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setLocation({
          latitude: null,
          longitude: null,
          error: t('geolocation_error'),
          loading: false
        });
      }
    );
  };

  const calculateDistance = (userLat, userLng) => {
    // Simplified distance calculation
    const R = 6371; // Earth's radius in km
    const hospitalLat = hospital.latitude || 36.8065;
    const hospitalLng = hospital.longitude || 10.1815;
    
    const dLat = toRad(hospitalLat - userLat);
    const dLon = toRad(hospitalLng - userLng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(userLat)) * Math.cos(toRad(hospitalLat)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    const estimatedTime = Math.round((distance / 30) * 60); // in minutes
    
    setFormData(prev => ({
      ...prev,
      distance: distance.toFixed(1),
      estimatedTime: estimatedTime.toString()
    }));
  };

  const toRad = (value) => value * Math.PI / 180;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Appointment request:', { ...formData, hospital });
    alert(t('appointment_request_sent'));
    onClose();
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="appointment-modal-overlay" onClick={onClose}>
      <div className="appointment-modal" onClick={e => e.stopPropagation()}>
        <div className="appointment-form-container">
          <div className="appointment-header">
            <h3>{t('book_appointment')}</h3>
            <h4>{hospital.name}</h4>
            <p className="hospital-address">
              <FaMapMarkerAlt /> {hospital.address}
            </p>
          </div>

          {step === 1 && (
            <div className="location-step">
              <h4>{t('your_location')}</h4>
              <p>{t('location_help_text')}</p>
              
              <div className="location-options">
                <button 
                  type="button" 
                  className="btn-location"
                  onClick={getCurrentLocation}
                  disabled={location.loading}
                >
                  {location.loading ? t('detecting') : t('use_my_location')}
                </button>
                
                <div className="or-separator">
                  <span>{t('or')}</span>
                </div>
                
                <div className="manual-location">
                  <input
                    type="text"
                    name="address"
                    placeholder={t('enter_your_address')}
                    value={formData.address || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              {formData.distance && (
                <div className="distance-info">
                  <p>{t('distance_from_you')}: <strong>{formData.distance} km</strong></p>
                  <p>{t('estimated_travel_time')}: <strong>{formData.estimatedTime} min</strong></p>
                </div>
              )}
              
              {location.error && (
                <div className="error-message">
                  <FaInfoCircle /> {location.error}
                </div>
              )}
              
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>
                  {t('cancel')}
                </button>
                <button 
                  type="button" 
                  className="btn-next"
                  onClick={nextStep}
                  disabled={!formData.distance}
                >
                  {t('next')} →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="appointment-details-form">
              <h4>{t('appointment_details')}</h4>
              
              <div className="form-group">
                <label htmlFor="fullName">
                  <FaUser /> {t('full_name')} *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">
                  <FaPhone /> {t('phone_number')} *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope /> {t('email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">
                    <FaCalendarAlt /> {t('preferred_date')} *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="time">
                    <FaClock /> {t('preferred_time')} *
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">
                  <FaInfoCircle /> {t('additional_notes')}
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder={t('notes_placeholder')}
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-back"
                  onClick={prevStep}
                >
                  ← {t('back')}
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={!formData.fullName || !formData.phone || !formData.date || !formData.time}
                >
                  {t('book_appointment')}
                </button>
              </div>
            </form>
          )}
        </div>
        
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default AppointmentForm;
