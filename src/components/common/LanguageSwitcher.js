import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-bootstrap';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { t } = useTranslation('common');

  const languages = [
    { code: 'en', name: t('language.en'), dir: 'ltr' },
    { code: 'fr', name: t('language.fr'), dir: 'ltr' },
    { code: 'ar', name: t('language.ar'), dir: 'rtl' },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <Dropdown className="language-switcher">
      <Dropdown.Toggle variant="light" id="language-dropdown">
        {currentLanguage.name}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {languages.map((lang) => (
          <Dropdown.Item 
            key={lang.code} 
            onClick={() => changeLanguage(lang.code)}
            active={i18n.language === lang.code}
          >
            {lang.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSwitcher;
