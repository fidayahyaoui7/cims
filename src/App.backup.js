import React, { Suspense, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layouts
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';

// Routes
import PublicRoute from './components/routes/PublicRoute';
import ProtectedRoute from './components/routes/ProtectedRoute';

// Pages
const TestPage = React.lazy(() => import('./pages/TestPage'));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPasswordPage'));
const AppointmentsListPage = React.lazy(() => import('./pages/AppointmentsListPage'));
const DateTimeSelection = React.lazy(() => import('./pages/booking/DateTimeSelection'));
const PatientInfo = React.lazy(() => import('./pages/booking/PatientInfo'));
const MessagesPage = React.lazy(() => import('./pages/MessagesPage'));
const AppointmentBookingPage = React.lazy(() => import('./pages/AppointmentBookingPage'));
const ExamSelection = React.lazy(() => import('./pages/booking/ExamSelection'));
const RegionSelection = React.lazy(() => import('./pages/booking/RegionSelection'));
const CenterSelection = React.lazy(() => import('./pages/booking/CenterSelection'));
const Confirmation = React.lazy(() => import('./pages/booking/Confirmation'));
const PrefillCenterRoute = React.lazy(() => import('./components/routes/PrefillCenterRoute'));
const OHIFViewerPage = React.lazy(() => import('./pages/OHIFViewerPage'));
const UnifiedHospitalsPage = React.lazy(() => import('./pages/hospitals/UnifiedHospitalsPage'));
const TunisianHospitalsPage = React.lazy(() => import('./pages/hospitals/TunisianHospitalsPage'));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const theme = createTheme({
    direction: isRTL ? 'rtl' : 'ltr',
  });

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleRTL = () => setIsRTL(!isRTL);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<TestPage />} />
            
            {/* Auth Routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <AuthLayout>
                    <LoginPage />
                  </AuthLayout>
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <AuthLayout>
                    <RegisterPage />
                  </AuthLayout>
                </PublicRoute>
              } 
            />
            <Route 
              path="/forgot-password" 
              element={
                <PublicRoute>
                  <AuthLayout>
                    <ForgotPasswordPage />
                  </AuthLayout>
                </PublicRoute>
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/appointments" 
              element={
                <ProtectedRoute>
                  <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} isRTL={isRTL}>
                    <AppointmentsListPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Booking Wizard Routes */}
            <Route 
              path="/book-wizard" 
              element={
                <ProtectedRoute>
                  <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} isRTL={isRTL}>
                    <ExamSelection />
                  </Layout>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="region" replace />} />
              <Route path="region" element={<RegionSelection />} />
              <Route path="center" element={<CenterSelection />} />
              <Route path="datetime" element={<DateTimeSelection />} />
              <Route path="patient-info" element={<PatientInfo />} />
              <Route path="confirmation" element={<Confirmation />} />
              <Route path="prefill/:centerId" element={<PrefillCenterRoute />} />
            </Route>

            {/* Individual Booking Routes */}
            <Route 
              path="/booking/date-time" 
              element={
                <ProtectedRoute>
                  <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} isRTL={isRTL}>
                    <DateTimeSelection />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/booking/patient-info" 
              element={
                <ProtectedRoute>
                  <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} isRTL={isRTL}>
                    <PatientInfo />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} isRTL={isRTL}>
                    <MessagesPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/book/:centerId" 
              element={
                <ProtectedRoute>
                  <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} isRTL={isRTL}>
                    <AppointmentBookingPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* OHIF Viewer Route */}
            <Route 
              path="/viewer" 
              element={
                <ProtectedRoute>
                  <OHIFViewerPage />
                </ProtectedRoute>
              } 
            />

            {/* Hospital Routes */}
            <Route 
              path="/unified-hospitals" 
              element={
                <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} isRTL={isRTL}>
                  <UnifiedHospitalsPage />
                </Layout>
              } 
            />
            
            <Route 
              path="/tunisian-hospitals/*" 
              element={
                <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} isRTL={isRTL}>
                  <TunisianHospitalsPage />
                </Layout>
              } 
            />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;