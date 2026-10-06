import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaClock,
  FaCalendarAlt,
  FaStar,
  FaRegStar,
  FaGlobe, 
  FaMapPin, 
  FaArrowLeft, 
  FaSearch, 
  FaCar, 
  FaHospital, 
  FaClinicMedical,
  FaStarHalfAlt,
  FaDirections,
  FaEnvelope,
  FaChevronLeft,
  FaChevronRight,
  FaAmbulance,
  FaWheelchair,
  FaParking,
  FaWifi,
  FaUserMd
} from 'react-icons/fa';
import hospitalsData from '../data/hospitalsData';

const CenterDetailPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    // Simulate API call to fetch center data
    const fetchCenter = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find the center with the matching ID
        const foundCenter = hospitalsData.find(hospital => hospital.id === id);
        
        if (foundCenter) {
          // Add some mock data for demonstration
          const enhancedCenter = {
            ...foundCenter,
            images: [
              foundCenter.image || 'https://via.placeholder.com/800x400?text=No+Image+Available',
              'https://via.placeholder.com/800x400?text=Hospital+Facility',
              'https://via.placeholder.com/800x400?text=Medical+Equipment'
            ],
            doctors: [
              { 
                id: 1, 
                name: 'Dr. Ahmed Ben Salah', 
                specialty: 'Médecine Générale',
                image: 'https://randomuser.me/api/portraits/men/1.jpg',
                rating: 4.5,
                reviews: 24
              },
              { 
                id: 2, 
                name: 'Dr. Fatma Ben Ammar', 
                specialty: 'Cardiologie',
                image: 'https://randomuser.me/api/portraits/women/1.jpg',
                rating: 4.8,
                reviews: 32
              }
            ],
            workingHours: {
              monday: '08:00 - 18:00',
              tuesday: '08:00 - 18:00',
              wednesday: '08:00 - 18:00',
              thursday: '08:00 - 18:00',
              friday: '08:00 - 13:00',
              saturday: '09:00 - 13:00',
              sunday: 'Fermé'
            },
            emergencyContact: foundCenter.emergencyPhone || '190',
            facilities: [
              { name: 'Parking', icon: <FaParking />, available: true },
              { name: 'Accès Handicapé', icon: <FaWheelchair />, available: true },
              { name: 'WiFi', icon: <FaWifi />, available: true },
              { name: 'Urgence 24/7', icon: <FaAmbulance />, available: foundCenter.emergency || false }
            ]
          };
          
          setCenter(enhancedCenter);
        } else {
          throw new Error('Center not found');
        }
      } catch (error) {
        console.error('Error fetching center:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCenter();
  }, [id]);

  const nextImage = () => {
    setCurrentImageIndex(prev => 
      prev === center.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? center.images.length - 1 : prev - 1
    );
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-2 text-sm text-gray-600">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  const renderDoctorCard = (doctor) => (
    <div key={doctor.id} className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
      <img 
        src={doctor.image} 
        alt={doctor.name} 
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <h4 className="font-semibold">{doctor.name}</h4>
        <p className="text-sm text-gray-600">{doctor.specialty}</p>
        <div className="flex items-center mt-1">
          {renderRatingStars(doctor.rating)}
          <span className="text-xs text-gray-500 ml-2">({doctor.reviews} avis)</span>
        </div>
      </div>
    </div>
  );

  const renderWorkingHours = () => (
    <div className="space-y-2">
      {Object.entries(center.workingHours).map(([day, hours]) => (
        <div key={day} className="flex justify-between">
          <span className="capitalize">{t(`days.${day}`)}:</span>
          <span className="font-medium">{hours}</span>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Centre non trouvé</h2>
        <p className="text-gray-600 mb-6">Le centre que vous recherchez n'existe pas ou a été déplacé.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : ''}`}>
      {/* Header with Back Button */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaChevronLeft className="mr-2" />
            {t('back')}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Center Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Image Gallery */}
          <div className="relative h-64 md:h-96 bg-gray-100">
            <img 
              src={center.images[currentImageIndex]} 
              alt={center.name}
              className="w-full h-full object-cover"
            />
            {center.images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
                  aria-label="Previous image"
                >
                  <FaChevronLeft />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
                  aria-label="Next image"
                >
                  <FaChevronRight />
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {center.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Center Info */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{center.name}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <FaMapMarkerAlt className="mr-2 text-red-500" />
                  <span>{center.address}, {center.city}</span>
                </div>
                <div className="flex items-center">
                  {renderRatingStars(center.rating)}
                  <span className="ml-2 text-sm text-gray-600">
                    ({center.reviews} {center.reviews === 1 ? 'avis' : 'avis'})
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <a 
                  href={`tel:${center.phone}`}
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPhone className="mr-2" />
                  {t('call')}
                </a>
              </div>
            </div>

            {/* Emergency Info */}
            {center.emergency && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r mb-6">
                <div className="flex">
                  <FaAmbulance className="text-red-500 text-xl mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-semibold text-red-800">Urgence</h3>
                    <p className="text-red-700">Composez le <strong>{center.emergencyContact}</strong> pour les urgences 24/7</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  {t('overview')}
                </button>
                <button
                  onClick={() => setActiveTab('services')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'services' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  {t('services')}
                </button>
                <button
                  onClick={() => setActiveTab('doctors')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'doctors' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  {t('doctors')}
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'contact' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  {t('contact')}
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'overview' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('aboutCenter')}</h2>
                <p className="text-gray-700 mb-6">{center.description || t('noDescriptionAvailable')}</p>
                
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('servicesOffered')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {center.services && center.services.slice(0, 6).map((service, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <FaUserMd className="text-blue-500 mr-3" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
                
                {center.services && center.services.length > 6 && (
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    {t('viewAllServices')} ({center.services.length})
                  </button>
                )}
              </div>
            )}

            {activeTab === 'services' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('allServices')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {center.services && center.services.map((service, index) => (
                    <div key={index} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaUserMd className="text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{service}</h4>
                        <p className="text-sm text-gray-500 mt-1">{t('available')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'doctors' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('ourDoctors')}</h2>
                <div className="space-y-4">
                  {center.doctors && center.doctors.length > 0 ? (
                    center.doctors.map(doctor => renderDoctorCard(doctor))
                  ) : (
                    <p className="text-gray-500">{t('noDoctorsAvailable')}</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('contactInformation')}</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">{t('address')}</h3>
                    <div className="flex items-start">
                      <FaMapMarkerAlt className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700">{center.address}</p>
                        <p className="text-gray-700">{center.city}, Tunisie</p>
                        <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                          <FaDirections className="mr-1" /> {t('getDirections')}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">{t('contact')}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FaPhone className="text-gray-500 mr-3 w-5" />
                        <a href={`tel:${center.phone}`} className="text-blue-600 hover:underline">
                          {center.phone}
                        </a>
                      </div>
                      {center.emergencyContact && (
                        <div className="flex items-center">
                          <FaAmbulance className="text-red-500 mr-3 w-5" />
                          <a href={`tel:${center.emergencyContact}`} className="text-red-600 hover:underline">
                            {center.emergencyContact} (Urgence)
                          </a>
                        </div>
                      )}
                      {center.email && (
                        <div className="flex items-center">
                          <FaEnvelope className="text-gray-500 mr-3 w-5" />
                          <a href={`mailto:${center.email}`} className="text-blue-600 hover:underline">
                            {center.email}
                          </a>
                        </div>
                      )}
                      {center.website && (
                        <div className="flex items-center">
                          <FaGlobe className="text-gray-500 mr-3 w-5" />
                          <a 
                            href={center.website.startsWith('http') ? center.website : `https://${center.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {center.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">{t('openingHours')}</h3>
                    {renderWorkingHours()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Book Appointment Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('bookAppointment')}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('bookAppointmentDescription')}
              </p>
              <button 
                onClick={() => navigate(`/appointment/${center.id}`)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                {t('bookNow')}
              </button>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('facilities')}</h3>
              <div className="space-y-3">
                {center.facilities && center.facilities.length > 0 ? (
                  center.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center">
                      <span className={`mr-3 ${facility.available ? 'text-green-500' : 'text-gray-300'}`}>
                        {facility.icon}
                      </span>
                      <span className={facility.available ? 'text-gray-700' : 'text-gray-400 line-through'}>
                        {facility.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">{t('noFacilitiesListed')}</p>
                )}
              </div>
            </div>

            {/* Map */}
            {center.coordinates && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  {/* Map placeholder - in a real app, integrate with Google Maps or similar */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center p-4">
                      <FaMapMarkerAlt className="text-red-500 text-3xl mx-auto mb-2" />
                      <p className="text-sm text-gray-600">{center.address}</p>
                      <p className="text-sm text-gray-600">{center.city}, Tunisie</p>
                      <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                        {t('viewOnMap')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            {center.emergency && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                <div className="flex">
                  <FaAmbulance className="text-red-500 text-xl mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-semibold text-red-800">{t('emergency')}</h3>
                    <p className="text-red-700">
                      {t('emergencyContactText')} <strong>{center.emergencyContact || '190'}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterDetailPage;
