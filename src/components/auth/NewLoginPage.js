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
import { loginUser } from '../../services/authService';
import './Auth.css';

const NewLoginPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'patient'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      window.history.replaceState({}, '');
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.email || !formData.password) {
      setError(t('fill_all_fields'));
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser(formData.email, formData.password, formData.userType);
      
      if (response?.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        
        setSuccess(t('login_success'));
        
        const role = (response.user.role || response.user.userType || 'patient').toLowerCase();
        
        setTimeout(() => {
          switch(role) {
            case 'admin':
              navigate('/admin/dashboard', { replace: true });
              break;
            case 'doctor':
              navigate('/doctor/dashboard', { replace: true });
              break;
            case 'patient':
            default:
              navigate('/patient/dashboard', { replace: true });
          }
        }, 1000);
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

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>{t('login')}</h1>
          <p>{t('welcome_back')}</p>
        </div>
        
        <div className="auth-body">
          {error && (
            <div className="message error-message">
              <FaExclamationCircle className="message-icon" /> {error}
            </div>
          )}
          
          {success && (
            <div className="message success-message">
              <FaCheckCircle className="message-icon" /> {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">{t('email')}</label>
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
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="password" className="form-label">{t('password')}</label>
                <Link to="/forgot-password" className="forgot-password">
                  {t('forgot_password')}?
                </Link>
              </div>
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
                  required
                />
              </div>
            </div>
            
            <div className="form-group remember-me">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  id="rememberMe"
                  className="checkbox-input"
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">{t('remember_me')}</span>
              </label>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
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
            
            <div className="divider">
              <span className="divider-text">{t('or_continue_with')}</span>
            </div>
            
            <div className="social-login">
              <button type="button" className="btn btn-social btn-google">
                <FaGoogle className="social-icon" />
                <span>{t('sign_in_with_google')}</span>
              </button>
              <button type="button" className="btn btn-social btn-facebook">
                <FaFacebookF className="social-icon" />
                <span>{t('sign_in_with_facebook')}</span>
              </button>
            </div>
          </form>
          
          <div className="auth-footer">
            {t('dont_have_account')} <Link to="/register" className="auth-link">{t('sign_up')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLoginPage;
