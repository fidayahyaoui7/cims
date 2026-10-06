import React from 'react';
import { useTranslation } from 'react-i18next';

const AppointmentsPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('appointments.title')}</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          {t('appointments.newAppointment')}
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">{t('appointments.upcomingAppointments')}</p>
        {/* Appointments list will go here */}
      </div>
    </div>
  );
};

export default AppointmentsPage;
