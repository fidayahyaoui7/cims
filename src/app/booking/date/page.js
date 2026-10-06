'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DatePage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [timeSlots, setTimeSlots] = useState([
    '08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ]);
  const [selectedTime, setSelectedTime] = useState('');

  // Generate next 7 days
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  const handleDateSelect = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    // In a real app, you would fetch available time slots for the selected date
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    const dateTime = {
      date: selectedDate,
      time: time
    };
    localStorage.setItem('selectedDateTime', JSON.stringify(dateTime));
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      router.push('/booking/patient-info');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choisissez une date et une heure</h1>
          <p className="text-gray-600">Sélectionnez une date et un créneau horaire pour votre rendez-vous</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Date</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dates.map((date, index) => {
              const dateStr = date.toISOString().split('T')[0];
              const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
              const dayNum = date.getDate();
              const month = date.toLocaleDateString('fr-FR', { month: 'short' });
              
              return (
                <div
                  key={dateStr}
                  onClick={() => handleDateSelect(date)}
                  className={`p-4 text-center rounded-lg cursor-pointer transition-colors ${
                    selectedDate === dateStr ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{dayName}</div>
                  <div className="text-2xl font-bold">{dayNum}</div>
                  <div className="text-sm">{month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedDate && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Heure</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`py-3 px-4 rounded-lg text-center transition-colors ${
                    selectedTime === time
                      ? 'bg-blue-600 text-white'
                      : 'bg-white hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-8">
          <button
            onClick={handleContinue}
            disabled={!selectedDate || !selectedTime}
            className={`px-6 py-3 rounded-lg font-medium ${
              selectedDate && selectedTime
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}
