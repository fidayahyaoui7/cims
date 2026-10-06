import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../contexts/BookingContext';
import { format, parseISO } from 'date-fns';
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const Confirmation = () => {
  const { bookingData, clearBooking } = useBooking();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  // If we don't have required data, show an error
  if (!bookingData?.patientInfo || !bookingData?.center) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Missing Booking Information</h2>
          <p className="mb-4">Some required booking information is missing. Please start a new booking.</p>
          <button
            onClick={() => navigate('/book')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Start New Booking
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    try {
      // In a real app, you would submit the booking to your API here
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          centerId: bookingData.center?.id,
          date: bookingData.date,
          time: bookingData.time,
          patientInfo: bookingData.patientInfo,
          // Add any other necessary fields
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to book appointment');
      }
  
      const data = await response.json();
      setIsSuccess(true);
      clearBooking();
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.message || 'Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-green-500 text-6xl mb-4 flex justify-center">
            <FaCheckCircle />
          </div>
          <h2 className="text-2xl font-bold mb-4">Appointment Booked Successfully!</h2>
          <p className="mb-6">Your appointment has been confirmed. You will receive a confirmation email shortly.</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Return to Home
            </button>
            <button
              onClick={() => navigate('/appointments')}
              className="px-6 py-2 bg-white border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
            >
              View My Appointments
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Confirm Your Appointment</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Center</h3>
              <p className="text-gray-900">{bookingData.center?.name}</p>
              <p className="text-gray-600">{bookingData.center?.address}</p>
              <p className="text-gray-600">{bookingData.center?.city}, {bookingData.center?.region}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Date & Time</h3>
              <p className="text-gray-900">
                {bookingData.date && format(parseISO(bookingData.date), 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-gray-900">{bookingData.time}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Patient Information</h3>
              <p className="text-gray-900">{bookingData.patientInfo.fullName}</p>
              <p className="text-gray-600">{bookingData.patientInfo.email}</p>
              <p className="text-gray-600">{bookingData.patientInfo.phone}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          
          <div className="space-x-4">
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-6 py-2 rounded text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? 'Processing...' : 'Confirm Appointment'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>• Please arrive 15 minutes before your scheduled appointment time.</p>
              <p>• Bring your ID and any relevant medical documents.</p>
              <p>• Cancellations must be made at least 24 hours in advance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
