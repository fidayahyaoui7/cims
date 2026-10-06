import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaChevronRight, 
  FaChevronLeft,
  FaHospital,
  FaRegClock,
  FaRegHospital
} from 'react-icons/fa';
import tunisiaHospitals from '../../../data/tunisiaHospitalsComplete';
import './TunisiaHospitalSelection.css';

const TunisiaHospitalSelection = ({ onNext, onBack }) => {
  const { t } = useTranslation('booking');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [view, setView] = useState('regions');
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  
  // Get unique regions
  const regions = [...new Set(tunisiaHospitals.map(h => h.region))].sort();
  
  // Filter hospitals based on search term and selected region
  useEffect(() => {
    let result = [...tunisiaHospitals];
    
    if (selectedRegion) {
      result = result.filter(hospital => hospital.region === selectedRegion);
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(hospital => 
        [hospital.name, hospital.city, hospital.address || '', hospital.region]
          .join(' ')
          .toLowerCase()
          .includes(searchLower)
      );
    }
    
    setFilteredHospitals(result);
  }, [searchTerm, selectedRegion]);
  
  // Get hospital type label
  const getHospitalTypeLabel = (type) => {
    const types = {
      'public': t('type.public', 'Public'),
      'private': t('type.private', 'Private'),
      'university': t('type.university', 'University'),
      'military': t('type.military', 'Military'),
      'regional': t('type.regional', 'Regional')
    };
    return types[type] || type;
  };
  
  // Handle region selection
  const handleSelectRegion = (region) => {
    setSelectedRegion(region);
    setView('hospitals');
  };
  
  // Handle back to regions
  const handleBackToRegions = () => {
    setSelectedRegion(null);
    setView('regions');
    setSearchTerm('');
  };
  
  // Handle back to hospitals
  const handleBackToHospitals = () => {
    setView('hospitals');
  };
  
  // Handle confirm selection
  const handleConfirmSelection = () => {
    if (selectedHospital) {
      onNext({
        center: {
          id: selectedHospital.id,
          name: selectedHospital.name,
          address: selectedHospital.address,
          city: selectedHospital.city,
          region: selectedHospital.region,
          phone: selectedHospital.phone,
          type: selectedHospital.type || 'public'
        },
        region: selectedHospital.region
      });
    }
  };
  
  // Handle hospital selection
  const handleSelectHospital = (hospital) => {
    setSelectedHospital(hospital);
    setView('details');
  };
  
  // Render regions view
  const renderRegionsView = () => (
    <div className="step-content">
      <h2 className="step-title">{t('regionSelection.title', 'Select a Region')}</h2>
      <p className="step-subtitle">
        {t('regionSelection.subtitle', 'Choose a region to see available hospitals')}
      </p>
      
      <div className="regions-grid">
        {regions.map((region) => (
          <div 
            key={region} 
            className="region-card"
            onClick={() => handleSelectRegion(region)}
          >
            <FaMapMarkerAlt className="region-icon" />
            <span>{region}</span>
            <FaChevronRight className="arrow-icon" />
          </div>
        ))}
      </div>
    </div>
  );
  
  // Render hospitals list view
  const renderHospitalsView = () => (
    <div className="step-content">
      <div className="hospitals-header">
        <button 
          onClick={handleBackToRegions}
          className="back-button"
        >
          <FaChevronLeft className="back-icon" />
          {t('regionSelection.backToRegions', 'Back to Regions')}
        </button>
        <h2 className="section-title">
          {selectedRegion 
            ? t('regionSelection.hospitalsIn', { region: selectedRegion })
            : t('regionSelection.allHospitals', 'All Hospitals')}
        </h2>
      </div>
      
      <div className="search-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={t('regionSelection.searchPlaceholder', 'Search hospitals...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      {filteredHospitals.length === 0 ? (
        <div className="no-results">
          <FaHospital className="no-results-icon" />
          <p>{t('regionSelection.noHospitalsFound', 'No hospitals found')}</p>
          <button 
            onClick={handleBackToRegions}
            className="back-link"
          >
            {t('regionSelection.backToAllRegions', 'Back to all regions')}
          </button>
        </div>
      ) : (
        <div className="hospitals-list">
          {filteredHospitals.map((hospital) => (
            <div 
              key={hospital.id}
              className="hospital-card"
              onClick={() => handleSelectHospital(hospital)}
            >
              <div className="hospital-info">
                <h3>{hospital.name}</h3>
                <p className="hospital-address">
                  <FaMapMarkerAlt /> {hospital.address}, {hospital.city}
                </p>
                {hospital.phone && (
                  <p className="hospital-phone">
                    <FaPhone /> {hospital.phone}
                  </p>
                )}
                <div className="hospital-type">
                  {getHospitalTypeLabel(hospital.type || 'public')}
                </div>
              </div>
              <FaChevronRight className="arrow-icon" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
  // Render hospital details view
  const renderHospitalDetails = () => {
    if (!selectedHospital) {
      return (
        <div className="step-content">
          <p>{t('error.noHospitalSelected', 'No hospital selected')}</p>
          <button onClick={handleBackToHospitals} className="back-button">
            {t('common.back', 'Back')}
          </button>
        </div>
      );
    }
    
    return (
      <div className="step-content">
        <div className="hospital-details-header">
          <button 
            onClick={handleBackToHospitals}
            className="back-button"
          >
            <FaChevronLeft className="back-icon" />
            {t('common.back', 'Back')}
          </button>
          <h2 className="section-title">{selectedHospital.name}</h2>
        </div>
        
        <div className="hospital-details">
          <div className="hospital-info">
            <div className="info-row">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <p className="info-label">{t('common.address', 'Address')}</p>
                <p className="info-value">
                  {selectedHospital.address}, {selectedHospital.city}, {selectedHospital.region}
                </p>
              </div>
            </div>
            
            {selectedHospital.phone && (
              <div className="info-row">
                <FaPhone className="info-icon" />
                <div>
                  <p className="info-label">{t('common.phone', 'Phone')}</p>
                  <p className="info-value">
                    <a href={`tel:${selectedHospital.phone}`}>
                      {selectedHospital.phone}
                    </a>
                  </p>
                </div>
              </div>
            )}
            
            <div className="info-row">
              <FaRegHospital className="info-icon" />
              <div>
                <p className="info-label">{t('common.type', 'Type')}</p>
                <p className="info-value">
                  {getHospitalTypeLabel(selectedHospital.type || 'public')}
                </p>
              </div>
            </div>
            
            <div className="info-row">
              <FaRegClock className="info-icon" />
              <div>
                <p className="info-label">{t('common.availability', 'Availability')}</p>
                <p className="info-value">
                  {t('common.workingHours', 'Working Hours')}: 8:00 AM - 6:00 PM
                  <br />
                  {t('common.emergency', 'Emergency')}: {t('common.available24_7', 'Available 24/7')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="hospital-actions">
            <button 
              onClick={handleConfirmSelection}
              className="confirm-button"
            >
              {t('common.confirmSelection', 'Confirm Selection')}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Main render
  return (
    <div className="tunisia-hospital-selection">
      {view === 'regions' && renderRegionsView()}
      {view === 'hospitals' && renderHospitalsView()}
      {view === 'details' && renderHospitalDetails()}
    </div>
  );
};

export default TunisiaHospitalSelection;
