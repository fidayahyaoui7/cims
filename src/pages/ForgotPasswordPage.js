import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import * as authService from '../services/authService';
import { toast } from 'react-toastify';
import '../styles/AuthPages.css';

const ForgotPasswordPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const isRTL = i18n.language === 'ar';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error(t('email_required'));
      return;
    }

    try {
      setIsSubmitting(true);
      await authService.forgotPassword(email);
      setIsEmailSent(true);
      toast.success(t('reset_link_sent'));
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.response?.data?.message || t('reset_password_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className={`auth-container ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="auth-card">
          <div className="text-center mb-4">
            <div className="success-icon">
              <FaCheckCircle />
            </div>
            <h2>{t('check_your_email')}</h2>
            <p className="text-muted">
              {t('reset_link_sent_to')} <strong>{email}</strong>
            </p>
            <p className="text-muted">
              {t('reset_link_instructions')}
            </p>
          </div>
          <div className="d-grid gap-2">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              {t('back_to_login')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`auth-container ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="auth-card">
        <button 
          className="btn btn-link back-button" 
          onClick={() => navigate(-1)}
          aria-label={t('back')}
        >
          <FaArrowLeft /> {t('back')}
        </button>
        
        <div className="text-center mb-4">
          <h2>{t('forgot_password')}</h2>
          <p className="text-muted">
            {t('enter_email_for_reset')}
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              {t('email_address')}
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <FaEnvelope />
              </span>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('enter_email')}
                required
                autoFocus
              />
            </div>
          </div>
          
          <div className="d-grid gap-2">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {t('sending')}...
                </>
              ) : (
                t('send_reset_link')
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-3">
          <p className="mb-0">
            {t('remember_password')}{' '}
            <Link to="/login" className="text-primary">
              {t('back_to_login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
