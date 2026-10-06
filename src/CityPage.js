import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { centersAPI } from './services/api';
import './CityPage.css';

const CityPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [centers, setCenters] = useState([]);
  const [cityName, setCityName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCenters = useCallback(async (name) => {
    try {
      setLoading(true);
      setError(null);
      const response = await centersAPI.getByCity(name);
      const formattedCenters = (response.centers || []).map(center => ({
        ...center,
        services: typeof center.services === 'string' ? center.services.split(',') : (center.services || []),
      }));
      setCenters(formattedCenters);
    } catch (err) {
      setError('Failed to load medical centers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const actualCityName = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    setCityName(actualCityName);
    loadCenters(actualCityName);
  }, [slug, loadCenters]);

  const handleCenterClick = (center) => {
    navigate(`/center/${center.id}`, { state: { center, cityName } });
  };

  if (loading) {
    return (
      <div className="city-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading medical centers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="city-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => loadCenters(cityName)} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="city-page">
      <header className="city-header">
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          Back to Home
        </button>
        <div className="city-info">
          <h1>{cityName}</h1>
          <p>{centers.length > 0 ? `${centers.length} medical centers available` : `No medical centers found for ${cityName}`}</p>
        </div>
      </header>

      <main className="city-content">
        {centers.length > 0 ? (
          <div className="centers-grid">
            {centers.map((center) => (
              <div 
                key={center.id} 
                className="center-card"
                onClick={() => handleCenterClick(center)}
              >
                
                <div className="center-details">
                  <div className="detail-item">
                    <span className="label">Address:</span>
                    <span>{center.address || <em>Not provided</em>}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Phone:</span>
                    <span>{center.phone || <em>Not provided</em>}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Hours:</span>
                    <span>{center.hours || <em>Not provided</em>}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Rating:</span>
                    <span>{center.rating ? `${center.rating}/5` : <em>Not rated</em>}</span>
                  </div>
                  <div className="detail-item services-item">
                    <span className="label">Services:</span>
                    <div className="services-list">
                      {center.services && center.services.length > 0 ? (
                        center.services.slice(0, 3).map((service, index) => (
                          <span key={index} className="service-tag">{service}</span>
                        ))
                      ) : (
                        <span className="service-tag">General Medicine</span>
                      )}
                      {center.services && center.services.length > 3 && (
                        <span className="service-tag">...</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="center-actions">
                  <button
                    className="btn btn-success"
                    onClick={e => {
                      e.stopPropagation();
                      navigate('/book-appointment', { state: { centerId: center.id } });
                    }}
                  >
                    Book Appointment
                  </button>
                  <div className="center-arrow">View Details</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-centers-found">
            <p>We couldn't find any centers for {cityName}. Try another city or region.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CityPage;