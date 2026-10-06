import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { format, addDays, isBefore, isAfter, parseISO } from 'date-fns';
import { fr, arTN } from 'date-fns/locale';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  availableSlots: string[];
}

interface AppointmentFormData {
  doctorId: string;
  date: string;
  time: string;
  reason: string;
  notes: string;
}

export default function BookAppointmentPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [formData, setFormData] = useState<AppointmentFormData>({
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const currentLanguage = i18n.language;

  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      date: date.toISOString().split('T')[0],
      display: format(date, 'EEE, MMM d', {
        locale: currentLanguage === 'fr' ? fr : currentLanguage === 'ar' ? arTN : undefined
      })
    };
  });

  // Fetch doctors list
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/doctors');
        // const data = await response.json();
        
        // Mock data
        const mockDoctors: Doctor[] = [
          {
            id: '1',
            name: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00']
          },
          {
            id: '2',
            name: 'Dr. Michael Chen',
            specialty: 'Dermatology',
            availableSlots: ['10:00', '11:00', '13:00', '14:00', '16:00']
          },
          {
            id: '3',
            name: 'Dr. Emily Davis',
            specialty: 'General Medicine',
            availableSlots: ['08:00', '09:30', '11:00', '13:30', '15:00']
          },
        ];
        
        setDoctors(mockDoctors);
      } catch (err) {
        setError(t('bookAppointment.errors.fetchDoctors'));
        console.error('Error fetching doctors:', err);
      }
    };

    fetchDoctors();
  }, [t]);

  // Update available slots when doctor or date changes
  useEffect(() => {
    if (formData.doctorId && formData.date) {
      const doctor = doctors.find(d => d.id === formData.doctorId);
      if (doctor) {
        setAvailableSlots(doctor.availableSlots);
      }
    } else {
      setAvailableSlots([]);
    }
  }, [formData.doctorId, formData.date, doctors]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData(prev => ({
      ...prev,
      doctorId: doctor.id
    }));
    setStep(2);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setFormData(prev => ({
      ...prev,
      date
    }));
    setStep(3);
  };

  const handleTimeSelect = (time: string) => {
    setFormData(prev => ({
      ...prev,
      time
    }));
    setStep(4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/appointments', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      //   },
      //   body: JSON.stringify(formData)
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to book appointment');
      // }
      
      // For demo purposes, simulate a successful booking
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to confirmation page or appointments list
      navigate('/patient/appointments', {
        state: { bookingSuccess: true }
      });
    } catch (err) {
      setError(t('bookAppointment.errors.submit'));
      console.error('Error booking appointment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t('bookAppointment.selectDoctor')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map(doctor => (
          <div 
            key={doctor.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.doctorId === doctor.id 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'hover:border-blue-300'
            }`}
            onClick={() => handleDoctorSelect(doctor)}
          >
            <h3 className="font-medium">{doctor.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{doctor.specialty}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => setStep(1)}
          className="text-blue-600 hover:text-blue-800"
        >
          &larr; {t('common.back')}
        </button>
        <h2 className="text-xl font-semibold">{t('bookAppointment.selectDate')}</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {dates.map(({ date, display }) => {
          const isSelected = selectedDate === date;
          const isPast = isBefore(parseISO(date), new Date());
          
          return (
            <button
              key={date}
              type="button"
              onClick={() => !isPast && handleDateSelect(date)}
              disabled={isPast}
              className={`p-3 border rounded-lg text-center transition-colors ${
                isSelected
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : isPast
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
            >
              <div className="text-sm font-medium">
                {display.split(',')[0]}
              </div>
              <div className="text-lg font-bold mt-1">
                {display.split(', ')[1]}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => setStep(2)}
          className="text-blue-600 hover:text-blue-800"
        >
          &larr; {t('common.back')}
        </button>
        <h2 className="text-xl font-semibold">{t('bookAppointment.selectTime')}</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {availableSlots.length > 0 ? (
          availableSlots.map(slot => (
            <button
              key={slot}
              type="button"
              onClick={() => handleTimeSelect(slot)}
              className={`p-3 border rounded-lg text-center transition-colors ${
                formData.time === slot
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
            >
              {slot}
            </button>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">
            {t('bookAppointment.noAvailableSlots')}
          </p>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <button 
          type="button"
          onClick={() => setStep(3)}
          className="text-blue-600 hover:text-blue-800"
        >
          &larr; {t('common.back')}
        </button>
        <h2 className="text-xl font-semibold">{t('bookAppointment.appointmentDetails')}</h2>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="font-medium">{t('bookAppointment.appointmentSummary')}</h3>
        <div className="mt-2 space-y-1 text-sm">
          <p><span className="text-gray-500">{t('bookAppointment.doctor')}:</span> {selectedDoctor?.name}</p>
          <p><span className="text-gray-500">{t('bookAppointment.specialty')}:</span> {selectedDoctor?.specialty}</p>
          <p><span className="text-gray-500">{t('bookAppointment.date')}:</span> {selectedDate}</p>
          <p><span className="text-gray-500">{t('bookAppointment.time')}:</span> {formData.time}</p>
        </div>
      </div>
      
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('bookAppointment.reasonForVisit')} *
        </label>
        <input
          type="text"
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('bookAppointment.additionalNotes')}
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={3}
          className="w-full p-2 border rounded"
          placeholder={t('bookAppointment.notesPlaceholder')}
        />
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('common.booking') + '...' : t('bookAppointment.confirmBooking')}
        </button>
      </div>
    </form>
  );

  const steps = [
    { number: 1, title: t('bookAppointment.steps.selectDoctor'), active: step === 1 },
    { number: 2, title: t('bookAppointment.steps.selectDate'), active: step === 2 },
    { number: 3, title: t('bookAppointment.steps.selectTime'), active: step === 3 },
    { number: 4, title: t('bookAppointment.steps.confirm'), active: step === 4 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">{t('bookAppointment.title')}</h1>
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center">
          {steps.map((stepItem, index) => (
            <React.Fragment key={stepItem.number}>
              <div className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stepItem.active || step > stepItem.number
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepItem.number}
                </div>
                <span className={`text-xs mt-1 text-center ${stepItem.active ? 'font-medium' : 'text-gray-500'}`}>
                  {stepItem.title}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 bg-gray-200">
                  <div 
                    className={`h-full ${step > stepItem.number ? 'bg-blue-600' : 'bg-transparent'}`}
                    style={{ width: step > stepItem.number ? '100%' : '0%' }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Form Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>
    </div>
  );
}
