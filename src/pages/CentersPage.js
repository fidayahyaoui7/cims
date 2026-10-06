import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import hospitalsData from '../data/hospitalsData';
import { useNavigate } from 'react-router-dom';

const unique = (arr) => Array.from(new Set(arr));

const CentersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [city, setCity] = useState('all');

  const allTypes = useMemo(() => {
    return ['all', ...unique(hospitalsData.map(h => h.type).filter(Boolean))];
  }, []);

  const allCities = useMemo(() => {
    return ['all', ...unique(hospitalsData.map(h => h.city).filter(Boolean)).sort((a, b) => a.localeCompare(b))];
  }, []);

  const filtered = useMemo(() => {
    return hospitalsData.filter(h => {
      const matchesQuery = query.trim().length === 0 ||
        h.name.toLowerCase().includes(query.toLowerCase()) ||
        (h.city && h.city.toLowerCase().includes(query.toLowerCase()));
      const matchesType = type === 'all' || h.type === type;
      const matchesCity = city === 'all' || h.city === city;
      return matchesQuery && matchesType && matchesCity;
    });
  }, [query, type, city]);

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-end gap-3 mb-4">
        <div className="flex-grow-1">
          <h1 className="h3 mb-2">{t('centers') || 'Centers'}</h1>
          <p className="text-muted mb-0">{t('browse_centers_description') || 'Browse all hospitals and medical centers. Use filters to narrow results.'}</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          ← {t('back') || 'Back'}
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder={t('search') || 'Search by name or city'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="col-6 col-md-3 col-lg-2">
          <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
            {allTypes.map(opt => (
              <option key={opt} value={opt}>
                {opt === 'all' ? (t('all_types') || 'All types') : opt}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md-3 col-lg-2">
          <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)}>
            {allCities.map(opt => (
              <option key={opt} value={opt}>
                {opt === 'all' ? (t('all_cities') || 'All cities') : opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-muted py-5">
          {t('no_results') || 'No results found'}
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filtered.map(center => (
            <div key={center.id} className="col">
              <div className="card h-100 shadow-sm">
                {center.image && (
                  <img src={center.image} alt={center.name} className="card-img-top" style={{ objectFit: 'cover', height: 160 }} />
                )}
                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h3 className="h5 mb-0">{center.name}</h3>
                    {center.rating && (
                      <span className="badge bg-success">★ {center.rating}</span>
                    )}
                  </div>
                  <div className="text-muted small mb-2">
                    {center.city} • {center.type}
                  </div>
                  {center.description && (
                    <p className="mb-3 text-muted" style={{ minHeight: 42 }}>
                      {center.description}
                    </p>
                  )}
                  <div className="mt-auto d-flex gap-2">
                    <button className="btn btn-primary btn-sm" onClick={() => navigate(`/centers/${center.id}`)}>
                      {t('view_details') || 'View details'}
                    </button>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/appointment/${center.id}`)}>
                      {t('book_appointment') || 'Book appointment'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CentersPage;
