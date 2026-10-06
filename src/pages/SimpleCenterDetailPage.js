import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaClock, FaChevronLeft, FaExclamationTriangle } from 'react-icons/fa';
import SimpleMap from '../components/SimpleMap';

const SimpleCenterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [center, setCenter] = useState(location.state?.center || null);
  const [loading, setLoading] = useState(!location.state?.center);

  // Mock data - will work even without API
  const mockCenter = {
    id: id || '1',
    name: 'Centre de Santé de Tunis',
    type: 'public',
    address: 'Rue de la Santé, 1002 Tunis',
    city: 'Tunis',
    phone: '71345678',
    emergencyPhone: '190',
    description: 'Centre de santé offrant des services médicaux complets avec des professionnels qualifiés.',
    coordinates: { lat: 36.8008, lng: 10.1806 },
    hours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '13:00' },
      saturday: { open: '09:00', close: '13:00' },
      sunday: { open: 'Closed', close: 'Closed' }
    }
  };

  useEffect(() => {
    if (!center) {
      // Simulate API call
      setTimeout(() => {
        setCenter(mockCenter);
        setLoading(false);
      }, 500);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="p-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 mb-4"
        >
          <FaChevronLeft className="mr-1" /> Retour
        </button>
        <div className="text-center py-10">
          <h2 className="text-xl font-bold">Centre non trouvé</h2>
          <p>Le centre demandé n'existe pas ou n'est plus disponible.</p>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const hours = center?.hours || {};
  const todayHours = hours[today] || { open: 'Fermé', close: '' };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 mr-2"
        >
          <FaChevronLeft />
        </button>
        <h1 className="text-2xl font-bold">{center.name}</h1>
      </div>

      {/* Map */}
      <div className="h-64 bg-gray-200 rounded-lg mb-6 overflow-hidden">
        <SimpleMap 
          center={center.coordinates}
          zoom={15}
          markers={[{
            position: center.coordinates,
            title: center.name
          }]}
        />
      </div>

      {/* Info */}
      <div className="space-y-4">
        <div className="flex items-start">
          <FaMapMarkerAlt className="text-red-500 mt-1 mr-3 flex-shrink-0" />
          <div>
            <h2 className="font-medium">Adresse</h2>
            <p>{center.address}, {center.city}</p>
          </div>
        </div>

        <div className="flex items-center">
          <FaPhone className="text-blue-500 mr-3" />
          <div>
            <h2 className="font-medium">Téléphone</h2>
            <a href={`tel:${center.phone}`} className="text-blue-600">
              {center.phone}
            </a>
          </div>
        </div>

        <div className="flex items-start">
          <FaClock className="text-green-500 mt-1 mr-3 flex-shrink-0" />
          <div>
            <h2 className="font-medium">Horaires aujourd'hui</h2>
            <p>
              {(!todayHours.open || ['closed', 'fermé'].includes(String(todayHours.open).toLowerCase()))
                ? 'Fermé aujourd\'hui'
                : `Ouvert de ${todayHours.open} à ${todayHours.close || ''}`}
            </p>
          </div>
        </div>
      </div>

      {/* Emergency */}
      {center.emergencyPhone && (
        <div className="mt-8 p-4 bg-red-50 rounded-lg">
          <h3 className="font-bold text-red-700 mb-2">Urgence</h3>
          <a href={`tel:${center.emergencyPhone}`} className="text-red-600 font-medium">
            {center.emergencyPhone}
          </a>
          <p className="text-sm text-gray-600 mt-1">Service d'urgence 24/7</p>
        </div>
      )}
    </div>
  );
};

export default SimpleCenterDetailPage;
