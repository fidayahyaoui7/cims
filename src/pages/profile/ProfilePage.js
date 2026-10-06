import React from 'react';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('profile.title', 'Profile')}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>{t('profile.welcome', 'Welcome to your profile page.')}</p>
        {/* Add profile content here */}
      </div>
    </div>
  );
};

export default ProfilePage;
