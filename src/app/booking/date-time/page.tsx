'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import React from 'react';

export default function SelectDateTimePage() {
  const router = useRouter();
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCenter, setSelectedCenter] = useState('');

  useEffect(() => {
    // Get selected center from localStorage
    const center = localStorage.getItem('selectedCenter');
    if (!center) {
      router.push('/booking/region');
      return;
    }
    setSelectedCenter(JSON.parse(center));

    // Fetch available time slots for the selected center
    const fetchAvailableSlots = async () => {
      try {
        // Simulate API call to get available slots
        setTimeout(() => {
          // Generate some sample time slots for the next 7 days
          const slots = [];
          const now = new Date();
          
          for (let i = 1; i <= 7; i++) {
            const date = new Date(now);
            date.setDate(now.getDate() + i);
            
            // Add morning slots
            for (let h = 9; h < 12; h++) {
              const time = new Date(date);
              time.setHours(h, 0, 0, 0);
              slots.push(time.toISOString());
              
              // Add half-hour slots
              if (h < 12) {
                const halfHour = new Date(date);
                halfHour.setHours(h, 30, 0, 0);
                slots.push(halfHour.toISOString());
              }
            }
            
            // Add afternoon slots
            for (let h = 14; h < 18; h++) {
              const time = new Date(date);
              time.setHours(h, 0, 0, 0);
              slots.push(time.toISOString());
              
              // Add half-hour slots
              if (h < 17) {
                const halfHour = new Date(date);
                halfHour.setHours(h, 30, 0, 0);
                slots.push(halfHour.toISOString());
              }
            }
          }
          
          setAvailableSlots(slots);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching available slots:', error);
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [router]);

  const handleDateTimeSelect = (dateTime: string) => {
    setSelectedDateTime(dateTime);
    localStorage.setItem('selectedDateTime', JSON.stringify(dateTime));
  };

  const handleNext = () => {
    if (!selectedDateTime) {
      alert('Veuillez choisir une date et heure.');
      return;
    }
    router.push('/booking/patient-info');
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

  // Group slots by date
  const slotsByDate: { [key: string]: string[] } = {};
  availableSlots.forEach(slot => {
    const date = new Date(slot);
    const dateKey = date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    
    if (!slotsByDate[dateKey]) {
      slotsByDate[dateKey] = [];
    }
    slotsByDate[dateKey].push(slot);
  });

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">Choisissez la date et l'heure</h1>
      <p className="text-gray-600 mb-6">Sélectionnez un créneau horaire disponible pour votre rendez-vous</p>
      
      <div className="space-y-6">
        {Object.entries(slotsByDate).map(([date, slots]) => (
          <div key={date} className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">{date}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {slots.map(slot => {
                const timeString = new Date(slot).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                });
                const isSelected = selectedDateTime === slot;
                
                return (
                  <button
                    key={slot}
                    onClick={() => handleDateTimeSelect(slot)}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {timeString}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
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
          disabled={!selectedDateTime}
          className={`px-6 py-2 rounded-md text-white font-medium ${
            selectedDateTime
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
