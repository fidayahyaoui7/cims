import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Lazy load dashboard components
const DashboardLayout = lazy(() => import('../components/dashboard/DashboardLayout'));
const DashboardHome = lazy(() => import('../components/dashboard/DashboardHome'));
const Appointments = lazy(() => import('../components/dashboard/Appointments'));
const Profile = lazy(() => import('../pages/dashboard/ProfilePage'));
const Settings = lazy(() => import('../components/dashboard/Settings'));
const Messages = lazy(() => import('../components/dashboard/Messages'));
const MedicalRecords = lazy(() => import('../components/dashboard/MedicalRecords'));

// Admin specific components
const AdminDashboard = lazy(() => import('../components/admin/AdminDashboard'));
const ManageUsers = lazy(() => import('../components/admin/ManageUsers'));
const ManageCenters = lazy(() => import('../components/admin/ManageCenters'));

// Doctor specific components
const DoctorDashboard = lazy(() => import('../components/doctor/DoctorDashboard'));
const DoctorAppointments = lazy(() => import('../components/doctor/DoctorAppointments'));
const DoctorPatients = lazy(() => import('../components/doctor/DoctorPatients'));

// Patient specific components
const PatientDashboard = lazy(() => import('../components/patient/PatientDashboard'));
const BookAppointment = lazy(() => import('../components/patient/BookAppointment'));
const PatientMedicalRecords = lazy(() => import('../components/patient/MedicalRecords'));

const DashboardRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* Main dashboard route - redirects based on role */}
        <Route index element={<Navigate to="home" replace />} />
        
        {/* Common dashboard routes */}
        <Route path="home" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />
        
        {/* Profile routes */}
        <Route path="profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
        <Route path=":userType/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
        
        <Route path="settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
        
        {/* Patient specific routes */}
        <Route path="appointments" element={<DashboardLayout><Appointments /></DashboardLayout>} />
        <Route path="book-appointment" element={<DashboardLayout><BookAppointment /></DashboardLayout>} />
        <Route path="medical-records" element={<DashboardLayout><PatientMedicalRecords /></DashboardLayout>} />
        
        {/* Doctor specific routes */}
        <Route path="doctor/appointments" element={<DashboardLayout><DoctorAppointments /></DashboardLayout>} />
        <Route path="doctor/patients" element={<DashboardLayout><DoctorPatients /></DashboardLayout>} />
        
        {/* Admin specific routes */}
        <Route path="admin/dashboard" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
        <Route path="admin/users" element={<DashboardLayout><ManageUsers /></DashboardLayout>} />
        <Route path="admin/centers" element={<DashboardLayout><ManageCenters /></DashboardLayout>} />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </Suspense>
  );
};

export default DashboardRoutes;
