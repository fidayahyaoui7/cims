import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import './AuthPages.css';

const LoginPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to access your account</p>
        </div>
        
        <div className="auth-content">
          <LoginForm />
          
          <div className="auth-divider">
            <span>OR</span>
          </div>
          
          <div className="social-login">
            <button className="btn btn-social btn-google">
              <i className="fab fa-google"></i> Continue with Google
            </button>
            <button className="btn btn-social btn-facebook">
              <i className="fab fa-facebook-f"></i> Continue with Facebook
            </button>
          </div>
          
          <div className="auth-footer">
            <p>By continuing, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>
          </div>
        </div>
      </div>
      
      <div className="auth-image">
        <div className="auth-image-overlay">
          <h2>Your Health, Our Priority</h2>
          <p>Access your medical records, book appointments, and connect with healthcare providers.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
