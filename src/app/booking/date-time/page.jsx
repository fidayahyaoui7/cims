'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SelectDateTimePage() {
  const router = useRouter();
  const [dateTime, setDateTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Generate time slots (example data)
  useEffect(() => {
    // In a real app, you would fetch available slots from your API
    const generateSlots = () => {
      const slots = [];
      const now = new Date();
      
      // Start from the next hour
      now.setHours(now.getHours() + 1, 0, 0, 0);
      
      // Generate slots for the next 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() + i);
        
        // Only weekdays
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        
        // Generate time slots from 9:00 to 17:00
        for (let hour = 9; hour < 17; hour++) {
          const slotDate = new Date(date);
          slotDate.setHours(hour, 0, 0, 0);
          
          // Only future slots
          if (slotDate > now) {
            slots.push(slotDate);
          }
        }
      }
      
      setAvailableSlots(slots);
    };
    
    generateSlots();
  }, []);

  const handleNext = () => {
    if (!selectedSlot) return alert('Veuillez choisir un créneau.');
    localStorage.setItem('selectedDateTime', selectedSlot);
    router.push('/booking/patient-info');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Choisissez la date et l'heure</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">Sélectionnez un créneau :</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-2">
          {availableSlots.map((slot, index) => (
            <button
              key={index}
              onClick={() => setSelectedSlot(slot.toISOString())}
              className={`p-3 border rounded-lg text-left transition-colors ${
                selectedSlot === slot.toISOString()
                  ? 'bg-blue-100 border-blue-500'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
            >
              {formatDate(slot)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          ← Précédent
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedSlot}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}
