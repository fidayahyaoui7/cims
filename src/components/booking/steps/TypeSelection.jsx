import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaXRay, FaBrain, FaProcedures, FaTeeth, FaHeartbeat, FaSyringe, FaArrowRight } from 'react-icons/fa';
import HospitalSelection from './HospitalSelection';

const TypeSelection = ({ onNext }) => {
  const { t } = useTranslation();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  
  const radiologyTypes = [
    { 
      id: 'xray', 
      icon: <FaXRay className="text-2xl" />,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      text: 'text-blue-100',
      key: 'type_xray',
      price: '40-80 DT',
      description: t('type_xray_description')
    },
    { 
      id: 'mri', 
      icon: <FaBrain className="text-2xl" />,
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      hoverColor: 'hover:from-indigo-600 hover:to-indigo-700',
      text: 'text-indigo-100',
      key: 'type_mri',
      price: '250-400 DT',
      description: t('type_mri_description')
    },
    { 
      id: 'ct', 
      icon: <FaProcedures className="text-2xl" />,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      text: 'text-purple-100',
      key: 'type_ct',
      price: '180-300 DT',
      description: t('type_ct_description')
    },
    { 
      id: 'ultrasound', 
      icon: <FaTeeth className="text-2xl" />,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      text: 'text-green-100',
      key: 'type_ultrasound',
      price: '60-120 DT',
      description: t('type_ultrasound_description')
    },
    { 
      id: 'mammography', 
      icon: <FaProcedures className="text-2xl" />,
      color: 'bg-gradient-to-r from-pink-500 to-pink-600',
      hoverColor: 'hover:from-pink-600 hover:to-pink-700',
      text: 'text-pink-100',
      key: 'type_mammography',
      price: '120-200 DT',
      description: t('type_mammography_description')
    },
    { 
      id: 'petct', 
      icon: <FaHeartbeat className="text-2xl" />,
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      hoverColor: 'hover:from-red-600 hover:to-red-700',
      text: 'text-red-100',
      key: 'type_petct',
      price: '800-1200 DT',
      description: t('type_petct_description')
    },
    { 
      id: 'interventional', 
      icon: <FaSyringe className="text-2xl" />,
      color: 'bg-gradient-to-r from-amber-500 to-amber-600',
      hoverColor: 'hover:from-amber-600 hover:to-amber-700',
      text: 'text-amber-100',
      key: 'type_interventional',
      price: 'Varies',
      description: t('type_interventional_description')
    }
  ];

  const handleSelectType = (type) => {
    setSelectedType(type);
    onNext({ 
      radiologyType: type,
      step: 2, // Move to region selection (next step in the flow)
      center: null, // Clear any previous center selection
      region: null  // Clear any previous region selection
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          {t('select_exam_type')}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('select_exam_type_description')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {radiologyTypes.map((type) => {
          const title = t(type.key).split(':')[0];
          
          return (
            <div 
              key={type.id}
              onClick={() => handleSelectType(type.id)}
              onMouseEnter={() => setHoveredCard(type.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden h-full flex flex-col group cursor-pointer ${
                selectedType === type.id ? 'ring-2 ring-blue-500' : 'hover:border-blue-300'
              }`}
            >
              {/* Header with colored accent */}
              <div 
                className={`h-2 w-full ${type.color.replace('bg-gradient-to-r', 'bg-gradient-to-r')}`}
              ></div>
              
              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Icon and Price */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg ${type.color.replace('bg-gradient-to-r', 'bg-gradient-to-r')} text-white`}>
                    {React.cloneElement(type.icon, { className: 'text-xl' })}
                  </div>
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                    {type.price}
                  </span>
                </div>
                
                {/* Title and Description */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {type.description}
                  </p>
                </div>
                
                {/* Select Button */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button 
                    className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium ${
                      selectedType === type.id 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    } transition-colors duration-200`}
                  >
                    {selectedType === type.id ? (
                      <>
                        <span>{t('selected')}</span>
                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>{t('select')}</span>
                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TypeSelection;
