import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from './DashboardLayout';
import DashboardHome from './DashboardHome';
import Appointments from './Appointments';
import Profile from './Profile';
import MessagesPage from '../../pages/MessagesPage';
import PatientDashboard from '../../pages/dashboard/PatientDashboard';

const DashboardRouter = ({ isDarkMode, toggleDarkMode, isRTL }) => {
  const { user } = useAuth();
  const { userType } = useParams();

  return (
    <DashboardLayout 
      isDarkMode={isDarkMode} 
      toggleDarkMode={toggleDarkMode} 
      isRTL={isRTL}
    >
      <Routes>
        {/* When no userType segment, redirect to user's role */}
        <Route
          index
          element={
            <Navigate
              to={`/dashboard/${(user?.role || user?.type || 'patient').toLowerCase()}/profile`}
              replace
            />
          }
        />

        {/* Patient routes */}
        <Route path=":userType" element={userType === 'patient' ? <PatientDashboard /> : <DashboardHome />} />
        <Route path=":userType/profile" element={<Profile />} />
        <Route path=":userType/appointments" element={<Appointments />} />
        <Route path=":userType/messages" element={<MessagesPage />} />

        {/* Fallback inside dashboard: go to user's role */}
        <Route
          path="*"
          element={
            <Navigate
              to={`/dashboard/${(user?.role || user?.type || 'patient').toLowerCase()}/profile`}
              replace
            />
          }
        />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRouter;
