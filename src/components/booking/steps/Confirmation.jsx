import React from 'react';
import { useBooking } from '../../../contexts/BookingContext';
import { format, parseISO } from 'date-fns';

const Confirmation = ({ onBack, onComplete }) => {
  const { bookingData } = useBooking();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  // Debug: Log the current booking data
  React.useEffect(() => {
    console.group('Confirmation Component - Debug Info');
    console.log('Current step:', bookingData?.step);
    console.log('Full bookingData:', JSON.parse(JSON.stringify(bookingData)));
    console.log('Patient Info:', bookingData?.patientInfo);
    console.log('Has patientInfo:', !!bookingData?.patientInfo);
    console.log('Has center:', !!bookingData?.center);
    console.log('Has date:', !!bookingData?.date);
    console.log('Has time:', !!bookingData?.time);
    
    // Check if we're actually on the confirmation step
    if (bookingData?.step !== 5) {
      console.warn('Confirmation component rendered but step is not 5. Current step:', bookingData?.step);
    }
    
    console.groupEnd();
  }, [bookingData]);
  
  // If we don't have required data, show an error
  if (!bookingData?.patientInfo || !bookingData?.center || !bookingData?.date || !bookingData?.time) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Missing Booking Information</h2>
        <p className="text-red-600 mb-4">Some required booking information is missing. Please go back and complete all steps.</p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Missing data: {
                  [
                    !bookingData?.patientInfo && 'patientInfo',
                    !bookingData?.center && 'center',
                    !bookingData?.date && 'date',
                    !bookingData?.time && 'time'
                  ].filter(Boolean).join(', ')
                }
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Go Back
        </button>
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
      onComplete(); // Proceed to success step
    } catch (error) {
      console.error('Booking error:', error);
      setError(error.message || 'Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bookingData.center || !bookingData.date || !bookingData.time || !bookingData.patientInfo) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Incomplete Booking Data</h3>
        <p className="text-gray-600">Please go back and complete all the required information.</p>
        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="text-sm text-yellow-700">
            Missing data: {
              [
                !bookingData.center && 'center',
                !bookingData.date && 'date',
                !bookingData.time && 'time',
                !bookingData.patientInfo && 'patientInfo'
              ].filter(Boolean).join(', ')
            }
          </p>
        </div>
      </div>
    );
  }

  const formattedDate = format(parseISO(bookingData.date), 'EEEE, MMMM d, yyyy');

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Confirm Your Appointment</h2>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Appointment Details</h3>
            <div className="bg-white p-4 rounded-md border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Medical Center</h4>
                  <p className="text-gray-900">{bookingData.center.name}</p>
                  <p className="text-sm text-gray-600">{bookingData.center.address}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Date & Time</h4>
                  <p className="text-gray-900">{formattedDate}</p>
                  <p className="text-gray-900 font-medium">{bookingData.time}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your Information</h3>
            <div className="bg-white p-4 rounded-md border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Name</h4>
                  <p className="text-gray-900">{bookingData.patientInfo?.name || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Email</h4>
                  <p className="text-gray-900">{bookingData.patientInfo?.email || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Phone</h4>
                  <p className="text-gray-900">{bookingData.patientInfo?.phone || 'Not provided'}</p>
                </div>
                {bookingData.patientInfo.notes && (
                  <div className="md:col-span-2">
                    <h4 className="font-medium text-gray-700">Additional Notes</h4>
                    <p className="text-gray-900 whitespace-pre-line">{bookingData.patientInfo.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4 border-t">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Confirm Appointment'
          )}
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
