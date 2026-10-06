import React from 'react';
import { useTranslation } from 'react-i18next';

const MyAppointmentsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="page-container">
      <h1>{t('my_appointments') || 'My Appointments'}</h1>
      <p>
        {t('appointments_placeholder') ||
          'This is a placeholder. Here you will be able to see your upcoming and past appointments.'}
      </p>
    </div>
  );
};

export default MyAppointmentsPage;
