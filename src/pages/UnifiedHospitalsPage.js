import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Routes, Route, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaClock,
  FaCalendarAlt,
  FaStar,
  FaRegStar,
  FaGlobe, 
  FaMapPin, 
  FaArrowLeft, 
  FaSearch, 
  FaCar, 
  FaHospital, 
  FaClinicMedical,
  FaExclamationTriangle,
  FaUniversity, 
  FaXRay,
  FaWalking,
  FaBicycle,
  FaCarAlt,
  FaFilter,
  FaTimes,
  FaUserMd
} from 'react-icons/fa';
import hospitalsData from '../data/hospitalsData';
import { calculateDistance, calculateTravelTime } from '../utils/distanceUtils';
import AppointmentForm from '../components/AppointmentForm';
// Removed unused import: local HospitalDetail component is defined below
import '../styles/TunisianHospitalsPage.css';

// In TunisianHospitalsPage.js, update the component like this:

const TunisianHospitalsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const [userLocation, setUserLocation] = useState(null);
  const [distances, setDistances] = useState({});
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [travelMode, setTravelMode] = useState('driving');
  const [loading, setLoading] = useState(false);
  const isRTL = i18n.language === 'ar';

  // Process hospitals data with proper error handling and logging
  const { processedHospitals, centersByCity, cityList } = useMemo(() => {
    // Initialize default values
    const result = {
      processedHospitals: [],
      centersByCity: {},
      cityList: []
    };

    try {
      console.log('Raw hospitalsData:', hospitalsData);
      
      if (!Array.isArray(hospitalsData)) {
        console.error('hospitalsData is not an array');
        return result;
      }

      // Process hospitals: add city_id and filter Tunisian hospitals
      const tunisianHospitals = hospitalsData
        .filter(h => h && (h.country === 'Tunisia' || !h.country))
        .map(hospital => ({
          ...hospital,
          city_id: hospital.city_id || (hospital.city ? 
            hospital.city.toLowerCase().replace(/\s+/g, '-') : '')
        }));

      console.log('Processed Tunisian hospitals:', tunisianHospitals);

      // Group by city
      const cities = tunisianHospitals.reduce((acc, hospital) => {
        if (!hospital.city) return acc;
        
        if (!acc[hospital.city]) {
          acc[hospital.city] = [];
        }
        acc[hospital.city].push(hospital);
        return acc;
      }, {});

      result.processedHospitals = tunisianHospitals;
      result.centersByCity = cities;
      result.cityList = Object.keys(cities).sort();
      
      console.log('Cities with hospitals:', result.cityList);
      console.log('Hospitals by city:', result.centersByCity);
      
    } catch (error) {
      console.error('Error processing hospitals data:', error);
    }

    return result;
  }, [hospitalsData]);

  // Filter hospitals based on search query, city, and type
  const filteredHospitals = useMemo(() => {
    if (!Array.isArray(processedHospitals) || processedHospitals.length === 0) {
      console.log('No hospitals data available');
      return [];
    }
    
    console.log('Filtering hospitals with:', {
      searchQuery,
      selectedCity,
      selectedType,
      totalHospitals: processedHospitals.length
    });
    
    const lowerSearchQuery = searchQuery ? searchQuery.trim().toLowerCase() : '';
    
    const seenKeys = new Set();
    const result = processedHospitals.filter(hospital => {
      if (!hospital) return false;
      
      // Search in name or address
      const nameMatch = hospital.name && hospital.name.toLowerCase().includes(lowerSearchQuery);
      const addressMatch = hospital.address && hospital.address.toLowerCase().includes(lowerSearchQuery);
      const matchesSearch = !lowerSearchQuery || nameMatch || addressMatch;
      
      // Filter by city (if selected)
      const matchesCity = !selectedCity || 
                         (hospital.city && hospital.city.toLowerCase() === selectedCity.toLowerCase()) || 
                         (hospital.city_id && hospital.city_id.toLowerCase() === selectedCity.toLowerCase());
      
      // Filter by type (if selected)
      const rawType = String(hospital.type || '').toLowerCase();
      let normalizedType = rawType;
      if (rawType.includes('public')) normalizedType = 'public';
      else if (rawType.includes('university')) normalizedType = 'university';
      else if (rawType.includes('private')) normalizedType = 'private';
      // Always exclude clinics/private entries from results
      if (normalizedType === 'private') return false;
      const matchesType = selectedType === 'all' || (normalizedType === selectedType.toLowerCase());
      
      if (!(matchesSearch && matchesCity && matchesType)) return false;

      // De-duplicate by stable key: prefer id, else name+phone
      const key = hospital.id || `${(hospital.name||'').toLowerCase()}|${(hospital.phone||hospital.contact||'').toString()}`;
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });
    
    console.log('Filter results:', {
      searchQuery,
      selectedCity,
      selectedType,
      filteredCount: result.length,
      sample: result.length > 0 ? result[0].name : 'No results'
    });
    
    return result;
  }, [searchQuery, selectedCity, selectedType, processedHospitals]);



  // Sort hospitals by distance if user location is available
  const sortedHospitals = userLocation 
    ? [...filteredHospitals].sort((a, b) => 
        (distances[a.id] || Infinity) - (distances[b.id] || Infinity)
      )
    : filteredHospitals;

  // Handle hospital selection for appointment
  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital);
    setShowAppointmentForm(true);
  };

  // Handle hospital click to view details
  const handleHospitalClick = (hospital) => {
    navigate(`/centers/${hospital.id}`, { 
      state: { 
        center: hospital,
        cityName: hospital.city,
        from: location
      } 
    });
  };

  // Handle back to list
  const handleBackToList = useCallback(() => {
    navigate('/tunisian-hospitals');
  }, [navigate]);

  const getHospitalTypeIcon = (type) => {
    switch (type) {
      case 'public':
        return <FaHospital className="hospital-icon public" />;
      case 'university':
        return <FaUniversity className="hospital-icon university" />;
      case 'private':
        return <FaClinicMedical className="hospital-icon private" />;
      case 'imaging':
        return <FaXRay className="hospital-icon imaging" />;
      default:
        return <FaHospital className="hospital-icon" />;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t('loading')}...</p>
      </div>
    );
  }

  // Render a single hospital row in the table
  const renderHospitalRow = (hospital) => {
    if (!hospital) return null;
    
    // Normalize type for display and CSS class
    const rawType = String(hospital.type || '').toLowerCase();
    let normType = rawType.includes('public') ? 'public'
                  : rawType.includes('university') ? 'university'
                  : rawType.includes('private') ? 'private'
                  : rawType.replace(/\s+/g, '-');
    const hospitalType =
      normType === 'public' ? t('public_hospitals') :
      normType === 'university' ? t('university_hospitals') :
      normType === 'private' ? t('private_clinics') : (hospital.type || '');
    const distanceInfo = userLocation && distances[hospital.id] ? (
      <div className="distance-info">
        <FaCar className="icon" />
        <span>{distances[hospital.id].distance} km</span>
        <span className="travel-time">({distances[hospital.id].time})</span>
      </div>
    ) : null;

    return (
      <tr key={hospital.id} className="hospital-row" onClick={() => handleHospitalClick(hospital)}>
        <td className="hospital-type">
          {getHospitalTypeIcon(hospital.type)}
          <span>{hospitalType}</span>
        </td>
        <td className="hospital-name">
          <h4>{hospital.name}</h4>
          {hospital.rating && (
            <div className="rating">
              {[...Array(5)].map((_, i) => (
                i < Math.floor(hospital.rating) ? 
                  <FaStar key={i} className="star filled" /> : 
                  <FaRegStar key={i} className="star" />
              ))}
              <span>({hospital.reviews || 0})</span>
            </div>
          )}
        </td>
        <td className="hospital-address">
          <div className="address">
            <FaMapMarkerAlt className="icon" />
            <div>
              <p>{hospital.address}</p>
              <p className="city">{hospital.city}</p>
            </div>
          </div>
        </td>
        {userLocation && <td className="distance">{distanceInfo}</td>}
        <td className="hospital-contact">
          {hospital.phone && (
            <div className="phone">
              <FaPhone className="icon" />
              <a href={`tel:${hospital.phone}`}>{hospital.phone}</a>
            </div>
          )}
          {hospital.emergencyPhone && (
            <div className="emergency">
              <FaExclamationTriangle className="icon" />
              <span>{hospital.emergencyPhone}</span>
            </div>
          )}
        </td>
        <td className="actions">
          <button 
            className="appointment-button"
            onClick={(e) => {
              e.stopPropagation();
              handleHospitalSelect(hospital);
            }}
          >
            <FaCalendarAlt className="icon" />
            {t('book_appointment')}
          </button>
        </td>
      </tr>
    );
  };

  // Hospital detail component
  const HospitalDetail = ({ hospital }) => {
    const { t } = useTranslation();
    
    if (!hospital) return <div className="error">{t('hospital_not_found')}</div>;
    
    // Normalize type for display and CSS class (same logic as list rows)
    const rawType = String(hospital.type || '').toLowerCase();
    let normType = rawType.includes('public') ? 'public'
                  : rawType.includes('university') ? 'university'
                  : rawType.includes('private') ? 'private'
                  : rawType.replace(/\s+/g, '-');
    const hospitalType =
      normType === 'public' ? t('public_hospitals') :
      normType === 'university' ? t('university_hospitals') :
      normType === 'private' ? t('private_clinics') : (hospital.type || '');

    const renderServices = () => {
      if (!hospital.services || hospital.services.length === 0) {
        return <p>{t('no_services_available')}</p>;
      }
      
      return (
        <div className="services-list">
          {hospital.services.map((service, index) => (
            <span key={index} className="service-tag">
              {service}
            </span>
          ))}
        </div>
      );
    };
    
    return (
      <div className="hospital-detail">
        <div className="hospital-header">
          <h2>{hospital.name}</h2>
          <div className="hospital-meta">
            <span className={`hospital-type ${normType}`}>
              {hospitalType}
            </span>
            {hospital.rating && (
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  i < Math.floor(hospital.rating) ? 
                    <FaStar key={i} className="star filled" /> : 
                    <FaRegStar key={i} className="star" />
                ))}
                <span>({hospital.reviews || 0} {t('reviews')})</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="hospital-content">
          <div className="hospital-info">
            <div className="info-section">
              <h3><FaMapMarkerAlt /> {t('address')}</h3>
              <p>{hospital.address}</p>
              <p className="city">{hospital.city}</p>
            </div>
            
            <div className="info-section">
              <h3><FaPhone /> {t('contact')}</h3>
              {hospital.phone && <p><a href={`tel:${hospital.phone}`}>{hospital.phone}</a></p>}
              {hospital.emergencyPhone && (
                <p className="emergency">
                  <FaExclamationTriangle /> {t('emergency')}: {hospital.emergencyPhone}
                </p>
              )}
              {hospital.email && <p><a href={`mailto:${hospital.email}`}>{hospital.email}</a></p>}
              {hospital.website && (
                <p>
                  <a href={hospital.website.startsWith('http') ? hospital.website : `https://${hospital.website}`} 
                     target="_blank" 
                     rel="noopener noreferrer">
                    <FaGlobe /> {hospital.website}
                  </a>
                </p>
              )}
            </div>
            
            <div className="info-section">
              <h3><FaHospital /> {t('services')}</h3>
              {renderServices()}
            </div>
            
            {hospital.description && (
              <div className="info-section">
                <h3>{t('about')}</h3>
                <p>{hospital.description}</p>
              </div>
            )}
          </div>
          
          <div className="hospital-map">
            {hospital.coordinates && (
              <div className="map-container">
                {/* Map integration would go here */}
                <div className="map-placeholder">
                  <FaMapPin className="map-icon" />
                  <p>{t('map_placeholder')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="hospital-actions">
          <button 
            className="appointment-button"
            onClick={() => handleHospitalSelect(hospital)}
          >
            <FaCalendarAlt className="icon" />
            {t('book_appointment')}
          </button>
        </div>
      </div>
    );
  };

  // Wrapper component for hospital detail view
  const HospitalDetailWrapper = () => {
    const { id } = useParams();
    const hospital = processedHospitals.find(h => h.id === id || h.id === `pub-${id}` || h.id === `priv-${id}`);
    
    if (!hospital) {
      return <div className="error">{t('hospital_not_found')}</div>;
    }
    
    return (
      <div className="hospital-detail-container">
        <button 
          className="back-button"
          onClick={handleBackToList}
        >
          <FaArrowLeft className="back-icon" />
          {t('back_to_list')}
        </button>
        <HospitalDetail hospital={hospital} />
      </div>
    );
  };

  return (
    <div className={`hospitals-container ${isRTL ? 'rtl' : ''}`}>
      <Routes>
        <Route 
          path="/" 
          element={
            <div className="hospitals-view">
              <div className="hospitals-header with-search">
                <div className="header-left">
                  <h2>{t('tunisian_hospitals')}</h2>
                </div>
                <div className="search-input-container hospital-search">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder={t('search_hospitals_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
                  />
                  {searchQuery && (
                    <button 
                      className="clear-search"
                      onClick={() => setSearchQuery('')}
                      aria-label={t('clear_search')}
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="filters-container">
                <select 
                  className="type-filter"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">{t('all_types')}</option>
                  <option value="public">{t('public_hospitals')}</option>
                  <option value="university">{t('university_hospitals')}</option>
                </select>
                
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
                      <th>{t('type')}</th>
                      <th>{t('hospital')}</th>
                      <th>{t('address')}</th>
                      {userLocation && <th>{t('distance')}</th>}
                      <th>{t('contact')}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedHospitals.length > 0 ? (
                      sortedHospitals.map((hospital) => renderHospitalRow(hospital))
                    ) : (
                      <tr>
                        <td colSpan={userLocation ? 6 : 5} className="no-results">
                          <p>{t('no_hospitals_found')}</p>
                          {(searchQuery || selectedType !== 'all') && (
                            <button 
                              className="clear-search-button"
                              onClick={() => {
                                setSearchQuery('');
                                setSelectedType('all');
                              }}
                            >
                              {t('clear_filters')}
                            </button>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {showAppointmentForm && selectedHospital && (
                <AppointmentForm
                  hospital={selectedHospital}
                  onClose={() => setShowAppointmentForm(false)}
                />
              )}
            </div>
          } 
        />
        <Route 
          path="/:id" 
          element={<HospitalDetailWrapper />} 
        />
      </Routes>
    </div>
  );
};

export default TunisianHospitalsPage;
