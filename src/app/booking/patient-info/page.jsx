'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PatientInfoPage() {
  const router = useRouter();
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    phone: '',
    email: '',
    birthDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved user data if available
  useEffect(() => {
    const savedInfo = localStorage.getItem('patientInfo');
    if (savedInfo) {
      setPatientInfo(JSON.parse(savedInfo));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!patientInfo.name.trim() || !patientInfo.phone.trim() || !patientInfo.email.trim()) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patientInfo.email)) {
      alert('Veuillez entrer une adresse email valide.');
      return;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[0-9]{8}$/;
    if (!phoneRegex.test(patientInfo.phone.replace(/\s/g, ''))) {
      alert('Veuillez entrer un numéro de téléphone valide (8 chiffres).');
      return;
    }
    
    setIsSubmitting(true);
    
    // Save to localStorage
    localStorage.setItem('patientInfo', JSON.stringify(patientInfo));
    
    // Simulate API call
    setTimeout(() => {
      router.push('/booking/confirmation');
    }, 500);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Vos informations</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom complet <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={patientInfo.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={patientInfo.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={patientInfo.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="XX XXX XXX"
            required
          />
        </div>
        
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date de naissance
          </label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            value={patientInfo.birthDate}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="pt-4 flex justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Précédent
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Traitement...' : 'Confirmer →'}
          </button>
        </div>
      </form>
    </div>
  );
}
