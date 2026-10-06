'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function ConfirmationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load all booking data from localStorage
    const center = localStorage.getItem('selectedCenter');
    const dateTime = localStorage.getItem('selectedDateTime');
    const patientInfo = localStorage.getItem('patientInfo');
    const examType = localStorage.getItem('selectedExam');

    if (center && dateTime && patientInfo && examType) {
      setBookingData({
        center: JSON.parse(center),
        dateTime: JSON.parse(dateTime),
        patientInfo: JSON.parse(patientInfo),
        examType: JSON.parse(examType)
      });
    }
    setLoading(false);
  }, []);

  const handleConfirm = async () => {
    if (!bookingData) return;
    
    setIsBooking(true);
    setError('');
    
    try {
      const response = await fetch('/api/v1/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          examType: bookingData.examType,
          centerId: bookingData.center.id,
          centerName: bookingData.center.name,
          appointmentDate: bookingData.dateTime.dateTime,
          patientName: `${bookingData.patientInfo.firstName} ${bookingData.patientInfo.lastName}`,
          patientEmail: user?.email || bookingData.patientInfo.email,
          patientPhone: bookingData.patientInfo.phone
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to book appointment');
      }

      // Clear booking data from localStorage
      localStorage.removeItem('selectedExam');
      localStorage.removeItem('selectedCenter');
      localStorage.removeItem('selectedDateTime');
      localStorage.removeItem('patientInfo');

      // Redirect to success page
      router.push('/booking/success');
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleBack = () => {
    router.push('/booking/patient-info');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Missing booking information. Please start over.
        </div>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-900 mb-4">
              Confirmation du Rendez-vous
            </h1>
            <p className="text-gray-600">
              Vérifiez les détails de votre réservation
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Détails du Rendez-vous</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-medium text-gray-700">Type d'examen</h3>
                <p className="text-gray-900">{bookingData.examType}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Centre médical</h3>
                <p className="text-gray-900">{bookingData.center.name}</p>
                <p className="text-gray-600 text-sm">{bookingData.center.address}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Date et Heure</h3>
                <p className="text-gray-900">
                  {new Date(bookingData.dateTime.dateTime).toLocaleString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Patient</h3>
                <p className="text-gray-900">
                  {`${bookingData.patientInfo.firstName} ${bookingData.patientInfo.lastName}`}
                </p>
                <p className="text-gray-600 text-sm">{bookingData.patientInfo.email}</p>
                <p className="text-gray-600 text-sm">{bookingData.patientInfo.phone}</p>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={handleBack}
              disabled={isBooking}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              ← Retour
            </button>
            
            <button
              onClick={handleConfirm}
              disabled={isBooking}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isBooking ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement...
                </>
              ) : 'Confirmer le rendez-vous'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
