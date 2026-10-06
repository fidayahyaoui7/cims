import React, { lazy, Suspense, useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth } from './contexts/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheckCircle } from 'react-icons/fa';
import ErrorBoundary from './components/common/ErrorBoundary';
import { BookingProvider } from './contexts/BookingContext';
import HospitalsMap from './components/HospitalsMap';
import './App.css';

// Lazy load components
const TunisianHospitalsImproved = lazy(() => import('./pages/TunisianHospitalsImproved'));
const HospitalDetailPage = lazy(() => import('./pages/hospitals/HospitalDetailPage'));
const HospitalsHomePage = lazy(() => import('./pages/hospitals/HospitalsHomePage'));
const RegionHospitalsPage = lazy(() => import('./pages/hospitals/RegionHospitalsPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const RadiologyTypeSelection = lazy(() => import('./pages/booking/RadiologyTypeSelection'));
const RegionSelection = lazy(() => import('./pages/booking/RegionSelection'));
const CenterSelection = lazy(() => import('./pages/booking/CenterSelection'));
const DateTimeSelection = lazy(() => 
  import('./pages/booking/DateTimeSelection.jsx').catch(() => ({
    default: () => (
      <div className="p-4 text-center">
        <p className="text-red-500">Error loading Date/Time selection. Please refresh the page.</p>
      </div>
    )
  }))
);
const Confirmation = lazy(() => import('./pages/booking/Confirmation'));
const PatientInfo = lazy(() => import('./pages/booking/PatientInfo'));
const Layout = lazy(() => import('./components/layout/Layout'));
const PatientLayout = lazy(() => import('./components/layout/PatientLayout'));
const HomePage = lazy(() => import('./pages/HomePage'));
const CenterDetailPage = lazy(() => import('./pages/CenterDetailPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));
const TranslationTest = lazy(() => import('./components/TranslationTest'));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Simple Protected Route
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div>Loading...</div>; // or a loading spinner
  }
  
  return user ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}

// Patient Route wrapper
function PatientRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div>Loading...</div>; // or a loading spinner
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  return children || <Outlet />;
}

// Theme configuration with RTL support
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    mode: 'light',
  },
  direction: 'ltr',
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 500 },
    h2: { fontSize: '2rem', fontWeight: 500 },
  },
});

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const location = useLocation();
  const { currentUser } = useAuth();

  // Set document title based on route
  useEffect(() => {
    const routeTitles = {
      '/': 'Home',
      '/hospitals/tunisia': 'Tunisian Hospitals',
      '/map': 'Map',
      '/book': 'Book Appointment',
    };

    const currentTitle = routeTitles[location.pathname] || 'Medical Platform';
    document.title = currentTitle;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [location, isRTL, isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const toggleRTL = useCallback(() => {
    setIsRTL(prev => !prev);
  }, []);

  // Layout wrapper component with theme props
  const LayoutWrapper = ({ children }) => (
    <Layout isDarkMode={isDarkMode} isRTL={isRTL}>
      {children}
    </Layout>
  );

  return (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <ErrorBoundary>
          <BookingProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <LayoutWrapper>
                  <HomePage 
                    isDarkMode={isDarkMode} 
                    toggleDarkMode={toggleDarkMode} 
                    isRTL={isRTL} 
                    toggleRTL={toggleRTL} 
                  />
                </LayoutWrapper>
              } />
              
              {/* Tunisian Hospitals - New structure */}
              <Route path="/hospitals" element={
                <LayoutWrapper>
                  <HospitalsHomePage />
                </LayoutWrapper>
              } />
              <Route path="/hospitals/region/:regionId" element={
                <LayoutWrapper>
                  <RegionHospitalsPage />
                </LayoutWrapper>
              } />
              <Route path="/hospitals/hospital/:id" element={
                <LayoutWrapper>
                  <HospitalDetailPage />
                </LayoutWrapper>
              } />
              {/* Keep old route for backward compatibility */}
              <Route path="/hospitals/:id" element={
                <LayoutWrapper>
                  <HospitalDetailPage />
                </LayoutWrapper>
              } />
              <Route path="/hospitals-improved" element={
                <LayoutWrapper>
                  <TunisianHospitalsImproved />
                </LayoutWrapper>
              } />
              
              {/* Redirect old /tunisian-hospitals to /hospitals */}
              <Route path="/tunisian-hospitals" element={
                <Navigate to="/hospitals" replace />
              } />
              
              <Route path="/centers/:centerId" element={
                <LayoutWrapper>
                  <CenterDetailPage />
                </LayoutWrapper>
              } />
              

              <Route path="/map" element={
                <LayoutWrapper>
                  <MapPage />
                </LayoutWrapper>
              } />

              <Route path="/hospitals-map" element={
                <LayoutWrapper>
                  <HospitalsMap />
                </LayoutWrapper>
              } />

              <Route path="/login" element={
                currentUser ? <Navigate to="/" replace /> : 
                <Layout hideHeader>
                  <LoginPage />
                </Layout>
              } />

              <Route path="/register" element={
                currentUser ? <Navigate to="/" replace /> : 
                <Layout hideHeader>
                  <RegisterPage />
                </Layout>
              } />

              {/* About and Help pages */}
              <Route path="/about" element={
                <LayoutWrapper>
                  <div className="container mx-auto p-4">
                    <h1 className="text-3xl font-bold mb-4">About Medical Platform</h1>
                    <p className="mb-4">Your trusted healthcare partner in Tunisia.</p>
                  </div>
                </LayoutWrapper>
              } />

              <Route path="/help" element={
                <LayoutWrapper>
                  <div className="container mx-auto p-4">
                    <h1 className="text-3xl font-bold mb-4">Help & Support</h1>
                    <p className="mb-4">How can we help you today?</p>
                  </div>
                </LayoutWrapper>
              } />

              {/* Booking Flow - No authentication required */}
              <Route path="/book" element={
                <LayoutWrapper>
                  <Outlet />
                </LayoutWrapper>
              }>
                <Route index element={<Navigate to="exam-type" replace />} />
                <Route path="exam-type" element={<RadiologyTypeSelection />} />
                <Route path="region" element={<RegionSelection />} />
                <Route path="center" element={<CenterSelection />} />
                <Route path="datetime" element={<DateTimeSelection />} />
                <Route path="patient-info" element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <PatientInfo />
                  </Suspense>
                } />
                <Route path="confirmation" element={<Confirmation />} />
                <Route path="success" element={
                  <div className="p-8 text-center">
                    <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Appointment Booked Successfully!</h2>
                    <p className="mb-4">Your appointment has been confirmed. You will receive a confirmation email shortly.</p>
                    <Link to="/" className="btn btn-primary">Return to Home</Link>
                  </div>
                } />
              </Route>

              {/* Patient Routes */}
              <Route element={
                <PatientRoute>
                  <PatientLayout 
                    isDarkMode={isDarkMode}
                    isRTL={isRTL}
                  >
                    <Outlet />
                  </PatientLayout>
                </PatientRoute>
              }>
                <Route path="/patient/favorites" element={<div>Favorites feature coming soon</div>} />
                <Route path="/patient/profile" element={<div>Profile page coming soon</div>} />
              </Route>

              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/test-translation" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <TranslationTest />
                </Suspense>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              <ToastContainer 
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={isRTL}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </Suspense>
          </BookingProvider>
        </ErrorBoundary>
      </I18nextProvider>
    </ThemeProvider>
  );
}
export default App;