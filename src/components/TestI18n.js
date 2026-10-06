import React from 'react';
import { useTranslation } from 'react-i18next';

const TestI18n = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h2>Translation Test</h2>
      <p>{t('welcome_message')}</p>
      <p>Current language: {i18n.language}</p>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => changeLanguage('en')} style={{ marginRight: '10px' }}>English</button>
        <button onClick={() => changeLanguage('fr')} style={{ marginRight: '10px' }}>Français</button>
        <button onClick={() => changeLanguage('ar')}>العربية</button>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Test Translations:</h3>
        <p><strong>Login:</strong> {t('login')}</p>
        <p><strong>Register:</strong> {t('register')}</p>
        <p><strong>Book Appointment:</strong> {t('book_appointment')}</p>
      </div>
    </div>
  );
};

export default TestI18n;
