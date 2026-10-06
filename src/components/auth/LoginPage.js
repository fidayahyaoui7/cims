import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  FaUser, 
  FaLock, 
  FaSignInAlt, 
  FaSpinner, 
  FaExclamationCircle, 
  FaCheckCircle, 
  FaGoogle, 
  FaFacebookF 
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import i18n from '../../i18n';
import './Auth.css';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading: authLoading } = useAuth();
  
  // State management
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const access = localStorage.getItem('access') || localStorage.getItem('token');
        if (user && access) {
          const rawRole = user.role || user.userType || 'PATIENT';
          const role = (() => {
            const r = String(rawRole).toUpperCase();
            if (r === 'PATIENT') return 'patient';
            if (r === 'RADIOLOGIST' || r === 'DOCTOR') return 'doctor';
            if (r === 'ADMIN') return 'admin';
            return String(rawRole).toLowerCase();
          })();
          redirectUser(role);
        } else {
          // Clear any invalid user data
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Auth check error:', err);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  // Handle redirect based on user role (align with AuthContext)
  const redirectUser = (role) => {
    const from = location.state?.from || location.pathname;
    
    // If there's a 'from' location in the state, use it
    if (from && from !== '/login') {
      navigate(from, { replace: true });
      return;
    }
    
    // Otherwise, redirect based on role
    const normalized = String(role || 'patient').toLowerCase();
    const profilePath = `/dashboard/${normalized}/profile`;
    navigate(profilePath, { replace: true });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear any existing errors when user starts typing
    if (error) setError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError(t('fill_all_fields'));
      setLoading(false);
      return;
    }

    try {
      const ok = await login(formData.email, formData.password, undefined);
      if (ok) {
        setSuccess(t('login_success'));
        // AuthContext handles navigation to /dashboard/{role}/profile
      } else {
        throw new Error(t('login_failed'));
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || t('login_error');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Render the login form
  return (
    <div className="auth-container" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} lang={i18n.language || 'en'}>
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-title-container">
            <h1>{t('login')}</h1>
          </div>
          <p>{t('welcome_back')}</p>
        </div>

        {/* Error and success messages */}
        {error && (
          <div className="message error-message">
            <FaExclamationCircle className="message-icon" /> 
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="message success-message">
            <FaCheckCircle className="message-icon" /> 
            <span>{success}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                {t('email')}
              </label>
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder={t('enter_email')}
                  autoComplete="username"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                {t('password')}
              </label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
              </div>
              <div className="forgot-password-row">
                <Link to="/forgot-password" className="forgot-password">
                  {t('forgot_password')}
                </Link>
              </div>
            </div>
            
            {/* Remember Me Checkbox */}
            <div className="form-group remember-me">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="checkbox-input"
                  disabled={loading}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">{t('remember_me')}</span>
              </label>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || authLoading}
            >
              {loading || authLoading ? (
                <>
                  <FaSpinner className="spinner" />
                  {t('signing_in')}...
                </>
              ) : (
                <>
                  <FaSignInAlt className="btn-icon" />
                  {t('sign_in')}
                </>
              )}
            </button>
            
            {/* Social login removed for a cleaner UI */}
        </form>

        {/* Registration Link */}
        <div className="auth-footer">
          {t('dont_have_account')}{' '}
          <Link to="/register" className="auth-link">
            {t('sign_up')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;