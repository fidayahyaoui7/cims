import React from 'react';
import { useTranslation } from 'react-i18next';
import Section from '../../components/medicalImaging/OverviewSection';

const HomeContent = ({ isDarkMode, toggleDarkMode, isRTL, toggleRTL }) => {
  const { t } = useTranslation();
  
  return (
    <div className="home-page min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('welcome', 'Welcome to Medical Platform')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            {t('home_subtitle', 'Your trusted partner in healthcare services across Tunisia')}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t('find_doctors', 'Find Doctors')}
              </h2>
              <p className="text-gray-600">
                {t('find_doctors_desc', 'Book appointments with top specialists')}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t('hospitals', 'Hospitals')}
              </h2>
              <p className="text-gray-600">
                {t('hospitals_desc', 'Discover hospitals and medical centers across Tunisia')}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {t('appointments', 'Appointments')}
              </h2>
              <p className="text-gray-600">
                {t('appointments_desc', 'Manage your medical appointments easily')}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overview Section */}
      <OverviewSection />
      
      {/* Additional sections can be added here */}
    </div>
  );
};

export default HomeContent;
