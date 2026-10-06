import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import hospitalsData from '../../data/hospitalsData';
import './booking.css';

export default function CenterSelection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState(() => {
    try {
      const v = localStorage.getItem('selectedRegion');
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  });

  const normalize = (s) =>
    String(s || '')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim();

  useEffect(() => {
    try {
      // Deduplicate by id to avoid React key collisions (dataset contains some duplicates)
      const unique = Array.from(new Map(hospitalsData.map(c => [c.id, c])).values());
      setCenters(unique);
      console.log('[CenterSelection] Loaded centers from hospitalsData:', unique.length);
    } catch (e) {
      console.error('Failed to load local hospitals data', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredCenters = useMemo(() => {
    if (!selectedRegion) return centers;
    const q = normalize(selectedRegion);
    const result = centers.filter(c => {
      const name = normalize(c.name);
      const address = normalize(c.address);
      const city = normalize(c.city);
      return name.includes(q) || address.includes(q) || city.includes(q);
    });
    console.log('[CenterSelection] Filtering by city=', selectedRegion, 'matches=', result.length);
    return result;
  }, [centers, selectedRegion]);

  const clearRegionFilter = () => {
    try { localStorage.removeItem('selectedRegion'); } catch {}
    setSelectedRegion(null);
  };

  const handleSelect = (c) => {
    localStorage.setItem('selectedCenter', JSON.stringify(c));
    navigate('/book/datetime');
  };

  if (loading) {
    return <div className="booking-page"><div className="spinner" /></div>;
  }

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1>{t('booking_center_title') || 'Select a center'}</h1>
        <p>{t('booking_center_subtitle') || 'Choose the center for your exam'}</p>
      </div>

      {selectedRegion && (
        <div className="notice info" style={{marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8}}>
          <span>
            {t('selected_city_label') || 'Selected city'}: <strong>{selectedRegion}</strong>
            {selectedRegion && filteredCenters.length === 0 && (
              <em style={{marginLeft: 8, color: '#7f8c8d'}}>{t('no_centers_found_notice') || 'No center found. Showing all centers.'}</em>
            )}
          </span>
          <button className="btn" onClick={clearRegionFilter}>{t('clear_filter') || 'Clear filter'}</button>
        </div>
      )}

      <div className="card-grid">
        {(selectedRegion && filteredCenters.length === 0 ? centers : filteredCenters).map((c) => (
          <div key={c.id} className="center-card">
            <div className="center-card-body">
              <h3>{c.name}</h3>
              <p className="muted">{c.address}</p>
              {c.phone && <p className="muted small">{c.phone}</p>}
            </div>
            <div className="center-card-actions">
              <button className="btn primary" onClick={() => handleSelect(c)}>{t('choose') || 'Choose'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
