import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserMd, FaIdBadge } from 'react-icons/fa';
import i18n from '../../i18n';
import './Auth.css';

const RegisterPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userType: 'patient',
    specialty: '',
    licenseNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerWithContext, loading: authLoading } = useAuth();

  // Check for redirect message from other pages
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, '');
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for the current field when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = t('field_required', { field: t('full_name') });
      isValid = false;
    }

     if (!formData.email.trim()) {
      errors.email = t('field_required', { field: t('email_address') });
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('invalid_email');
      isValid = false;
    }

    if (!formData.password) {
      errors.password = t('field_required', { field: t('password') });
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = t('password_too_short');
      isValid = false;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = t('field_required', { field: t('confirm_password') });
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('passwords_dont_match');
      isValid = false;
    }

    // Doctor-specific fields
    if (String(formData.userType).toLowerCase() === 'doctor') {
      if (!formData.specialty.trim()) {
        errors.specialty = t('field_required', { field: t('specialty') });
        isValid = false;
      }
      if (!formData.licenseNumber.trim()) {
        errors.licenseNumber = t('field_required', { field: t('license_number') });
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  // Enhanced registration handler with detailed error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate form
    if (!validateForm()) {
      console.log('Form validation failed');
      setLoading(false);
      return;
    }

    try {
      // Expected payload
      const userData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        name: formData.name.trim(),
        phone: formData.phone ? String(formData.phone).trim() : '',
        userType: String(formData.userType).toLowerCase(),
      };

      console.log('Attempting to register user with data:', userData);
      
      // Call the register function from auth context
      const registrationResult = await registerWithContext(userData);
      
      if (registrationResult) {
        console.log('Registration successful, result:', registrationResult);
        setSuccess(t('registration_success'));
        
        // Check if we have a user object in the result
        if (registrationResult.user) {
          console.log('User data in registration result:', registrationResult.user);
          
          // Check if we have tokens
          const hasToken = !!(registrationResult.access || registrationResult.token);
          console.log('Has access token:', hasToken);
          
          // Check if user data is in localStorage
          const storedUser = localStorage.getItem('user');
          console.log('User in localStorage:', storedUser);
          
          // The AuthContext should handle the redirection, but let's add a fallback
          setTimeout(() => {
            const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
            if (userFromStorage && userFromStorage.id) {
              const role = (userFromStorage.role || userFromStorage.userType || 'patient').toLowerCase();
              console.log('Redirecting to profile for role:', role);
              navigate(`/dashboard/${role}/profile`, { replace: true });
            } else {
              console.error('No user data found in localStorage after registration');
              setError(t('registration_redirect_failed'));
            }
          }, 1000);
        } else {
          console.error('No user data in registration result');
          setError(t('registration_complete_but_no_user_data'));
        }
      } else {
        console.error('Registration failed - no result returned from registerWithContext');
        throw new Error(t('registration_failed_no_result'));
      }
    } catch (err) {
      console.error('Registration error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        response: err.response?.data
      });
      
      // Handle different types of errors
      if (err.response?.data?.errors) {
        // Handle validation errors from the server
        const serverErrors = {};
        Object.keys(err.response.data.errors).forEach(key => {
          serverErrors[key] = err.response.data.errors[key][0];
        });
        setFormErrors(serverErrors);
      } else if (err.message.includes('Network Error')) {
        setError(t('network_error'));
      } else {
        // Show a user-friendly error message
        const errorMessage = err.response?.data?.message || 
                           err.message || 
                           t('registration_error');
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
};

  return (
    <div className="auth-container" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} lang={i18n.language || 'en'}>
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-title-container">
            <h1>{t('create_account')}</h1>
          </div>
          <p>{t('join_platform')}</p>
        </div>
        
        {error && <div className="message error-message">{error}</div>}
        {success && <div className="message success-message">{success}</div>}
        <form onSubmit={handleSubmit} className={`auth-form ${loading ? 'form-loading' : ''}`}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">{t('full_name')}</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-control ${formErrors.name ? 'input-error' : ''}`}
                disabled={loading}
                required
              />
            </div>
            {formErrors.name && <div className="error-text">{formErrors.name}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">{t('email_address')}</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-control ${formErrors.email ? 'input-error' : ''}`}
                disabled={loading}
                required
              />
            </div>
            {formErrors.email && <div className="error-text">{formErrors.email}</div>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password" className="form-label">{t('password')}</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-control ${formErrors.password ? 'input-error' : ''}`}
                  disabled={loading}
                  required
                  minLength="8"
                  placeholder={t('password_min_chars', { count: 8 }) || 'At least 8 characters'}
                />
              </div>
              {formErrors.password && <div className="error-text">{formErrors.password}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">{t('confirm_password')}</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`form-control ${formErrors.confirmPassword ? 'input-error' : ''}`}
                  disabled={loading}
                  required
                />
              </div>
              {formErrors.confirmPassword && <div className="error-text">{formErrors.confirmPassword}</div>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="phone" className="form-label">{t('phone_optional')}</label>
            <div className="input-with-icon">
              <FaPhone className="input-icon" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`form-control ${formErrors.phone ? 'input-error' : ''}`}
                disabled={loading}
                pattern="[0-9]{8,15}"
                title="Phone number should be between 8-15 digits"
              />
            </div>
            {formErrors.phone && <div className="error-text">{formErrors.phone}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="userType" className="form-label">{t('account_type')}</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              className={`form-control ${formErrors.userType ? 'input-error' : ''}`}
              disabled={loading}
              required
            >
              <option value="patient">{t('patient')}</option>
              <option value="doctor">{t('doctor')}</option>
            </select>
            {formErrors.userType && <div className="error-text">{formErrors.userType}</div>}
          </div>

          {String(formData.userType).toLowerCase() === 'doctor' && (
            <>
              <div className="form-group">
                <label htmlFor="specialty" className="form-label">{t('specialty')}</label>
                <div className="input-with-icon">
                  <FaUserMd className="input-icon" />
                  <input
                    type="text"
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className={`form-control ${formErrors.specialty ? 'input-error' : ''}`}
                    disabled={loading}
                    required
                  />
                </div>
                {formErrors.specialty && <div className="error-text">{formErrors.specialty}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="licenseNumber" className="form-label">{t('license_number')}</label>
                <div className="input-with-icon">
                  <FaIdBadge className="input-icon" />
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className={`form-control ${formErrors.licenseNumber ? 'input-error' : ''}`}
                    disabled={loading}
                    required
                  />
                </div>
                {formErrors.licenseNumber && <div className="error-text">{formErrors.licenseNumber}</div>}
              </div>
            </>
          )}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || authLoading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {t('signing_up')}
                </>
              ) : t('create_account_button')}
            </button>
          </div>
        </form>
        <div className="auth-footer">
          <p>
            {t('already_have_account')}{' '}
            <Link to="/login" className="auth-link">{t('sign_in')}</Link>
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default RegisterPage;