import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { useBooking } from '../../contexts/BookingContext';
import { FaCalendarAlt } from 'react-icons/fa';
import './booking.css';

export default function PatientInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});
  
  // Initialize form with any prefill data from location state or localStorage
  const [form, setForm] = useState({ 
    fullName: localStorage.getItem('patientName') || '', 
    phone: localStorage.getItem('patientPhone') || '', 
    email: localStorage.getItem('patientEmail') || '',
    selectedDate: '',
    selectedTime: ''
  });

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = t('validation.required') || 'Full name is required';
    if (!form.phone.trim()) newErrors.phone = t('validation.required') || 'Phone number is required';
    if (!form.email.trim()) {
      newErrors.email = t('validation.required') || 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = t('validation.invalid_email') || 'Email is invalid';
    }
    return newErrors;
  };

  // Load prefill data on component mount
  useEffect(() => {
    // Handle pre-selected center from navigation state
    if (location.state?.preSelectedCenter) {
      // Save the selected center to localStorage for persistence
      localStorage.setItem('selectedCenter', JSON.stringify(location.state.preSelectedCenter));
      
      // Update booking context with the selected center
      updateBookingData({
        center: location.state.preSelectedCenter,
        step: 1
      });
    }

    // Load date/time from URL params or localStorage
    const searchParams = new URLSearchParams(location.search);
    const dateParam = searchParams.get('date');
    const timeParam = searchParams.get('time');
    
    // Check for prefill data in location state or URL params
    const prefillData = location.state?.prefillData || 
      (dateParam && timeParam ? { 
        selectedDate: dateParam,
        selectedTime: timeParam 
      } : null);
    
    const savedPrefill = prefillData || JSON.parse(localStorage.getItem('bookingPrefill') || '{}');
    const savedPatientInfo = JSON.parse(localStorage.getItem('patientInfo') || '{}');
    
    setForm(prev => ({
      ...prev,
      ...savedPatientInfo,
      selectedDate: savedPrefill.selectedDate || '',
      selectedTime: savedPrefill.selectedTime || ''
    }));
    
    if (prefillData) {
      localStorage.setItem('bookingPrefill', JSON.stringify(prefillData));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const { bookingData, updateBookingData } = useBooking();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Prepare patient info
    const patientInfo = {
      firstName: form.fullName.trim().split(' ')[0],
      lastName: form.fullName.trim().split(' ').slice(1).join(' '),
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      notes: form.notes || ''
    };
    
    // Get selected center from context or localStorage
    const selectedCenter = bookingData?.center || JSON.parse(localStorage.getItem('selectedCenter') || '{}');
    const selectedDate = bookingData?.date || new Date();
    const selectedTime = bookingData?.time || '';
    
    // Update booking context with all necessary data
    updateBookingData({
      patientInfo,
      center: selectedCenter,
      date: selectedDate,
      time: selectedTime,
      step: 5 // Move to confirmation step (step 5 in BookingFlow)
    });
    
    // Save to localStorage for persistence
    localStorage.setItem('patientInfo', JSON.stringify(patientInfo));
    
    // Navigate to confirmation page
    navigate('/book/confirmation');
  };
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1>{t('booking_patient_title') || 'Patient Information'}</h1>
        <p>{t('booking_patient_subtitle') || 'Please provide your contact details'}</p>
      </div>

      {/* Appointment Summary */}
      {(form.selectedDate || form.selectedTime) && (
        <div className="appointment-summary">
          <h3>{t('appointment_details') || 'Appointment Details'}</h3>
          {form.selectedDate && (
            <p><strong>{t('date') || 'Date'}:</strong> {new Date(form.selectedDate).toLocaleDateString()}</p>
          )}
          {form.selectedTime && (
            <p><strong>{t('time') || 'Time'}:</strong> {form.selectedTime}</p>
          )}
        </div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label>{t('label_full_name') || 'Full Name'} *</label>
          <input 
            name="fullName" 
            className="input" 
            value={form.fullName} 
            onChange={handleChange} 
            required 
            placeholder={t('enter_full_name') || 'Enter your full name'}
          />
        </div>
        
        <div className="form-group">
          <label>{t('label_phone') || 'Phone Number'} *</label>
          <input 
            name="phone" 
            type="tel"
            className="input" 
            value={form.phone} 
            onChange={handleChange} 
            required
            placeholder={t('enter_phone') || 'Enter your phone number'}
          />
        </div>
        
        <div className="form-group">
          <label>{t('label_email') || 'Email Address'} *</label>
          <input 
            name="email" 
            type="email"
            className="input" 
            value={form.email} 
            onChange={handleChange} 
            required
            placeholder={t('enter_email') || 'Enter your email address'}
          />
        </div>
      </div>

      <div className="actions">
        <button 
          className="btn secondary" 
          onClick={() => navigate(-1)}
          style={{ marginRight: '10px' }}
        >
          {t('back') || 'Back'}
        </button>
        <button 
          className="btn primary" 
          onClick={handleSubmit}
          disabled={!form.fullName || !form.phone || !form.email}
        >
          {t('continue') || 'Continue to Confirmation'}
        </button>
      </div>
    </div>
  );
}
