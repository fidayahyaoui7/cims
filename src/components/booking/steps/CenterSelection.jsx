import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useBooking } from '../../../contexts/BookingContext';
import { FaSearch, FaMapMarkerAlt, FaPhone, FaHospital, FaArrowRight, FaArrowLeft, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CenterSelection = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { bookingData, updateBookingData } = useBooking();
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for hospitals
  const mockHospitals = [
    {
      id: '1',
      name: 'Hôpital Charles Nicolle',
      address: 'Boulevard 9 Avril, Tunis 1006',
      city: 'Tunis',
      region: 'Tunis',
      phone: '+216 71 578 000',
      type: 'public',
      rating: 4.2,
      services: ['Radiologie', 'IRM', 'Scanner', 'Échographie'],
      distance: '2.5',
      travelTime: '10'
    },
    {
      id: '2',
      name: 'Clinique Les Berges du Lac',
      address: 'Les Berges du Lac, Tunis 1053',
      city: 'Tunis',
      region: 'Tunis',
      phone: '+216 71 196 000',
      type: 'private',
      rating: 4.5,
      services: ['IRM', 'Scanner', 'Mammographie', 'Échographie'],
      distance: '3.1',
      travelTime: '12'
    },
    {
      id: '3',
      name: 'Hôpital La Rabta',
      address: 'Bab Saadoun, Tunis 1007',
      city: 'Tunis',
      region: 'Tunis',
      phone: '+216 71 573 000',
      type: 'public',
      rating: 4.0,
      services: ['Radiologie', 'Scanner', 'Mammographie'],
      distance: '3.8',
      travelTime: '15'
    }
  ];
  
  // Filter hospitals by selected region and radiology type
  const filteredHospitals = useMemo(() => {
    if (!bookingData.region) return [];
    
    return mockHospitals.filter(hospital => 
      hospital.region === bookingData.region &&
      hospital.services.some(service => 
        service.toLowerCase().includes((bookingData.radiologyType || '').toLowerCase())
      )
    );
  }, [bookingData.region, bookingData.radiologyType]);
  
  // Filter by search term
  const displayedHospitals = useMemo(() => {
    if (!searchTerm) return filteredHospitals;
    
    const term = searchTerm.toLowerCase();
    return filteredHospitals.filter(hospital => 
      hospital.name.toLowerCase().includes(term) ||
      hospital.address.toLowerCase().includes(term) ||
      hospital.services.some(service => service.toLowerCase().includes(term))
    );
  }, [filteredHospitals, searchTerm]);
  
  const handleSelectCenter = (center) => {
    setSelectedCenter(center);
  };
  
  const handleNext = () => {
    if (!selectedCenter) return;
    
    updateBookingData({
      ...bookingData,
      center: selectedCenter,
      step: 4 // Move to date/time selection
    });
    
    onNext({ center: selectedCenter });
  };
  
  const getTypeLabel = (type) => {
    switch (type) {
      case 'public':
        return t('public_hospital');
      case 'private':
        return t('private_clinic');
      case 'university':
        return t('university_hospital');
      default:
        return type;
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('select_center')}</h2>
      
      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder={t('search_centers_placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Hospitals list */}
      <div className="space-y-4 mb-6">
        {displayedHospitals.length > 0 ? (
          displayedHospitals.map((hospital) => (
            <motion.div
              key={hospital.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedCenter?.id === hospital.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleSelectCenter(hospital)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{hospital.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <FaMapMarkerAlt className="mr-1.5" />
                    {hospital.address}
                  </p>
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                      {getTypeLabel(hospital.type)}
                    </span>
                    <span className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      {hospital.rating}
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span>{hospital.distance} km • {hospital.travelTime} min</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {hospital.services.slice(0, 3).map((service) => (
                      <span key={service} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {service}
                      </span>
                    ))}
                    {hospital.services.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                        +{hospital.services.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <a 
                    href={`tel:${hospital.phone}`}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaPhone className="mr-1" /> {hospital.phone}
                  </a>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <FaHospital className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {t('no_centers_found')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {t('no_centers_match_filters')}
            </p>
          </div>
        )}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          {t('back')}
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!selectedCenter}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            selectedCenter 
              ? 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {t('next')}
          <FaArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('select_center')}</h2>
      
      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder={t('search_centers_placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Hospitals list */}
      <div className="space-y-4 mb-6">
        {displayedHospitals.length > 0 ? (
          displayedHospitals.map((hospital) => (
            <motion.div
              key={hospital.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedCenter?.id === hospital.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleSelectCenter(hospital)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{hospital.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <FaMapMarkerAlt className="mr-1.5" />
                    {hospital.address}
                  </p>
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                      {getTypeLabel(hospital.type)}
                    </span>
                    <span className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      {hospital.rating}
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span>{hospital.distance} km • {hospital.travelTime} min</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {hospital.services.slice(0, 3).map((service) => (
                      <span key={service} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {service}
                      </span>
                    ))}
                    {hospital.services.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                        +{hospital.services.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <a 
                    href={`tel:${hospital.phone}`}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaPhone className="mr-1" /> {hospital.phone}
                  </a>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <FaHospital className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {t('no_centers_found')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {t('no_centers_match_filters')}
            </p>
          </div>
        )}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          {t('back')}
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!selectedCenter}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            selectedCenter 
              ? 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {t('next')}
          <FaArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CenterSelection;
