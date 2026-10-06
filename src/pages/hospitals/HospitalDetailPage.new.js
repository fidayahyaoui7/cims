import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaClock, 
  FaChevronLeft, 
  FaExclamationTriangle,
  FaClinicMedical,
  FaMapMarkedAlt,
  FaHeartbeat,
  FaTooth,
  FaEye,
  FaBrain,
  FaHeart,
  FaBaby,
  FaSyringe,
  FaXRay,
  FaMicroscope,
  FaDna,
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaRegStar,
  FaEnvelope,
  FaGlobe,
  FaAmbulance,
  FaStethoscope,
  FaBed,
  FaParking,
  FaWheelchair,
  FaChevronRight,
  FaTimes,
  FaDirections
} from 'react-icons/fa';
import SimpleMap from '../components/SimpleMap';
import '../styles/CenterDetailPage.css';

const defaultOpeningHours = {
  monday: { open: '08:00', close: '18:00' },
  tuesday: { open: '08:00', close: '18:00' },
  wednesday: { open: '08:00', close: '18:00' },
  thursday: { open: '08:00', close: '18:00' },
  friday: { open: '08:00', close: '13:00' },
  saturday: { open: '09:00', close: '13:00' },
  sunday: { open: 'Closed', close: 'Closed' }
};

const CenterDetailPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [center, setCenter] = useState(location.state?.center || null);
  const [loading, setLoading] = useState(!location.state?.center);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const isRTL = i18n.language === 'ar';

  // Handle booking submission
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    console.log('Initiating booking for center:', center?.id);
    
    if (center?.id) {
      try {
        // Store the center data in localStorage for the booking flow
        localStorage.setItem('selectedCenter', JSON.stringify(center));
        
        // Navigate directly to the date-time selection step
        console.log('Navigating to date-time selection for center:', center.id);
        navigate('/booking/date-time', { 
          state: { 
            prefillData: {
              centerId: center.id,
              centerName: center.name || 'Centre de santé'
            }
          },
          replace: true 
        });
      } catch (error) {
        console.error('Error in handleBookingSubmit:', error);
      }
    } else {
      console.error('Missing center data for booking');
    }
  };

  // Mock data - replace with actual API call
  const mockCenter = {
    id,
    name: 'Centre de Santé de Tunis',
    type: 'public',
    address: 'Rue de la Santé, 1002 Tunis',
    city: 'Tunis',
    phone: '71345678',
    emergencyPhone: '190',
    email: 'contact@centresantetunis.tn',
    website: 'www.centresantetunis.tn',
    description: 'Centre de santé offrant des services médicaux complets avec des professionnels qualifiés.',
    rating: 4.5,
    reviews: 128,
    coordinates: { lat: 36.8008, lng: 10.1806 },
    images: [
      'https://via.placeholder.com/800x400?text=Centre+de+Santé+de+Tunis',
      'https://via.placeholder.com/800x400?text=Entrée+Principale',
      'https://via.placeholder.com/800x400?text=Salle+d\'attente'
    ],
    services: [
      { name: 'Urgences 24/7', icon: <FaAmbulance /> },
      { name: 'Consultation', icon: <FaStethoscope /> },
      { name: 'Hospitalisation', icon: <FaBed /> },
      { name: 'Radiologie', icon: <FaXRay /> },
      { name: 'Cardiologie', icon: <FaHeartbeat /> },
      { name: 'Pédiatrie', icon: <FaBaby /> },
      { name: 'Dentisterie', icon: <FaTooth /> },
      { name: 'Ophtalmologie', icon: <FaEye /> },
      { name: 'Neurologie', icon: <FaBrain /> },
      { name: 'Analyses médicales', icon: <FaMicroscope /> }
    ],
    hours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '13:00' },
      saturday: { open: '09:00', close: '13:00' },
      sunday: { open: 'Closed', close: 'Closed' }
    },
    emergency: {
      available: true,
      phone: '190',
      notes: 'Service d\'urgence disponible 24/7'
    },
    facilities: [
      { name: 'Parking', available: true, icon: <FaParking /> },
      { name: 'Accès handicapé', available: true, icon: <FaWheelchair /> },
      { name: 'Pharmacie', available: true, icon: <FaSyringe /> }
    ],
    insurance: [
      { name: 'CNAM', accepted: true },
      { name: 'CNSS', accepted: true },
      { name: 'CNRPS', accepted: true },
      { name: 'Assurances privées', accepted: true }
    ]
  };

  // Fetch center data if not passed via state
  useEffect(() => {
    if (center) return;

    const fetchCenter = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch the center data here
        // const response = await fetch(`/api/centers/${id}`);
        // const data = await response.json();
        // setCenter(data);
        
        // Using mock data for now
        await new Promise(resolve => setTimeout(resolve, 500));
        setCenter(mockCenter);
      } catch (error) {
        console.error('Error fetching center:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCenter();
  }, [id, center]);

  // Handle image navigation
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === center.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? center.images.length - 1 : prevIndex - 1
    );
  };

  // Check if center is currently open
  const isOpenNow = () => {
    try {
      // Return false if center is not available
      if (!center) return false;
      
      // Use center's hours if available, otherwise use defaultOpeningHours
      const hours = center.hours || defaultOpeningHours;
      
      const now = new Date();
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const today = days[currentDay];
      
      // Return false if we don't have hours for today
      if (!hours || !hours[today]) return false;
      
      const { open, close } = hours[today];
      
      // Return false if the center is closed today
      if (open === 'Closed' || close === 'Closed') return false;
      
      // Convert time strings to minutes since midnight for comparison
      const formatTime = (timeStr) => {
        if (!timeStr || timeStr === 'Closed') return null;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return (hours * 60) + minutes;
      };
      
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTime = (currentHour * 60) + currentMinutes;
      
      const openTime = formatTime(open);
      const closeTime = formatTime(close);
      
      // If we couldn't parse the times, return false
      if (openTime === null || closeTime === null) return false;
      
      return currentTime >= openTime && currentTime <= closeTime;
    } catch (error) {
      console.error('Error in isOpenNow:', error);
      return false; // If anything goes wrong, assume the center is closed
    }
  };

  // Render star rating
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400 opacity-50" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    
    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-2 text-sm text-gray-600">({center.reviews})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4">{t('loading')}</span>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-2">{t('center_not_found')}</h2>
        <p className="text-gray-600 mb-6">{t('center_not_found_description')}</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <FaChevronLeft className="inline mr-2" />
          {t('back')}
        </button>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${isRTL ? 'rtl' : ''}`}>
      {/* Main header with back button and title */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 mr-4"
          aria-label={t('back')}
        >
          <FaChevronLeft className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold">{center.name}</h1>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Image gallery */}
        <div className="relative h-64 bg-gray-100">
          {center.images && center.images.length > 0 && (
            <>
              <img 
                src={center.images[currentImageIndex]} 
                alt={center.name}
                className="w-full h-full object-cover"
              />
              {center.images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-md hover:bg-opacity-100"
                    aria-label={t('previous_image')}
                  >
                    <FaChevronLeft />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-md hover:bg-opacity-100"
                    aria-label={t('next_image')}
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
              {center?.images?.length > 0 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {center.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-blue-500' : 'bg-white bg-opacity-50'}`}
                      aria-label={t('go_to_image', { index: index + 1 })}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Center info */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <div className="mb-2">
                <div className="flex items-center text-gray-600 mb-2">
                  <FaMapMarkerAlt className="mr-2 text-red-500" />
                  <p>{center.address}, {center.city}</p>
                </div>
                {center.phone && (
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaPhone className="mr-2 text-blue-500" />
                    <a href={`tel:${center.phone}`} className="hover:underline">
                      {center.phone}
                    </a>
                  </div>
                )}
                {center.emergency?.available && (
                  <div className="flex items-center text-red-600 font-medium">
                    <FaExclamationTriangle className="mr-2" />
                    <span>{t('emergency_service')} {center.emergency.phone}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                {isOpenNow() ? (
                  <>
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    <span className="font-medium text-green-700">{t('open_now')}</span>
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    <span className="font-medium text-red-700">{t('closed')}</span>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {t('today')}: {center?.hours?.[new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()]?.open || t('closed')}
                {center?.hours?.[new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()]?.close && 
                  ` - ${center.hours[new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()]?.close}`}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('center.overview')}
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'services'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('center.services')}
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'contact'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('center.contact_info')}
              </button>
            </nav>
          </div>

          {/* Tab content */}
          <div className="py-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('center.about')}</h3>
                <p className="text-gray-700 mb-6">{center.description}</p>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">{t('center.opening_hours')}</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {center?.hours && typeof center.hours === 'object' ? (
                      Object.entries(center.hours).map(([day, { open, close }]) => {
                        const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
                        const isToday = day.toLowerCase() === currentDay;
                        
                        return (
                          <div 
                            key={day} 
                            className={`flex justify-between py-2 ${isToday ? 'font-medium text-blue-600' : 'text-gray-700'}`}
                          >
                            <span className="capitalize">{t(`days.${day}`)}</span>
                            <span>{open === 'Closed' ? t('closed') : `${open} - ${close}`}</span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500">{t('no_hours_available')}</p>
                    )}
                  </div>
                </div>

                {center.coordinates && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">{t('center.location')}</h4>
                    <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
                      <SimpleMap 
                        center={center.coordinates || { lat: 34.0, lng: 9.0 }}
                        zoom={15}
                        markers={[{
                          position: center.coordinates || { lat: 34.0, lng: 9.0 },
                          title: center.name
                        }]}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('center.services')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {center?.services?.length > 0 ? center.services.map((service, index) => (
                    <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                      {service.icon && <span className="text-blue-500 mr-3 mt-1">{service.icon}</span>}
                      <span className="text-gray-700">{service.name || t('service_not_specified')}</span>
                    </div>
                  )) : (
                    <p className="text-gray-500">{t('no_services_available')}</p>
                  )}
                </div>

                <div className="mt-8">
                  <h4 className="font-medium text-gray-900 mb-3">{t('center.facilities')}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {center?.facilities?.length > 0 ? center.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center">
                        {facility?.icon && (
                          <span className={`mr-2 ${facility.available ? 'text-green-500' : 'text-gray-400'}`}>
                            {facility.icon}
                          </span>
                        )}
                        <span className={!facility.available ? 'text-gray-400' : ''}>
                          {facility.name || t('facility_not_specified')}
                        </span>
                      </div>
                    )) : (
                      <p className="text-gray-500">{t('no_facilities_available')}</p>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-medium text-gray-900 mb-3">{t('center.insurance')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {center?.insurance?.length > 0 ? center.insurance.map((insurance, index) => (
                      <span 
                        key={index} 
                        className={`px-3 py-1 rounded-full text-sm ${
                          insurance.accepted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {insurance.name || t('insurance_not_specified')}
                      </span>
                    )) : (
                      <p className="text-gray-500">{t('no_insurance_available')}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('center.contact_info')}</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">{t('center.address')}</h4>
                      <p className="text-gray-700">{center.address}, {center.city}</p>
                      {center.coordinates && center.coordinates.lat && center.coordinates.lng ? (
                        <div className="flex gap-2 mt-3">
                        <button 
                          onClick={() => {
                            // Open in Google Maps
                            window.open(
                              `https://www.google.com/maps?q=${center.coordinates.lat},${center.coordinates.lng}`,
                              '_blank'
                            );
                          }}
                          className="px-3 py-2 bg-white border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center text-sm font-medium"
                        >
                          <FaMapMarkedAlt className="mr-2" /> {t('view_on_map')}
                        </button>
                        <button 
                          onClick={() => {
                            // Get Directions in Google Maps
                            window.open(
                              `https://www.google.com/maps/dir/?api=1&destination=${center.coordinates.lat},${center.coordinates.lng}&travelmode=driving`,
                              '_blank'
                            );
                          }}
                          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center text-sm font-medium"
                        >
                          <FaDirections className="mr-2" /> {t('get_directions')}
                        </button>
                      </div>
                      ) : (
                        <p className="mt-2 text-sm text-gray-500">Aucune coordonnée disponible</p>
                      )}
                    </div>
                  </div>

                  {center.phone && (
                    <div className="flex items-center">
                      <FaPhone className="text-blue-500 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-900">Téléphone</h4>
                        <a href={`tel:${center.phone}`} className="text-blue-600 hover:underline">
                          {center.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {center.emergency?.available && (
                    <div className="flex items-center">
                      <FaExclamationTriangle className="text-red-500 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-900">Urgence</h4>
                        <a href={`tel:${center.emergency.phone}`} className="text-red-600 font-medium">
                          {center.emergency.phone}
                        </a>
                        {center.emergency.notes && (
                          <p className="text-sm text-gray-600">{center.emergency.notes}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {center.email && (
                    <div className="flex items-center">
                      <FaEnvelope className="text-gray-500 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-900">Email</h4>
                        <a 
                          href={`mailto:${center.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {center.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {center.website && (
                    <div className="flex items-center">
                      <FaGlobe className="text-blue-500 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-900">Site web</h4>
                        <a 
                          href={center.website.startsWith('http') ? center.website : `https://${center.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {center.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 shadow-lg">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-2 sm:mb-0">
            <p className="text-sm text-gray-600">Vous avez besoin d'aide ?</p>
            <p className="font-medium">Appelez le {center.emergency?.phone || center.phone}</p>
          </div>
          <div className="flex space-x-3 w-full sm:w-auto">
            <a 
              href={`tel:${center.phone}`}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-center font-medium transition-colors"
            >
              Appeler
            </a>
            <button 
              onClick={() => setShowBookingForm(true)}
              className="flex-1 sm:flex-none bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Prendre RDV
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowBookingForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Fermer"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4">Prendre un rendez-vous</h2>
            <form onSubmit={handleBookingSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="date">
                  Date du rendez-vous
                </label>
                <input
                  type="date"
                  id="date"
                  className="w-full p-2 border rounded-md"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="time">
                  Heure du rendez-vous
                </label>
                <input
                  type="time"
                  id="time"
                  className="w-full p-2 border rounded-md"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CenterDetailPage;
