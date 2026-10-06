import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TestBookingPage() {
  const navigate = useNavigate();

  const testBooking = () => {
    // Create mock booking data
    const mockBookingData = {
      selectedDate: new Date().toISOString().split('T')[0], // Today's date
      selectedTime: '14:30',
      centerId: 'test-center-123',
      centerName: 'Test Medical Center'
    };

    // Save to localStorage
    localStorage.setItem('bookingPrefill', JSON.stringify(mockBookingData));
    
    // Navigate directly to the patient info page
    navigate('/booking/patient-info', { 
      state: { prefillData: mockBookingData }
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Test Booking Flow</h1>
      <button
        onClick={testBooking}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Test Patient Info Page
      </button>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Test Data:</h2>
        <pre className="bg-white p-4 rounded overflow-x-auto">
          {JSON.stringify({
            selectedDate: new Date().toISOString().split('T')[0],
            selectedTime: '14:30',
            centerId: 'test-center-123',
            centerName: 'Test Medical Center'
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
