import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState, useContext } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context
import { AuthContext, AuthProvider } from './contexts/AuthContext';

// Pages
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import SearchPage from './pages/SearchPage';
import CenterDetailPageNew from './pages/CenterDetailPageNew';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import CityPage from './pages/CityPage';
import MapPage from './pages/MapPage';
import UnifiedHospitalsPage from './pages/UnifiedHospitalsPage';
import TunisianHospitalsPage from './pages/TunisianHospitalsPage';
import CharlesNicollePage from './pages/CharlesNicollePage';
import CentersPage from './pages/CentersPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OHIFViewerPage from './pages/OHIFViewerPage';
import RadiologyInfoHomePage from './pages/RadiologyInfoHomePage';

// Components
import Layout from './components/layout/Layout';
import DashboardRouter from './components/dashboard/DashboardRouter';

// Styles
import './styles/theme.css';
import 'leaflet/dist/leaflet.css';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
  },
});

// Public route wrapper - Only for unauthenticated users
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
};

// Protected route wrapper - Only for authenticated users
const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};

// Auth wrapper component to handle authentication state
const AuthWrapper = ({ children }) => {
  const { checkAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setLoading(false);
    };
    verifyAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <AuthWrapper>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } />
                <Route path="/register" element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                } />
                <Route path="/forgot-password" element={
                  <PublicRoute>
                    <ForgotPasswordPage />
                  </PublicRoute>
                } />
                
                {/* Protected Routes */}
                <Route path="/dashboard/*" element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                } />
                
                {/* Public Layout Routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<SearchPage />} />
                  <Route path="centers" element={<CentersPage />} />
                  <Route path="center/:id" element={<CenterDetailPageNew />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="help" element={<HelpPage />} />
                  <Route path="city/:city" element={<CityPage />} />
                  <Route path="map" element={<MapPage />} />
                  <Route path="hospitals" element={<UnifiedHospitalsPage />} />
                  <Route path="tunisian-hospitals" element={<TunisianHospitalsPage />} />
                  <Route path="charles-nicolle" element={<CharlesNicollePage />} />
                  <Route path="ohif-viewer" element={<OHIFViewerPage />} />
                  <Route path="radiology-info" element={<RadiologyInfoHomePage />} />
                </Route>
                
                {/* 404 Not Found */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AuthWrapper>
            <ToastContainer 
              position="top-right" 
              autoClose={5000} 
              hideProgressBar={false} 
              newestOnTop 
              closeOnClick 
              rtl={false} 
              pauseOnFocusLoss 
              draggable 
              pauseOnHover 
            />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;
