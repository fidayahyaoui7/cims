import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaSearch, 
  FaHospital, 
  FaClinicMedical, 
  FaUniversity, 
  FaXRay,
  FaFilter,
  FaTimes,
  FaWalking,
  FaCarAlt,
  FaBicycle,
  FaMapPin
} from 'react-icons/fa';
import './HospitalsList.css';

const HospitalsList = ({ 
  hospitals = [], 
  onHospitalClick, 
  userLocation, 
  distances = {},
  loading = false,
  onFilterChange = {},
  filters = {},
  cities = [],
  showDistanceFilter = false,
  onToggleDistanceFilter = () => {},
  onBookAppointment = () => {}
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [selectedCity, setSelectedCity] = useState(filters.city || 'all');
  const [selectedType, setSelectedType] = useState(filters.type || 'all');
  const [sortBy, setSortBy] = useState(filters.sortBy || 'distance');
  const [maxDistance, setMaxDistance] = useState(filters.distance || 10);
  const [travelMode, setTravelMode] = useState(filters.travelMode || 'driving');

  // Update local state when props change
  useEffect(() => {
    if (filters.search !== undefined) setSearchQuery(filters.search);
    if (filters.city !== undefined) setSelectedCity(filters.city);
    if (filters.type !== undefined) setSelectedType(filters.type);
    if (filters.sortBy !== undefined) setSortBy(filters.sortBy);
    if (filters.distance !== undefined) setMaxDistance(filters.distance);
    if (filters.travelMode !== undefined) setTravelMode(filters.travelMode);
  }, [filters]);

  // Filter and sort hospitals
  const filteredHospitals = useMemo(() => {
    let result = [...hospitals];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(hospital => 
        hospital.name.toLowerCase().includes(query) ||
        (hospital.address && hospital.address.toLowerCase().includes(query))
      );
    }
    
    // Apply city filter
    if (selectedCity !== 'all') {
      result = result.filter(hospital => 
        hospital.city_id && hospital.city_id.toString() === selectedCity.toString()
      );
    }
    
    // Apply type filter
    if (selectedType !== 'all') {
      result = result.filter(hospital => hospital.type === selectedType);
    }
    
    // Apply distance filter if user location is available
    if (userLocation && Object.keys(distances).length > 0) {
      result = result.filter(hospital => {
        const distance = distances[hospital.id];
        return !distance || distance <= maxDistance;
      });
    }
    
    // Sort results
    result.sort((a, b) => {
      if (sortBy === 'distance' && userLocation) {
        const distA = distances[a.id] || Infinity;
        const distB = distances[b.id] || Infinity;
        return distA - distB;
      } else if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      } else {
        // Default sort by name
        return a.name.localeCompare(b.name);
      }
    });
    
    return result;
  }, [hospitals, searchQuery, selectedCity, selectedType, sortBy, userLocation, distances, maxDistance]);

  // Handle filter changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onFilterChange.search) onFilterChange.search(value);
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setSelectedCity(value);
    if (onFilterChange.city) onFilterChange.city(value);
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);
    if (onFilterChange.type) onFilterChange.type(value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    if (onFilterChange.sortBy) onFilterChange.sortBy(value);
  };

  const handleDistanceChange = (e) => {
    const value = parseInt(e.target.value);
    setMaxDistance(value);
    if (onFilterChange.distance) onFilterChange.distance(value);
  };

  const handleTravelModeChange = (mode) => {
    setTravelMode(mode);
    if (onFilterChange.travelMode) onFilterChange.travelMode(mode);
  };

  const handleHospitalClickInternal = (hospital) => {
    if (onHospitalClick) {
      onHospitalClick(hospital);
    } else {
      navigate(`/hospitals/${hospital.id}`, { state: { hospital } });
    }
  };

  const handleBookAppointment = (e, hospital) => {
    e.stopPropagation();
    onBookAppointment(hospital);
  };

  const getHospitalTypeIcon = (type) => {
    switch (type) {
      case 'public':
        return <FaHospital className="hospital-icon public" />;
      case 'university':
        return <FaUniversity className="hospital-icon university" />;
      case 'imaging':
        return <FaXRay className="hospital-icon imaging" />;
      default:
        return <FaHospital className="hospital-icon" />;
    }
  };

  if (loading) {
    return <div className="loading">{t('loading')}...</div>;
  }

  return (
    <div className="hospitals-container">
      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={t('search_hospitals_placeholder')}
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search"
              onClick={() => handleSearchChange({ target: { value: '' } })}
              aria-label={t('clear_search')}
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        <div className="filter-options">
          <div className="filter-group">
            <label htmlFor="city-filter">{t('city')}:</label>
            <select 
              id="city-filter"
              value={selectedCity}
              onChange={handleCityChange}
              className="filter-select"
            >
              <option value="all">{t('all_cities')}</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="type-filter">{t('type')}:</label>
            <select 
              id="type-filter"
              value={selectedType}
              onChange={handleTypeChange}
              className="filter-select"
            >
              <option value="all">{t('all_types')}</option>
              <option value="public">{t('public')}</option>
              <option value="university">{t('university')}</option>
            </select>
          </div>
          
          <button 
            className={`filter-btn ${showDistanceFilter ? 'active' : ''}`}
            onClick={onToggleDistanceFilter}
          >
            <FaFilter /> {t('distance')}
          </button>
          
          {showDistanceFilter && userLocation && (
            <div className="distance-filter-panel">
              <div className="distance-filter-header">
                <h4>{t('distance_filter')}</h4>
                <button 
                  className="close-btn"
                  onClick={onToggleDistanceFilter}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="distance-slider">
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={maxDistance} 
                  onChange={handleDistanceChange}
                />
                <span>{maxDistance} km</span>
              </div>
              <div className="travel-modes">
                <button 
                  className={`travel-mode-btn ${travelMode === 'walking' ? 'active' : ''}`}
                  onClick={() => handleTravelModeChange('walking')}
                >
                  <FaWalking /> {t('walking')}
                </button>
                <button 
                  className={`travel-mode-btn ${travelMode === 'driving' ? 'active' : ''}`}
                  onClick={() => handleTravelModeChange('driving')}
                >
                  <FaCarAlt /> {t('driving')}
                </button>
                <button 
                  className={`travel-mode-btn ${travelMode === 'bicycling' ? 'active' : ''}`}
                  onClick={() => handleTravelModeChange('bicycling')}
                >
                  <FaBicycle /> {t('bicycling')}
                </button>
              </div>
            </div>
          )}
          
          <div className="sort-options">
            <label htmlFor="sort-by">{t('sort_by')}:</label>
            <select 
              id="sort-by"
              value={sortBy}
              onChange={handleSortChange}
              className="sort-select"
            >
              {userLocation && <option value="distance">{t('distance')}</option>}
              <option value="rating">{t('rating')}</option>
              <option value="name">{t('name')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="results-count">
        {filteredHospitals.length} {t('hospitals_found')}
      </div>

      <div className="hospitals-grid">
        {filteredHospitals.length > 0 ? (
          filteredHospitals.map((hospital) => (
            <div 
              key={hospital.id} 
              className="hospital-card"
              onClick={() => handleHospitalClickInternal(hospital)}
            >
              <div className="hospital-image">
                <img 
                  src={hospital.image || `https://via.placeholder.com/400x250?text=${encodeURIComponent(hospital.name)}`} 
                  alt={hospital.name} 
                />
                <div className="hospital-type">
                  {getHospitalTypeIcon(hospital.type)}
                  <span>{t(hospital.type || 'hospital')}</span>
                </div>
              </div>
              <div className="hospital-info">
                <h3>{hospital.name}</h3>
                <p className="hospital-address">
                  <FaMapMarkerAlt className="location-icon" />
                  {hospital.address}
                </p>
                
                {userLocation && distances[hospital.id] !== undefined && (
                  <div className="hospital-distance">
                    <FaMapPin className="distance-icon" />
                    <span>
                      {distances[hospital.id].toFixed(1)} km • {t('approx')} {Math.round(distances[hospital.id] * 2)} {t('min')}
                    </span>
                  </div>
                )}
                
                <div className="hospital-rating">
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        className={`star ${star <= Math.floor(hospital.rating || 0) ? 'filled' : ''}`}
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </span>
                    ))}
                  </div>
                  <span className="rating-value">{(hospital.rating || 0).toFixed(1)}</span>
                  <span className="review-count">
                    ({hospital.reviewCount || 0} {t('reviews')})
                  </span>
                </div>
                
                <div className="hospital-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={(e) => handleBookAppointment(e, hospital)}
                  >
                    {t('book_appointment')}
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={() => handleHospitalClickInternal(hospital)}
                  >
                    {t('view_details')}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="no-results-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3>{t('no_hospitals_found')}</h3>
            <p>{t('try_changing_filters')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalsList;
