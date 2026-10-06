import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaClock,
  FaChevronLeft,
  FaUserMd,
  FaCalendarAlt,
  FaArrowRight
} from 'react-icons/fa';
import BookingSteps from '../components/BookingSteps';
import { centersAPI } from '../services/api';
import '../CenterDetailPageNew.css';

const CenterDetailPageFixed = () => {
  const { id: routeId, centerId } = useParams();
  const effectiveId = centerId || routeId;
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);

  // Load center data
  useEffect(() => {
    const loadCenter = async () => {
      try {
        setLoading(true);
        
        // First check if center data was passed in location state
        if (location.state?.center) {
          const c = location.state.center;
          const services = Array.isArray(c.services) ? c.services : 
                         (typeof c.services === 'string' ? c.services.split(',').map(s => s.trim()) : []);
          
          setCenter({
            ...c,
            services,
            coordinates: c.coordinates || (c.latitude && c.longitude ? 
              { lat: c.latitude, lng: c.longitude } : null)
          });
        } 
        // Otherwise fetch from API
        else if (effectiveId) {
          const response = await centersAPI.getCenterById(effectiveId);
          setCenter(response.data);
        }
      } catch (err) {
        console.error('Error loading center:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCenter();
  }, [effectiveId, location.state]);

  const handleBack = () => navigate('/hospitals');

  const handleBookAppointment = () => {
    if (!center) return;
    
    // Navigate to the booking page with the center ID in the URL
    navigate(`/book/${center.id}`, {
      state: {
        preSelectedCenter: {
          id: center.id,
          name: center.name,
          address: center.address,
          city: center.city || '',
          type: center.type,
          phone: center.phone,
          selectedService
        }
      }
    });
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setCurrentStep(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Center not found</p>
          <button 
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Hospitals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <button onClick={handleBack} className="mr-4 p-2 rounded-full hover:bg-gray-100">
              <FaChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold">{center.name}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Booking Steps */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <BookingSteps 
            currentStep={currentStep}
            onStepClick={(step) => currentStep > step && setCurrentStep(step)}
          />
          
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Select a Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {center.services && center.services.length > 0 ? (
                  center.services.map((service, index) => (
                    <div
                      key={index}
                      onClick={() => handleServiceSelect(service)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <FaUserMd className="text-blue-500" />
                        </div>
                        <h3 className="font-medium">{service}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Click to select
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-6">
                    <p className="text-gray-500">No services available</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Booking Summary */}
          {currentStep === 2 && selectedService && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Appointment Summary</h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-blue-800">{selectedService}</h3>
                <p className="text-blue-600">{center.name}</p>
                <p className="text-sm text-gray-600 mt-2">{center.address}</p>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleBookAppointment}
                  className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Continue to Book <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Center Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Contact Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">{center.address}</p>
                  </div>
                </div>
                
                {center.phone && (
                  <div className="flex items-center">
                    <FaPhone className="text-blue-500 mr-3" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href={`tel:${center.phone}`} className="text-blue-600 hover:underline">
                        {center.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div>
            {/* Book Appointment Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Book an Appointment</h3>
              <p className="text-gray-600 mb-4">
                Select a service to book an appointment
              </p>
              
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                {currentStep === 1 ? 'Select a Service' : 'Continue Booking'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CenterDetailPageFixed;
