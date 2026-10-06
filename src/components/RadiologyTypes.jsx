import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaXRay, FaProcedures, FaUserMd, FaClinicMedical, FaBrain, FaHeartbeat, FaSyringe } from 'react-icons/fa';

const RadiologyTypes = ({ onTypeSelect }) => {
  const { t } = useTranslation();

  const types = [
    {
      id: 'xray',
      icon: <FaXRay className="text-4xl mb-3" />,
      color: 'from-blue-500 to-blue-600',
      border: 'border-blue-500',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      key: 'type_xray'
    },
    {
      id: 'ultrasound',
      icon: <FaProcedures className="text-4xl mb-3" />,
      color: 'from-green-500 to-green-600',
      border: 'border-green-500',
      bg: 'bg-green-50',
      text: 'text-green-800',
      key: 'type_ultrasound'
    },
    {
      id: 'mammography',
      icon: <FaClinicMedical className="text-4xl mb-3" />,
      color: 'from-pink-500 to-pink-600',
      border: 'border-pink-500',
      bg: 'bg-pink-50',
      text: 'text-pink-800',
      key: 'type_mammography'
    },
    {
      id: 'ct',
      icon: <FaProcedures className="text-4xl mb-3" />,
      color: 'from-purple-500 to-purple-600',
      border: 'border-purple-500',
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      key: 'type_ct'
    },
    {
      id: 'mri',
      icon: <FaBrain className="text-4xl mb-3" />,
      color: 'from-indigo-500 to-indigo-600',
      border: 'border-indigo-500',
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      key: 'type_mri'
    },
    {
      id: 'petct',
      icon: <FaHeartbeat className="text-4xl mb-3" />,
      color: 'from-red-500 to-red-600',
      border: 'border-red-500',
      bg: 'bg-red-50',
      text: 'text-red-800',
      key: 'type_petct'
    },
    {
      id: 'interventional',
      icon: <FaSyringe className="text-4xl mb-3" />,
      color: 'from-amber-500 to-amber-600',
      border: 'border-amber-500',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      key: 'type_interventional'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
        {t('radiology_types_title')}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {types.map((type) => {
          const description = t(type.key);
          const [title, ...descParts] = description.split(':');
          const descriptionText = descParts.join(':').trim();
          
          return (
            <div 
              key={type.id}
              onClick={() => onTypeSelect && onTypeSelect(type.id)}
              className={`group relative overflow-hidden rounded-xl border ${type.border} ${type.bg} p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full flex flex-col`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              
              <div className="relative z-10 flex-1 flex flex-col">
                <div className={`w-16 h-16 rounded-full ${type.bg} flex items-center justify-center mb-4 mx-auto`}>
                  {type.icon}
                </div>
                
                <h3 className="text-xl font-semibold mb-2 text-center">
                  {title}
                </h3>
                
                <p className={`${type.text} text-center text-sm flex-1`}>
                  {descriptionText}
                </p>
                
                <div className="mt-4 pt-4 border-t border-opacity-20 border-gray-500">
                  <p className="text-xs text-gray-600 text-center">
                    {t('click_to_select')}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RadiologyTypes;
