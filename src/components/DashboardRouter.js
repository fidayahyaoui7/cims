import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PatientDashboard from './dashboard/PatientDashboard';
import DoctorDashboard from './dashboard/DoctorDashboard';
import AdminDashboard from './dashboard/AdminDashboard';
import './DashboardRouter.css';

const DashboardRouter = ({ role: propRole }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          throw new Error('No user found. Please log in.');
        }

        const parsedUser = JSON.parse(storedUser);
        
        // Determine user role (check both role and userType for backward compatibility)
        const userRole = parsedUser.role || parsedUser.userType;
        if (!userRole) {
          throw new Error('User role not defined');
        }

        // If a specific role is required but doesn't match, redirect to login
        if (propRole && userRole !== propRole) {
          throw new Error(`Unauthorized access to ${propRole} dashboard`);
        }

        setUser({
          ...parsedUser,
          role: userRole // Ensure we have a consistent role property
        });
      } catch (error) {
        console.error('Authentication error:', error);
        setError(error.message);
        // Store the current location to redirect back after login
        navigate('/login', { 
          state: { 
            from: location,
            error: error.message
          },
          replace: true 
        });
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate, location, propRole]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary">
          Go to Login
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="alert alert-danger">
        User data not found. Please <a href="/login">log in</a>.
      </div>
    );
  }

  // At this point, user should be defined and have a role
  const userRole = user.role?.toLowerCase();

  // Render the appropriate dashboard based on user role
  switch (userRole) {
    case 'doctor':
      return <DoctorDashboard user={user} />;
    case 'admin':
      return <AdminDashboard user={user} />;
    case 'patient':
      return <PatientDashboard user={user} />;
    default:
      // This should not happen due to our earlier checks, but just in case
      console.error('Unknown user role:', userRole);
      return (
        <div className="error-container">
          <h2>Access Denied</h2>
          <p>Your account does not have permission to access this dashboard.</p>
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-primary"
          >
            Return Home
          </button>
        </div>
      );
  }
};

export default DashboardRouter;