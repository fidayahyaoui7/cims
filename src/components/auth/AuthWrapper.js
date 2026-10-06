import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * Wrapper component that handles authentication state
 * and provides user context to child components
 */
const AuthWrapper = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // Show loading state while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return children;
};

export default AuthWrapper;
