import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt, FaPhone, FaGlobe, FaMapPin, FaArrowLeft, FaSearch, FaCar } from 'react-icons/fa';
import hospitalsData from '../data/hospitalsData';
import AppointmentForm from '../components/AppointmentForm';
import '../styles/HospitalsPage.css';

const HospitalsPage = () => {
  const { t, i18n } = useTranslation();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [distances, setDistances] = useState({});
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  // Group medical centers by city
  const centersByCity = hospitalsData.reduce((acc, center) => {
    if (!center.coordinates) {
      // Add mock coordinates if none exist (for testing)
      center.coordinates = {
        lat: 36.8 + (Math.random() * 0.5),
        lng: 10.16 + (Math.random() * 0.5)
      };
    }
    
    if (!acc[center.city]) {
      acc[center.city] = [];
    }
    acc[center.city].push(center);
    return acc;
  }, {});

  const cityList = Object.keys(centersByCity).sort();

  // Get user's current location on component mount
  useEffect(() => {
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
          toast.error(t('location_access_denied'));
        }
      );
    }
  }, [t]);

  // Calculate distances when user location or selected city changes
  useEffect(() => {
    if (userLocation && selectedCity) {
      const calculatedDistances = {};
      centersByCity[selectedCity].forEach(hospital => {
        calculatedDistances[hospital.id] = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          hospital.coordinates.lat,
          hospital.coordinates.lng
        );
      });
      setDistances(calculatedDistances);
    }
  }, [userLocation, selectedCity]);

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const toRad = (value) => {
    return value * Math.PI / 180;
  };

  // Format distance for display
  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };

  // Calculate estimated travel time
  const getTravelTime = (distance) => {
    // Assuming average speed of 30 km/h in city traffic
    const timeInMinutes = Math.round((distance / 30) * 60);
    if (timeInMinutes < 60) {
      return `${timeInMinutes} min`;
    }
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
  };

  // Filter cities based on search query
  const filteredCities = cityList.filter(city => 
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter hospitals based on search query when a city is selected
  const filteredHospitals = selectedCity 
    ? centersByCity[selectedCity].filter(center => 
        center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        center.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Sort hospitals by distance if user location is available
  const sortedHospitals = userLocation 
    ? [...filteredHospitals].sort((a, b) => 
        (distances[a.id] || Infinity) - (distances[b.id] || Infinity)
      )
    : filteredHospitals;

  const handleBookAppointment = (hospital) => {
    setSelectedHospital(hospital);
    setShowAppointmentForm(true);
  };

  return (
    <div className="hospitals-container">
      {!selectedCity ? (
        <>
          <div className="hospitals-header">
            <h1>{t('select_city')}</h1>
            <p className="lead">{t('select_city_to_view_hospitals')}</p>
          </div>
          
          <div className="search-container">
            <div className="search-input-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder={t('search_city_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="cities-grid">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <div 
                  key={city} 
                  className="city-card"
                  onClick={() => setSelectedCity(city)}
                >
                  <h3>{city}</h3>
                  <p>{centersByCity[city].length} {t('hospitals')}</p>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>{t('no_cities_found')}</p>
                {searchQuery && (
                  <button 
                    className="clear-search-button"
                    onClick={() => setSearchQuery('')}
                  >
                    {t('clear_search')}
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="hospitals-header">
            <button 
              className="back-button"
              onClick={() => setSelectedCity(null)}
            >
              <FaArrowLeft className="back-icon" />
              {t('back_to_cities')}
            </button>
            <h1>{selectedCity}</h1>
            <p className="lead">{t('select_hospital')}</p>
          </div>
          
          <div className="search-container">
            <div className="search-input-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder={t('search_hospital_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {userLocation && (
              <div className="location-indicator">
                <FaMapPin className="location-icon" />
                <span>{t('your_location_detected')}</span>
              </div>
            )}
          </div>
          
          <div className="hospitals-table-container">
            <table className="hospitals-table">
              <thead>
                <tr>
                  <th>{t('hospital')}</th>
                  <th>{t('address')}</th>
                  {userLocation && <th>{t('distance')}</th>}
                  <th>{t('contact')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sortedHospitals.map((hospital) => (
                  <tr key={hospital.id} className="hospital-row">
                    <td>
                      <div className="hospital-name">{hospital.name}</div>
                    </td>
                    <td>
                      <div className="hospital-address">
                        <FaMapMarkerAlt className="icon" />
                        <span>{hospital.address}</span>
                      </div>
                    </td>
                    {userLocation && (
                      <td>
                        {distances[hospital.id] ? (
                          <div className="distance-info">
                            <div className="distance">
                              {formatDistance(distances[hospital.id])}
                            </div>
                            <div className="travel-time">
                              <FaCar className="icon" />
                              {getTravelTime(distances[hospital.id])}
                            </div>
                          </div>
                        ) : (
                          <span className="distance-unknown">-</span>
                        )}
                      </td>
                    )}
                    <td>
                      <div className="contact-info">
                        {hospital.phone && (
                          <a href={`tel:${hospital.phone}`} className="contact-link">
                            <FaPhone className="icon" />
                            {hospital.phone}
                          </a>
                        )}
                        {hospital.website && (
                          <a 
                            href={`https://${hospital.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="contact-link"
                          >
                            <FaGlobe className="icon" />
                            {hospital.website}
                          </a>
                        )}
                      </div>
                    </td>
                    <td>
                      <button 
                        className="book-button"
                        onClick={() => handleBookAppointment(hospital)}
                      >
                        {t('book_appointment')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {sortedHospitals.length === 0 && (
              <div className="no-results">
                <p>{t('no_hospitals_found')}</p>
                <button 
                  className="clear-search-button"
                  onClick={() => setSearchQuery('')}
                >
                  {t('clear_search')}
                </button>
              </div>
            )}
          </div>
        </>
      )}
      
      {showAppointmentForm && selectedHospital && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AppointmentForm 
              hospital={selectedHospital}
              onClose={() => setShowAppointmentForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalsPage;
