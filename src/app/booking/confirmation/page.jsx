'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BookingConfirmation() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch this from your API
    const loadBookingData = () => {
      try {
        const centerId = JSON.parse(localStorage.getItem('selectedCenter') || 'null');
        const dateTime = localStorage.getItem('selectedDateTime');
        const patientInfo = JSON.parse(localStorage.getItem('patientInfo') || '{}');
        
        // Map center ID to name (in a real app, this would come from an API)
        const centerMap = {
          'c1': 'Hôpital Mongi Slim',
          'c2': 'Centre de Traumatologie',
          'c3': 'Hôpital La Marsa'
        };
        
        setBookingData({
          center: centerMap[centerId] || 'Centre non spécifié',
          dateTime: dateTime ? new Date(dateTime).toLocaleString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : 'Date non spécifiée',
          patientInfo: {
            name: patientInfo.name || 'Non spécifié',
            email: patientInfo.email || 'Non spécifié',
            phone: patientInfo.phone || 'Non spécifié',
            birthDate: patientInfo.birthDate || 'Non spécifié'
          },
          reference: `REF-${Math.floor(100000 + Math.random() * 900000)}`
        });
      } catch (error) {
        console.error('Error loading booking data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBookingData();
  }, []);

  const handleNewAppointment = () => {
    // Clear the form data
    localStorage.removeItem('selectedCenter');
    localStorage.removeItem('selectedDateTime');
    localStorage.removeItem('patientInfo');
    
    // Redirect to the first step
    router.push('/booking');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Aucune réservation trouvée</h1>
        <p className="mb-6">Il semble qu'aucune réservation n'a été effectuée.</p>
        <button
          onClick={() => router.push('/booking')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          Nouvelle réservation
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Réservation confirmée !</h1>
        <p className="text-gray-600">Votre rendez-vous a été enregistré avec succès.</p>
        <p className="text-gray-600">Numéro de référence: <span className="font-medium">{bookingData.reference}</span></p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Détails de la réservation</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="w-1/3 text-sm font-medium text-gray-500">Centre</div>
            <div className="flex-1 text-gray-900">{bookingData.center}</div>
          </div>
          
          <div className="flex items-start">
            <div className="w-1/3 text-sm font-medium text-gray-500">Date et heure</div>
            <div className="flex-1 text-gray-900">{bookingData.dateTime}</div>
          </div>
          
          <div className="border-t border-gray-100 my-4"></div>
          
          <div className="flex items-start">
            <div className="w-1/3 text-sm font-medium text-gray-500">Patient</div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{bookingData.patientInfo.name}</div>
              <div className="text-sm text-gray-600">{bookingData.patientInfo.email}</div>
              <div className="text-sm text-gray-600">{bookingData.patientInfo.phone}</div>
              {bookingData.patientInfo.birthDate && (
                <div className="text-sm text-gray-600 mt-1">
                  Né(e) le: {new Date(bookingData.patientInfo.birthDate).toLocaleDateString('fr-FR')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 mb-8">
        <h3 className="font-medium text-blue-800 mb-2">Rappel important</h3>
        <p className="text-sm text-blue-700">
          Un email de confirmation a été envoyé à {bookingData.patientInfo.email}. 
          Merci de vous présenter 15 minutes avant l'heure du rendez-vous avec une pièce d'identité.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Retour à l'accueil
        </button>
        <button
          onClick={handleNewAppointment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          Nouvelle réservation
        </button>
      </div>
    </div>
  );
}
