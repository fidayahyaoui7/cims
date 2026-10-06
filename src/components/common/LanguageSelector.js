import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';

const LanguageSelector = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
    { code: 'ar', label: 'العربية' },
  ];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={currentLanguage === lang.code ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`min-w-[40px] ${currentLanguage === lang.code ? 'font-bold' : ''}`}
          aria-label={`Switch to ${lang.label}`}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
};

export default LanguageSelector;
