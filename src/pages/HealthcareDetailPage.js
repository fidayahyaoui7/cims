import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaCalendarAlt,
  FaStar,
  FaRegStar,
  FaChevronLeft,
  FaChevronRight,
  FaRegClock,
  FaImage
} from 'react-icons/fa';
import { BsCalendarCheck } from 'react-icons/bs';
import { MdOutlineMedicalServices } from 'react-icons/md';
import api, { centersAPI } from '../services/api';
import '../styles/CenterDetailPage.css';

const HealthcareDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fallback data to keep UI consistent if API lacks fields
  const fallback = {
    id,
    name: 'Healthcare Facility',
    address: 'Address not available',
    phone: '',
    hours: '08:00 - 18:00',
    rating: 4.2,
    reviews: 0,
    availableSlots: [
      { date: new Date().toISOString().split('T')[0], times: ['09:00', '10:00', '11:00', '14:00', '15:00'] }
    ],
    images: [],
    about: 'No description available.',
    services: [],
    doctors: [],
    openingHours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '18:00' },
      saturday: { open: '09:00', close: '13:00' },
      sunday: { open: null, close: null },
    },
    type: '',
    city: '',
  };

  useEffect(() => {
    let isMounted = true;

    const fetchItem = async () => {
      try {
        // 1) Try hospitals API
        const hosp = await api.hospitals.getById(parseInt(id, 10));
        if (isMounted && hosp) {
          const normalized = normalizeData(hosp);
          setItem(normalized);
          return;
        }
      } catch (_) {}

      try {
        // 2) Fallback to centers API
        const { center } = await centersAPI.getById(id);
        if (isMounted && center) {
          const normalized = normalizeData(center);
          setItem(normalized);
          return;
        }
      } catch (_) {}

      // 3) Final fallback
      if (isMounted) setItem(fallback);
    };

    fetchItem().finally(() => isMounted && setLoading(false));
    return () => { isMounted = false; };
  }, [id]);

  const normalizeData = (data) => ({
    id: data?.id ?? fallback.id,
    name: data?.name ?? fallback.name,
    address: data?.address ?? fallback.address,
    phone: data?.phone ?? fallback.phone,
    hours: data?.hours ?? fallback.hours,
    rating: data?.rating ?? fallback.rating,
    reviews: data?.reviews ?? fallback.reviews,
    availableSlots: Array.isArray(data?.availableSlots) ? data.availableSlots : fallback.availableSlots,
    images: Array.isArray(data?.images) ? data.images : fallback.images,
    about: data?.description || data?.about || fallback.about,
    services: Array.isArray(data?.services) ? data.services : fallback.services,
    doctors: Array.isArray(data?.doctors) ? data.doctors : fallback.doctors,
    openingHours: data?.openingHours || fallback.openingHours,
    type: data?.type || data?.hospital_type || data?.center_type || '',
    city: data?.city || data?.city_name || '',
  });

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === (item?.images?.length || 1) - 1 ? 0 : prev + 1));
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? (item?.images?.length || 1) - 1 : prev - 1));
  };

  const formatDate = (date) => date.toISOString().split('T')[0];
  const selectedDateSlots = item?.availableSlots?.find(s => s.date === formatDate(selectedDate));

  if (loading) {
    return (
      <div className="main-container">
        <div className="page-content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>{t('loading')}...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="error-container">
        <h2>{t('center_not_found')}</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          {t('back_to_home')}
        </button>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="center-detail">
        <button onClick={() => navigate(-1)} className="back-button">
          <FaChevronLeft /> {t('back')}
        </button>

        <div className="center-header">
          {item.images && item.images.length > 0 ? (
            <div className="center-gallery">
              <div className="gallery-image">
                <img src={item.images[currentImageIndex]} alt={`${item.name} - ${currentImageIndex + 1}`} />
                {item.images.length > 1 && (
                  <>
                    <button className="nav-button prev" onClick={prevImage}>
                      <FaChevronLeft />
                    </button>
                    <button className="nav-button next" onClick={nextImage}>
                      <FaChevronRight />
                    </button>
                    <div className="image-counter">
                      {currentImageIndex + 1} / {item.images.length}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="no-photo-placeholder">
              <FaImage size={48} />
              <p>No photos available</p>
            </div>
          )}

          <div className="center-info">
            <h1>{item.name}</h1>
            <div className="rating">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={star <= Math.floor(item.rating) ? 'star filled' : 'star'}>
                    {star <= item.rating ? <FaStar /> : <FaRegStar />}
                  </span>
                ))}
              </div>
              <span className="review-count">({item.reviews || 0} {t('reviews')})</span>
            </div>

            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <span>{item.address}</span>
            </div>

            {item.phone && (
              <div className="info-item">
                <FaPhone className="info-icon" />
                <a href={`tel:${item.phone}`}>{item.phone}</a>
              </div>
            )}

            <div className="info-item">
              <FaRegClock className="info-icon" />
              <div>
                <p className="opening-status">{t('open_today')}: {item.hours}</p>
                <button className="view-hours-btn">{t('view_all_hours')}</button>
              </div>
            </div>

            <div className="action-buttons">
              {item.phone && (
                <button className="btn btn-primary">
                  <FaPhone /> {t('call_now')}
                </button>
              )}
              <button className="btn btn-outline">
                <FaMapMarkerAlt /> {t('get_directions')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="center-content">
        <div className="main-content">
          <section className="about-section">
            <h2>{t('about_center')}</h2>
            <p>{item.about}</p>
          </section>

          <section className="services-section">
            <h2>{t('services')}</h2>
            <div className="services-grid">
              {(item.services || []).map((service, idx) => (
                <div key={idx} className="service-item">
                  <MdOutlineMedicalServices className="service-icon" />
                  <div>
                    <h4>{service.name || service}</h4>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {Array.isArray(item.doctors) && item.doctors.length > 0 && (
            <section className="doctors-section">
              <h2>{t('our_doctors')}</h2>
              <div className="doctors-grid">
                {item.doctors.map((doctor, index) => (
                  <div key={index} className="doctor-card">
                    {doctor.image && <img src={doctor.image} alt={doctor.name} className="doctor-image" />}
                    <div className="doctor-info">
                      <h4>{doctor.name}</h4>
                      {doctor.specialty && <p className="specialty">{doctor.specialty}</p>}
                      {typeof doctor.available !== 'undefined' && (
                        <p className={`availability ${doctor.available ? 'available' : 'unavailable'}`}>
                          {doctor.available ? t('available') : t('not_available')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="booking-sidebar">
          <div className="booking-card">
            <h3>{t('book_appointment')}</h3>

            <div className="form-group">
              <label>{t('select_date')}</label>
              <div className="date-picker">
                {[...Array(7)].map((_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() + i);
                  const dateStr = formatDate(date);
                  const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
                  const dayNum = date.getDate();
                  const isSelected = dateStr === formatDate(selectedDate);
                  return (
                    <button key={i} className={`date-option ${isSelected ? 'selected' : ''}`} onClick={() => setSelectedDate(date)}>
                      <span className="day">{dayName}</span>
                      <span className="date">{dayNum}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label>{t('select_time')}</label>
              {selectedDateSlots ? (
                <div className="time-slots">
                  {selectedDateSlots.times.map((time, index) => (
                    <button key={index} className={`time-slot ${selectedTime === time ? 'selected' : ''}`} onClick={() => setSelectedTime(time)}>
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="no-slots">{t('no_available_slots')}</p>
              )}
            </div>

            <button className="btn btn-primary book-now-btn" disabled={!selectedTime} onClick={() => {
              if (selectedTime) navigate(`/appointment/${id}?date=${selectedDate.toISOString().split('T')[0]}&time=${selectedTime}`);
            }}>
              <BsCalendarCheck className="btn-icon" />
              {t('book_now')}
            </button>

            <p className="booking-note">
              <FaRegClock className="icon" />
              {t('appointment_duration')}: 30 {t('minutes')}
            </p>
          </div>

          <div className="opening-hours">
            <h4>{t('opening_hours')}</h4>
            <ul>
              {Object.entries(item.openingHours || {}).map(([day, hours]) => {
                const dayName = day.charAt(0).toUpperCase() + day.slice(1);
                const hoursText = hours?.open && hours?.close ? `${hours.open} - ${hours.close}` : t('closed');
                return (
                  <li key={day}>
                    <span className="day">{dayName}:</span>
                    <span className="hours">{hoursText}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthcareDetailPage;
