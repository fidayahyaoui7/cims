import React, { Suspense, lazy, useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'leaflet/dist/leaflet.css';
import './styles/theme.css';
import MedicalCentersPage from './pages/MedicalCentersPage';

// Context
import { useAuth } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';

// Lazy load pages for better performance
const LoginPage = lazy(() => import('./components/auth/LoginPage'));
const RegisterPage = lazy(() => import('./components/auth/RegisterPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const CenterDetailPage = lazy(() => import('./pages/CenterDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const HelpPage = lazy(() => import('./pages/HelpPage'));
const CityPage = lazy(() => import('./pages/CityPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const UnifiedHospitalsPage = lazy(() => import('./pages/UnifiedHospitalsPage'));
const TunisianHospitalsPage = lazy(() => import('./pages/TunisianHospitalsPage'));
const CharlesNicollePage = lazy(() => import('./pages/CharlesNicollePage'));
const CentersPage = lazy(() => import('./pages/CentersPage'));
const HospitalsListPage = lazy(() => import('./pages/HospitalsListPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const OHIFViewerPage = lazy(() => import('./pages/OHIFViewerPage'));
const RadiologyInfoHomePage = lazy(() => import('./pages/RadiologyInfoHomePage'));
const AuthLayout = lazy(() => import('./components/layout/AuthLayout'));
const HomePage = lazy(() => import('./HomePage'));
const BookingFlow = lazy(() => import('./components/booking/BookingFlow'));
const AppointmentsListPage = lazy(() => import('./pages/AppointmentsListPage'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));

// Booking Wizard pages
const ExamSelection = lazy(() => import('./pages/booking/ExamSelection'));
const RegionSelection = lazy(() => import('./pages/booking/RegionSelection'));
const CenterSelection = lazy(() => import('./pages/booking/CenterSelection'));
const DateTimeSelection = lazy(() => import('./components/booking/steps/DateTimeSelection'));
const PatientInfo = lazy(() => import('./pages/booking/PatientInfo'));
const AppointmentConfirmation = lazy(() => import('./pages/booking/AppointmentConfirmation'));
const PrefillCenterRoute = lazy(() => import('./pages/booking/PrefillCenterRoute'));

// Patient Dashboard Pages
const PatientDashboard = lazy(() => import('./pages/patient/DashboardPage'));
const PatientAppointments = lazy(() => import('./pages/patient/AppointmentsPage'));
const PatientMessages = lazy(() => import('./pages/patient/MessagesPage'));
const PatientMedicalRecords = lazy(() => import('./pages/patient/MedicalRecordsPage'));
const PatientHealthTracker = lazy(() => import('./pages/patient/HealthTrackerPage'));
const PatientFavorites = lazy(() => import('./pages/patient/FavoritesPage'));
const ProfilePage = lazy(() => import('./pages/patient/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/patient/SettingsPage'));
const NotificationsPage = lazy(() => import('./pages/patient/NotificationsPage'));
const BillingPage = lazy(() => import('./pages/patient/BillingPage'));
const SupportPage = lazy(() => import('./pages/patient/SupportPage'));

// Components
const Layout = lazy(() => import('./components/layout/Layout'));
const PatientLayout = lazy(() => import('./components/layout/PatientLayout'));
const ProtectedRoute = lazy(() => import('./components/routes/ProtectedRoute'));
const PublicRoute = lazy(() => import('./components/routes/PublicRoute'));
const PatientRoute = lazy(() => import('./components/routes/PatientRoute'));
const AuthWrapper = lazy(() => import('./components/auth/AuthWrapper'));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Error Boundary to surface runtime errors in routing tree
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
          <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
          <p className="text-sm opacity-80 mb-4">An unexpected error occurred while rendering this page.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const location = useLocation();
  const { currentUser } = useAuth();

  // Set document title based on route
  useEffect(() => {
    const path = location.pathname;
    let title = 'Medical Appointment Platform';
    
    if (path.startsWith('/patient')) {
      title = 'Patient Dashboard | ' + title;
    } else if (path.startsWith('/book')) {
      title = 'Book Appointment | ' + title;
    } else if (path === '/login') {
      title = 'Login | ' + title;
    } else if (path === '/register') {
      title = 'Register | ' + title;
    }
    
    document.title = title;
  }, [location]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prevMode => !prevMode);
  }, []);

  const toggleRTL = useCallback(() => {
    setIsRTL(prev => !prev);
    document.documentElement.dir = isRTL ? 'ltr' : 'rtl';
  }, [isRTL]);

  // Create theme based on dark mode and RTL settings
  const theme = React.useMemo(
    () =>
      createTheme({
        direction: isRTL ? 'rtl' : 'ltr',
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: {
            main: '#2563eb',
          },
          secondary: {
            main: '#7c3aed',
          },
          background: {
            default: isDarkMode ? '#111827' : '#f9fafb',
            paper: isDarkMode ? '#1f2937' : '#ffffff',
          },
        },
        typography: {
          fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
          ].join(','),
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollBehavior: 'smooth',
              },
            },
          },
        },
      }),
    [isDarkMode, isRTL]
  );

  // Check if current route should show header
  const isPatientRoute = location.pathname.startsWith('/patient');
  const isAuthRoute = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  const isTunisianHospitalsRoute = location.pathname === '/tunisian-hospitals';
  const shouldShowHeader = !isPatientRoute && !isAuthRoute && !isTunisianHospitalsRoute;

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthWrapper>
          <BookingProvider>
            <ErrorBoundary>
              <div id="app-root" className={`flex flex-col min-h-screen ${isDarkMode ? 'dark' : ''}`}>
                <Layout hideHeader={!shouldShowHeader}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<MedicalCentersPage />} />
                      <Route path="/home" element={<HomePage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/centers" element={<CentersPage />} />
                      <Route path="/centers/:id" element={<CenterDetailPage />} />
                      <Route path="/hospitals" element={<HospitalsListPage />} />
                      <Route path="/charles-nicolle" element={<CharlesNicollePage />} />
                      <Route path="/map" element={<MapPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/help" element={<HelpPage />} />
                      <Route path="/city/:cityName" element={<CityPage />} />
                      <Route path="/radiology-info" element={<RadiologyInfoHomePage />} />

                      {/* Auth Routes */}
                      <Route
                        path="/login"
                        element={
                          <PublicRoute>
                            <LoginPage />
                          </PublicRoute>
                        }
                      />
                      <Route
                        path="/register"
                        element={
                          <PublicRoute>
                            <RegisterPage />
                          </PublicRoute>
                        }
                      />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                      {/* Booking Flow - Accessible without login */}
                      <Route path="/book" element={<BookingFlow />} />

                      {/* OHIF Viewer Route */}
                      <Route 
                        path="/viewer" 
                        element={
                          <ProtectedRoute>
                            <OHIFViewerPage />
                          </ProtectedRoute>
                        } 
                      />

                      {/* Confirmation is now handled within the BookingFlow component */}

                      {/* Patient Dashboard */}
                      <Route 
                        path="/patient" 
                        element={
                          <PatientRoute>
                            <PatientLayout />
                          </PatientRoute>
                        }
                      >
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<PatientDashboard />} />
                        <Route path="appointments" element={<PatientAppointments />} />
                        <Route path="messages" element={<PatientMessages />} />
                        <Route path="medical-records" element={<PatientMedicalRecords />} />
                        <Route path="health-tracker" element={<PatientHealthTracker />} />
                        <Route path="favorites" element={<PatientFavorites />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="notifications" element={<NotificationsPage />} />
                        <Route path="billing" element={<BillingPage />} />
                        <Route path="support" element={<SupportPage />} />
                      </Route>

                      {/* Unified Hospitals Route */}
                      <Route 
                        path="/unified-hospitals" 
                        element={
                          <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} isRTL={isRTL}>
                            <UnifiedHospitalsPage />
                          </Layout>
                        } 
                      />
                      
                      {/* Tunisian Hospitals Route */}
                      <Route 
                        path="/tunisian-hospitals" 
                        element={
                          <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} isRTL={isRTL}>
                            <TunisianHospitalsPage />
                          </Layout>
                        } 
                      />
                      
                      {/* 404 Route */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </Layout>
                
                <ToastContainer 
                  position="bottom-right" 
                  autoClose={5000} 
                  theme={isDarkMode ? 'dark' : 'light'} 
                />
              </div>
            </ErrorBoundary>
          </BookingProvider>
        </AuthWrapper>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;
