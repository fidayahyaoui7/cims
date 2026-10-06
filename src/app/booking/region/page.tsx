'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Center {
  id: string;
  name: string;
}

export default function SelectRegionPage() {
  const router = useRouter();
  const [selectedCenter, setSelectedCenter] = useState<string>('');
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch centers from API in a real app
    const fetchCenters = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setCenters([
            { id: 'c1', name: 'Hôpital Mongi Slim' },
            { id: 'c2', name: 'Centre de Traumatologie' },
            { id: 'c3', name: 'Hôpital La Marsa' },
          ]);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching centers:', error);
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  const handleSelect = (centerId: string) => {
    setSelectedCenter(centerId);
    localStorage.setItem('selectedCenter', JSON.stringify(centerId));
  };

  const handleNext = () => {
    if (!selectedCenter) {
      alert('Veuillez sélectionner un centre.');
      return;
    }
    router.push('/booking/date-time');
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Choisissez un centre</h1>
      <ul className="space-y-3 mb-6">
        {centers.map(center => (
          <li 
            key={center.id} 
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedCenter === center.id 
                ? 'bg-blue-50 border-blue-300' 
                : 'hover:bg-gray-50 border-gray-200'
            }`}
            onClick={() => handleSelect(center.id)}
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 h-5 w-5 rounded-full border-2 ${
                selectedCenter === center.id 
                  ? 'bg-blue-500 border-blue-500' 
                  : 'border-gray-300'
              } flex items-center justify-center mr-3`}>
                {selectedCenter === center.id && (
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-gray-800">{center.name}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <button 
          onClick={handleNext} 
          disabled={!selectedCenter}
          className={`px-6 py-2 rounded-md text-white font-medium ${
            selectedCenter 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-gray-400 cursor-not-allowed'
          } transition-colors`}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}
