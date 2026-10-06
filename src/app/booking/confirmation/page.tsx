'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import React from 'react';

interface PatientInfo {
  name: string;
  phone: string;
  email: string;
}

interface BookingDetails {
  center: string;
  dateTime: string;
  patient: PatientInfo;
}

export default function ConfirmationPage() {
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    center: '',
    dateTime: '',
    patient: {
      name: '',
      phone: '',
      email: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    // Get all booking data from localStorage
    const center = localStorage.getItem('selectedCenter');
    const dateTime = localStorage.getItem('selectedDateTime');
    const patientInfo = localStorage.getItem('patientInfo');

    if (!center || !dateTime || !patientInfo) {
      router.push('/booking/region');
      return;
    }

    try {
      setBookingData({
        center: JSON.parse(center),
        dateTime: JSON.parse(dateTime),
        patientInfo: JSON.parse(patientInfo)
      });
      setLoading(false);
    } catch (error) {
      console.error('Error parsing booking data:', error);
      router.push('/booking/region');
    }
  }, [router]);

  const handleConfirmBooking = async () => {
    if (!bookingData) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would send this data to your backend
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          center: bookingData.center,
          dateTime: bookingData.dateTime,
          patientInfo: bookingData.patientInfo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }

      const data = await response.json();
      setBookingId(data.bookingId);
      setBookingSuccess(true);
      
      // Clear booking data from localStorage
      localStorage.removeItem('selectedCenter');
      localStorage.removeItem('selectedDateTime');
      localStorage.removeItem('patientInfo');
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Une erreur est survenue lors de la réservation. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading || !bookingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Rendez-vous confirmé !</h1>
          <p className="text-gray-600">Votre réservation a été enregistrée avec succès.</p>
          {bookingId && (
            <p className="text-sm text-gray-500 mt-2">
              N° de réservation: <span className="font-mono">{bookingId}</span>
            </p>
          )}
        </div>

        <div className="bg-green-50 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Détails de la réservation</h2>
          <div className="space-y-2">
            <p><span className="font-medium text-gray-700">Centre :</span> {bookingData.center}</p>
            <p><span className="font-medium text-gray-700">Date et heure :</span> {formatDate(bookingData.dateTime)}</p>
            <p><span className="font-medium text-gray-700">Patient :</span> {bookingData.patientInfo.name}</p>
            <p><span className="font-medium text-gray-700">Email :</span> {bookingData.patientInfo.email}</p>
            <p><span className="font-medium text-gray-700">Téléphone :</span> {bookingData.patientInfo.phone}</p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-blue-800 mb-2">Prochaines étapes</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Vous recevrez un email de confirmation avec les détails du rendez-vous</li>
            <li>• Un rappel vous sera envoyé 24h avant le rendez-vous</li>
            <li>• Merci de vous présenter 15 minutes avant l'heure prévue</li>
          </ul>
        </div>

        <button
          onClick={() => router.push('/')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">Confirmer la réservation</h1>
      <p className="text-gray-600 mb-6">Veuillez vérifier les informations avant de confirmer</p>
      
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Détails de la réservation</h2>
        <div className="space-y-3">
          <p><span className="font-medium text-gray-700">Centre :</span> {bookingData.center}</p>
          <p><span className="font-medium text-gray-700">Date et heure :</span> {formatDate(bookingData.dateTime)}</p>
          <div className="border-t border-gray-200 my-3"></div>
          <p><span className="font-medium text-gray-700">Patient :</span> {bookingData.patientInfo.name}</p>
          <p><span className="font-medium text-gray-700">Email :</span> {bookingData.patientInfo.email}</p>
          <p><span className="font-medium text-gray-700">Téléphone :</span> {bookingData.patientInfo.phone}</p>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              En confirmant, vous acceptez nos conditions générales d'utilisation et notre politique de confidentialité.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium mb-3 sm:mb-0"
          disabled={isSubmitting}
        >
          ← Retour
        </button>
        <div className="space-x-3">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement...
              </span>
            ) : 'Confirmer la réservation'}
          </button>
        </div>
      </div>
    </div>
  );
}
