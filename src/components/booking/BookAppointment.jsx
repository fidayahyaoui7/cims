import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaUserMd, FaHospital, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';
import api from '../../services/api';

const BookAppointment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    reason: ''
  });

  // Load center data if provided in location state
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (location.state?.centerId) {
          const center = await api.centers.getCenter(location.state.centerId);
          setSelectedCenter(center);
        }
      } catch (err) {
        console.error('Error loading center data:', err);
        setError('Failed to load center information');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [location.state]);

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setLoading(true);
    try {
      // Fetch available time slots for the selected date
      const slots = await api.appointments.getAvailableSlots({
        centerId: selectedCenter.id,
        date: date
      });
      setAvailableSlots(slots);
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setError('Failed to load available time slots');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.appointments.bookAppointment({
        centerId: selectedCenter.id,
        date: selectedDate,
        time: selectedTime,
        patientInfo: {
          ...patientInfo,
          // Add any additional patient info needed
        }
      });
      navigate('/appointments', { state: { bookingSuccess: true } });
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError('Failed to book appointment. Please try again.');
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t('selectCenter')}</h2>
            {/* Center selection UI */}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t('selectDateTime')}</h2>
            {/* Date and time selection UI */}
          </div>
        );
      case 3:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold">{t('patientInformation')}</h2>
            {/* Patient info form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={patientInfo.name}
                  onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('email')} *
                </label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={patientInfo.email}
                  onChange={(e) => setPatientInfo({...patientInfo, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('phoneNumber')} *
                </label>
                <input
                  type="tel"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={patientInfo.phone}
                  onChange={(e) => setPatientInfo({...patientInfo, phone: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('reasonForVisit')}
                </label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={patientInfo.reason}
                  onChange={(e) => setPatientInfo({...patientInfo, reason: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaArrowLeft className="-ml-1 mr-2 h-5 w-5" />
                {t('back')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? t('booking') + '...' : t('confirmAppointment')}
              </button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('bookAppointment')}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {t('bookAppointmentDescription')}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading && !selectedCenter ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {renderStep()}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
