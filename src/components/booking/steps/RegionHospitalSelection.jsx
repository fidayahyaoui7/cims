import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaMapMarkerAlt, 
  FaHospital, 
  FaChevronLeft, 
  FaSearch, 
  FaStar, 
  FaChevronRight,
  FaFilter,
  FaTimes,
  FaPhone,
  FaGlobe,
  FaMapMarkedAlt
} from 'react-icons/fa';
import { getHospitalsByRegion } from '../../../data/tunisiaHospitalsComplete';
import RegionSelector from './RegionSelector';

const RegionHospitalSelection = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hospital types for filtering
  const hospitalTypes = [
    { id: 'all', name: t('all_types') },
    { id: 'public', name: t('public_hospitals') },
    { id: 'university', name: t('university_hospitals') },
    { id: 'regional', name: t('regional_hospitals') }
  ];

  // Get hospitals by region
  const hospitalsByRegion = useMemo(() => {
    const hospitalsMap = getHospitalsByRegion();
    
    // Sort hospitals within each region
    Object.values(hospitalsMap).forEach(hospitals => {
      hospitals.sort((a, b) => a.name.localeCompare(b.name));
    });

    return hospitalsMap;
  }, []);

  // Filter hospitals based on search query and selected filters
  const filteredHospitals = useMemo(() => {
    if (!selectedRegion) return [];
    
    // Get hospitals for the selected region
    let hospitals = [...(hospitalsByRegion[selectedRegion] || [])];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      hospitals = hospitals.filter(hospital => 
        hospital.name.toLowerCase().includes(query) ||
        (hospital.city && hospital.city.toLowerCase().includes(query)) ||
        (hospital.services && hospital.services.some(service => 
          service.toLowerCase().includes(query)
        ))
      );
    }
    
    // Apply type filter
    if (selectedType !== 'all') {
      hospitals = hospitals.filter(hospital => {
        const name = hospital.name.toLowerCase();
        
        switch(selectedType) {
          case 'public':
            // Public hospitals are those that are not university or regional
            return !name.includes('universitaire') && 
                   !name.includes('chu') && 
                   !name.includes('régional') && 
                   !name.includes('regional');
            
          case 'university':
            // University hospitals contain 'Universitaire' or 'CHU' in their name
            return name.includes('universitaire') || name.includes('chu');
            
          case 'regional':
            // Regional hospitals contain 'Régional' or 'Région' in their name
            return name.includes('régional') || name.includes('region');
            
          default:
            return true;
        }
      });
    }
    
    return hospitals;
  }, [selectedRegion, searchQuery, selectedType, hospitalsByRegion]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
    setLoading(false);
  }, []);

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setSelectedHospital(null);
    setSearchQuery('');
  };

  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital);
  };

  const handleNext = () => {
    if (selectedRegion && selectedHospital) {
      // Save to localStorage
      localStorage.setItem('selectedRegion', selectedRegion);
      localStorage.setItem('selectedHospital', JSON.stringify(selectedHospital));
      
      // Call onNext with the selected hospital data
      if (typeof onNext === 'function') {
        onNext({
          region: selectedRegion,
          hospital: selectedHospital
        });
      }
    } else if (selectedRegion && !selectedHospital) {
      // If we have a region but no hospital selected, ensure we have a hospital selected
      const hospitals = filteredHospitals;
      if (hospitals.length > 0) {
        setSelectedHospital(hospitals[0]);
      }
    }
  };

  const handleBack = () => {
    if (selectedRegion) {
      setSelectedRegion(null);
      setSelectedHospital(null);
    } else if (onBack) {
      onBack();
    }
  };

  // Get hospital count by type for the selected region
  const getHospitalCountByType = (type) => {
    if (!selectedRegion) return 0;
    
    const hospitals = hospitalsByRegion[selectedRegion] || [];
    
    if (type === 'all') return hospitals.length;
    
    if (type === 'public') {
      return hospitals.filter(hospital => hospital.type === 'public').length;
   
    } else if (type === 'university') {
      return hospitals.filter(hospital => 
        hospital.name.toLowerCase().includes('universitaire') || 
        hospital.name.includes('CHU')
      ).length;
    } else if (type === 'regional') {
      return hospitals.filter(hospital => 
        hospital.name.toLowerCase().includes('régional') || 
        hospital.name.toLowerCase().includes('region')
      ).length;
    }
    
    return 0;
  };

  // Render hospital details
  const renderHospitalDetails = (hospital) => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{hospital.name}</h3>
            <p className="text-gray-600 mt-1">{hospital.address}</p>
            {hospital.city && <p className="text-gray-500 text-sm">{hospital.city}</p>}
          </div>
          <div className="flex items-center">
            <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              <FaStar className="text-yellow-400 mr-1" />
              <span>{hospital.rating || '4.5'}</span>
            </div>
          </div>
        </div>

        {(hospital.phone || hospital.emergencyPhone || hospital.website) && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hospital.phone && (
                <div className="flex items-center text-gray-700">
                  <FaPhone className="text-gray-400 mr-2" />
                  <a href={`tel:${hospital.phone}`} className="hover:text-blue-600">
                    {hospital.phone}
                  </a>
                </div>
              )}
              {hospital.emergencyPhone && (
                <div className="flex items-center text-red-600">
                  <FaPhone className="mr-2" />
                  <span className="font-medium">Urgence: </span>
                  <a href={`tel:${hospital.emergencyPhone}`} className="ml-1 hover:underline">
                    {hospital.emergencyPhone}
                  </a>
                </div>
              )}
              {hospital.website && (
                <div className="flex items-center text-blue-600">
                  <FaGlobe className="mr-2 text-gray-400" />
                  <a 
                    href={hospital.website.startsWith('http') ? hospital.website : `https://${hospital.website}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {hospital.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {hospital.services && hospital.services.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Services disponibles</h4>
          <div className="flex flex-wrap gap-2">
            {hospital.services.map((service, idx) => (
              <span key={idx} className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                {service}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          onClick={() => onNext({ hospital })}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg flex items-center"
        >
          {t('select') || 'Sélectionner'}
          <FaChevronRight className="ml-2" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {!selectedRegion ? (
        <RegionSelector onSelectRegion={handleRegionSelect} />
      ) : (
        <div>
          {/* Back button */}
          <button
            onClick={() => setSelectedRegion(null)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <FaChevronLeft className="mr-1" />
            {t('back_to_regions') || 'Retour aux régions'}
          </button>
          
          {/* Region header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedRegion}</h2>
              <p className="text-gray-600">
                {filteredHospitals.length} {t('hospitals_available') || 'centres disponibles'}
              </p>
            </div>
            
            {/* Search and filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={t('search_hospitals') || 'Rechercher un centre...'}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <FaFilter className="h-4 w-4 mr-2" />
                  {t('filter') || 'Filtrer'}
                </button>
                
                {showFilters && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                    <div className="p-3 border-b border-gray-200">
                      <h4 className="font-medium text-gray-900">Type d'établissement</h4>
                    </div>
                    <div className="p-2 space-y-2">
                      {hospitalTypes.map((type) => (
                        <div 
                          key={type.id} 
                          className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                          onClick={() => setSelectedType(type.id)}
                        >
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                            selectedType === type.id 
                              ? 'border-blue-500 bg-blue-500' 
                              : 'border-gray-300'
                          }`}>
                            {selectedType === type.id && (
                              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <label
                            className="flex-1 flex justify-between items-center cursor-pointer"
                          >
                            <span className="text-sm text-gray-700">{type.name}</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              {getHospitalCountByType(type.id)}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Hospitals list */}
          <div className="space-y-4">
            {filteredHospitals.length > 0 ? (
              filteredHospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start">
                          <div className="bg-blue-100 p-2 rounded-lg mr-4">
                            <FaHospital className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <FaMapMarkerAlt className="mr-1.5 flex-shrink-0" />
                              <span>{hospital.address}, {hospital.city}</span>
                            </div>
                            
                            {hospital.phone && (
                              <div className="mt-2 flex items-center text-sm">
                                <FaPhone className="text-gray-400 mr-2" />
                                <a href={`tel:${hospital.phone}`} className="text-blue-600 hover:underline">
                                  {hospital.phone}
                                </a>
                              </div>
                            )}
                            
                            {hospital.services && hospital.services.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {hospital.services.slice(0, 3).map((service, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {service}
                                  </span>
                                ))}
                                {hospital.services.length > 3 && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    +{hospital.services.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-end">
                        <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span>{hospital.rating || '4.5'}</span>
                        </div>
                        
                        <button
                          onClick={() => onNext({ hospital })}
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          {t('select') || 'Sélectionner'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <FaHospital className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  {t('no_hospitals_found') || 'Aucun centre trouvé'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t('try_different_search') || 'Essayez de modifier vos critères de recherche'}
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedType('all');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {t('reset_filters') || 'Réinitialiser les filtres'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionHospitalSelection;
