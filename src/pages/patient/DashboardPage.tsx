import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t('dashboard.welcome')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link 
          to="/patient/appointments" 
          className="p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <h3 className="text-lg font-medium mb-2">{t('dashboard.appointments')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('dashboard.viewUpcomingAppointments')}
          </p>
        </Link>
        
        <Link 
          to="/patient/messages" 
          className="p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <h3 className="text-lg font-medium mb-2">{t('dashboard.messages')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('dashboard.viewMessages')}
          </p>
        </Link>
        
        <Link 
          to="/patient/book-appointment" 
          className="p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <h3 className="text-lg font-medium mb-2">{t('dashboard.bookAppointment')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('dashboard.scheduleNewAppointment')}
          </p>
        </Link>
        
        <Link 
          to="/patient/medical-records" 
          className="p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <h3 className="text-lg font-medium mb-2">{t('dashboard.medicalRecords')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('dashboard.viewMedicalHistory')}
          </p>
        </Link>
        
        <Link 
          to="/patient/health-tracker" 
          className="p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <h3 className="text-lg font-medium mb-2">{t('dashboard.healthTracker')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('dashboard.trackYourHealth')}
          </p>
        </Link>
        
        <Link 
          to="/patient/favorites" 
          className="p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <h3 className="text-lg font-medium mb-2">{t('dashboard.favorites')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('dashboard.viewSavedItems')}
          </p>
        </Link>
      </div>
    </div>
  );
}
