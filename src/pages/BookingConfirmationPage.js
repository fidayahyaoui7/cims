import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaCheckCircle, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUserMd, 
  FaClock, 
  FaHospital,
  FaPrint,
  FaEnvelope,
  FaFilePdf,
  FaArrowLeft,
  FaPhone,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useBooking } from '../contexts/BookingContext';
import { getCurrentUser } from '../services/authService';

const BookingConfirmationPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { bookingData, clearBooking } = useBooking();
  const [isLoading, setIsLoading] = useState(true);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const user = getCurrentUser();

  // Process booking data and set up effect
  useEffect(() => {
    const loadBookingData = () => {
      // First check context
      if (bookingData && (bookingData.center || bookingData.appointmentDetails?.center)) {
        return processBookingData(bookingData);
      }
      
      // If no data in context, check localStorage
      const savedData = localStorage.getItem('booking_data');
      const savedPatientInfo = localStorage.getItem('patientInfo');
      
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          if (parsedData && (parsedData.center || parsedData.appointmentDetails?.center)) {
            return processBookingData(parsedData);
          }
        } catch (e) {
          console.error('Error parsing booking data:', e);
        }
      }
      
      // If we have patient info but no booking data, try to reconstruct
      if (savedPatientInfo) {
        try {
          const patientInfo = JSON.parse(savedPatientInfo);
          return processBookingData({
            patientInfo,
            center: { name: 'Unknown Center' },
            date: new Date(),
            time: '10:00 AM'
          });
        } catch (e) {
          console.error('Error parsing patient info:', e);
        }
      }
      
      // If no data found, redirect to home
      navigate('/');
      return null;
    };

    // Format appointment details
    const processBookingData = (data) => {
      const center = data.center || data.appointmentDetails?.center || { name: 'Unknown Center' };
      const appointmentDate = data.date || data.appointmentDetails?.date || new Date();
      const time = data.time || data.appointmentDetails?.time || '10:00 AM';
      const patientInfo = data.patientInfo || {};
      
      return {
        center,
        date: new Date(appointmentDate),
        time,
        patientInfo: {
          name: patientInfo.fullName || patientInfo.name || 'Non spécifié',
          firstName: patientInfo.firstName || '',
          lastName: patientInfo.lastName || '',
          email: patientInfo.email || '',
          phone: patientInfo.phone || '',
          notes: patientInfo.notes || ''
        },
        formattedDate: new Date(appointmentDate).toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        reference: data.reference || `REF-${Date.now().toString().slice(-8)}`
      };
    };

    const data = loadBookingData();
    if (data) {
      setAppointmentDetails(data);
      setIsLoading(false);
    }
  }, [bookingData, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleBackToHome = () => {
    clearBooking();
    navigate('/');
  };

  if (isLoading || !appointmentDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { center, doctor, formattedDate, time, patientInfo, reference } = appointmentDetails;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 print:py-0 print:px-0">
      <div className="max-w-4xl mx-auto">
        {/* Print Header - Only shows when printing */}
        <div className="hidden print:block mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Appointment Confirmation</h1>
          <p className="text-gray-600">Reference: {reference}</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 print:shadow-none print:border-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-center text-white">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-full">
                <FaCheckCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-3">
              {t('booking_confirmed') || 'Appointment Confirmed!'}
            </h1>
            <p className="text-green-100 text-lg">
              {t('booking_confirmation_message') || 'Your appointment has been successfully scheduled.'}
            </p>
            <div className="mt-4 bg-white/10 inline-block px-4 py-2 rounded-full">
              <span className="font-mono text-sm">Reference: {reference}</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 py-8 md:px-8">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8 print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaPrint className="mr-2" /> Print
              </button>
              <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <FaEnvelope className="mr-2" /> Email
              </button>
              <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <FaFilePdf className="mr-2 text-red-500" /> Save as PDF
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                  {t('appointment_details') || 'Appointment Details'}
                </h2>
                
                <div className="space-y-6">
                  {/* Center Info */}
                  <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaHospital className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {t('medical_center') || 'Medical Center'}
                      </h3>
                      <p className="text-lg font-medium text-gray-900 mt-1">{center?.name}</p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <FaMapMarkerAlt className="mr-1.5 h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span>{center?.address || 'Address not available'}</span>
                      </p>
                      {center?.phone && (
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <FaPhone className="mr-1.5 h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                          <span>{center.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <FaCalendarAlt className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {t('date_time') || 'Date & Time'}
                      </h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center">
                          <FaCalendarAlt className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-900 font-medium">{formattedDate}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-700">{time || 'Time not specified'}</span>
                        </div>
                        {doctor && (
                          <div className="flex items-center">
                            <FaUserMd className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-700">Dr. {doctor.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Doctor Info - Only if doctor is assigned */}
                  {doctor && (
                    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                        <FaUserMd className="h-6 w-6 text-amber-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                          {t('doctor') || 'Doctor'}
                        </h3>
                        <p className="text-lg font-medium text-gray-900 mt-1">Dr. {doctor.name}</p>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        {doctor.phone && (
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <FaPhone className="mr-1.5 h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                            <span>{doctor.phone}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                  {t('your_information') || 'Your Information'}
                </h2>
                
                <div className="space-y-6">
                  {/* Patient Info */}
                  <div className="p-5 bg-gray-50 rounded-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FaUserMd className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4 w-full">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                          {t('your_information') || 'Your Information'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="text-gray-900 font-medium">{patientInfo.name || 'Not provided'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Email Address</p>
                            <p className="text-gray-900">{patientInfo.email || 'Not provided'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="text-gray-900">{patientInfo.phone || 'Not provided'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Date of Birth</p>
                            <p className="text-gray-900">{patientInfo.dob ? new Date(patientInfo.dob).toLocaleDateString() : 'Not provided'}</p>
                          </div>
                          {patientInfo.address && (
                            <div className="md:col-span-2 space-y-1">
                              <p className="text-sm text-gray-500">Address</p>
                              <p className="text-gray-900">{patientInfo.address}</p>
                            </div>
                          )}
                          {patientInfo.insurance && (
                            <div className="md:col-span-2 space-y-1">
                              <p className="text-sm text-gray-500">Insurance Information</p>
                              <p className="text-gray-900">{patientInfo.insurance}</p>
                            </div>
                          )}
                          {patientInfo.notes && (
                            <div className="md:col-span-2 space-y-1">
                              <p className="text-sm text-gray-500">Additional Notes</p>
                              <p className="text-gray-600 italic">{patientInfo.notes}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => navigate('/profile/edit')}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Update Information
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="p-5 bg-blue-50 border border-blue-100 rounded-lg">
                    <h3 className="text-lg font-medium text-blue-800 mb-3">What's Next?</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          1
                        </div>
                        <span className="text-blue-700">You'll receive a confirmation email with these details</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          2
                        </div>
                        <span className="text-blue-700">Arrive 15 minutes before your appointment time</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          3
                        </div>
                        <span className="text-blue-700">Bring your ID and insurance card (if applicable)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="mt-8 p-5 bg-amber-50 border border-amber-100 rounded-lg">
              <h3 className="text-lg font-medium text-amber-800 mb-3 flex items-center">
                <FaExclamationTriangle className="mr-2" />
                Important Notes
              </h3>
              <ul className="list-disc list-inside space-y-2 text-amber-700">
                <li>Please arrive 15 minutes before your scheduled appointment time</li>
                <li>Bring your ID and any relevant medical records or medications</li>
                <li>Cancel at least 24 hours in advance if you cannot make your appointment</li>
                <li>Call {center?.phone || 'the clinic'} if you have any questions</li>
              </ul>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <button
                onClick={() => navigate('/')}
                type="button"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('back_to_home') || 'Back to Home'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/appointments')}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('view_my_appointments') || 'View My Appointments'}
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {t('need_help') || 'Need Help?'}
            </h3>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-gray-600 mb-4">
              {t('contact_support_message') || 'If you have any questions or need to reschedule, please contact our support team.'}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700">
                  {t('support_phone') || 'Support:'}
                </span>
                <span className="ml-2 text-sm text-gray-600">+216 71 123 456</span>
              </div>
              <div className="mt-3 sm:mt-0">
                <a
                  href="mailto:support@medicalapp.tn"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  {t('contact_support') || 'Contact Support'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
