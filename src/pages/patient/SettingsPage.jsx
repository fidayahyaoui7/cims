import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaBell, 
  FaLanguage,
  FaTimes, 
  FaMoon, 
  FaSun,
  FaLock,
  FaTrash,
  FaSignOutAlt,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    appointmentReminders: true,
    healthTips: true,
    newsletter: false
  });

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    // Save to localStorage or user preferences
    localStorage.setItem('userLanguage', newLanguage);
  };

  const toggleNotification = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    // Here you would typically update the user's notification preferences in your backend
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Implement dark mode toggle logic here
    document.documentElement.classList.toggle('dark');
  };

  const handleDeleteAccount = () => {
    // Implement account deletion logic here
    if (window.confirm(t('settings.deleteAccountConfirm'))) {
      console.log('Account deletion requested');
      // Call API to delete account
    }
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('User logged out');
    // Call your auth service logout method
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {t('settings.title')}
      </h1>

      {/* Language Settings */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            <FaLanguage className="inline mr-2" />
            {t('settings.language')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            {t('settings.languageDescription')}
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="max-w-lg">
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('settings.selectLanguage')}
            </label>
            <select
              id="language"
              name="language"
              value={language}
              onChange={handleLanguageChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            {darkMode ? (
              <FaSun className="inline mr-2 text-yellow-400" />
            ) : (
              <FaMoon className="inline mr-2 text-gray-600" />
            )}
            {t('settings.display')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            {t('settings.displayDescription')}
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {t('settings.darkMode')}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('settings.darkModeDescription')}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`${
                darkMode ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              role="switch"
              aria-checked={darkMode}
            >
              <span className="sr-only">Toggle dark mode</span>
              <span
                className={`${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
              >
                <span
                  className={`${
                    darkMode ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'
                  } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                  aria-hidden="true"
                >
                  <FaMoon className="h-3 w-3 text-gray-400" />
                </span>
                <span
                  className={`${
                    darkMode ? 'opacity-100 duration-200 ease-in' : 'opacity-0 ease-out duration-100'
                  } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                  aria-hidden="true"
                >
                  <FaSun className="h-3 w-3 text-yellow-400" />
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            <FaBell className="inline mr-2 text-blue-500" />
            {t('settings.notifications')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            {t('settings.notificationsDescription')}
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {t(`settings.notificationTypes.${key}`)}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t(`settings.notificationTypes.${key}Description`)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotification(key)}
                  className={`${
                    value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  role="switch"
                  aria-checked={value}
                >
                  <span className="sr-only">
                    {value ? t('common.disable') : t('common.enable')} {key}
                  </span>
                  <span
                    className={`${
                      value ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  >
                    <span
                      className={`${
                        value ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'
                      } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                      aria-hidden="true"
                    >
                      <FaTimes className="h-3 w-3 text-gray-400" />
                    </span>
                    <span
                      className={`${
                        value ? 'opacity-100 duration-200 ease-in' : 'opacity-0 ease-out duration-100'
                      } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                      aria-hidden="true"
                    >
                      <FaCheckCircle className="h-3 w-3 text-blue-600" />
                    </span>
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            <FaLock className="inline mr-2 text-red-500" />
            {t('settings.accountActions')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            {t('settings.accountActionsDescription')}
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-red-600 dark:text-red-400">
                <FaExclamationTriangle className="inline mr-2" />
                {t('settings.deleteAccount')}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('settings.deleteAccountWarning')}
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FaTrash className="mr-2" />
              {t('settings.deleteMyAccount')}
            </button>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                <FaSignOutAlt className="inline mr-2" />
                {t('auth.logout')}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('auth.logoutDescription')}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              {t('auth.logoutButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
