import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaUserMd, 
  FaCalendarAlt,
  FaHospital, 
  FaClock, 
  FaMapMarkerAlt,
  FaChevronDown,
  FaSearch,
  FaTimes,
  FaArrowRight
} from 'react-icons/fa';

const BookAppointmentPage = () => {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reason, setReason] = useState('');
  
  // Mock data - replace with real data from your API
  const doctors = [
    { 
      id: 1, 
      name: 'Dr. Sarah Johnson', 
      specialty: 'Cardiologist', 
      hospital: 'City Medical Center',
      rating: 4.8,
      reviews: 124,
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      availableDates: ['2023-06-10', '2023-06-12', '2023-06-15'],
      availableTimes: ['09:00', '10:00', '11:00', '14:00', '15:00']
    },
    { 
      id: 2, 
      name: 'Dr. Michael Chen', 
      specialty: 'Neurologist', 
      hospital: 'University Hospital',
      rating: 4.9,
      reviews: 89,
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      availableDates: ['2023-06-11', '2023-06-13', '2023-06-16'],
      availableTimes: ['10:00', '11:00', '13:00', '14:00', '16:00']
    },
    { 
      id: 3, 
      name: 'Dr. Emily Wilson', 
      specialty: 'Dermatologist', 
      hospital: 'Skin Care Center',
      rating: 4.7,
      reviews: 156,
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      availableDates: ['2023-06-12', '2023-06-14', '2023-06-17'],
      availableTimes: ['08:00', '09:30', '11:00', '13:30', '15:00']
    },
  ];

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setStep(3);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically submit the appointment to your backend
    console.log('Appointment booked:', {
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      reason
    });
    // Show success message or redirect to appointments page
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {t('appointments.selectDoctor')}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {t('appointments.selectDoctorDescription')}
        </p>
      </div>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={t('appointments.searchDoctors')}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      
      <div className="space-y-4">
        {doctors.map((doctor) => (
          <div 
            key={doctor.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleDoctorSelect(doctor)}
          >
            <div className="flex items-center space-x-4">
              <img 
                className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm" 
                src={doctor.image} 
                alt={doctor.name} 
              />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{doctor.name}</h3>
                <p className="text-sm text-gray-600">{doctor.specialty}</p>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <FaHospital className="mr-1 h-3.5 w-3.5 text-gray-400" />
                  <span>{doctor.hospital}</span>
                </div>
                <div className="mt-1 flex items-center">
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      i < Math.floor(doctor.rating) ? (
                        <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ) : (
                        <svg key={i} className="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      )
                    ))}
                  </div>
                  <span className="ml-2 text-xs text-gray-500">
                    {doctor.rating} ({doctor.reviews} {t('common.reviews')})
                  </span>
                </div>
              </div>
              <div className="text-blue-600">
                <FaArrowRight />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <button 
          onClick={() => setStep(1)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          <FaArrowRight className="transform rotate-180 mr-1" />
          {t('common.back')}
        </button>
        <h2 className="mt-2 text-xl font-semibold text-gray-900">
          {t('appointments.selectDate')}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {t('appointments.selectDateDescription')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {selectedDoctor.availableDates.map((date, index) => {
          const dateObj = new Date(date);
          const dayName = dateObj.toLocaleDateString(i18n.language, { weekday: 'short' });
          const day = dateObj.getDate();
          const month = dateObj.toLocaleDateString(i18n.language, { month: 'short' });
          
          return (
            <button
              key={index}
              onClick={() => handleDateSelect(date)}
              className={`p-4 border rounded-lg text-center hover:bg-blue-50 hover:border-blue-200 transition-colors ${
                selectedDate === date ? 'bg-blue-50 border-blue-500' : 'border-gray-200'
              }`}
            >
              <div className="text-sm font-medium text-gray-500">{dayName}</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">{day}</div>
              <div className="mt-1 text-sm text-gray-500">{month}</div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <button 
          onClick={() => setStep(2)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          <FaArrowRight className="transform rotate-180 mr-1" />
          {t('common.back')}
        </button>
        <h2 className="mt-2 text-xl font-semibold text-gray-900">
          {t('appointments.selectTime')}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {t('appointments.selectTimeDescription')}
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {selectedDoctor.availableTimes.map((time, index) => (
          <button
            key={index}
            onClick={() => handleTimeSelect(time)}
            className={`px-4 py-2 border rounded-md text-center ${
              selectedTime === time 
                ? 'bg-blue-600 text-white border-blue-700' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <button 
          onClick={() => setStep(3)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          <FaArrowRight className="transform rotate-180 mr-1" />
          {t('common.back')}
        </button>
        <h2 className="mt-2 text-xl font-semibold text-gray-900">
          {t('appointments.confirmDetails')}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {t('appointments.confirmDetailsDescription')}
        </p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">{t('appointments.appointmentDetails')}</h3>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FaUserMd className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-500">{t('appointments.doctor')}</h4>
              <p className="text-sm text-gray-900">{selectedDoctor.name}</p>
              <p className="text-sm text-gray-500">{selectedDoctor.specialty}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FaCalendarAlt className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-500">{t('appointments.date')}</h4>
              <p className="text-sm text-gray-900">
                {new Intl.DateTimeFormat(i18n.language, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }).format(new Date(selectedDate))}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FaClock className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-500">{t('appointments.time')}</h4>
              <p className="text-sm text-gray-900">{selectedTime}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FaMapMarkerAlt className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-500">{t('appointments.location')}</h4>
              <p className="text-sm text-gray-900">{selectedDoctor.hospital}</p>
              <p className="text-sm text-gray-500">
                {t('appointments.youWillReceiveConfirmation')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
            {t('appointments.reasonForVisit')} ({t('common.optional')})
          </label>
          <div className="mt-1">
            <textarea
              id="reason"
              name="reason"
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder={t('appointments.reasonPlaceholder')}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('appointments.confirmAppointment')}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('appointments.bookAppointment')}
        </h1>
        <div className="mt-2">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((stepNum) => (
                <React.Fragment key={stepNum}>
                  <li>
                    <div 
                      className={`flex items-center ${
                        step >= stepNum ? 'text-blue-600' : 'text-gray-400'
                      }`}
                    >
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        step === stepNum 
                          ? 'bg-blue-100 border-2 border-blue-600' 
                          : step > stepNum 
                            ? 'bg-green-100 border-2 border-green-500' 
                            : 'bg-gray-100 border-2 border-gray-300'
                      }`}>
                        {step > stepNum ? (
                          <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          stepNum
                        )}
                      </span>
                      {stepNum < 4 && (
                        <span className="mx-2 text-gray-400">/</span>
                      )}
                    </div>
                  </li>
                </React.Fragment>
              ))}
            </ol>
          </nav>
        </div>
      </div>
      
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </div>
  );
};

export default BookAppointmentPage;
