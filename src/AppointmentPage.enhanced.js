import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addDays, isAfter, isBefore, isToday } from 'date-fns';
import { enUS, ar } from 'date-fns/locale';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { debounce } from 'lodash';
// Import API services with fallbacks
let centersAPI, usersAPI, appointmentsAPI;
try {
  const api = require('../services/api_fixed');
  centersAPI = api.centersAPI || {};
  usersAPI = api.usersAPI || {};
  appointmentsAPI = api.appointmentsAPI || {};
} catch (e) {
  console.warn('Error importing API services:', e);
  centersAPI = {};
  usersAPI = {};
  appointmentsAPI = {};
}

// Define fallback API implementations if needed
const createFallbackAPI = (name) => ({
  getAll: async () => {
    console.warn(`Using fallback for ${name}.getAll`);
    return [];
  },
  getById: async (id) => {
    console.warn(`Using fallback for ${name}.getById`, id);
    return null;
  },
  // Add other required methods as needed
});

// Ensure APIs are defined with fallbacks
const safeCentersAPI = centersAPI || createFallbackAPI('centersAPI');
const safeUsersAPI = usersAPI || createFallbackAPI('usersAPI');
const safeAppointmentsAPI = appointmentsAPI || createFallbackAPI('appointmentsAPI');

// Export the API instance
const api = {
  centers: safeCentersAPI,
  users: safeUsersAPI,
  appointments: safeAppointmentsAPI
};

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

  // Memoized filtered centers
  const filteredCenters = useMemo(() => {
    return centers.filter(center => 
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

  // Fetch centers with error handling
  const fetchCenters = useCallback(async () => {
    try {
      setIsLoading(prev => ({ ...prev, centers: true }));
      const response = await centersAPI.getAll();
      setCenters(response.centers || []);
    } catch (err) {
      setError(t('error_loading_centers'));
      toast.error(t('error_loading_centers'));
    } finally {
      setIsLoading(prev => ({ ...prev, centers: false }));
    }
  }, [t]);

  // Fetch doctors with retry logic and error handling
  const fetchDoctors = useCallback(debounce(async (center, retryCount = 0) => {
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
      setError(err.message || t('error_loading_doctors'));
      toast.error(err.message || t('error_loading_doctors'));
      setStep(1);
    } finally {
      setIsLoading(prev => ({ ...prev, doctors: false }));
    }
  }, 300), [t]);

  // Fetch available slots with error handling
  const fetchAvailableSlots = useCallback(async () => {
    if (!selectedDoctor || !selectedDate) return;
    
    try {
      setIsLoading(prev => ({ ...prev, slots: true }));
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const response = await appointmentsAPI.getAvailableSlots(selectedDoctor.id, dateStr);
      
      // Sort time slots chronologically
      const sortedSlots = (response.slots || []).sort((a, b) => {
        return new Date(`1970/01/01 ${a}`) - new Date(`1970/01/01 ${b}`);
      });
      
      setAvailableSlots(sortedSlots);
      setStep(4);
    } catch (err) {
      setError(t('error_loading_slots'));
      toast.error(t('error_loading_slots'));
      console.error('Error fetching available slots:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, slots: false }));
    }
  }, [selectedDoctor, selectedDate, t]);

  // Handle date selection
  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setAvailableSlots([]);
  }, []);

  // Handle booking submission
  const handleBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error(t('please_fill_all_fields'));
      return;
    }
    
    try {
      setIsLoading(prev => ({ ...prev, booking: true }));
      const appointmentData = {
        doctorId: selectedDoctor.id,
        centerId: selectedCenter.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        notes: notes.trim()
      };
      
      await appointmentsAPI.bookAppointment(appointmentData);
      
      // Show success message
      toast.success(t('appointment_booked_successfully'));
      
      // Navigate to appointments page after a short delay
      setTimeout(() => {
        navigate('/appointments', { 
          state: { 
            success: true, 
            message: t('appointment_booked_successfully') 
          } 
        });
      }, 1500);
      
    } catch (err) {
      const errorMessage = err.message || t('error_booking_appointment');
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error booking appointment:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, booking: false }));
    }
  };

  // Navigation functions
  const goToStep = useCallback((targetStep) => {
    setStep(targetStep);
    setError(null);
  }, []);

  const handleStepBack = useCallback((targetStep) => {
    setStep(targetStep);
    setError(null);
  }, []);

  // Initial data loading
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      try {
        const userData = JSON.parse(loggedInUser);
        setUser(userData);
        fetchCenters();
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        navigate('/login', { state: { message: t('session_expired') } });
      }
    } else {
      navigate('/login', { state: { message: t('login_required') } });
    }
  }, [navigate, t, fetchCenters]);

  // Auto-fetch slots when doctor and date are selected
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate, fetchAvailableSlots]);

  // Render step content based on current step
  const renderStepContent = () => {
    switch (step) {
      case 1: // Center Selection
        return (
          <div className="step-content center-selection">
            <div className="search-container">
              <input
                type="text"
                placeholder={t('search_centers')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label={t('search_centers')}
              />
            </div>
            
            {isLoading.centers ? (
              <div className="center-list">
                {[1, 2, 3].map(i => <CenterCardSkeleton key={i} />)}
              </div>
            ) : (
              <>
                {filteredCenters.length > 0 ? (
                  <div className="center-list">
                    {filteredCenters.map(center => (
                      <div 
                        key={center.id} 
                        className={`center-card ${selectedCenter?.id === center.id ? 'selected' : ''}`}
                        onClick={() => fetchDoctors(center)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && fetchDoctors(center)}
                        aria-label={`${center.name}, ${center.address}`}
                      >
                        <h3>{center.name}</h3>
                        <p className="address">{center.address}</p>
                        <div className="center-meta">
                          <span className="rating">⭐ {center.rating || 'N/A'}</span>
                          <span className="distance">📍 {center.distance ? `${center.distance} km` : '--'}</span>
                        </div>
                        {isLoading.doctors && selectedCenter?.id === center.id && (
                          <div className="loading-indicator">
                            <div className="spinner"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <p>{t('no_centers_found')}</p>
                    <button 
                      className="btn btn-text"
                      onClick={() => setSearchQuery('')}
                    >
                      {t('clear_search')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );
        
      case 2: // Doctor Selection
        return (
          <div className="step-content doctor-selection">
            <div className="filters-container">
              <div className="search-container">
                <input
                  type="text"
                  placeholder={t('search_doctors')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  aria-label={t('search_doctors')}
                />
              </div>
              
              {doctorSpecialties.length > 0 && (
                <div className="specialty-filter">
                  <label htmlFor="specialty-filter">{t('specialty')}:</label>
                  <select
                    id="specialty-filter"
                    value={specialtyFilter}
                    onChange={(e) => setSpecialtyFilter(e.target.value)}
                    className="select-input"
                    aria-label={t('filter_by_specialty')}
                  >
                    <option value="all">{t('all_specialties')}</option>
                    {doctorSpecialties.map(specialty => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            {isLoading.doctors ? (
              <div className="doctor-list">
                {[1, 2, 3].map(i => <DoctorCardSkeleton key={i} />)}
              </div>
            ) : (
              <>
                {filteredDoctors.length > 0 ? (
                  <div className="doctor-list">
                    {filteredDoctors.map(doctor => (
                      <div 
                        key={doctor.id}
                        className={`doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setStep(3);
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setSelectedDoctor(doctor) && setStep(3)}
                        aria-label={`Dr. ${doctor.name}, ${doctor.specialty}`}
                      >
                        <div className="doctor-avatar">
                          {doctor.avatar ? (
                            <img src={doctor.avatar} alt={doctor.name} />
                          ) : (
                            <div className="avatar-placeholder">
                              {doctor.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </div>
                        <div className="doctor-info">
                          <h3>Dr. {doctor.name}</h3>
                          <p className="specialty">{doctor.specialty}</p>
                          <div className="doctor-rating">
                            <span>⭐ {doctor.rating || 'N/A'}</span>
                            <span className="reviews">
                              ({doctor.reviews || 0} {t('reviews')})
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <p>{t('no_doctors_found')}</p>
                    <button 
                      className="btn btn-text"
                      onClick={() => {
                        setSearchQuery('');
                        setSpecialtyFilter('all');
                      }}
                    >
                      {t('clear_filters')}
                    </button>
                  </div>
                )}
              </>
            )}
            
            <div className="step-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => handleStepBack(1)}
                disabled={isLoading.doctors}
              >
                {t('back')}
              </button>
            </div>
          </div>
        );

      case 3: // Date Selection
        return (
          <div className="step-content date-selection">
            <h2>{t('select_date')}</h2>
            <div className="calendar-container">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                minDate={new Date()}
                maxDate={addDays(new Date(), 30)}
                inline
                locale={i18n.language === 'ar' ? ar : enUS}
                filterDate={isDateSelectable}
                className="date-picker"
                calendarClassName="calendar"
                dayClassName={(date) => {
                  if (date.getDate() === selectedDate.getDate() && 
                      date.getMonth() === selectedDate.getMonth() && 
                      date.getFullYear() === selectedDate.getFullYear()) {
                    return 'selected-day';
                  }
                  return isDateSelectable(date) ? 'available-day' : 'unavailable-day';
                }}
              />
            </div>
            
            <div className="selected-date-preview">
              <h3>{t('selected_date')}:</h3>
              <p>{format(selectedDate, 'EEEE, MMMM d, yyyy', { 
                locale: i18n.language === 'ar' ? ar : enUS 
              })}</p>
            </div>
            
            <div className="step-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => handleStepBack(2)}
              >
                {t('back')}
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => fetchAvailableSlots()}
                disabled={isLoading.slots}
              >
                {isLoading.slots ? (
                  <>
                    <span className="spinner"></span>
                    {t('loading')}...
                  </>
                ) : (
                  t('view_available_slots')
                )}
              </button>
            </div>
          </div>
        );

      case 4: // Time Selection
        return (
          <div className="step-content time-selection">
            <h2>{t('select_time')}</h2>
            <div className="selected-appointment-info">
              <p>{t('with')} <strong>Dr. {selectedDoctor?.name}</strong></p>
              <p>{format(selectedDate, 'EEEE, MMMM d, yyyy', { 
                locale: i18n.language === 'ar' ? ar : enUS 
              })}</p>
            </div>
            
            {isLoading.slots ? (
              <div className="time-slots-loading">
                <div className="spinner"></div>
                <p>{t('loading_available_slots')}...</p>
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="time-slots">
                {availableSlots.map(slot => (
                  <button
                    key={slot}
                    className={`time-slot ${selectedTime === slot ? 'selected' : ''}`}
                    onClick={() => setSelectedTime(slot)}
                    aria-label={`Select ${slot}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <div className="no-slots">
                <p>{t('no_available_slots')}</p>
                <div className="suggested-actions">
                  <button 
                    className="btn btn-text"
                    onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                  >
                    {t('check_tomorrow')}
                  </button>
                  <button 
                    className="btn btn-text"
                    onClick={() => setStep(2)}
                  >
                    {t('choose_another_doctor')}
                  </button>
                </div>
              </div>
            )}
            
            <div className="step-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => handleStepBack(3)}
                disabled={isLoading.slots}
              >
                {t('back')}
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => setStep(5)}
                disabled={!selectedTime || isLoading.slots}
              >
                {t('continue')}
              </button>
            </div>
          </div>
        );

      case 5: // Confirmation
        return (
          <div className="step-content confirmation">
            <div className="appointment-summary">
              <h2>{t('appointment_summary')}</h2>
              
              <div className="summary-section">
                <h3>{t('appointment_details')}</h3>
                <div className="summary-item">
                  <span className="label">{t('medical_center')}:</span>
                  <span className="value">{selectedCenter?.name}</span>
                </div>
                <div className="summary-item">
                  <span className="label">{t('doctor')}:</span>
                  <span className="value">Dr. {selectedDoctor?.name}</span>
                </div>
                <div className="summary-item">
                  <span className="label">{t('date')}:</span>
                  <span className="value">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy', { 
                      locale: i18n.language === 'ar' ? ar : enUS 
                    })}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="label">{t('time')}:</span>
                  <span className="value">{selectedTime}</span>
                </div>
              </div>
              
              <div className="summary-section">
                <h3>{t('additional_notes')}</h3>
                <div className="notes-container">
                  <label htmlFor="appointment-notes">
                    {t('any_special_requirements')} ({t('optional')})
                  </label>
                  <textarea
                    id="appointment-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('type_your_notes_here')}
                    rows={4}
                    maxLength={500}
                  />
                  <div className="character-count">
                    {notes.length}/500 {t('characters')}
                  </div>
                </div>
              </div>
              
              <div className="confirmation-actions">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => handleStepBack(4)}
                  disabled={isLoading.booking}
                >
                  {t('back')}
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleBooking}
                  disabled={isLoading.booking}
                >
                  {isLoading.booking ? (
                    <>
                      <span className="spinner"></span>
                      {t('processing')}...
                    </>
                  ) : (
                    t('confirm_booking')
                  )}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="error-message">{t('invalid_step')}</div>;
    }
  };

  // Render the component
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
