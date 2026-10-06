import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUserMd, FaHospital, FaPhone, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { centersAPI, appointmentsAPI } from '../services/api';
import { getCurrentUser } from '../services/authService';
import { useBooking } from '../contexts/BookingContext';
import './AppointmentBookingPage.css';

const AppointmentBookingPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { centerId } = useParams();
  const [center, setCenter] = useState(null);
  const [centers, setCenters] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState('');
  const isRTL = i18n.language === 'ar';

  // Fetch center and available slots
  useEffect(() => {
    const fetchCenterAndSlots = async () => {
      try {
        setIsLoading(true);
        
        // 1. Fetch center details
        const centerData = await centersAPI.getById(centerId);
        const normalized = centerData?.center || centerData;
        setCenter(normalized);
        
        // 2. Get current user if logged in
        try {
          const currentUser = getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        } catch (error) {
          console.log('No user logged in, proceeding as guest');
        }
        
        // 3. Fetch available time slots
        const today = new Date().toISOString().split('T')[0];
        try {
          const slots = await appointmentsAPI.getAvailableSlots({
            centerId: centerId,
            date: today
          });
          setAvailableSlots(slots || []);
        } catch (error) {
          console.error('Error fetching available slots:', error);
          // Fallback to default slots if API fails
          const defaultSlots = [
            '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
          ];
          setAvailableSlots(defaultSlots);
          toast.warning(t('using_default_slots'));
        }
      } catch (error) {
        console.error('Error fetching center:', error);
        toast.error(t('error_loading_center'));
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCentersList = async () => {
      try {
        setIsLoading(true);
        const resp = await centersAPI.getAll();
        const list = resp?.centers || (Array.isArray(resp) ? resp : []);
        setCenters(list);
      } catch (error) {
        console.error('Error fetching centers list:', error);
        toast.error(t('error_loading_centers') || 'Error loading centers');
      } finally {
        setIsLoading(false);
      }
    };

    // Get current user
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (centerId) {
      fetchCenterAndSlots();
    } else {
      // No centerId in route (/app/booking): load a list of centers to choose from
      fetchCentersList();
    }
  }, [centerId, t]);

  // Handle date change
  const handleDateChange = async (date) => {
    setSelectedDate(date);
    try {
      const slots = await appointmentsAPI.getAvailableSlots({
        centerId: centerId,
        date: date.toISOString().split('T')[0]
      });
      setAvailableSlots(slots || []);
      setSelectedTime(''); // Reset selected time when date changes
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error(t('error_fetching_slots'));
    }
  };

  const { updateBookingData } = useBooking();

  // Handle booking submission
  const handleBooking = async () => {
    if (!selectedTime) {
      toast.error(t('please_select_time'));
      return;
    }

    try {
      setIsBooking(true);
      
      // Prepare appointment data
      const appointmentData = {
        centerId: center.id,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        notes,
        patientId: user?.id || null,
        status: 'pending'
      };
      
      // Book the appointment
      const result = await appointmentsAPI.bookAppointment(appointmentData);
      
      // Show success message
      toast.success(t('appointment_booked_success'));
      
      // Update booking context with all necessary data
      updateBookingData({
        ...result,
        center: center,
        date: selectedDate,
        time: selectedTime,
        patientInfo: {
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          notes: notes || ''
        },
        status: 'confirmed',
        step: 3 // Move to confirmation step
      });

      // Navigate to confirmation page
      navigate('/booking/confirmation');
      
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || t('booking_error'));
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>{t('loading')}...</p>
      </div>
    );
  }

  // Selection mode: no centerId provided
  if (!centerId) {
    return (
      <div className="appointment-booking-page">
        <div className="container">
          <div className="mb-6">
            <button onClick={() => navigate(-1)} className="back-button" style={{ marginBottom: '20px' }}>
              <FaArrowLeft style={{ marginRight: isRTL ? 0 : '8px', marginLeft: isRTL ? '8px' : 0 }} />
              {t('back')}
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{t('bookAppointment')}</h1>
            <p className="mt-2 text-sm text-gray-600">{t('choose_center_to_book') || 'Choose a medical center to book an appointment'}</p>
          </div>

          {centers.length === 0 ? (
            <div className="error-container">
              <h2 className="text-red-600">{t('no_centers_found') || 'No centers found'}</h2>
              <button onClick={() => navigate('/centers')} className="btn-primary">
                {t('browse_centers') || 'Browse centers'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {centers.map((c) => (
                <div key={c.id} className="bg-white rounded shadow p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{c.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{c.address}</p>
                    {c.phone && (
                      <p className="text-sm text-gray-500">{c.phone}</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="btn-primary w-full"
                      onClick={() => navigate(`/app/booking/${c.id}`)}
                    >
                      {t('book_now') || 'Book now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Error if a specific centerId was requested but not found
  if (centerId && !center) {
    return (
      <div className="error-container">
        <h2>{t('center_not_found')}</h2>
        <button onClick={() => navigate('/')} className="btn-primary">
          {t('back_to_home')}
        </button>
      </div>
    );
  }

  return (
    <div className="appointment-booking-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container">
        <button 
          onClick={() => navigate(-1)} 
          className="back-button"
          style={{ marginBottom: '20px' }}
        >
          <FaArrowLeft style={{ marginRight: isRTL ? 0 : '8px', marginLeft: isRTL ? '8px' : 0 }} />
          {t('back')}
        </button>

        <div className="center-header">
          <div className="center-image">
            <img 
              src={center.image || '/images/medical-center-default.jpg'} 
              alt={center.name} 
            />
          </div>
          <div className="center-info">
            <h1>{center.name}</h1>
            <p className="address">
              <FaMapMarkerAlt /> {center.address}
            </p>
            {center.phone && (
              <p className="contact-info">
                <FaPhone /> <a href={`tel:${center.phone}`}>{center.phone}</a>
              </p>
            )}
            {center.email && (
              <p className="contact-info">
                <FaEnvelope /> <a href={`mailto:${center.email}`}>{center.email}</a>
              </p>
            )}
          </div>
        </div>

      <div className="booking-container">
        <div className="booking-form">
          <h2>{t('select_date_time')}</h2>
          
          <div className="form-group">
            <label>{t('date')}</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              minDate={new Date()}
              dateFormat="PPP"
              className="form-control"
              placeholderText={t('select_date')}
              locale={i18n.language}
            />
          </div>

          <div className="form-group">
            <label>{t('available_time_slots')}</label>
            <div className="time-slots">
              {availableSlots.map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  className={`time-slot ${selectedTime === slot ? 'selected' : ''}`}
                  onClick={() => setSelectedTime(slot)}
                >
                  {slot}
                </button>
              ))}
              {availableSlots.length === 0 && (
                <p className="no-slots">{t('no_available_slots')}</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">{t('additional_notes')} ({t('optional')})</label>
            <textarea
              id="notes"
              className="form-control"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('any_special_requirements')}
              dir={isRTL ? 'rtl' : 'ltr'}
            ></textarea>
          </div>

          <div className="booking-summary">
            <h3>{t('appointment_summary')}</h3>
            <div className="summary-item">
              <span>{t('center')}:</span>
              <span>{center.name}</span>
            </div>
            <div className="summary-item">
              <span>{t('date')}:</span>
              <span>{selectedDate.toLocaleDateString(i18n.language)}</span>
            </div>
            {selectedTime && (
              <div className="summary-item">
                <span>{t('time')}:</span>
                <span>{selectedTime}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn-primary btn-block"
            onClick={handleBooking}
            disabled={!selectedTime || isBooking}
          >
            {isBooking ? t('booking') + '...' : t('confirm_booking')}
          </button>
        </div>

        <div className="center-details">
          <h2>{t('about_center')}</h2>
          <p>{center.description || t('no_description_available')}</p>
          
          {center.services && center.services.length > 0 && (
            <>
              <h3>{t('services_offered')}</h3>
              <ul className="services-list">
                {center.services.map((service, index) => (
                  <li key={index}>
                    <FaHospital /> {service}
                  </li>
                ))}
              </ul>
            </>
          )}
          
          {center.workingHours && (
            <>
              <h3>{t('working_hours')}</h3>
              <div className="working-hours">
                {Object.entries(center.workingHours).map(([day, hours]) => (
                  <div key={day} className="working-day">
                    <span className="day">{t(day.toLowerCase())}:</span>
                    <span className="hours">{hours || t('closed')}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default AppointmentBookingPage;
