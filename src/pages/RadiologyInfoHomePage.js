import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaXRay, FaProcedures, FaClinicMedical, FaUserMd, FaHospital, FaChartBar } from 'react-icons/fa';

const RadiologyInfoHomePage = () => {
  const { t } = useTranslation();

  const radiologyServices = [
    {
      icon: <FaXRay className="text-4xl text-blue-600 mb-2" />,
      title: t('equip_xray') || 'X-ray',
      description: t('type_xray') || 'Widely available for bones, chest, and trauma cases.'
    },
    {
      icon: <FaProcedures className="text-4xl text-blue-600 mb-2" />,
      title: t('equip_ultrasound') || 'Ultrasound',
      description: t('type_ultrasound') || 'Used for abdominal, obstetric, and soft tissue examinations.'
    },
    {
      icon: <FaClinicMedical className="text-4xl text-blue-600 mb-2" />,
      title: t('equip_mammography') || 'Mammography',
      description: t('type_mammography') || 'Available in regional and university hospitals for breast cancer screening.'
    },
    {
      icon: <FaUserMd className="text-4xl text-blue-600 mb-2" />,
      title: 'CT Scan',
      description: t('type_ct') || 'Available in regional and university hospitals for trauma, oncology, and complex diagnostics.'
    },
    {
      icon: <FaHospital className="text-4xl text-blue-600 mb-2" />,
      title: 'MRI',
      description: t('type_mri') || 'Concentrated in university hospitals for specialized diagnostics.'
    },
    {
      icon: <FaChartBar className="text-4xl text-blue-600 mb-2" />,
      title: 'PET-CT',
      description: t('type_petct') || 'Specialized nuclear imaging, available at Institut Salah Azaiez for oncology.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-4">
            {t('radiology_info.title') || 'Radiology Services in Tunisia'}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t('radiology_info.subtitle') || 'Comprehensive radiology services across public and private healthcare facilities'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Services Overview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t('radiology_info.available_services') || 'Available Radiology Services'}
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {radiologyServices.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hospital Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t('radiology_info.hospital_categories') || 'Hospital Categories'}
          </h2>
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">{t('district_hospitals') || 'District Hospitals'}</h3>
              <p className="text-gray-600">
                {t('district_hospitals_desc') || 'Basic imaging services including X-ray and ultrasound. Primarily serving rural areas and small towns.'}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">{t('regional_hospitals') || 'Regional Hospitals'}</h3>
              <p className="text-gray-600">
                {t('regional_hospitals_desc') || 'Broader range of services including X-ray, ultrasound, CT scan, and mammography. At least one per governorate.'}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">{t('university_hospitals') || 'University Hospitals (CHU)'}</h3>
              <p className="text-gray-600">
                {t('university_hospitals_desc') || 'Full range of radiology services including CT, MRI, PET-CT, interventional radiology, and research facilities. Mainly located in major cities.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadiologyInfoHomePage;
