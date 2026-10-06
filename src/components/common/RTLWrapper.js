import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const RTLWrapper = ({ children }) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set document direction based on language
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    
    // Add/remove RTL class to body
    if (i18n.language === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [i18n.language]);

  return <>{children}</>;
};

export default RTLWrapper;
