import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './booking.css';

const regions = [
  'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan', 'Bizerte', 'Beja', 'Jendouba', 'Kef', 'Siliana',
  'Sousse', 'Monastir', 'Mahdia', 'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid', 'Gabes', 'Medenine', 'Tataouine',
  'Gafsa', 'Tozeur', 'Kebili'
];

function RegionSelection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { t } = useTranslation();

  // Auto-skip if a region (city) was already selected on the hospitals page
  useEffect(() => {
    try {
      const v = localStorage.getItem('selectedRegion');
      const saved = v ? JSON.parse(v) : null;
      if (saved) {
        // Ensure it's also persisted in case it came from URL
        localStorage.setItem('selectedRegion', JSON.stringify(saved));
        navigate('/booking/center', { replace: true });
      }
    } catch (e) {
      // no-op
    }
  }, [navigate]);

  const filtered = regions.filter(r => r.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (region) => {
    localStorage.setItem('selectedRegion', JSON.stringify(region));
    navigate('/book/center');
  };

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1>{t('booking_region_title') || 'Choose your region'}</h1>
        <p>{t('booking_region_subtitle') || 'Select the region where you want exam'}</p>
      </div>

      <div className="toolbar">
        <input
          className="input"
          placeholder={t('search_region_placeholder') || 'Search a region...'}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div className="pill-grid">
        {filtered.map(region => (
          <button key={region} className="pill" onClick={() => handleSelect(region)}>
            {region}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RegionSelection;
