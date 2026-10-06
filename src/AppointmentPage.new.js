import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addDays, isBefore } from 'date-fns';
import { enUS, ar } from 'date-fns/locale';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { debounce } from 'lodash';

// Import API services
import { centersAPI, usersAPI, appointmentsAPI } from './services/api';
import './styles/AppointmentPage.css';

// Skeleton Loader Components
const CenterCardSkeleton = () => (
  <div className="center-card skeleton">
    <div className="skeleton-title"></div>
    <div className="skeleton-text"></div>
    <div className="skeleton-meta">
      <span></span>
      <span></span>
    </div>
  </div>
);

const DoctorCardSkeleton = () => (
  <div className="doctor-card skeleton">
    <div className="skeleton-avatar"></div>
    <div className="skeleton-info">
      <div className="skeleton-text"></div>
      <div className="skeleton-specialty"></div>
      <div className="skeleton-rating"></div>
    </div>
  </div>
);

const AppointmentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  // UI State
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState({
    centers: true,
    doctors: false,
    slots: false,
    booking: false
  });
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');

  // Data states
  const [centers, setCenters] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [doctorSpecialties, setDoctorSpecialties] = useState([]);

  // Selection states
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [user, setUser] = useState(null);

  // Memoized filtered centers (excluding Nord Paris Hospital)
  const filteredCenters = useMemo(() => {
    return centers
      .filter(center => center.name !== 'Nord Paris Hospital')
      .filter(center => 
        center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [centers, searchQuery]);

  // Memoized filtered doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => 
      (specialtyFilter === 'all' || doctor.specialty === specialtyFilter) &&
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [doctors, searchQuery, specialtyFilter]);

  // Check if date is a weekday and not in the past
  const isDateSelectable = (date) => {
    const day = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return day !== 0 && day !== 6 && !isBefore(date, today);
  };

  // Handle going back to previous step
  const handleStepBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/');
    }
  };

  // Render content based on current step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-content">
            <h2>{t('select_center')}</h2>
            <div className="search-filter">
              <input
                type="text"
                placeholder={t('search_center_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="centers-grid">
              {isLoading.centers ? (
                Array(4).fill().map((_, i) => <CenterCardSkeleton key={i} />)
              ) : (
                filteredCenters.map(center => (
                  <div 
                    key={center.id} 
                    className={`center-card ${selectedCenter?.id === center.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCenter(center)}
                  >
                    <h3>{center.name}</h3>
                    <p>{center.address}</p>
                    <div className="center-meta">
                      <span className="rating">
                        {center.rating} ★
                      </span>
                      <span className="distance">
                        {center.distance ? `${center.distance} km` : ''}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="step-content">
            <h2>{t('select_doctor')}</h2>
            <div className="filters">
              <select 
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
              >
                <option value="all">{t('all_specialties')}</option>
                {Array.from(new Set(doctors.map(d => d.specialty))).map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
            <div className="doctors-list">
              {isLoading.doctors ? (
                Array(3).fill().map((_, i) => <DoctorCardSkeleton key={i} />)
              ) : (
                filteredDoctors.map(doctor => (
                  <div 
                    key={doctor.id}
                    className={`doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    <div className="doctor-avatar">
                      {doctor.avatar ? (
                        <img src={doctor.avatar} alt={doctor.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {doctor.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="doctor-info">
                      <h3>{doctor.name}</h3>
                      <p className="specialty">{doctor.specialty}</p>
                      <div className="rating">
                        {Array(5).fill().map((_, i) => (
                          <span key={i} className={i < Math.floor(doctor.rating) ? 'filled' : ''}>★</span>
                        ))}
                        <span className="reviews">({doctor.reviews} {t('reviews')})</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="step-content">
            <h2>{t('select_date_time')}</h2>
            <div className="date-time-picker">
              <div className="calendar">
                <DatePicker
                  selected={selectedDate}
                  onChange={date => setSelectedDate(date)}
                  minDate={new Date()}
                  maxDate={addDays(new Date(), 30)}
                  filterDate={isDateSelectable}
                  inline
                  locale={i18n.language === 'ar' ? ar : enUS}
                />
              </div>
              <div className="time-slots">
                <h3>{format(selectedDate, 'EEEE, MMMM d, yyyy', { locale: i18n.language === 'ar' ? ar : enUS })}</h3>
                <div className="slots-grid">
                  {isLoading.slots ? (
                    <div className="loading-slots">
                      {t('loading_available_slots')}...
                    </div>
                  ) : availableSlots.length > 0 ? (
                    availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        className={`time-slot ${selectedTime === slot ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </button>
                    ))
                  ) : (
                    <div className="no-slots">
                      {t('no_available_slots')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="step-content">
            <h2>{t('confirm_booking')}</h2>
            <div className="booking-summary">
              <div className="summary-item">
                <span className="label">{t('center')}:</span>
                <span className="value">{selectedCenter?.name}</span>
              </div>
              <div className="summary-item">
                <span className="label">{t('doctor')}:</span>
                <span className="value">{selectedDoctor?.name}</span>
              </div>
              <div className="summary-item">
                <span className="label">{t('date')}:</span>
                <span className="value">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy', { locale: i18n.language === 'ar' ? ar : enUS })}
                </span>
              </div>
              <div className="summary-item">
                <span className="label">{t('time')}:</span>
                <span className="value">{selectedTime}</span>
              </div>
              <div className="form-group">
                <label htmlFor="notes">{t('additional_notes')}:</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('notes_placeholder')}
                />
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Check if user is authenticated
  const checkAuth = useCallback(() => {
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      navigate('/login', { 
        state: { 
          message: t('login_required_appointment'),
          redirectTo: location.pathname
        } 
      });
      return false;
    }
    return true;
  }, [navigate, t, location.pathname]);

  // Fetch centers with error handling
  const fetchCenters = useCallback(async () => {
    if (!checkAuth()) return;
    
    try {
      setIsLoading(prev => ({ ...prev, centers: true }));
      const response = await centersAPI.getAll();
      setCenters(response.centers || []);
    } catch (err) {
      const errorMsg = t('error_loading_centers');
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(prev => ({ ...prev, centers: false }));
    }
  }, [t, checkAuth]);

  // Fetch doctors with retry logic and error handling
  const fetchDoctors = useCallback(debounce(async (center, retryCount = 0) => {
    if (!checkAuth()) return;
    
    const MAX_RETRIES = 2;
    setIsLoading(prev => ({ ...prev, doctors: true }));
    setError(null);
    
    try {
      const response = await usersAPI.getDoctorsByCenter(center.id);
      if (!response.doctors || response.doctors.length === 0) {
        throw new Error(t('no_doctors_available'));
      }
      
      setDoctors(response.doctors);
      setSelectedCenter(center);
      
      // Extract unique specialties for filter
      const specialties = [...new Set(response.doctors.map(doc => doc.specialty))];
      setDoctorSpecialties(specialties);
      
      setStep(2);
    } catch (err) {
      if (retryCount < MAX_RETRIES) {
        const delay = 1000 * (retryCount + 1);
        setTimeout(() => fetchDoctors(center, retryCount + 1), delay);
        return;
      }
      const errorMsg = err.message || t('error_loading_doctors');
      setError(errorMsg);
      toast.error(errorMsg);
      setStep(1);
    } finally {
      setIsLoading(prev => ({ ...prev, doctors: false }));
    }
  }, 300), [t, checkAuth]);

  // Initial data loading
  useEffect(() => {
    fetchCenters();
  }, [fetchCenters]);

  // Rest of the component code remains the same as in the enhanced version
  // [Previous component code continues...]

  return (
    <div className="appointment-page" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container">
        {/* Progress Steps */}
        <div className="progress-steps">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <div 
              key={stepNumber} 
              className={`step ${step === stepNumber ? 'active' : ''} ${step > stepNumber ? 'completed' : ''}`}
              onClick={() => stepNumber < step && handleStepBack(stepNumber)}
              role="button"
              tabIndex={stepNumber < step ? 0 : -1}
              onKeyDown={(e) => stepNumber < step && e.key === 'Enter' && handleStepBack(stepNumber)}
              aria-label={`${t('step')} ${stepNumber}: ${t([
                'select_center',
                'select_doctor',
                'select_date',
                'select_time',
                'confirm'
              ][stepNumber - 1])}`}
            >
              <div className="step-number">{stepNumber}</div>
              <div className="step-label">
                {t([
                  'select_center',
                  'select_doctor',
                  'select_date',
                  'select_time',
                  'confirm'
                ][stepNumber - 1])}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="appointment-content">
          {error && (
            <div className="alert alert-error" role="alert">
              {error}
              <button 
                type="button" 
                className="close" 
                onClick={() => setError(null)}
                aria-label={t('close')}
              >
                &times;
              </button>
            </div>
          )}
          
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
