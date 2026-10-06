import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaHospital, 
  FaClinicMedical, 
  FaUniversity,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import { tunisiaRegions, getHospitalsByRegion, getHospitalById } from '../../data/tunisiaHospitals';
import './TunisiaHospitalsList.css';

const TunisiaHospitalsList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [allHospitals, setAllHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  
  // Initialize selectedRegion from URL params on component mount and when URL changes
  useEffect(() => {
    const regionFromUrl = searchParams.get('city') || searchParams.get('region') || 'all';
    if (regionFromUrl !== selectedRegion) {
      setSelectedRegion(regionFromUrl);
    }
  }, [searchParams, selectedRegion]);

  // Flatten all hospitals from all regions
  useEffect(() => {
    const hospitals = [];
    tunisiaRegions.forEach(region => {
      region.hospitals.forEach(hospital => {
        hospitals.push({
          ...hospital,
          regionName: region.name,
          regionId: region.id
        });
      });
    });
    setAllHospitals(hospitals);
    setFilteredHospitals(hospitals);
  }, []);

  // Update URL when region changes
  const handleRegionChange = (regionId) => {
    // Update local state immediately for better UX
    setSelectedRegion(regionId);
    
    // Update URL with the selected region
    const newParams = new URLSearchParams();
    
    // Only add city param if not 'all'
    if (regionId !== 'all') {
      newParams.set('city', regionId);
    }
    
    // Preserve other query parameters
    searchParams.forEach((value, key) => {
      if (key !== 'city' && key !== 'region') {
        newParams.set(key, value);
      }
    });
    
    navigate(`?${newParams.toString()}`, { replace: true });
  };

  // Filter hospitals based on search and filters
  useEffect(() => {
    let result = [...allHospitals];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(hospital => 
        hospital.name.toLowerCase().includes(term) || 
        hospital.city.toLowerCase().includes(term) ||
        hospital.address.toLowerCase().includes(term)
      );
    }
    
    // Filter by region
    if (selectedRegion !== 'all') {
      result = result.filter(hospital => hospital.regionId === selectedRegion);
    }
    
    // Filter by type
    if (selectedType !== 'all') {
      result = result.filter(hospital => hospital.type === selectedType);
    }
    
    setFilteredHospitals(result);
  }, [searchTerm, selectedRegion, selectedType, allHospitals, searchParams]);

  const handleHospitalClick = (hospitalId) => {
    navigate(`/hospitals/hospital/${hospitalId}`);
  };

  const getHospitalTypeIcon = (type) => {
    switch(type) {
      case 'public':
        return <FaHospital className="hospital-icon public" title="Public Hospital" />;
      case 'university':
        return <FaUniversity className="hospital-icon university" title="University Hospital" />;
      case 'private':
        return <FaClinicMedical className="hospital-icon private" title="Private Clinic" />;
      default:
        return <FaHospital className="hospital-icon" />;
    }
  };

  return (
    <div className="tunisia-hospitals-container">
      <div className="hospitals-header">
        <h1>{t('hospitals.title')}</h1>
        <p>{t('hospitals.subtitle')}</p>
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
          <FaFilter className="filter-icon" />
          <select 
            value={selectedRegion} 
            onChange={(e) => handleRegionChange(e.target.value)}
            className="filter-select"
            aria-label="Select region"
          >
            <option value="all">{t('hospitals.allRegions')}</option>
            {tunisiaRegions.map(region => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
          
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className="filter-select"
          >
            <option value="all">{t('hospitals.allTypes')}</option>
            <option value="public">{t('hospitals.public')}</option>
            <option value="university">{t('hospitals.university')}</option>
            <option value="private">{t('hospitals.private')}</option>
          </select>
        </div>
      </div>
      
      <div className="hospitals-grid">
        {filteredHospitals.length > 0 ? (
          filteredHospitals.map(hospital => (
            <div 
              key={hospital.id} 
              className="hospital-card"
              onClick={() => handleHospitalClick(hospital.id)}
            >
              <div className="hospital-card-header">
                {getHospitalTypeIcon(hospital.type)}
                <h3>{hospital.name}</h3>
                <span className="hospital-type">
                  {hospital.type === 'public' ? t('hospitals.public') : 
                   hospital.type === 'university' ? t('hospitals.university') : 
                   t('hospitals.private')}
                </span>
              </div>
              
              <div className="hospital-details">
                <div className="detail-row">
                  <FaMapMarkerAlt className="detail-icon" />
                  <span>{hospital.address}, {hospital.city}</span>
                </div>
                
                {hospital.phone && (
                  <div className="detail-row">
                    <FaPhone className="detail-icon" />
                    <a href={`tel:${hospital.phone}`} onClick={e => e.stopPropagation()}>
                      {hospital.phone}
                    </a>
                  </div>
                )}
                
                {hospital.emergencyPhone && (
                  <div className="detail-row emergency">
                    <FaPhone className="detail-icon" />
                    <span>{t('hospitals.emergency')}: </span>
                    <a href={`tel:${hospital.emergencyPhone.split(',')[0].trim()}`} onClick={e => e.stopPropagation()}>
                      {hospital.emergencyPhone.split(',')[0].trim()}
                    </a>
                  </div>
                )}
              </div>
              
              <div className="hospital-services">
                {hospital.services && hospital.services.slice(0, 3).map((service, index) => (
                  <span key={index} className="service-tag">
                    {service}
                  </span>
                ))}
                {hospital.services && hospital.services.length > 3 && (
                  <span className="more-services">+{hospital.services.length - 3} more</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>{t('hospitals.noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TunisiaHospitalsList;
