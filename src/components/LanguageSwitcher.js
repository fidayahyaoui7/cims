import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/LanguageSelector.css';

const languages = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'ar', label: 'عربي', name: 'العربية' }
];

const LanguageSwitcher = ({ position = 'fixed' }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    if (i18n.language !== lng) {  // Only change if it's a different language
      i18n.changeLanguage(lng).then(() => {
        localStorage.setItem('i18nextLng', lng);
        document.documentElement.lang = lng;
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
      });
    }
  };

  // Set initial language and direction on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng') || 'en';
    if (i18n.language !== savedLanguage) {
      changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
    <div className={`language-selector ${position}`}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`lang-btn ${i18n.language === lang.code ? 'active' : ''}`}
          onClick={() => changeLanguage(lang.code)}
          aria-label={`Change language to ${lang.name}`}
          title={lang.name}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
