import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaChevronRight, FaMapMarkerAlt } from 'react-icons/fa';
import { tunisiaRegions, getHospitalsByRegion } from '../../../data/tunisiaHospitals';

const RegionSelector = ({ onSelectRegion }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get regions data with hospital counts
  const regionsData = useMemo(() => {
    return tunisiaRegions.map(region => ({
      id: region.id,
      name: region.name,
      count: region.hospitals.length
    }));
  }, []);
  
  // Filter regions based on search term
  const filteredRegions = useMemo(() => {
    if (!searchTerm.trim()) return regionsData;
    
    const term = searchTerm.toLowerCase();
    return regionsData.filter(region => 
      region.name.toLowerCase().includes(term)
    );
  }, [regionsData, searchTerm]);
  
  const handleRegionSelect = (regionId) => {
    const region = tunisiaRegions.find(r => r.id === regionId);
    if (region) {
      onSelectRegion(region);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('select_region') || 'Sélectionnez votre région'}
        </h2>
        <p className="text-gray-600">
          {t('select_region_description') || 'Choisissez votre région pour afficher les centres disponibles'}
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={t('search_region_placeholder') || 'Rechercher une région...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Regions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRegions.map((region) => (
          <button
            key={region.id}
            onClick={() => handleRegionSelect(region.id)}
            className="flex items-center justify-between w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <FaMapMarkerAlt className="h-5 w-5 text-blue-500 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">{region.name}</h3>
                <p className="text-sm text-gray-500">
                  {region.count} {region.count === 1 ? 'hôpital' : 'hôpitaux'}
                </p>
              </div>
            </div>
            <FaChevronRight className="h-4 w-4 text-gray-400" />
          </button>
        ))}
      </div>
      
      {filteredRegions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {t('no_regions_found') || 'Aucune région trouvée'}
          </p>
        </div>
      )}
    </div>
  );
};

export default RegionSelector;
