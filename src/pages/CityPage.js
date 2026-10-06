import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaPhone, FaStar, FaRegStar, FaSearch, FaFilter, FaClock } from 'react-icons/fa';
import hospitalsData from '../data/hospitalsData';
import '../styles/CityPage.css';

const CityPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    service: '',
    rating: 0,
    openNow: false
  });

  

  useEffect(() => {
    // Simulate API call
    const fetchCenters = async () => {
      try {
        // Filter centers by city if slug is provided
        let filteredCenters = hospitalsData;
        let usedFallback = false;
        if (slug) {
          const cityName = slug.replace(/-/g, ' '); // Convert slug to city name
          const norm = (s) => (s || '').toString().toLowerCase().normalize('NFD').replace(/\p{Diacritic}+/gu, '');
          const normCity = norm(cityName);

          // primary: items whose city matches exactly (accent-insensitive)
          filteredCenters = hospitalsData.filter(center => norm(center.city) === normCity);

          // fallback: if none, include regional hospitals for that city
          if (filteredCenters.length === 0) {
            const isRegional = (name) => {
              const n = norm(name);
              return n.includes('hopital regional') || n.includes('hôpital regional') || n.includes('regional hospital') || n.includes('regional');
            };
            filteredCenters = hospitalsData.filter(c => norm(c.city) === normCity && isRegional(c.name));
            if (filteredCenters.length > 0) usedFallback = true;
          }
        }
        
        // Defensive: exclude any placeholder entries if present
        filteredCenters = filteredCenters.filter(c => c.id !== 'med-001' && c.name !== 'Medical Center');

        // Apply search filter (keep for fallback as well)
        if (searchTerm) {
          filteredCenters = filteredCenters.filter(center =>
            center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            center.address.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Apply service filter
        if (filters.service && !usedFallback) {
          filteredCenters = filteredCenters.filter(center =>
            center.services.some(service => 
              service.toLowerCase().includes(filters.service.toLowerCase())
            )
          );
        }

        // Apply rating filter
        if (filters.rating > 0 && !usedFallback) {
          filteredCenters = filteredCenters.filter(
            center => center.rating >= filters.rating
          );
        }

        // Apply open now filter
        if (filters.openNow && !usedFallback) {
          filteredCenters = filteredCenters.filter(center => center.openNow);
        }

        setCenters(filteredCenters);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching centers:', error);
        setLoading(false);
      }
    };

    fetchCenters();
  }, [slug, searchTerm, filters]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="star half" />);
      } else {
        stars.push(<FaRegStar key={i} className="star" />);
      }
    }
    
    return stars;
  };

  const handleCenterClick = (centerId) => {
    navigate(`/center/${centerId}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="city-page">
      <div className="page-header">
        <h1>{slug ? `${t('medical_centers_in')} ${slug}` : t('all_medical_centers')}</h1>
        <div className="search-container">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder={t('search_center_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filters">
            <select 
              value={filters.service}
              onChange={(e) => setFilters({...filters, service: e.target.value})}
            >
              <option value="">{t('all_services')}</option>
              <option value="radiologie">{t('radiology')}</option>
              <option value="echographie">{t('ultrasound')}</option>
              <option value="mammographie">{t('mammography')}</option>
              <option value="irm">IRM</option>
              <option value="scanner">{t('scanner')}</option>
            </select>
            <select 
              value={filters.rating}
              onChange={(e) => setFilters({...filters, rating: Number(e.target.value)})}
            >
              <option value="0">{t('all_ratings')}</option>
              <option value="4">4+ {t('stars')}</option>
              <option value="3">3+ {t('stars')}</option>
            </select>
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                checked={filters.openNow}
                onChange={(e) => setFilters({...filters, openNow: e.target.checked})}
              />
              <span>{t('open_now')}</span>
            </label>
          </div>
        </div>
      </div>

      {centers.length === 0 ? (
        <div className="no-results">
          <p>{t('no_centers_found')}</p>
        </div>
      ) : (
        <div className="centers-grid">
          {centers.map(center => (
            <div key={center.id} className="center-card" onClick={() => handleCenterClick(center.id)}>
              <div className="center-image">
                <img src={center.image} alt={center.name} />
                {center.openNow && <span className="status-badge open">{t('open')}</span>}
              </div>
              <div className="center-info">
                <h3>{center.name}</h3>
                <div className="rating">
                  {renderStars(center.rating)}
                  <span>({center.reviews})</span>
                </div>
                <div className="address">
                  <FaMapMarkerAlt />
                  <span>{center.address}</span>
                </div>
                <div className="phone">
                  <FaPhone />
                  <span>{center.phone}</span>
                </div>
                <div className="opening-hours">
                  <FaClock />
                  <span>{center.openingHours}</span>
                </div>
                <div className="services">
                  {center.services.slice(0, 3).map((service, index) => (
                    <span key={index} className="service-tag">{service}</span>
                  ))}
                  {center.services.length > 3 && (
                    <span className="more-services">+{center.services.length - 3} {t('more')}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CityPage;
