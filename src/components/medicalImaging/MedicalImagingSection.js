import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaXRay, FaProcedures, FaClinicMedical, FaHospitalAlt, FaInfoCircle } from 'react-icons/fa';

const MedicalImagingSection = () => {
  const { t } = useTranslation();

  const medicalImagingStats = [
    { 
      id: 1, 
      name: t('medicalImaging.xray'), 
      icon: <FaXRay className="text-blue-500 text-2xl" />,
      description: t('medicalImaging.xrayDesc'),
      availability: t('medicalImaging.widelyAvailable'),
      notes: t('medicalImaging.xrayNotes')
    },
    { 
      id: 2, 
      name: t('medicalImaging.ultrasound'), 
      icon: <FaProcedures className="text-green-500 text-2xl" />,
      description: t('medicalImaging.ultrasoundDesc'),
      availability: t('medicalImaging.highCoverage'),
      notes: t('medicalImaging.ultrasoundNotes')
    },
    { 
      id: 3, 
      name: t('medicalImaging.ct'), 
      icon: <FaClinicMedical className="text-purple-500 text-2xl" />,
      description: t('medicalImaging.ctDesc'),
      availability: t('medicalImaging.ctAvailability'),
      notes: t('medicalImaging.ctNotes')
    },
    { 
      id: 4, 
      name: t('medicalImaging.mri'), 
      icon: <FaHospitalAlt className="text-red-500 text-2xl" />,
      description: t('medicalImaging.mriDesc'),
      availability: t('medicalImaging.mriAvailability'),
      notes: t('medicalImaging.mriNotes')
    },
    { 
      id: 5, 
      name: t('medicalImaging.petct'), 
      icon: <FaInfoCircle className="text-yellow-500 text-2xl" />,
      description: t('medicalImaging.petctDesc'),
      availability: t('medicalImaging.singleCenter'),
      notes: t('medicalImaging.petctNotes')
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('medicalImaging.title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('medicalImaging.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicalImagingStats.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-opacity-20 rounded-full mr-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold">{item.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="space-y-2 text-sm text-gray-500">
                <p><span className="font-medium">{t('medicalImaging.availability')}:</span> {item.availability}</p>
                <p><span className="font-medium">{t('medicalImaging.notes')}:</span> {item.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MedicalImagingSection;
