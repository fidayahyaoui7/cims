import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../../contexts/BookingContext';
import ModernDateTimePicker from './ModernDateTimePicker';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { appointmentsAPI } from '../../../services/api';

const DateTimeSelection = ({ onNext, onBack }) => {
  const { bookingData, updateBookingData } = useBooking();
  const [selectedDateTime, setSelectedDateTime] = useState({
    date: bookingData.date || '',
    time: bookingData.time || ''
  });
  const navigate = useNavigate();

  const handleDateTimeSelect = ({ date, time, dateTime }) => {
    setSelectedDateTime({ date, time });
    updateBookingData({
      date,
      time,
      dateTime // ISO string of the full date and time
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDateTime.date || !selectedDateTime.time) {
      toast.error('Please select a date and time');
      return;
    }

    try {
      // Create appointment without personal info
      const appointmentData = {
        centerId: bookingData.center?.id,
        doctorId: bookingData.doctor?.id,
        date: selectedDateTime.date,
        time: selectedDateTime.time,
        status: 'confirmed'
      };

      // Call API to create appointment
      await appointmentsAPI.create(appointmentData);
      
      // Show success message
      toast.success('Appointment booked successfully!');
      
      // Reset booking data
      updateBookingData({
        center: null,
        doctor: null,
        date: null,
        time: null,
        radiologyType: null,
        region: null,
        status: 'completed',
        step: 1
      });
      
      // Redirect to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
        Select Date & Time for Your Appointment
      </h2>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <ModernDateTimePicker 
          onDateTimeSelect={handleDateTimeSelect}
          initialDate={selectedDateTime.date}
        />
        
        {/* Selected time display */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex-1 px-4 text-center">
            {selectedDateTime.date && selectedDateTime.time && (
              <p className="text-gray-600 text-sm">
                Selected: {selectedDateTime.date} at {selectedDateTime.time}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
            disabled={!selectedDateTime.date || !selectedDateTime.time}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Book Now
          </button>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
        <p className="font-medium">Need to reschedule?</p>
        <p className="mt-1">You can change your appointment time up to 24 hours before your scheduled time.</p>
      </div>
    </div>
  );
};

export default DateTimeSelection;
