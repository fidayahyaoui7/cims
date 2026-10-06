import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Logout user (defined early to be available to hooks below)
  const logout = useCallback(() => {
    try {
      // Clear all auth data
      localStorage.removeItem('user');
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('token'); // legacy
      
      // Clear state
      setUser(null);
      setError(null);
      
      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [navigate]);

  // Check if user is authenticated on initial load and expose as method
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('user');
      const accessToken = localStorage.getItem('access') || localStorage.getItem('token');
      const refreshTok = localStorage.getItem('refresh');

      if (storedUser && accessToken) {
        // Verify token is still valid
        const userData = JSON.parse(storedUser);
        setUser(userData);

        // If token is expired, try to refresh it
        if (isTokenExpired(accessToken) && refreshTok) {
          await refreshToken();
        }
      } else {
        // Clean up inconsistent state
        localStorage.removeItem('user');
        localStorage.removeItem('access');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Do not force logout here; allow UI to proceed and explicit actions to handle
      throw error;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false; // not a standard JWT, treat as non-expiring
      const payload = JSON.parse(atob(parts[1]));
      if (!payload.exp) return false; // no exp claim -> treat as not expired
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      // If we cannot decode, be permissive to avoid logging out users unnecessarily
      return false;
    }
  };

  // Refresh access token using refresh token
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh');
      if (!refreshToken) throw new Error('No refresh token available');
      
      const response = await fetch(`${process.env.REACT_APP_AUTH_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      
      if (!response.ok) throw new Error('Failed to refresh token');
      
      const data = await response.json();
      localStorage.setItem('access', data.accessToken);
      return data.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    }
  };

  // Login user - development mock
  const login = useCallback(async (email, password, userType = 'patient') => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock login for development
      console.log('Mock login with:', { email, userType });
      
      // Mock user data
      const mockUser = {
        id: 'dev-user-123',
        email: email || 'dev@example.com',
        name: 'Dev User',
        role: userType || 'patient',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        joinDate: new Date().toLocaleDateString(),
        lastLogin: new Date().toLocaleString(),
        phone: '+216 12 345 678',
        address: '123 Main St, Tunis, Tunisia'
      };
      
      // Mock token
      const mockToken = 'dev-mock-token';
      
      // Store mock data
      localStorage.setItem('access', mockToken);
      localStorage.setItem('token', mockToken); // for backward compatibility
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Update state
      setUser(mockUser);
      
      // Redirect to the intended URL or dashboard
      const returnUrl = location.state?.from || `/${userType}/dashboard`;
      navigate(returnUrl, { replace: true });
      
      return mockUser;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate, location.state?.from?.pathname]);

  // Register new user
  const register = async (userData) => {
    console.log('Starting registration with data:', userData);
    try {
      setLoading(true);
      setError(null);
      
      console.log('Calling authService.registerUser...');
      const response = await authService.registerUser(userData);
      console.log('Registration response:', response);
      
      if (response && response.user) {
        console.log('User data in response:', response.user);
        
        // Store the user data from registration
        console.log('Setting user state...');
        setUser(response.user);
        
        // Store tokens if available in the response
        console.log('Storing tokens in localStorage...');
        if (response.access) {
          console.log('Storing access token');
          localStorage.setItem('access', response.access);
        }
        if (response.refresh) {
          console.log('Storing refresh token');
          localStorage.setItem('refresh', response.refresh);
        }
        
        console.log('Storing user data in localStorage...');
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Set flag to hide welcome header after registration
        sessionStorage.setItem('justRegistered', 'true');
        
        // Set flag to indicate new registration
        sessionStorage.setItem('justRegistered', 'true');
        
        // Redirect to the user's profile page inside the dashboard
        const resolvedRole = (response.user.role || response.user.type || 'patient').toLowerCase();
        const profilePath = `/dashboard/${resolvedRole}/profile`;
        console.log('Navigating to:', profilePath);
        
        // Use React Router's navigate for SPA navigation
        navigate(profilePath, { replace: true });
        
        return true;
      } else {
        console.error('No user data in response:', response);
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      // Call your API to update the profile
      // const updatedUser = await api.updateUserProfile(profileData);
      // setUser(updatedUser);
      // return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    checkAuth,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading authentication...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
