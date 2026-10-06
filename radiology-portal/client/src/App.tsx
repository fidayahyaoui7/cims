import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import PrivateRoute from './components/common/PrivateRoute';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CentersPage from './pages/centers/CentersPage';
import CenterDetailPage from './pages/centers/CenterDetailPage';
import AppointmentsPage from './pages/appointments/AppointmentsPage';
import BookAppointmentPage from './pages/appointments/BookAppointmentPage';
import MyStudiesPage from './pages/studies/MyStudiesPage';
import StudyDetailPage from './pages/studies/StudyDetailPage';
import MessagesPage from './pages/messages/MessagesPage';
import ProfilePage from './pages/profile/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Create a theme instance
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
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  
                  <Route path="centers">
                    <Route index element={<CentersPage />} />
                    <Route path=":id" element={<CenterDetailPage />} />
                  </Route>
                  
                  <Route path="appointments">
                    <Route index element={
                      <PrivateRoute>
                        <AppointmentsPage />
                      </PrivateRoute>
                    } />
                    <Route path="book" element={
                      <PrivateRoute>
                        <BookAppointmentPage />
                      </PrivateRoute>
                    } />
                    <Route path="book/:centerId" element={
                      <PrivateRoute>
                        <BookAppointmentPage />
                      </PrivateRoute>
                    } />
                  </Route>
                  
                  <Route path="studies">
                    <Route index element={
                      <PrivateRoute>
                        <MyStudiesPage />
                      </PrivateRoute>
                    } />
                    <Route path=":id" element={
                      <PrivateRoute>
                        <StudyDetailPage />
                      </PrivateRoute>
                    } />
                  </Route>
                  
                  <Route path="messages" element={
                    <PrivateRoute>
                      <MessagesPage />
                    </PrivateRoute>
                  } />
                  
                  <Route path="profile" element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  } />
                  
                  {/* 404 - Keep this at the end */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Router>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;
