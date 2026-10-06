import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import './AuthPages.css';

const RegisterPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Create an Account</h1>
          <p>Join our healthcare community today</p>
        </div>
        
        <div className="auth-content">
          <RegisterForm />
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
          
          <div className="auth-footer mt-6">
            <p className="text-xs text-gray-500">
              By registering, you agree to our{' '}
              <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and{' '}
              <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
      
      <div className="auth-image">
        <div className="auth-image-overlay">
          <h2>Your Health Journey Starts Here</h2>
          <p>Access quality healthcare services from the comfort of your home.</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
