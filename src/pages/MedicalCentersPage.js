import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaHospital, FaClinicMedical, FaUniversity, FaXRay, FaProcedures, FaClinicMedical as FaClinic } from 'react-icons/fa';
import { GiMedicines, GiStethoscope } from 'react-icons/gi';
import { BsHospitalFill, BsClipboardPulse, BsHospital } from 'react-icons/bs';

const MedicalCentersPage = () => {
  const { t } = useTranslation();
  
  const radiologyTypes = [
    {
      id: 'xray',
      title: t('radiology.xray', 'X-ray'),
      description: t('radiology.xray_desc', 'Widely available for bones, chest, and trauma cases'),
      icon: <FaXRay className="text-blue-500 text-3xl mb-3" />
    },
    {
      id: 'ultrasound',
      title: t('radiology.ultrasound', 'Ultrasound'),
      description: t('radiology.ultrasound_desc', 'Used for abdominal, obstetric, and soft tissue examinations'),
      icon: <GiStethoscope className="text-blue-500 text-3xl mb-3" />
    },
    {
      id: 'mammography',
      title: t('radiology.mammography', 'Mammography'),
      description: t('radiology.mammography_desc', 'Available in regional and university hospitals for breast cancer screening'),
      icon: <FaClinicMedical className="text-blue-500 text-3xl mb-3" />
    },
    {
      id: 'ct',
      title: t('radiology.ct', 'CT Scan'),
      description: t('radiology.ct_desc', 'Available in regional and university hospitals for trauma and diagnostics'),
      icon: <BsClipboardPulse className="text-blue-500 text-3xl mb-3" />
    },
    {
      id: 'mri',
      title: t('radiology.mri', 'MRI'),
      description: t('radiology.mri_desc', 'Concentrated in university hospitals for specialized diagnostics'),
      icon: <FaProcedures className="text-blue-500 text-3xl mb-3" />
    },
    {
      id: 'petct',
      title: t('radiology.petct', 'PET-CT'),
      description: t('radiology.petct_desc', 'Specialized nuclear imaging for oncology at select centers'),
      icon: <FaClinic className="text-blue-500 text-3xl mb-3" />
    }
  ];

  const hospitalCategories = [
    {
      id: 'district',
      title: t('hospitals.district', 'District Hospitals'),
      description: t('hospitals.district_desc', 'Basic imaging services: X-ray and ultrasound. Primarily serving rural areas and small towns.'),
      icon: <FaClinicMedical className="text-4xl text-blue-500 mb-3" />
    },
    {
      id: 'regional',
      title: t('hospitals.regional', 'Regional Hospitals'),
      description: t('hospitals.regional_desc', 'Broader range of services: X-ray, ultrasound, CT scan, mammography. At least one per governorate.'),
      icon: <BsHospital className="text-4xl text-blue-500 mb-3" />
    },
    {
      id: 'university',
      title: t('hospitals.university', 'University Hospitals (CHU)'),
      description: t('hospitals.university_desc', 'Full range of radiology services including CT, MRI, and specialized procedures. Mainly located in major cities.'),
      icon: <FaUniversity className="text-4xl text-blue-500 mb-3" />
    }
  ];

  const statistics = [
    { equipment: 'X-ray', availability: t('stats.widely_available', 'Widely available'), notes: t('stats.available_all', 'Available in all hospitals') },
    { equipment: 'Ultrasound', availability: t('stats.high_coverage', 'High coverage'), notes: t('stats.used_for', 'Used for obstetrics and abdominal examinations') },
    { equipment: 'CT Scanner', availability: '~9 ' + t('stats.per_million', 'per million'), notes: t('stats.available_regional', 'Available in regional hospitals and CHUs') },
    { equipment: 'MRI', availability: '~2 ' + t('stats.per_million', 'per million'), notes: t('stats.mainly_chu', 'Mainly in CHUs') },
    { equipment: 'PET-CT', availability: t('stats.one_national', '1 national center'), notes: t('stats.specialized_center', 'At specialized centers in major cities') }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('medical_centers.title', 'Medical Centers of Tunisia')}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            {t('medical_centers.subtitle', 'Find and book appointments at trusted medical centers across Tunisia')}
          </p>
        </div>
      </div>

      {/* Overview Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              {t('overview.title', 'Tunisian Healthcare System')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('overview.description', 'Tunisia has a well-structured system of public hospitals offering medical imaging and radiology services. Hospitals are classified into district hospitals, regional hospitals, and university hospitals (CHU). Available services range from basic X-rays and ultrasounds to advanced techniques like CT scans, MRIs, PET-CT, and interventional radiology. The public health sector represents over 80% of hospital beds nationwide. Each governorate has at least one regional hospital equipped with radiology services, while major cities like Tunis, Sousse, Monastir, and Sfax are home to university hospitals with advanced technologies.')}
            </p>
          </div>
        </div>
      </section>

      {/* Radiology Types Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {t('radiology.available_services', 'Available Radiology Services')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {radiologyTypes.map((type) => (
              <div key={type.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="text-center">
                    {type.icon}
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{type.title}</h3>
                    <p className="text-gray-600">{type.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hospital Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {t('hospitals.by_category', 'Hospitals by Category')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hospitalCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
                <div className="text-center">
                  {category.icon}
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{category.title}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {t('stats.radiology_stats', 'Radiology Statistics')}
          </h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('stats.equipment', 'Equipment')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('stats.availability', 'Availability')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('stats.notes', 'Notes')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {statistics.map((stat, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {stat.equipment}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stat.availability}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {stat.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default MedicalCentersPage;
