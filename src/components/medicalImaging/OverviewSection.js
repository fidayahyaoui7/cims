import React from 'react';
import { FaHospital, FaStethoscope, FaUniversity, FaXRay, FaProcedures, FaClinicMedical, FaUserMd, FaChartBar, FaMapMarkedAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const OverviewSection = () => {
  const radiologyTypes = [
    {
      icon: <FaXRay className="text-2xl text-blue-600" />,
      title: 'X-ray',
      description: 'Widely available for bones, chest, and trauma cases.'
    },
    {
      icon: <FaProcedures className="text-2xl text-blue-600" />,
      title: 'Ultrasound',
      description: 'Used for abdominal, obstetric, and soft tissue examinations.'
    },
    {
      icon: <FaClinicMedical className="text-2xl text-blue-600" />,
      title: 'Mammography',
      description: 'Available in regional and university hospitals for breast cancer screening.'
    },
    {
      icon: <FaUserMd className="text-2xl text-blue-600" />,
      title: 'CT Scan',
      description: 'Available in regional and university hospitals for trauma, oncology, and complex diagnostics.'
    },
    {
      icon: <FaHospital className="text-2xl text-blue-600" />,
      title: 'MRI',
      description: 'Concentrated in university hospitals for neurology, orthopedics, and oncology.'
    },
    {
      icon: <FaChartBar className="text-2xl text-blue-600" />,
      title: 'PET-CT',
      description: 'Specialized nuclear imaging, available at Institut Salah Azaiez for oncology.'
    }
  ];

  const hospitalCategories = [
    {
      icon: <FaHospital className="text-2xl text-blue-600" />,
      title: 'District Hospitals',
      description: 'Basic imaging services: X-ray and ultrasound. Primarily serving rural areas and small towns.'
    },
    {
      icon: <FaStethoscope className="text-2xl text-blue-600" />,
      title: 'Regional Hospitals',
      description: 'Broader range of services: X-ray, ultrasound, CT scan, mammography. At least one per governorate.'
    },
    {
      icon: <FaUniversity className="text-2xl text-blue-600" />,
      title: 'University Hospitals (CHU)',
      description: 'Full range of radiology: CT, MRI, PET-CT (oncology), interventional radiology, training & research. Mainly located in Tunis, Sousse, Monastir, and Sfax.'
    }
  ];

  const radiologyStats = [
    { equipment: 'X-ray', availability: 'Widely available', notes: 'Available in all hospitals' },
    { equipment: 'Ultrasound', availability: 'High coverage', notes: 'Used for obstetrics and abdominal examinations' },
    { equipment: 'CT Scanner', availability: '~9 per million', notes: 'Available in regional hospitals and CHUs' },
    { equipment: 'MRI', availability: '~2 per million', notes: 'Mainly in CHUs' },
    { equipment: 'PET-CT', availability: '1 national center', notes: 'At Institut Salah Azaiez in Tunis' }
  ];

  return (
    <section id="overview" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Medical Centers of Tunisia
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            Find medical centers and book appointments across Tunisia
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto my-6"></div>
          
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Tunisian Healthcare System</h3>
          <p className="text-lg text-gray-700 mb-8 text-left">
            Tunisia has a well-structured system of public hospitals offering medical imaging and radiology services. Hospitals are classified into district hospitals, regional hospitals, and university hospitals (CHU). Available services range from basic X-rays and ultrasounds to advanced techniques like CT scans, MRIs, PET-CT, and interventional radiology. The public health sector represents over 80% of hospital beds nationwide. Each governorate has at least one regional hospital equipped with radiology services, while major cities like Tunis, Sousse, Monastir, and Sfax are home to university hospitals with advanced technologies.
          </p>
        </div>

        {/* Available Radiology Types */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Available Radiology Types</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {radiologyTypes.map((type, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-center mb-4">
                  {type.icon}
                </div>
                <h4 className="text-xl font-semibold text-center mb-2">{type.title}</h4>
                <p className="text-gray-600 text-center">{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hospitals by Category */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-center mb-8">Hospitals by Category</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {hospitalCategories.map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-center mb-4">
                  {category.icon}
                </div>
                <h4 className="text-xl font-semibold text-center mb-3">{category.title}</h4>
                <p className="text-gray-600">{category.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Radiology Statistics */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-center mb-8">Radiology Statistics</h3>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability (per million inhabitants)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {radiologyStats.map((stat, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.equipment}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.availability}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{stat.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;
