import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { centersAPI } from './services/api';
import SimpleMap from './components/SimpleMap';
import { 
  FaAmbulance, 
  FaStethoscope, 
  FaBed, 
  FaParking, 
  FaWheelchair, 
  FaChevronRight,
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaChevronLeft,
  FaExclamationTriangle,
  FaClinicMedical,
  FaMapMarkedAlt,
  FaHeartbeat,
  FaTooth,
  FaEye,
  FaBrain,
  FaHeart,
  FaBaby,
  FaSyringe,
  FaXRay,
  FaMicroscope,
  FaDna
} from 'react-icons/fa';
import './CenterDetailPage.css';

const CenterDetailPage = () => {
  const { centerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [center, setCenter] = useState(location.state?.center || null);
  const [cityName, setCityName] = useState(location.state?.cityName || '');
  const [loading, setLoading] = useState(!center);
  const [error, setError] = useState(null);
  const [currentDay, setCurrentDay] = useState(new Date().getDay()); // 0 = Sunday, 1 = Monday, etc.
  
  // Default opening hours (can be overridden by API data)
  const defaultOpeningHours = [
    { day: 'monday', open: '08:00', close: '18:00' },
    { day: 'tuesday', open: '08:00', close: '18:00' },
    { day: 'wednesday', open: '08:00', close: '18:00' },
    { day: 'thursday', open: '08:00', close: '18:00' },
    { day: 'friday', open: '08:00', close: '13:00' }, // Shorter hours on Friday
    { day: 'saturday', open: '09:00', close: '13:00' },
    { day: 'sunday', open: 'Closed', close: 'Closed' },
  ];
  
  const [openingHours, setOpeningHours] = useState(defaultOpeningHours);

  useEffect(() => {
    if (!center) {
      const fetchCenter = async () => {
        try {
          setLoading(true);
          const response = await centersAPI.getById(centerId);
          setCenter(response.center);
          if (response.center.city_name) {
            setCityName(response.center.city_name);
          }
        } catch (err) {
          setError('Failed to load medical center details.');
        } finally {
          setLoading(false);
        }
      };
      fetchCenter();
    }
  }, [center, centerId]);

  useEffect(() => {
    if (center?.openingHours) {
      setOpeningHours(center.openingHours);
    }
  }, [center]);

  const currentDayHours = openingHours[currentDay === 0 ? 6 : currentDay - 1];
  const isOpenNow = () => {
    if (currentDayHours.open === 'Closed') return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const [openHour, openMinute] = currentDayHours.open.split(':').map(Number);
    const [closeHour, closeMinute] = currentDayHours.close.split(':').map(Number);
    
    const openTime = openHour * 100 + openMinute;
    const closeTime = closeHour * 100 + closeMinute;
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  if (loading) {
    return (
      <div className="center-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading center details...</p>
        </div>
      </div>
    );
  }

  if (error || !center) {
    return (
      <div className="center-detail-page">
        <div className="error-message">
          <h2>Medical Center Not Found</h2>
          <p>{error || 'The information for this medical center is not available.'}</p>
          <button className="btn btn-light" onClick={() => navigate(-1)}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="center-detail-page">
      <header className="center-header">
        <button onClick={() => cityName ? navigate(`/city/${cityName.toLowerCase().replace(/\s+/g, '-')}`) : navigate(-1)} className="btn btn-secondary">
          {`Back to ${cityName || 'Results'}`}
        </button>
        <div className="center-details">
          <div className="center-header">
            <h1>{center.name}</h1>
            <div className={`status-badge ${isOpenNow() ? 'open' : 'closed'}`}>
              {isOpenNow() ? t('open_now') : t('closed_now')}
            </div>
          </div>
          <p className="center-address">{center.address}</p>
          
          {/* Opening Hours Section */}
          <div className="opening-hours-section">
            <h3>{t('opening_hours')}</h3>
            <div className="opening-hours">
              {openingHours.map((day, index) => (
                <div 
                  key={day.day} 
                  className={`opening-hour-row ${index === currentDay - 1 ? 'current-day' : ''}`}
                >
                  <span className="day">{t(day.day)}</span>
                  <span className="hours">
                    {day.open === 'Closed' ? t('closed') : `${day.open} - ${day.close}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="center-content">
        <div className="center-info-grid">
          {/* Contact Information */}
          <div className="info-section">
            <h2>Contact Information</h2>
            <div className="info-card">
              <div className="info-item">
                <span className="info-label">Address:</span>
                <span className="info-value">{center.address}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value">
                  <a href={`tel:${center.phone}`}>{center.phone}</a>
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Opening Hours:</span>
                <span className="info-value">{center.hours}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Rating:</span>
                <span className="info-value">{center.rating ? `${center.rating}/5` : 'Not rated'}</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="info-section">
            <h2>Medical Services</h2>
            <div className="info-card">
              <div className="services-grid">
                {center.services && center.services.length > 0 ? (
                  center.services.map((service, index) => (
                    <div key={index} className="service-item">
                      <span className="service-icon">MD</span>
                      <span className="service-name">{service}</span>
                    </div>
                  ))
                ) : (
                  <div className="service-item">
                    <span className="service-icon">MD</span>
                    <span className="service-name">General Medicine</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="info-section">
            <h2>Location</h2>
            <div className="info-card">
              <div className="location-info">
                <div className="coordinates">
                  <span className="info-label">GPS Coordinates:</span>
                  <span className="info-value">
                    {center.latitude?.toFixed(6) || 'N/A'}, {center.longitude?.toFixed(6) || 'N/A'}
                  </span>
                </div>
                <div className="map-container">
                  <SimpleMap
                    center={
                      center?.coordinates
                        ? center.coordinates
                        : (center?.latitude && center?.longitude)
                        ? { lat: center.latitude, lng: center.longitude }
                        : { lat: 34.0, lng: 9.0 }
                    }
                    zoom={15}
                    markers={[{
                      position:
                        center?.coordinates
                          ? center.coordinates
                          : (center?.latitude && center?.longitude)
                          ? { lat: center.latitude, lng: center.longitude }
                          : { lat: 34.0, lng: 9.0 },
                      title: center?.name || 'Center'
                    }]}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="info-section">
            <h2>Additional Information</h2>
            <div className="info-card">
              <div className="additional-info">
                <div className="info-item">
                  <span className="info-label">Center Type:</span>
                  <span className="info-value">Public Medical Center</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Available Doctors:</span>
                  <span className="info-value">General Practitioners and Specialists</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Emergency Services:</span>
                  <span className="info-value">
                    {center.services && center.services.includes('Emergency') ? 'Available 24/7' : 'Not Available'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Pharmacy:</span>
                  <span className="info-value">Available on site</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <a href={`tel:${center.phone}`} className="btn btn-primary">
            Call Now
          </a>
          <a 
            href={center.coordinates 
              ? `https://www.google.com/maps/dir/?api=1&destination=${center.coordinates.lat},${center.coordinates.lng}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.address || center.name + ' ' + (center.city || ''))}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <FaMapMarkerAlt className="mr-2" /> Get Directions
          </a>
          <button 
            className="btn btn-success"
            onClick={() => navigate('/book-appointment', { state: { centerId: center.id } })}
          >
            Book Appointment
          </button>
        </div>
      </main>
    </div>
  );
};

export default CenterDetailPage;