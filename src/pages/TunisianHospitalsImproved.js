import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import { formatPhoneNumber } from '../utils/phoneUtils';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaClock,
  FaSearch, 
  FaFilter,
  FaHospitalAlt
} from 'react-icons/fa';
import hospitalsData from '../data/hospitalsData';
import { calculateDistance } from '../utils/distanceUtils';
import '../styles/TunisianHospitalsPage.css';

const TunisianHospitalsImproved = () => {
  const { t, i18n } = useTranslation();
  const [userLocation, setUserLocation] = useState(null);
  const [distances, setDistances] = useState({});
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const isRTL = i18n.language === 'ar';
  const listRef = useRef(null);

  // Process hospitals data
  const { processedHospitals, cities } = useMemo(() => {
    const tunisianHospitals = Array.isArray(hospitalsData) 
      ? hospitalsData.filter(h => h && (h.country === 'Tunisia' || !h.country))
      : [];

    // Get unique cities
    const citySet = new Set();
    tunisianHospitals.forEach(hospital => {
      if (hospital.city) citySet.add(hospital.city);
    });

    const cities = Array.from(citySet).sort();
    
    return {
      processedHospitals: tunisianHospitals,
      cities: ['all', ...cities] // Add 'all' option
    };
  }, []);

  // Filter hospitals based on selected city and search query
  const filteredHospitals = useMemo(() => {
    return processedHospitals.filter(hospital => {
      const matchesCity = selectedCity === 'all' || hospital.city === selectedCity;
      const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (hospital.address && hospital.address.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCity && matchesSearch;
    });
  }, [processedHospitals, selectedCity, searchQuery]);

  // Get user's location
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
          toast.error(t('location.error'));
        }
      );
    }
    setIsLoading(false);
  }, [t]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHospitals = filteredHospitals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHospitals.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCity, searchQuery]);

  // Calculate distances when user location or hospitals change
  useEffect(() => {
    if (userLocation && filteredHospitals.length > 0) {
      const newDistances = {};
      filteredHospitals.forEach(hospital => {
        if (hospital.lat && hospital.lng) {
          newDistances[hospital.id] = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            hospital.lat,
            hospital.lng
          ).toFixed(1);
        }
      });
      setDistances(newDistances);
    }
  }, [userLocation, filteredHospitals]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setShowCityDropdown(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by the filteredHospitals memo
  };

  // Scroll to top when page changes
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]);

  if (isLoading) {
    return <div className="loading">{t('loading')}...</div>;
  }

  return (
    <div className={`tunisian-hospitals ${isRTL ? 'rtl' : ''}`} style={{ minHeight: 'calc(100vh - 300px)', paddingBottom: '40px' }}>
      <div className="filters-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </form>

        <div className="city-filter">
          <div className="city-selector">
            <button 
              type="button" 
              className="city-selector-button"
              onClick={() => setShowCityDropdown(!showCityDropdown)}
            >
              {selectedCity === 'all' ? t('allCities') : selectedCity}
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {showCityDropdown && (
              <div className="city-dropdown">
                {cities.map(city => (
                  <div
                    key={city}
                    className={`city-option ${selectedCity === city ? 'selected' : ''}`}
                    onClick={() => handleCitySelect(city)}
                  >
                    {city === 'all' ? t('allCities') : city}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hospitals-list" ref={listRef}>
        {currentHospitals.length > 0 ? (
          currentHospitals.map(hospital => (
            <div key={hospital.id} className="hospital-card">
              <div className="hospital-header">
                <h3>{hospital.name}</h3>
                {hospital.rating && (
                  <div className="hospital-rating">
                    {Array(5).fill().map((_, i) => (
                      i < Math.floor(hospital.rating) ? 
                      <span key={i} className="star filled">★</span> : 
                      <span key={i} className="star">☆</span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="hospital-details">
                <div className="detail-row">
                  <FaMapMarkerAlt className="detail-icon" />
                  <span>{hospital.address || t('noAddress')}</span>
                </div>
                
                {hospital.phone && (
                  <div className="detail-row">
                    <FaPhone className="detail-icon" />
                    <span>{formatPhoneNumber(hospital.phone)}</span>
                  </div>
                )}
                
                {hospital.emergencyPhone && (
                  <div className="detail-row emergency">
                    <FaPhone className="detail-icon" />
                    <span>
                      {t('emergency')}: {hospital.emergencyPhone.split(',').map(phone => (
                        <span key={phone.trim()} className="phone-number">
                          {formatPhoneNumber(phone.trim())}
                        </span>
                      )).reduce((prev, curr, i, arr) => [prev, ', ', curr])}
                    </span>
                  </div>
                )}
                
                {hospital.hours && (
                  <div className="detail-row">
                    <FaClock className="detail-icon" />
                    <span>{hospital.hours}</span>
                  </div>
                )}
                
                {distances[hospital.id] && (
                  <div className="detail-row">
                    <FaMapMarkerAlt className="detail-icon" />
                    <span>{distances[hospital.id]} km {t('away')}</span>
                  </div>
                )}
              </div>
              
              <div className="hospital-actions">
                <button 
                  className="view-details-btn"
                  onClick={() => window.open(hospital.website || '#', '_blank')}
                  disabled={!hospital.website}
                >
                  {t('viewDetails')}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>{t('noHospitalsFound')}</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-button"
            aria-label={t('pagination.previous')}
          >
            {t('pagination.previous')}
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show first page, last page, and pages around current page
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            if (pageNum > 0 && pageNum <= totalPages) {
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`pagination-button ${currentPage === pageNum ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              );
            }
            return null;
          })}
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-button"
            aria-label={t('pagination.next')}
          >
            {t('pagination.next')}
          </button>
          
          <div className="pagination-info">
            {t('pagination.showing')} {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredHospitals.length)} {t('pagination.of')} {filteredHospitals.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default TunisianHospitalsImproved;
