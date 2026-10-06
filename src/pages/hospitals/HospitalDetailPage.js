import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaHospital, 
  FaClinicMedical, 
  FaUniversity, 
  FaArrowLeft,
  FaPhone,
  FaDirections,
  FaClock,
  FaMapMarkedAlt
} from 'react-icons/fa';
import { getHospitalById } from '../../data/tunisiaHospitals';
import { useTranslation } from 'react-i18next';

const HospitalDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  useEffect(() => {
    // Find the hospital by ID
    const foundHospital = getHospitalById(id);
    
    if (foundHospital) {
      setHospital({
        ...foundHospital,
        // Ensure all required fields have default values
        name: foundHospital.name || t('hospital.unknown_name'),
        city: foundHospital.city || t('hospital.unknown_city'),
        address: foundHospital.address || t('hospital.no_address'),
        phone: foundHospital.phone || t('hospital.not_available'),
        services: foundHospital.services || [],
        type: foundHospital.type || 'public',
        image: foundHospital.image || 'https://via.placeholder.com/800x400?text=H%C3%B4pital',
        description: foundHospital.description || t('hospital.no_description')
      });
      setLoading(false);
    } else {
      console.error(t('hospital.not_found_id', { id }));
      navigate('/hospitals');
    }
  }, [id, navigate, t]);

  // Get appropriate icon based on hospital type
  const getHospitalTypeIcon = (type) => {
    if (!type) return null;
    switch(type.toLowerCase()) {
      case 'public':
      case 'public hospital':
        return <FaHospital className="text-primary" />;
      case 'university':
      case 'university hospital':
        return <FaUniversity className="text-info" />;
      case 'private':
      case 'private clinic':
        return <FaClinicMedical className="text-success" />;
      default:
        return <FaHospital className="text-secondary" />;
    }
  };

  // Handle getting directions to the hospital
  const openGoogleMaps = () => {
    if (!hospital) return;
    
    if (hospital.coordinates?.lat && hospital.coordinates?.lng) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}&travelmode=driving`,
        '_blank'
      );
    } else if (hospital.address) {
      const address = encodeURIComponent(`${hospital.address}, ${hospital.city || ''}`.trim());
      window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
    } else {
      console.error(t('hospital.no_directions'));
    }
  };

  // Calculate distance (placeholder - would normally use geolocation)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // This is a simplified distance calculation
    // In a real app, you would use a proper geolocation library
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance; // returns distance in km
  };

  // Get user's current location (simplified)
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    // In a real app, you would get the user's actual location here
    // For now, we'll use a default location or skip distance calculation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Calculate distance when user location is available
  useEffect(() => {
    if (userLocation && hospital?.coordinates) {
      try {
        const calculatedDistance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          hospital.coordinates.lat,
          hospital.coordinates.lng
        );
        setDistance(calculatedDistance);
      } catch (error) {
        console.error('Error calculating distance:', error);
      }
    }
  }, [userLocation, hospital]);

  // Format distance in meters or kilometers
  const formatDistance = (dist) => {
    if (!dist) return t('hospital.distance_unknown');
    if (dist < 1) return `${Math.round(dist * 1000)} m`;
    return `${dist.toFixed(1)} km`;
  };

  // Calculate and format travel time based on distance
  const getTravelTime = (dist) => {
    if (!dist) return '';
    // Assuming average speed of 30 km/h in city traffic
    const timeInMinutes = Math.round((dist / 30) * 60);
    if (timeInMinutes < 60) {
      return `${timeInMinutes} ${t('common.minutes')}`;
    }
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return `${hours}${t('common.hour_short')}${minutes > 0 ? ` ${minutes}${t('common.minutes_short')}` : ''}`;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('loading')}...</span>
        </div>
      </div>
    );
  }

  // Render not found state
  if (!hospital) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger mb-4">{t('hospital_not_found')}</h2>
        <p className="lead mb-4">{t('hospital_not_found_description') || 'The requested hospital could not be found.'}</p>
        <div className="d-flex gap-3 justify-content-center">
          <button
            className="btn btn-primary"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="me-2" />
            {t('go_back')}
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate('/hospitals')}
          >
            {t('browse_hospitals')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Back button and header */}
      <div className="row mb-4">
        <div className="col-12">
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              border: '1px solid #6c757d',
              backgroundColor: 'transparent',
              color: '#6c757d',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.2s',
            }}
          >
            <FaArrowLeft />
            <span>{t('back_to_hospitals')}</span>
          </button>
        </div>
      </div>

      <div className="row">
        {/* Main Content */}
        <div className="col-md-8">
          {/* Hospital Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex align-items-center mb-3">
                {getHospitalTypeIcon(hospital.type)}
                <h1 className="mb-0 ms-3">{hospital.name}</h1>
              </div>
              
              {hospital.type && (
                <div className="mb-3">
                  <span className="badge bg-secondary">
                    {t(hospital.type.toLowerCase().replace(' ', '_'))}
                  </span>
                </div>
              )}
              
              <div className="hospital-location mb-3">
                <FaMapMarkerAlt className="me-2" />
                <span>{hospital.city}, {hospital.address}</span>
                
              </div>
              
              {distance !== null && (
                <div className="d-flex gap-3 mb-3">
                  <span className="text-muted">
                    <FaMapMarkedAlt className="me-1" />
                    {formatDistance(distance)}
                  </span>
                  <span className="text-muted">
                    <FaClock className="me-1" />
                    {getTravelTime(distance)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {hospital.services && hospital.services.length > 0 && (
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="h5 mb-3">{t('services_offered')}</h3>
                <div className="d-flex flex-wrap gap-2">
                  {hospital.services.map((service, index) => (
                    <span key={index} className="badge bg-light text-dark me-2 mb-2">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {hospital.description && (
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="h5 mb-3">{t('about_hospital')}</h3>
                <p className="mb-0">{hospital.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body text-center">
              <FaMapMarkedAlt className="display-4 text-primary mb-3" />
          
              <button 
                onClick={openGoogleMaps}
                className="btn btn-primary w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
              >
                <FaDirections className="me-2" />
                {t('get_directions')}
              </button>
              {distance !== null && (
                <div className="text-muted small mb-3">
                  {t('about')} {formatDistance(distance)} • {getTravelTime(distance)}
                </div>
              )}
              
              {distance !== null && (
                <div className="text-start">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">{t('distance')}:</span>
                    <span>{formatDistance(distance)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">{t('estimated_travel_time')}:</span>
                    <span>
                      <FaClock className="me-1" />
                      {getTravelTime(distance)}
                    </span>
                  </div>
                </div>
              )}
              
              
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Form Modal */}
      {showAppointmentForm && (
        <div 
          className="modal-backdrop show" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1040,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAppointmentForm(false);
            }
          }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '600px', width: '90%' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {t('book_appointment')} - {hospital.name}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAppointmentForm(false)}
                  aria-label={t('close')}
                  style={{
                    margin: 0,
                    padding: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    opacity: 0.5,
                    transition: 'opacity 0.2s',
                    lineHeight: 1
                  }}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body p-4">
                <div className="alert alert-info">
                  {t('hospital.appointment_instructions')}
                </div>
                <div className="text-center">
                  <a 
                    href={`tel:${hospital.phone || ''}`}
                    className="btn btn-primary btn-lg mb-3"
                    style={{ width: '100%' }}
                  >
                    <FaPhone className="me-2" />
                    {t('hospital.call_to_book')} {hospital.phone}
                  </a>
                  <p className="text-muted">
                    {t('hospital.or')}
                  </p>
                  <p>
                    {t('hospital.visit_reception')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(HospitalDetailPage);
