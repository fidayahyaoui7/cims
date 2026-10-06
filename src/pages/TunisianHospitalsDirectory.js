import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import hospitalsData from '../data/hospitalsData';
import '../styles/HospitalsPage.css';

const TunisianHospitalsDirectory = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');

  // Build city -> count mapping from Tunisian hospitals
  const tunisianByCity = useMemo(() => {
    const map = {};
    hospitalsData
      .filter((h) => (h.country || '').toLowerCase() === 'tunisia')
      .forEach((h) => {
        const city = h.city || t('unknown_city');
        map[city] = (map[city] || 0) + 1;
      });
    return map;
  }, [t]);

  const cities = useMemo(() => Object.keys(tunisianByCity).sort(), [tunisianByCity]);

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return cities;
    const q = searchQuery.toLowerCase();
    return cities.filter((c) => c.toLowerCase().includes(q));
  }, [cities, searchQuery]);

  const handleCityClick = (city) => {
    const qs = new URLSearchParams({ city });
    navigate(`/hospitals/tunisia?${qs.toString()}`);
  };

  return (
    <div className={`hospitals-page ${isRTL ? 'rtl' : ''}`}>
      <div className="hospitals-header">
        <h1>{t('tunisian_hospitals')}</h1>
        <p className="text-muted">
          {t('showing_x_of_y_cities', {
            count: filteredCities.length,
            total: cities.length,
          })}
        </p>
      </div>

      <div className="hospitals-filters">
        <div className="search-container">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder={t('search_city_placeholder') || t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="cities-grid">
        {filteredCities.length > 0 ? (
          filteredCities.map((city) => (
            <div
              key={city}
              className="city-card"
              onClick={() => handleCityClick(city)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleCityClick(city)}
            >
              <h3>{city}</h3>
              <p>
                {t('hospitals')} : {tunisianByCity[city]}
              </p>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>{t('no_cities_found')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TunisianHospitalsDirectory;
