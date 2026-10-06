import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PatientLayout from '../components/layout/PatientLayout';
import DashboardPage from '../pages/patient/DashboardPage';
import AppointmentsPage from '../pages/patient/AppointmentsPage';
import MessagesPage from '../pages/patient/MessagesPage';
import MedicalRecordsPage from '../pages/patient/MedicalRecordsPage';
import HealthTrackerPage from '../pages/patient/HealthTrackerPage';
import FavoritesPage from '../pages/patient/FavoritesPage';
import ProfilePage from '../pages/patient/ProfilePage';
import SettingsPage from '../pages/patient/SettingsPage';
import BookAppointmentPage from '../pages/patient/BookAppointmentPage';

const PatientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PatientLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="book-appointment" element={<BookAppointmentPage />} />
        <Route path="medical-records" element={<MedicalRecordsPage />} />
        <Route path="health-tracker" element={<HealthTrackerPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default PatientRoutes;
