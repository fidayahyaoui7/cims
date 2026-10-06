import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BookingSteps from '../components/BookingSteps';
import { centersAPI } from '../services/api';
import SimpleMap from '../components/SimpleMap';
import hospitalsData from '../data/hospitalsData';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaClock,
  FaStar,
  FaRegStar,
  FaChevronLeft,
  FaGlobe,
  FaAmbulance,
  FaWheelchair,
  FaParking,
  FaUserMd,
  FaCalendarAlt 
} from 'react-icons/fa';
import '../CenterDetailPageNew.css';

const CenterDetailPage = () => {
  // Route is defined as /centers/:id in App.js; support both just in case
  const { id: routeId, centerId } = useParams();
  const effectiveId = centerId || routeId;
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [center, setCenter] = useState(() => {
    const c = location.state?.center;
    if (!c) return null;
    const coordinates = c.latitude && c.longitude ? { lat: c.latitude, lng: c.longitude } : c.coordinates;
    const services = Array.isArray(c.services) ? c.services : (typeof c.services === 'string' ? c.services.split(',') : []);
    return { ...c, coordinates, services };
  });
  const [cityName, setCityName] = useState(location.state?.cityName || '');
  const [loading, setLoading] = useState(!center);
  const [error, setError] = useState(null);
  const [currentDay] = useState(new Date().getDay());
  const [currentStep, setCurrentStep] = useState(1);
  
  // Default opening hours (can be overridden by API data)
  const defaultOpeningHours = [
    { day: 'monday', open: '08:00', close: '18:00' },
    { day: 'tuesday', open: '08:00', close: '18:00' },
    { day: 'wednesday', open: '08:00', close: '18:00' },
    { day: 'thursday', open: '08:00', close: '18:00' },
    { day: 'friday', open: '08:00', close: '13:00' },
    { day: 'saturday', open: '09:00', close: '13:00' },
    { day: 'sunday', open: 'Closed', close: 'Closed' },
  ];
  
  const [openingHours, setOpeningHours] = useState(defaultOpeningHours);

 

  const handleBookAppointment = () => {
    navigate('/book', { 
      state: { 
        preSelectedCenter: {
          id: center.id,
          name: center.name,
          address: center.address,
          city: center.city || cityName,
          type: center.type,
          phone: center.phone
        }
      }
    });
  };

  const handleBack = () => {
    const fromPath = location.state?.from?.pathname || '';
    const fromSearch = location.state?.from?.search || '';
    
    const isListRoute = (path) => (
      path && (
        path === '/' || 
        path.startsWith('/hospitals') ||
        path.startsWith('/unified-hospitals') ||
        path.startsWith('/city/') ||
        path.startsWith('/search')
      )
    );

    if (isListRoute(fromPath)) {
      navigate(`${fromPath}${fromSearch}`);
    } else {
      navigate('/hospitals');
    }
  };

  useEffect(() => {
    if (!center && effectiveId) {
      const fetchCenter = async () => {
        try {
          setLoading(true);
          setError(null);
          // Try centers API first
          try {
            const response = await centersAPI.getById(effectiveId);
            if (!response || !response.center) {
              throw new Error('Invalid response from server');
            }
            const c = response.center;
            const coordinates = (c.latitude != null && c.longitude != null)
              ? { lat: c.latitude, lng: c.longitude }
              : (c.coordinates || null);
            const services = Array.isArray(c.services)
              ? c.services
              : (typeof c.services === 'string' ? c.services.split(',') : []);
            setCenter({ ...c, coordinates, services });
            if (c.city_name) setCityName(c.city_name);
            return; // success
          } catch (e1) {
            // Fall through to hospitals API
          }

          // Try hospitals API
          const base = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
          const res = await fetch(`${base}/hospitals/${effectiveId}`);
          if (res.ok) {
            const h = await res.json();
            const coordinates = (h.latitude != null && h.longitude != null)
              ? { lat: h.latitude, lng: h.longitude }
              : (h.coordinates || null);
            const services = Array.isArray(h.services)
              ? h.services.map(s => (typeof s === 'string' ? s : (s?.name || ''))).filter(Boolean)
              : [];
            setCenter({ ...h, coordinates, services });
            if (h.city_name) setCityName(h.city_name);
            return; // success
          }

          // Fallback to local data
          const local = hospitalsData.find(hh => String(hh.id) === String(effectiveId));
          if (local) {
            const coordinates = (local.latitude != null && local.longitude != null)
              ? { lat: local.latitude, lng: local.longitude }
              : (local.coordinates || null);
            const services = Array.isArray(local.services) ? local.services : [];
            setCenter({ ...local, coordinates, services });
            if (local.city_name) setCityName(local.city_name);
            return;
          }

          throw new Error('Center not found');
        } catch (err) {
          setError(`Failed to load medical center details. ${err?.message || ''}`.trim());
        } finally {
          setLoading(false);
        }
      };
      fetchCenter();
    }
  }, [center, effectiveId]);

  useEffect(() => {
    if (center?.openingHours) {
      setOpeningHours(center.openingHours);
    }
  }, [center]);

  const isOpenNow = () => {
    // Adjust for Sunday (0 in JS, but 6 in our array)
    const dayIndex = currentDay === 0 ? 6 : currentDay - 1;
    const currentDayHours = openingHours[dayIndex];
    
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
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !center) {
    return (
      <div className="center-detail-page">
        <div className="error-message">
          <h2>{t('center_not_found')}</h2>
          <p>{error || t('center_not_available')}</p>
          <button className="btn btn-light btn-sm" onClick={handleBack}
          >
            {t('back_to_hospitals')}
          </button>
        </div>
      </div>
    );
  }

  // Function to render operating hours in a more readable format
  const renderOperatingHours = () => {
    const days = [
      { key: 'monday', label: t('monday') },
      { key: 'tuesday', label: t('tuesday') },
      { key: 'wednesday', label: t('wednesday') },
      { key: 'thursday', label: t('thursday') },
      { key: 'friday', label: t('friday') },
      { key: 'saturday', label: t('saturday') },
      { key: 'sunday', label: t('sunday') }
    ];

    return (
      <div className="operating-hours">
        <h3>{t('opening_hours')}</h3>
        <div className="hours-grid">
          {days.map(({ key, label }) => {
            const dayHours = center.openingHours?.[key] || { open: 'Closed', close: '' };
            const isCurrentDay = new Date().getDay() === (key === 'sunday' ? 0 : days.findIndex(d => d.key === key) + 1);
            
            return (
              <div key={key} className={`hour-row ${isCurrentDay ? 'current-day' : ''}`}>
                <span className="day">{label}</span>
                <span className="hours">
                  {dayHours.open === 'Closed' ? t('closed') : `${dayHours.open} - ${dayHours.close}`}
                </span>
              </div>
            );
          })}
        </div>
        {center.openingHours?.emergency && (
          <div className="emergency-hours">
            <FaAmbulance className="mr-2 text-danger" />
            <span className="font-medium">{t('emergency')}:</span>{' '}
            {center.openingHours.emergency.open === '00:00' && center.openingHours.emergency.close === '24:00' 
              ? t('24_7') 
              : `${center.openingHours.emergency.open} - ${center.openingHours.emergency.close}`}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="center-detail-page">
      <header className="center-header">
        <div className="container mx-auto px-4">
          <button
            onClick={handleBack}
            className="btn btn-secondary btn-sm mb-4"
          >
            <FaChevronLeft className="mr-2" />
            {t('back_to_hospitals')}
          </button>
          
          <div className="center-details bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {center.name}
                  </h1>
                  <div className={`status-badge ${isOpenNow() ? 'open' : 'closed'} mb-4 md:mb-0`}>
                    {isOpenNow() ? t('open_now') : t('closed_now')}
                    {center.openingHours?.emergency && (
                      <span className="ml-2 text-sm font-normal">
                        • {t('emergency_available')}
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 flex items-center">
                  <FaMapMarkerAlt className="text-red-500 mr-2 flex-shrink-0" />
                  <span>{center.address}</span>
                </p>
                
                {center.description && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h3 className="font-medium text-blue-800 mb-2">{t('about_this_center')}</h3>
                    <p className="text-gray-700">{center.description}</p>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {center.type && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {center.type.charAt(0).toUpperCase() + center.type.slice(1)}
                    </span>
                  )}
                  {center.features?.map((feature, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="w-full md:w-80 mt-4 md:mt-0 md:ml-6">
                {renderOperatingHours()}
              </div>
              
              {/* Opening Hours Section */}
              <div className="opening-hours-section mt-6">
                <h3 className="text-lg font-semibold mb-3">{t('opening_hours')}</h3>
                <div className="opening-hours bg-white rounded-lg shadow-sm p-4">
                  {openingHours.map((day, index) => {
                    const isCurrentDay = (currentDay === 0 && index === 6) || (index === currentDay - 1);
                    
                    return (
                      <div 
                        key={day.day} 
                        className={`opening-hour-row flex justify-between py-2 px-1 ${isCurrentDay ? 'current-day bg-blue-50 rounded' : ''}`}
                      >
                        <span className="day font-medium">{t(day.day)}</span>
                        <span className="hours text-gray-700">
                          {day.open === 'Closed' ? t('closed') : `${day.open} - ${day.close}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <BookingSteps 
            currentStep={currentStep} 
            onStepClick={handleStepClick} 
          />
          
          {currentStep === 1 && (
            <div className="service-selection bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('select_service') || 'Select a Service'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {center.services && center.services.length > 0 ? (
                  center.services.map((service, index) => (
                    <div 
                      key={index} 
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md cursor-pointer transition-all duration-200 bg-white"
                      onClick={() => setCurrentStep(2)}
                    >
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <FaUserMd className="text-blue-500" />
                        </div>
                        <h3 className="font-medium text-gray-800">{service}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{t('click_to_select') || 'Click to select'}</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-gray-500">{t('no_services_available') || 'No services available'}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <button 
                  onClick={handleBack}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  {t('back') || 'Back'}
                </button>
                <button 
                  onClick={handleBookAppointment}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md flex items-center transition-colors"
                >
                  <FaCalendarAlt className="mr-2" />
                  {t('book_now') || 'Book Now'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="center-content">
        <div className="center-info-grid">
          {/* Contact Information */}
          <div className="info-section">
            <h2>{t('contact_information')}</h2>
            <div className="info-card">
              <div className="info-item">
                <span className="info-label">{t('address')}:</span>
                <span className="info-value">{center.address}</span>
              </div>
              {center.phone && (
                <div className="info-item">
                  <span className="info-label">{t('phone')}:</span>
                  <span className="info-value">
                    <a href={`tel:${center.phone}`}>
                      <FaPhone className="mr-1" /> {center.phone}
                    </a>
                  </span>
                </div>
              )}
              {center.emergency_phone && (
                <div className="info-item">
                  <span className="info-label">{t('emergency')}:</span>
                  <span className="info-value emergency-phone">
                    <a href={`tel:${center.emergency_phone}`}>
                      <FaAmbulance className="mr-1" /> {center.emergency_phone}
                    </a>
                  </span>
                </div>
              )}
              {center.website && (
                <div className="info-item">
                  <span className="info-label">{t('website')}:</span>
                  <span className="info-value">
                    <a href={center.website.startsWith('http') ? center.website : `https://${center.website}`} 
                       target="_blank" 
                       rel="noopener noreferrer">
                      <FaGlobe className="mr-1" /> {center.website}
                    </a>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Services */}
          {center.services && center.services.length > 0 && (
            <div className="info-section">
              <h2>{t('medical_services')}</h2>
              <div className="info-card">
                <div className="services-grid">
                  {center.services.map((service, index) => (
                    <div key={index} className="service-item">
                      <FaUserMd className="service-icon" />
                      <span className="service-name">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Location */}
          <div className="info-section">
            <h2>{t('location')}</h2>
            <div className="info-card">
              <div className="location-info">
                {center.latitude && center.longitude && (
                  <div className="coordinates">
                    <span className="info-label">{t('gps_coordinates')}:</span>
                    <span className="info-value">
                      {center.latitude.toFixed(6)}, {center.longitude.toFixed(6)}
                    </span>
                  </div>
                )}
                {center.coordinates && (
                  <div className="map-container">
                    <SimpleMap 
                      center={center.coordinates}
                      zoom={15}
                      markers={[{
                        position: center.coordinates,
                        title: center.name
                      }]}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          {center.phone && (
            <a href={`tel:${center.phone}`} className="btn btn-primary btn-sm">
              <FaPhone className="mr-1" /> {t('call_now')}
            </a>
          )}
          {center.latitude && center.longitude && (
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${center.latitude},${center.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              <FaMapMarkerAlt className="mr-1" /> {t('get_directions')}
            </a>
          )}
          <button 
            className="btn btn-success btn-sm"
            onClick={() => {
              const lite = { id: center.id, name: center.name, address: center.address, phone: center.phone, image: center.image };
              localStorage.setItem('selectedCenter', JSON.stringify(lite));
              navigate('/booking/date-time');
            }}
          >
            <FaCalendarAlt className="mr-1" /> {t('book_appointment')}
          </button>
        </div>
      </main>
    </div>
  );
};

export default CenterDetailPage;
