import React from 'react';
import { useTranslation } from 'react-i18next';

const TranslationTest = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '600px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>{t('welcome')}</h1>
      <div style={{ margin: '20px 0' }}>
        <p>Current language: <strong>{i18n.language}</strong></p>
      </div>
      
      <div style={{ margin: '20px 0' }}>
        <h2>Test Translations:</h2>
        <p><strong>Login:</strong> {t('login')}</p>
        <p><strong>Register:</strong> {t('register')}</p>
        <p><strong>Book Appointment:</strong> {t('book_appointment')}</p>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h3>Change Language:</h3>
        <button 
          onClick={() => changeLanguage('en')} 
          style={{
            marginRight: '10px',
            padding: '8px 16px',
            backgroundColor: i18n.language === 'en' ? '#1976d2' : '#f0f0f0',
            color: i18n.language === 'en' ? 'white' : 'black',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          English
        </button>
        <button 
          onClick={() => changeLanguage('fr')}
          style={{
            marginRight: '10px',
            padding: '8px 16px',
            backgroundColor: i18n.language === 'fr' ? '#1976d2' : '#f0f0f0',
            color: i18n.language === 'fr' ? 'white' : 'black',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Français
        </button>
        <button 
          onClick={() => changeLanguage('ar')}
          style={{
            padding: '8px 16px',
            backgroundColor: i18n.language === 'ar' ? '#1976d2' : '#f0f0f0',
            color: i18n.language === 'ar' ? 'white' : 'black',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          العربية
        </button>
      </div>
    </div>
  );
};

export default TranslationTest;
