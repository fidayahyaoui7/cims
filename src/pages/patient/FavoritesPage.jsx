import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaStar, 
  FaRegStar, 
  FaUserMd, 
  FaHospital, 
  FaPhone, 
  FaMapMarkerAlt,
  FaSearch,
  FaFilter
} from 'react-icons/fa';

const FavoritesPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('doctors');
  
  // Mock data - replace with real data from your API
  const favoriteDoctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      hospital: 'City Medical Center',
      rating: 4.8,
      reviews: 124,
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      isFavorite: true
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Neurologist',
      hospital: 'University Hospital',
      rating: 4.9,
      reviews: 89,
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      isFavorite: true
    }
  ];

  const favoriteHospitals = [
    {
      id: 1,
      name: 'City Medical Center',
      type: 'General Hospital',
      address: '123 Healthcare St, Medical District',
      rating: 4.7,
      reviews: 245,
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop&q=60',
      isFavorite: true
    },
    {
      id: 2,
      name: 'University Hospital',
      type: 'Teaching Hospital',
      address: '456 University Ave, Campus District',
      rating: 4.5,
      reviews: 312,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&auto=format&fit=crop&q=60',
      isFavorite: true
    }
  ];

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      i < Math.floor(rating) 
        ? <FaStar key={i} className="text-yellow-400" /> 
        : <FaRegStar key={i} className="text-gray-300" />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('favorites.title')}</h1>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('common.search')}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white">
              <option>{t('common.filters')}</option>
              <option>{t('filters.specialty')}</option>
              <option>{t('filters.location')}</option>
              <option>{t('filters.rating')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'doctors' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {t('favorites.doctors')} ({favoriteDoctors.length})
          </button>
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'hospitals' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {t('favorites.hospitals')} ({favoriteHospitals.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'doctors' ? (
          favoriteDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteDoctors.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start">
                      <img 
                        className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm" 
                        src={doctor.image} 
                        alt={doctor.name} 
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                          <button className="text-yellow-400 hover:text-yellow-500">
                            <FaStar className="h-5 w-5" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        <div className="mt-1 flex items-center">
                          <div className="flex">
                            {renderStars(doctor.rating)}
                          </div>
                          <span className="ml-2 text-sm text-gray-500">
                            {doctor.rating} ({doctor.reviews} {t('common.reviews')})
                          </span>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <FaHospital className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {doctor.hospital}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex space-x-3">
                      <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        {t('common.bookAppointment')}
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <FaPhone className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <FaRegStar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">{t('favorites.noFavoriteDoctors')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('favorites.addDoctorsPrompt')}</p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {t('favorites.browseDoctors')}
                </button>
              </div>
            </div>
          )
        ) : (
          favoriteHospitals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteHospitals.map((hospital) => (
                <div key={hospital.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="h-40 bg-gray-200 overflow-hidden">
                    <img 
                      src={hospital.image} 
                      alt={hospital.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
                        <p className="text-sm text-gray-600">{hospital.type}</p>
                      </div>
                      <button className="text-yellow-400 hover:text-yellow-500">
                        <FaStar className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className="flex">
                        {renderStars(hospital.rating)}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        {hospital.rating} ({hospital.reviews})
                      </span>
                    </div>
                    <div className="mt-3 flex items-start text-sm text-gray-500">
                      <FaMapMarkerAlt className="flex-shrink-0 mt-0.5 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{hospital.address}</span>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        {t('common.viewDetails')}
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <FaPhone className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <FaRegStar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">{t('favorites.noFavoriteHospitals')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('favorites.addHospitalsPrompt')}</p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {t('favorites.browseHospitals')}
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
