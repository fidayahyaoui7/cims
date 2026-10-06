'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RegionPage() {
  const router = useRouter();
  const [regions, setRegions] = useState([
    { id: 'tunis', name: 'Tunis' },
    { id: 'ariana', name: 'Ariana' },
    { id: 'ben_arous', name: 'Ben Arous' },
    { id: 'manouba', name: 'Manouba' },
    { id: 'tunis_nord', name: 'Tunis Nord' },
    { id: 'tunis_sud', name: 'Tunis Sud' }
  ]);

  const handleRegionSelect = (regionId) => {
    localStorage.setItem('selectedRegion', regionId);
    router.push('/booking/center');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sélectionnez votre région</h1>
          <p className="text-gray-600">Choisissez la région où vous souhaitez effectuer votre examen</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regions.map((region) => (
            <div
              key={region.id}
              onClick={() => handleRegionSelect(region.id)}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-center"
            >
              <h3 className="text-lg font-medium text-gray-900">{region.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
