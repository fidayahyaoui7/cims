import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ allowedRoles, redirectPath = '/login', children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('user');
        
        if (!userData) {
          setIsAuthorized(false);
          return;
        }

        const user = JSON.parse(userData);
        if (!user) {
          setIsAuthorized(false);
          return;
        }

        // Normalize backend roles to app roles
        const rawRole = user.role || user.userType;
        const normalizedRole = (() => {
          if (!rawRole) return null;
          const r = String(rawRole).toUpperCase();
          if (r === 'PATIENT') return 'patient';
          if (r === 'RADIOLOGIST' || r === 'DOCTOR') return 'doctor';
          if (r === 'ADMIN') return 'admin';
          // fallback: use lowercase value
          return String(rawRole).toLowerCase();
        })();
        
        if (!normalizedRole) {
          console.error('User has no role defined');
          setIsAuthorized(false);
          return;
        }

        // If no specific roles are required, just check if user is authenticated
        if (!allowedRoles || allowedRoles.length === 0) {
          setIsAuthorized(true);
          return;
        }

        if (Array.isArray(allowedRoles) && !allowedRoles.includes(normalizedRole)) {
          console.warn(`User with role ${normalizedRole} is not authorized for this route`);
          setIsAuthorized(false);
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [allowedRoles, location]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthorized) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If children are passed, render them, otherwise render Outlet for nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;