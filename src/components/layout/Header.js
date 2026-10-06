import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Header.css';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const accountMenuRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const changeLanguage = async (lng) => {
    if (i18n.language !== lng) {  // Only change if it's a different language
      try {
        await i18n.changeLanguage(lng);
        localStorage.setItem('i18nextLng', lng);
        document.documentElement.lang = lng;
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
        
        // Force re-render by updating state
        setCurrentLanguage(lng);
      } catch (error) {
        console.error('Error changing language:', error);
      }
    }
  };
  
  // State to track current language
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  
  // Update current language when i18n language changes
  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      setCurrentLanguage(lng);
    };
    
    i18n.on('languageChanged', handleLanguageChanged);
    
    // Set initial language and direction
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const dashboardPath = () => {
    const raw = (user && (user.role || user.userType)) || 'patient';
    const role = String(raw).toLowerCase();
    if (role === 'patient') return '/dashboard/patient';
    if (role === 'radiologist' || role === 'doctor') return '/dashboard/doctor';
    if (role === 'admin') return '/dashboard/admin';
    return '/dashboard/patient';
  };

  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Function to handle booking navigation
  const handleBookAppointment = (e) => {
    e?.preventDefault();
    setMobileMenuOpen(false);
    
    // Clear any previous booking data
    try {
      localStorage.removeItem('selectedExam');
      localStorage.removeItem('selectedRegion');
      localStorage.removeItem('selectedCenter');
      localStorage.removeItem('selectedDateTime');
    } catch (error) {
      console.error('Error clearing booking data:', error);
    }
    
    // Directly navigate to the booking flow
    navigate('/book', { replace: true });
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="logo">
          {t('app_name', 'Medical Platform')}
        </Link>
        
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-wrapper ${mobileMenuOpen ? 'open' : ''}`}>
          <nav className="main-nav">
            <ul className="nav-links">
              <li>
                <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>
                  {t('home', 'Home')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/hospitals" 
                  className={location.pathname.startsWith('/hospitals') ? 'active' : ''}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('tunisian_hospitals', 'Tunisian Hospitals')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/map" 
                  className={location.pathname === '/map' ? 'active' : ''}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('map', 'Map')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className={location.pathname === '/about' ? 'active' : ''}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('about', 'About')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/help" 
                  className={location.pathname === '/help' ? 'active' : ''}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('help', 'Help')}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
              <div className="language-selector" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                <button 
                  type="button"
                  onClick={() => changeLanguage('ar')} 
                  className={currentLanguage === 'ar' ? 'active' : ''}
                  aria-label={t('switch_to_arabic', 'Switch to Arabic')}
                  aria-pressed={currentLanguage === 'ar'}
                >
                  عربي
                </button>
                <button 
                  type="button"
                  onClick={() => changeLanguage('en')} 
                  className={currentLanguage === 'en' ? 'active' : ''}
                  aria-label={t('switch_to_english', 'Switch to English')}
                  aria-pressed={currentLanguage === 'en'}
                >
                  EN
                </button>
                <button 
                  type="button"
                  onClick={() => changeLanguage('fr')} 
                  className={currentLanguage === 'fr' ? 'active' : ''}
                  aria-label={t('switch_to_french', 'Switch to French')}
                  aria-pressed={currentLanguage === 'fr'}
                >
                  FR
                </button>
              </div>

            {user ? (
            <div className="user-menu" ref={accountMenuRef}>
              <button 
                type="button"
                className="btn btn-primary"
                onClick={handleBookAppointment}
              >
                {t('book_appointment', 'Book Appointment')}
              </button>
              <div className="account-dropdown">
                <button
                  type="button"
                  className="btn btn-outline account-button"
                  onClick={() => setAccountOpen(!accountOpen)}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                >
                  <span className="account-name">{user.displayName || user.email || t('account', 'Account')}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                {accountOpen && (
                  <div className="account-menu" role="menu">
                    <Link 
                      role="menuitem" 
                      to={dashboardPath()} 
                      className="menu-item"
                      onClick={() => setAccountOpen(false)}
                    >
                      {t('dashboard', 'Dashboard')}
                    </Link>
                    <Link 
                      role="menuitem" 
                      to="/appointments" 
                      className="menu-item"
                      onClick={() => setAccountOpen(false)}
                    >
                      {t('my_appointments', 'My Appointments')}
                    </Link>
                    <Link 
                      role="menuitem" 
                      to="/profile" 
                      className="menu-item"
                      onClick={() => setAccountOpen(false)}
                    >
                      {t('profile', 'Profile')}
                    </Link>
                    <button 
                      role="menuitem" 
                      className="menu-item menu-danger" 
                      onClick={() => {
                        setAccountOpen(false);
                        handleLogout();
                      }}
                    >
                      {t('logout', 'Logout')}
                    </button>
                  </div>
                )}
              </div>
            </div>
            ) : (
              <div className="auth-buttons">
                  <button 
                    type="button"
                    className="btn btn-primary"
                    onClick={handleBookAppointment}
                  >
                    {t('book_appointment', 'Book Appointment')}
                  </button>
                <Link 
                  to="/login" 
                  className="btn btn-outline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('login', 'Login')}
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-outline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('register', 'Register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
