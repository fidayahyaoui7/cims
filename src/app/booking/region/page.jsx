'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SelectRegionPage() {
  const router = useRouter();
  const [selectedCenter, setSelectedCenter] = useState('');

  const centers = [
    { id: 'c1', name: 'Hôpital Mongi Slim' },
    { id: 'c2', name: 'Centre de Traumatologie' },
    { id: 'c3', name: 'Hôpital La Marsa' },
  ];

  const handleSelect = (centerId) => {
    setSelectedCenter(centerId);
    localStorage.setItem('selectedCenter', JSON.stringify(centerId));
  };

  const handleNext = () => {
    if (!selectedCenter) return alert('Veuillez sélectionner un centre.');
    router.push('/booking/date-time');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Choisissez un centre</h1>
      <ul className="space-y-3 mb-6">
        {centers.map((center) => (
          <li 
            key={center.id} 
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedCenter === center.id 
                ? 'bg-blue-100 border-blue-500' 
                : 'hover:bg-gray-50 border-gray-200'
            }`}
            onClick={() => handleSelect(center.id)}
          >
            <h3 className="font-medium">{center.name}</h3>
            <p className="text-sm text-gray-500 mt-1">Tunis, Tunisie</p>
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <button 
          onClick={handleNext} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedCenter}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}
