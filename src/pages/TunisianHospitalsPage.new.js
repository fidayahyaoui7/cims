import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaGlobe, 
  FaMapPin, 
  FaArrowLeft, 
  FaSearch, 
  FaCar, 
  FaHospital, 
  FaClinicMedical, 
  FaUniversity, 
  FaXRay,
  FaWalking,
  FaBicycle,
  FaCarAlt,
  FaFilter,
  FaTimes
} from 'react-icons/fa';
import hospitalsData from '../data/hospitalsData';
import { calculateDistance, calculateTravelTime } from '../utils/distanceUtils';
import AppointmentForm from '../components/AppointmentForm';
import '../styles/HospitalsPage.css';

const TunisianHospitalsPage = () => {
  const { t, i18n } = useTranslation();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [distances, setDistances] = useState({});
  const [selectedType, setSelectedType] = useState('all');
  const [maxDistance, setMaxDistance] = useState(10);
  const [travelMode, setTravelMode] = useState('driving');
  const [showDistanceFilter, setShowDistanceFilter] = useState(false);
  const [sortedBy, setSortedBy] = useState('distance');
  
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  // Get unique cities from hospitals data
  const centersByCity = useMemo(() => {
    return hospitalsData.reduce((acc, center) => {
      if (!acc[center.city]) {
        acc[center.city] = [];
      }
      acc[center.city].push(center);
      return acc;
    }, {});
  }, []);

  const cityList = useMemo(() => Object.keys(centersByCity).sort(), [centersByCity]);

  // Calculate distances when user location or centers change
  useEffect(() => {
    if (userLocation) {
      const newDistances = {};
      hospitalsData.forEach(center => {
        if (center.coordinates && center.coordinates.lat && center.coordinates.lng) {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            center.coordinates.lat,
            center.coordinates.lng
          );
          newDistances[center.id] = {
            distance: parseFloat(distance.toFixed(1)),
            time: calculateTravelTime(distance, travelMode)
          };
        }
      });
      setDistances(newDistances);
    }
  }, [userLocation, travelMode]);

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

  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    if (!searchQuery) return cityList;
    const query = searchQuery.toLowerCase().trim();
    return cityList.filter(city => city.toLowerCase().includes(query));
  }, [cityList, searchQuery]);

  // Filter hospitals based on search query and filters
  const filteredHospitals = useMemo(() => {
    let result = [...hospitalsData];
    
    if (selectedCity) {
      result = result.filter(center => center.city === selectedCity);
    }
    
    if (searchQuery) {
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        result = result.filter(center => 
          (center.name && center.name.toLowerCase().includes(query)) ||
          (center.address && center.address.toLowerCase().includes(query)) ||
          (center.city && center.city.toLowerCase().includes(query))
        );
      }
    }
    
    if (selectedType && selectedType !== 'all') {
      result = result.filter(center => center.type === selectedType);
    }
    
    if (showDistanceFilter && userLocation) {
      result = result.filter(center => {
        if (!center.coordinates) return false;
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          center.coordinates.lat,
          center.coordinates.lng
        );
        return distance <= maxDistance;
      });
    }
    
    return result.sort((a, b) => {
      const distA = distances[a.id]?.distance || Infinity;
      const distB = distances[b.id]?.distance || Infinity;
      
      if (sortedBy === 'distance') return distA - distB;
      if (sortedBy === 'name') return a.name.localeCompare(b.name);
      if (sortedBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [searchQuery, selectedType, selectedCity, showDistanceFilter, maxDistance, distances, userLocation, sortedBy]);

  const handleBookAppointment = (hospital) => {
    setSelectedHospital(hospital);
    setShowAppointmentForm(true);
  };

  const getHospitalTypeIcon = (type) => {
    switch (type) {
      case 'Public Hospital':
        return <FaHospital className="hospital-icon" />;
      case 'University Hospital':
        return <FaUniversity className="university-icon" />;
      case 'Private Clinic':
        return <FaClinicMedical className="clinic-icon" />;
      case 'Radiology Center':
        return <FaXRay className="radiology-icon" />;
      default:
        return <FaHospital className="hospital-icon" />;
    }
  };

  const renderHospitalRow = (hospital) => (
    <tr 
      key={hospital.id} 
      className="hospital-row"
      onClick={() => navigate(`/center/${hospital.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <td>
        <div className="hospital-info">
          <div className="hospital-type">
            {getHospitalTypeIcon(hospital.type)}
          </div>
          <div className="hospital-details">
            <h3>{hospital.name}</h3>
            <div className="hospital-address">
              <FaMapMarkerAlt className="address-icon" />
              <span>{hospital.address}</span>
            </div>
            {userLocation && distances[hospital.id] && (
              <div className="distance-info">
                <span className="distance">
                  {distances[hospital.id].distance.toFixed(1)} km
                </span>
                <span className="travel-time">
                  {travelMode === 'driving' && <FaCarAlt />}
                  {travelMode === 'walking' && <FaWalking />}
                  {travelMode === 'bicycling' && <FaBicycle />}
                  {distances[hospital.id].time}
                </span>
              </div>
            )}
          </div>
        </div>
      </td>
      <td>
        <div className="hospital-actions">
          <button 
            className="book-button"
            onClick={(e) => { e.stopPropagation(); handleBookAppointment(hospital); }}
          >
            {t('book_appointment')}
          </button>
        </div>
      </td>
    </tr>
  );

  const renderCityCard = (city) => (
    <div 
      key={city} 
      className="city-card"
      onClick={() => setSelectedCity(city)}
    >
      <h3>{city}</h3>
      <p>{centersByCity[city].length} {t('hospitals')}</p>
    </div>
  );

  const renderCitySelectionView = () => (
    <div className="city-selection-view">
      <div className="hospitals-header">
        <h1>{t('tunisian_hospitals')}</h1>
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
      
      <div className="cities-grid">
        {filteredCities.length > 0 ? (
          filteredCities.map(renderCityCard)
        ) : (
          <div className="no-results">
            {t('no_cities_found')}
          </div>
        )}
      </div>
    </div>
  );

  const renderHospitalListView = () => (
    <div className="hospital-list-view">
      <div className="hospitals-header-actions">
        <button 
          className="back-button"
          onClick={() => {
            setSelectedCity(null);
            setSearchQuery('');
          }}
        >
          <FaArrowLeft className="back-icon" />
          {t('back_to_cities')}
        </button>
        <h2>{selectedCity}</h2>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label>{t('type')}:</label>
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="type-select"
          >
            <option value="all">{t('all_types')}</option>
            <option value="Public Hospital">{t('public_hospitals')}</option>
            <option value="University Hospital">{t('university_hospitals')}</option>
            <option value="Private Clinic">{t('private_clinics')}</option>
          </select>
        </div>

        <div className="filter-group">
          <button 
            className={`distance-filter ${showDistanceFilter ? 'active' : ''}`}
            onClick={() => setShowDistanceFilter(!showDistanceFilter)}
          >
            <FaFilter /> {t('distance_filter')}
          </button>
          
          {showDistanceFilter && (
            <div className="distance-filter-panel">
              <div className="travel-mode-selector">
                <button 
                  className={`travel-mode-btn ${travelMode === 'driving' ? 'active' : ''}`}
                  onClick={() => setTravelMode('driving')}
                  title={t('by_car')}
                >
                  <FaCarAlt />
                </button>
                <button 
                  className={`travel-mode-btn ${travelMode === 'walking' ? 'active' : ''}`}
                  onClick={() => setTravelMode('walking')}
                  title={t('walking')}
                >
                  <FaWalking />
                </button>
                <button 
                  className={`travel-mode-btn ${travelMode === 'bicycling' ? 'active' : ''}`}
                  onClick={() => setTravelMode('bicycling')}
                  title={t('bicycling')}
                >
                  <FaBicycle />
                </button>
              </div>
              
              <div className="distance-slider-container">
                <label>
                  {t('max_distance')}: {maxDistance} km
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="distance-slider"
                />
              </div>
            </div>
          )}
        </div>

        <div className="filter-group">
          <label>{t('sort_by')}:</label>
          <select 
            value={sortedBy}
            onChange={(e) => setSortedBy(e.target.value)}
            className="sort-select"
          >
            <option value="distance">{t('distance')}</option>
            <option value="name">{t('name')}</option>
            <option value="rating">{t('rating')}</option>
          </select>
        </div>
      </div>

      <div className="hospitals-list">
        <table className="hospitals-table">
          <thead>
            <tr>
              <th>{t('hospital')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredHospitals.length > 0 ? (
              filteredHospitals.map(renderHospitalRow)
            ) : (
              <tr>
                <td colSpan="2" className="no-results">
                  {t('no_hospitals_found')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={`hospitals-container ${isRTL ? 'rtl' : ''}`}>
      {!selectedCity ? renderCitySelectionView() : renderHospitalListView()}
      
      {showAppointmentForm && selectedHospital && (
        <AppointmentForm
          hospital={selectedHospital}
          onClose={() => setShowAppointmentForm(false)}
        />
      )}
    </div>
  );
};

export default TunisianHospitalsPage;
