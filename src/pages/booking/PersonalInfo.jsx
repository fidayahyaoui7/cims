import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBooking } from '../../contexts/BookingContext';
import '../../styles/PersonalInfo.css';

const PersonalInfo = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { bookingData, updateBookingData } = useBooking();
  
  const [formData, setFormData] = useState({
    firstName: bookingData.patientInfo?.firstName || '',
    lastName: bookingData.patientInfo?.lastName || '',
    email: bookingData.patientInfo?.email || '',
    phone: bookingData.patientInfo?.phone || '',
    address: bookingData.patientInfo?.address || '',
    city: bookingData.patientInfo?.city || '',
    zip: bookingData.patientInfo?.zip || ''
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 8 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Update booking context
      updateBookingData({
        patientInfo: {
          ...formData,
          fullName: `${formData.firstName} ${formData.lastName}`.trim()
        },
        step: 5 // Next step is confirmation
      });
      
      // Also save to localStorage for persistence
      localStorage.setItem('patientInfo', JSON.stringify(formData));
      navigate('/booking/confirmation');
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1>{t('personal_info_title', 'Personal Information')}</h1>
        <p>{t('personal_info_subtitle', 'Please provide your details to complete the booking')}</p>
      </div>

      <form onSubmit={handleSubmit} className="personal-info-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName" className="required">
              {t('first_name', 'First Name')}
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? 'error' : ''}
              required
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName" className="required">
              {t('last_name', 'Last Name')}
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email" className="required">
            {t('email', 'Email Address')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="required">
            {t('phone', 'Phone Number')}
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
          <label htmlFor="address">
            {t('address', 'Street Address')}
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">
              {t('city', 'City')}
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="zip">
              {t('zip_code', 'ZIP Code')}
            </label>
            <input
              type="text"
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            {t('back', 'Back')}
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone}
          >
            {t('next', 'Next')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;
