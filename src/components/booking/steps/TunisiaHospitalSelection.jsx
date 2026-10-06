import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaMapMarkerAlt, FaPhone, FaCheck, FaMapMarker } from 'react-icons/fa';
import { useBooking } from '../../../contexts/BookingContext';
import tunisiaHospitals from '../../../data/tunisiaHospitalsComplete';
import './TunisiaHospitalSelection.css';

// Map radiology types to hospital services
const RADIOLOGY_SERVICES = {
  xray: 'Radiographie (X-ray)',
  mri: 'IRM',
  ct: 'Scanner (CT)',
  ultrasound: 'Échographie'
};

const TunisiaHospitalSelection = React.memo(({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { bookingData } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Memoize the list of regions to prevent recalculation on every render
  const regions = useMemo(() => {
    return [...new Set(tunisiaHospitals.map(h => h.region))].sort();
  }, []);
  
  // Mock distance and time data
  const getDistanceInfo = (hospitalName) => {
    const distances = {
      'Tunis Medical Center': { distance: '2.5', time: '10' },
      'Sahloul University Hospital': { distance: '15.8', time: '25' },
      'Tahar Sfar University Hospital': { distance: '45.2', time: '50' },
      'Sfax University Hospital': { distance: '85.7', time: '75' },
      'La Rabta Hospital': { distance: '3.1', time: '12' }
    };
    return distances[hospitalName] || { distance: 'N/A', time: 'N/A' };
  };

  // Mock services data
  const getServices = (hospitalName) => {
    const services = {
      'Tunis Medical Center': ['Cardiology', 'Radiology', 'Pediatrics', 'Emergency'],
      'Sahloul University Hospital': ['Neurology', 'Oncology', 'Maternity', 'Intensive Care'],
      'Tahar Sfar University Hospital': ['Dermatology', 'Ophthalmology', 'ENT', 'Dentistry'],
      'Sfax University Hospital': ['Urology', 'Orthopedics', 'Physical Therapy', 'Lab Tests'],
      'La Rabta Hospital': ['General Medicine', 'Pediatrics', 'Vaccination']
    };
    return services[hospitalName] || [];
  };

  // Normalize region names for comparison
  const normalizeRegionName = (name) => {
    if (!name) return '';
    // First convert to lowercase
    let normalized = name.toString().toLowerCase().trim();
    // Remove any non-alphanumeric characters and standardize whitespace
    normalized = normalized
      .replace(/[éèêë]/g, 'e')
      .replace(/[àâä]/g, 'a')
      .replace(/[îï]/g, 'i')
      .replace(/[ôö]/g, 'o')
      .replace(/[ùûü]/g, 'u')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Standardize whitespace
      .trim();
    return normalized;
  };

  // Memoize filtered hospitals to prevent recalculation on every render
  const filteredHospitals = useMemo(() => {
    if (isLoading) return [];
    console.log('Filtering hospitals with:', { 
      selectedRegion, 
      radiologyType: bookingData?.radiologyType,
      totalHospitals: tunisiaHospitals.length
    });
    
    let result = [...tunisiaHospitals];
    
    // Filter by region if selected
    if (selectedRegion) {
      const normalizedSelectedRegion = normalizeRegionName(selectedRegion);
      console.log('Filtering by region:', {
        selectedRegion,
        normalizedSelectedRegion,
        totalHospitals: result.length
      });
      
      result = result.filter(hospital => {
        if (!hospital.region) {
          console.log('Hospital missing region:', hospital.name);
          return false;
        }
        
        const normalizedHospitalRegion = normalizeRegionName(hospital.region);
        const matches = normalizedHospitalRegion.includes(normalizedSelectedRegion) || 
                       normalizedSelectedRegion.includes(normalizedHospitalRegion);
        
        console.log({
          hospital: hospital.name,
          originalRegion: hospital.region,
          normalizedHospitalRegion,
          selectedRegion,
          normalizedSelectedRegion,
          matches
        });
        
        return matches;
      });
      
      console.log(`Found ${result.length} hospitals matching region "${selectedRegion}"`);
    }
    
    // Filter by radiology type if available in booking data
    if (bookingData?.radiologyType) {
      const requiredService = RADIOLOGY_SERVICES[bookingData.radiologyType];
      console.log('Required service for', bookingData.radiologyType, ':', requiredService);
      
      if (requiredService) {
        result = result.filter(hospital => {
          const hasService = hospital.services?.includes(requiredService) || 
                           hospital.type === 'university';
          
          if (!hasService) {
            console.log(`Filtered out hospital ${hospital.name} - missing service ${requiredService}`, {
              services: hospital.services,
              type: hospital.type
            });
          }
          
          return hasService;
        });
      }
    }
    
    console.log('Filtered hospitals result:', result);
    return result;
  }, [selectedRegion, bookingData?.radiologyType]);

  // Filter hospitals by search term if provided
  const searchedHospitals = searchTerm 
    ? filteredHospitals.filter(hospital => 
        [hospital.name, hospital.city, hospital.address || '']
          .some(field => field && field.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : filteredHospitals;

  const handleHospitalClick = (hospital) => {
    setSelectedHospital(hospital);
  };

  const handleSelectHospital = (hospital) => {
    console.log('Selected hospital:', hospital);
    
    if (!hospital) {
      console.error('No hospital provided to handleSelectHospital');
      return;
    }
    
    // Create a clean hospital data object
    const hospitalData = {
      center: {
        id: hospital.id || 'unknown',
        name: hospital.name || 'Nom non spécifié',
        address: hospital.address || '',
        city: hospital.city || '',
        region: hospital.region || 'Tunis',
        phone: hospital.phone || '',
        type: hospital.type || 'hospital'
      },
      region: hospital.region || 'Tunis',
      // Preserve radiology type if it exists
      ...(bookingData?.radiologyType ? { radiologyType: bookingData.radiologyType } : {})
    };
    
    console.log('Sending to onNext:', JSON.stringify(hospitalData, null, 2));
    
    // Call onNext with the hospital data and step 3
    if (typeof onNext === 'function') {
      onNext({
        ...hospitalData,
        step: 3 // This will trigger the step change in the parent component
      });
    } else {
      console.error('onNext is not a function:', onNext)
    }
  };

  const handleBack = () => {
    onBack();
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setSearchTerm('');
    setSelectedHospital(null);
  };

  const handleBackToRegions = () => {
    setSelectedRegion(null);
    setSearchTerm('');
    setSelectedHospital(null);
  };

  return (
    <div className="hospital-selection">
      <div className="header">
        <div className="flex items-center mb-4">
          <button 
            onClick={handleBack}
            className="mr-3 p-1 rounded-full hover:bg-gray-100"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2>{t('select_hospital', 'Select a Hospital')}</h2>
        </div>
        <p className="subtitle">{t('choose_hospital_from_list', 'Choose a hospital from the list below')}</p>
      </div>
      
      {selectedRegion ? (
        <div className="search-container">
          <button className="back-button" onClick={handleBackToRegions}>
            ← {t('back_to_regions', 'Back to Regions')}
          </button>
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder={t('search_hospitals_placeholder', 'Search hospitals...')}
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="selected-region">
            <h3>{selectedRegion}</h3>
            <span className="hospital-count">
              {t('hospitals_available', {
                count: searchedHospitals.length,
                defaultValue: '{{count}} hospitals available',
                defaultValue_plural: '{{count}} hospital available'
              })}
            </span>
          </div>
          
          <div className="hospitals-list">
            {searchedHospitals.map(hospital => {
              const distanceInfo = getDistanceInfo(hospital.name);
              const services = getServices(hospital.name);
              const isSelected = selectedHospital?.id === hospital.id;
              
              return (
                <div 
                  key={hospital.id}
                  className={`hospital-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleHospitalClick(hospital)}
                >
                  <div className="hospital-header">
                    <h3>{hospital.name}</h3>
                    {isSelected && <span className="selected-badge"><FaCheck /> {t('selected', 'Selected')}</span>}
                  </div>
                  
                  <div className="hospital-address">
                    <FaMapMarkerAlt className="icon" />
                    <span>{hospital.address || `${hospital.city}, ${hospital.region}`}</span>
                  </div>
                  
                  <div className="hospital-meta">
                    <span className="distance">
                      <FaMapMarker className="icon" />
                      {distanceInfo.distance} km • {distanceInfo.time} min
                    </span>
                    {hospital.phone && (
                      <span className="phone">
                        <FaPhone className="icon" /> {hospital.phone}
                      </span>
                    )}
                  </div>
                  
                  {services.length > 0 && (
                    <div className="services">
                      {services.slice(0, 3).map((service, idx) => (
                        <span key={idx} className="service-tag">{service}</span>
                      ))}
                      {services.length > 3 && (
                        <span className="more-tag">+{services.length - 3} {t('more', 'more')}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {selectedHospital && (
            <div className="selected-center-footer">
              <div className="selected-info">
                <span className="name">{selectedHospital.name}</span>
                <span className="address">• {selectedHospital.address || `${selectedHospital.city}, ${selectedHospital.region}`}</span>
              </div>
              <button 
                className="continue-button"
                onClick={() => handleSelectHospital(selectedHospital)}
              >
                {t('continue_with_city', 'Continue with {{city}}', { city: selectedHospital.city })}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="region-selection">
          <h3>{t('select_region', 'Select a Region')}</h3>
          <div className="regions-grid">
            {regions.map(region => (
              <button
                key={region}
                className="region-card"
                onClick={() => handleRegionSelect(region)}
              >
                {region}
                <span className="hospital-count">
                  ({t('hospitals_count', {
                    count: tunisiaHospitals.filter(h => h.region === region).length,
                    defaultValue: '{{count}} hospital',
                    defaultValue_plural: '{{count}} hospitals'
                  })})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TunisiaHospitalSelection;
