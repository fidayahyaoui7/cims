'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import React from 'react';

interface PatientInfo {
  name: string;
  phone: string;
  email: string;
}

export default function PatientInfoPage() {
  const router = useRouter();
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: '',
    phone: '',
    email: ''
  });
  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get selected center and date from localStorage
    const center = localStorage.getItem('selectedCenter');
    const dateTime = localStorage.getItem('selectedDateTime');
    
    if (!center || !dateTime) {
      router.push('/booking/region');
      return;
    }
    
    setSelectedCenter(JSON.parse(center));
    setSelectedDateTime(JSON.parse(dateTime));
    
    // Check if user is logged in and pre-fill their info
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setPatientInfo(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || ''
        }));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    setLoading(false);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (!patientInfo.name || !patientInfo.phone || !patientInfo.email) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patientInfo.email)) {
      alert('Veuillez entrer une adresse email valide.');
      return;
    }
    
    // Basic phone validation (minimum 8 digits)
    const phoneRegex = /^[0-9]{8,}$/;
    if (!phoneRegex.test(patientInfo.phone.replace(/\s/g, ''))) {
      alert('Veuillez entrer un numéro de téléphone valide (minimum 8 chiffres).');
      return;
    }
    
    localStorage.setItem('patientInfo', JSON.stringify(patientInfo));
    router.push('/booking/confirmation');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">Vos informations</h1>
      <p className="text-gray-600 mb-6">Remplissez vos coordonnées pour finaliser la prise de rendez-vous</p>
      
      {/* Booking Summary */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">Résumé du rendez-vous</h3>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Centre :</span> {selectedCenter}<br />
          <span className="font-medium">Date et heure :</span> {formatDate(selectedDateTime)}
        </p>
      </div>
      
      {/* Patient Information Form */}
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom complet <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={patientInfo.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={patientInfo.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={patientInfo.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: 50123456"
            required
          />
          <p className="mt-1 text-xs text-gray-500">Format: 8 chiffres minimum</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-8 pt-4 border-t">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
        >
          ← Retour
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Confirmer →
        </button>
      </div>
    </div>
  );
}
