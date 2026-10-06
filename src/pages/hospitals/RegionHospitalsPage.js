import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaHospital, 
  FaClinicMedical, 
  FaUniversity,
  FaArrowLeft,
  FaSearch
} from 'react-icons/fa';
import { tunisiaRegions } from '../../data/tunisiaHospitals';
import './RegionHospitalsPage.css';

const RegionHospitalsPage = () => {
  const { t } = useTranslation();
  const { regionId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [hospitals, setHospitals] = useState([]);
  const [region, setRegion] = useState(null);
  const [filteredHospitals, setFilteredHospitals] = useState([]);

  // Load region and hospitals data
  useEffect(() => {
    const foundRegion = tunisiaRegions.find(r => r.id === regionId);
    if (foundRegion) {
      setRegion(foundRegion);
      setHospitals(foundRegion.hospitals);
    } else {
      // Redirect to home if region not found
      navigate('/hospitals', { replace: true });
    }
  }, [regionId, navigate]);

  // Filter hospitals based on search and filters
  useEffect(() => {
    let result = [...hospitals];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(hospital => 
        hospital.name.toLowerCase().includes(term) || 
        (hospital.address && hospital.address.toLowerCase().includes(term))
      );
    }
    
    // Filter by type
    if (selectedType !== 'all') {
      result = result.filter(hospital => hospital.type === selectedType);
    }
    
    setFilteredHospitals(result);
  }, [searchTerm, selectedType, hospitals]);

  const getHospitalTypeIcon = (type, hospitalId) => {
    const handleClick = (e) => {
      e.stopPropagation();
      if (hospitalId) {
        navigate(`/hospitals/hospital/${hospitalId}`);
      }
    };

    const iconProps = {
      className: `hospital-icon ${type} clickable`,
      title: type === 'university' ? 'CHU' : type === 'private' ? 'Clinique Privée' : 'Hôpital Public',
      onClick: handleClick,
      style: { cursor: 'pointer' }
    };

    switch(type) {
      case 'public':
        return <FaHospital {...iconProps} />;
      case 'university':
        return <FaUniversity {...iconProps} />;
      case 'private':
        return <FaClinicMedical {...iconProps} />;
      default:
        return <FaHospital {...iconProps} />;
    }
  };

  if (!region) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="region-hospitals">
      <div className="back-button">
        <button onClick={() => navigate('/hospitals')} className="btn-back">
          <FaArrowLeft /> {t('common.back')}
        </button>
      </div>
      
      <div className="region-header">
        <h1>{region.name}</h1>
        <p>{t('hospitals.availableHospitals')}</p>
      </div>
      
      <div className="filters-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={t('hospitals.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className="filter-select"
          >
            <option value="all">{t('hospitals.allTypes')}</option>
            <option value="public">{t('hospitals.public')}</option>
            <option value="university">{t('hospitals.university')}</option>
            
          </select>
        </div>
      </div>
      
      <div className="hospitals-list">
        {filteredHospitals.length > 0 ? (
          filteredHospitals.map(hospital => (
            <div key={hospital.id} className="hospital-card">
              <div className="hospital-header" onClick={() => navigate(`/hospitals/hospital/${hospital.id}`)} style={{ cursor: 'pointer' }}>
                {getHospitalTypeIcon(hospital.type, hospital.id)}
                <h3>{hospital.name}</h3>
              </div>
              
              <div className="hospital-details">
                {hospital.address && (
                  <div className="detail-row">
                    <FaMapMarkerAlt className="detail-icon" />
                    <span>{hospital.address}</span>
                  </div>
                )}
                
                {hospital.phone && (
                  <div className="detail-row">
                    <FaPhone className="detail-icon" />
                    <a href={`tel:${hospital.phone}`}>
                      {hospital.phone}
                    </a>
                  </div>
                )}
              </div>
              
              {hospital.services && hospital.services.length > 0 && (
                <div className="hospital-services">
                  {hospital.services.slice(0, 3).map((service, index) => (
                    <span key={index} className="service-tag">
                      {service}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>{t('hospitals.noHospitalsFound')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionHospitalsPage;
