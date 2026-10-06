'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CenterPage() {
  const router = useRouter();
  const [centers, setCenters] = useState([
    { id: '1', name: 'Centre d\'Imagerie Médicale Les Berges du Lac', address: 'Les Berges du Lac, Tunis' },
    { id: '2', name: 'Polyclinique Les Jasmins', address: 'El Menzah, Tunis' },
    { id: '3', name: 'Clinique El Manar', address: 'El Manar, Tunis' },
    { id: '4', name: 'Centre de Radiologie de l\'Ariana', address: 'Ariana Ville' },
  ]);

  const handleCenterSelect = (centerId) => {
    const selectedCenter = centers.find(c => c.id === centerId);
    localStorage.setItem('selectedCenter', JSON.stringify(selectedCenter));
    router.push('/booking/date');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sélectionnez un centre</h1>
          <p className="text-gray-600">Choisissez le centre médical pour votre examen</p>
        </div>
        
        <div className="space-y-4">
          {centers.map((center) => (
            <div
              key={center.id}
              onClick={() => handleCenterSelect(center.id)}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="text-lg font-medium text-gray-900">{center.name}</h3>
              <p className="text-gray-600 mt-1">{center.address}</p>
              <div className="mt-2 text-sm text-blue-600">Voir les disponibilités →</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
