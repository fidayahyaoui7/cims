import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import './AuthLayout.css';
import LanguageSelector from '../common/LanguageSelector';

const AuthLayout = ({ children }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const justRegistered = sessionStorage.getItem('justRegistered');
  
  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      const dashboardPath = `/dashboard/${user.role || 'patient'}`;
      navigate(dashboardPath, { replace: true });
    }
  }, [user, navigate]);
  
  // Clear the flag if it exists
  if (justRegistered) {
    sessionStorage.removeItem('justRegistered');
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Global language selector for auth pages */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector />
      </div>
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        {!justRegistered && (
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {t('welcome_message')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('login_welcome')}
            </p>
          </div>
        )}
        
        <div className="mt-8">
          {children}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('already_have_account')}{' '}
            <Link 
              to="/login" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {t('sign_in')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
