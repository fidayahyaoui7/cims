import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { useBooking } from '../../../contexts/BookingContext';

const RegionSelection = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { bookingData, updateBookingData } = useBooking();
  const [selectedRegion, setSelectedRegion] = useState(bookingData?.region || null);
  
  // List of Tunisian regions
  const regions = useMemo(() => [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan',
    'Bizerte', 'Béja', 'Jendouba', 'Kef', 'Siliana', 'Kairouan',
    'Kasserine', 'Sidi Bouzid', 'Sousse', 'Monastir', 'Mahdia',
    'Sfax', 'Gafsa', 'Tozeur', 'Kebili', 'Gabès', 'Medenine', 'Tataouine'
  ], []);

  const handleSelectRegion = (region) => {
    setSelectedRegion(region);
  };

  const handleNext = () => {
    if (!selectedRegion) return;
    
    updateBookingData({
      ...bookingData,
      region: selectedRegion,
      step: 3 // Move to center selection
    });
    
    onNext({ region: selectedRegion });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('select_region')}
        </h2>
        <p className="text-gray-600">
          {t('select_region_description')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => handleSelectRegion(region)}
            className={`p-4 border rounded-lg text-left transition-all ${
              selectedRegion === region
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2 text-blue-500" />
              <span>{region}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          {t('back')}
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedRegion}
          className={`px-6 py-2 rounded-md text-white ${
            selectedRegion
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {t('next')} <FaArrowRight className="inline ml-1" />
        </button>
      </div>
    </div>
  );
};

export default RegionSelection;
