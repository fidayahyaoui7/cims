import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaStar, FaRegStar, FaPhone } from 'react-icons/fa';
import axios from 'axios';
import hospitalsData from '../data/hospitalsData';
import '../styles/SearchPage.css';

const SearchPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [centers, setCenters] = useState([]);
  const [filters, setFilters] = useState({
    services: [],
    rating: 0,
    openNow: false
  });

  // Format hospitals for the search results
  const formatCenters = (centers) => {
    return centers.map(center => ({
      id: center.id,
      name: center.name,
      address: center.address,
      distance: 'Calculating...',
      rating: center.rating || 0,
      reviews: center.reviews || 0,
      image: center.image || 'https://via.placeholder.com/300x200?text=Medical+Center',
      services: center.services || [],
      openNow: center.openNow || false,
      openingHours: center.openingHours || 'N/A',
      phone: center.phone || '',
      city: center.city,
      type: center.type,
      availableSlots: [t('today'), t('tomorrow'), t('this_week')]
    }));
  };
  
  const mockCenters = formatCenters(hospitalsData);

  useEffect(() => {
    const filterCenters = () => {
      setIsLoading(true);
      try {
        // If no search term or location is provided, show all centers
        if (!searchTerm && !location) {
          setCenters(mockCenters);
          return;
        }

        // Filter centers based on search term and location
        const filtered = mockCenters.filter(center => {
          const matchesSearch = !searchTerm || 
            center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            center.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            center.services.some(service => 
              service.toLowerCase().includes(searchTerm.toLowerCase())
            );
          
          const matchesLocation = !location || 
            center.city.toLowerCase().includes(location.toLowerCase()) ||
            center.address.toLowerCase().includes(location.toLowerCase());
          
          return matchesSearch && matchesLocation;
        });

        setCenters(filtered);
      } catch (error) {
        console.error('Error filtering centers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      filterCenters();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, location]);

  const handleSearch = (e) => {
    e.preventDefault();
    // The search is already handled by the useEffect that watches searchTerm and location
    // This function is kept for form submission handling
  };

  const handleCenterClick = (center) => {
    // Navigate to the hospital detail page with the correct ID
    // Using the correct route that matches the route in App.js
    navigate(`/hospitals/${center.id}`);
  };

  return (
    <div className="search-page">
      <div className="search-hero">
        <div className="container">
          <h1>{t('find_medical_center')}</h1>
          <p className="subtitle">
            {t('find_medical_center_subtitle')}
          </p>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-fields">
              <div className="form-group">
                <div className="input-with-icon">
                  <FaSearch className="input-icon" />
                  <input
                    type="text"
                    placeholder={t('search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <div className="input-with-icon">
                  <FaMapMarkerAlt className="input-icon" />
                  <input
                    type="text"
                    placeholder={t('location_placeholder')}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-group date-time-group">
                <div className="input-with-icon">
                  <FaCalendarAlt className="input-icon" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                
                <div className="input-with-icon">
                  <FaClock className="input-icon" />
                  <select 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="time-select"
                  >
                    <option value="">{t('any_time')}</option>
                    <option value="morning">{t('morning')}</option>
                    <option value="afternoon">{t('afternoon')}</option>
                    <option value="evening">{t('evening')}</option>
                  </select>
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary search-btn">
                {t('search')}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="search-results container">
        <div className="search-layout">
          <div className="filters">
            <h3>{t('filters')}</h3>
            <div className="filter-options">
              <div className="filter-group">
                <h4>{t('distance')}</h4>
                <label>
                  <input 
                    type="radio" 
                    name="distance" 
                    value="1" 
                    checked={filters.distance === '1'}
                    onChange={() => setFilters({...filters, distance: '1'})}
                  />
                  <span>{t('within_1km')}</span>
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="distance" 
                    value="5" 
                    checked={filters.distance === '5'}
                    onChange={() => setFilters({...filters, distance: '5'})}
                  />
                  <span>{t('within_5km')}</span>
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="distance" 
                    value="10" 
                    checked={filters.distance === '10'}
                    onChange={() => setFilters({...filters, distance: '10'})}
                  />
                  <span>{t('within_10km')}</span>
                </label>
              </div>
              
              <div className="filter-group">
                <h4>{t('availability')}</h4>
                <label>
                  <input 
                    type="checkbox" 
                    name="openNow" 
                    checked={filters.openNow}
                    onChange={(e) => setFilters({...filters, openNow: e.target.checked})}
                  />
                  <span>{t('open_now')}</span>
                </label>
              </div>
              
              <div className="filter-group">
                <h4>{t('rating')}</h4>
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating}>
                    <input 
                      type="radio" 
                      name="rating" 
                      value={rating}
                      checked={filters.rating === rating}
                      onChange={() => setFilters({...filters, rating})}
                    />
                    <span>
                      {[...Array(5)].map((_, i) => (
                        i < rating ? 
                        <FaStar key={i} className="star filled" size={14} /> : 
                        <FaRegStar key={i} className="star" size={14} />
                      ))}
                      {rating}+ {t('stars')}
                    </span>
                  </label>
                ))}
              </div>
              
              <div className="filter-group">
                <h4>{t('services')}</h4>
                {['radiology', 'ultrasound', 'mammography', 'scanner'].map(service => (
                  <label key={service}>
                    <input 
                      type="checkbox" 
                      name={service}
                      checked={filters.services.includes(service)}
                      onChange={(e) => {
                        const updatedServices = e.target.checked
                          ? [...filters.services, service]
                          : filters.services.filter(s => s !== service);
                        setFilters({...filters, services: updatedServices});
                      }}
                    />
                    <span>{t(service)}</span>
                  </label>
                ))}
              </div>
              
              <button 
                className="btn btn-outline btn-block"
                onClick={() => setFilters({ services: [], rating: 0, openNow: false, distance: '5' })}
              >
                {t('reset_filters')}
              </button>
            </div>
          </div>
          
          <div className="results-container">
            <div className="results-header">
              <h2>{t('search_results')} <span className="result-count">({mockCenters.length})</span></h2>
              <div className="sort-options">
                <select 
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="relevance">{t('most_relevant')}</option>
                  <option value="rating">{t('highest_rated')}</option>
                  <option value="distance">{t('nearest')}</option>
                </select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>{t('loading')}</p>
              </div>
            ) : centers.length > 0 ? (
            <div className="centers-grid">
              {centers.map((center) => (
                <div 
                  key={center.id} 
                  className="center-card"
                  onClick={() => handleCenterClick(center)}
                >
                  <div className="center-image">
                    <img src={center.image} alt={center.name} />
                    {center.openNow && (
                      <span className="status-badge open">
                        {t('open_now')}
                      </span>
                    )}
                  </div>
                  <div className="center-details">
                    <h3>{center.name}</h3>
                    <p className="address">
                      <FaMapMarkerAlt /> {center.address}, {center.city}
                    </p>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        i < Math.floor(center.rating) ? 
                        <FaStar key={i} className="star filled" /> : 
                        <FaRegStar key={i} className="star" />
                      ))}
                      <span>({center.reviews} {t('reviews')})</span>
                    </div>
                    <div className="services">
                      {center.services.slice(0, 3).map((service, i) => (
                        <span key={i} className="service-tag">{service}</span>
                      ))}
                      {center.services.length > 3 && (
                        <span className="service-tag">+{center.services.length - 3} {t('more')}</span>
                      )}
                    </div>
                    <div className="opening-hours">
                      <FaClock /> {center.openingHours}
                    </div>
                    <div className="contact-info">
                      <FaPhone /> {center.phone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">
                <FaSearch size={48} />
              </div>
              <h3>{t('no_results_found')}</h3>
              <p>{t('no_results_description')}</p>
              <div className="no-results-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setSearchTerm('');
                    setLocation('');
                    setFilters({ services: [], rating: 0, openNow: false, distance: '5' });
                  }}
                >
                  {t('reset_all_filters')}
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => navigate('/')}
                >
                  {t('back_to_home')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default SearchPage;
