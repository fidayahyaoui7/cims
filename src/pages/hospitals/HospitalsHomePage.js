import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHospital, FaMapMarkerAlt } from 'react-icons/fa';
import { tunisiaRegions } from '../../data/tunisiaHospitals';
import './HospitalsHomePage.css';

const HospitalsHomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleRegionClick = (regionId) => {
    navigate(`/hospitals/region/${regionId}`);
  };

  return (
    <div className="hospitals-home">
      <div className="hospitals-header">
        <h1>{t('hospitals.title')}</h1>
        <p>{t('hospitals.chooseRegion')}</p>
      </div>
      
      <div className="regions-grid">
        {tunisiaRegions.map(region => (
          <div 
            key={region.id} 
            className="region-card"
            onClick={() => handleRegionClick(region.id)}
          >
            <div className="region-icon">
              <FaMapMarkerAlt />
            </div>
            <h3>{region.name}</h3>
            <div className="hospital-count">
              <FaHospital />
              <span>{region.hospitals.length} {t('hospitals.hospitals')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalsHomePage;
