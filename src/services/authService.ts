import { jwtDecode } from 'jwt-decode';

// Types
type User = {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin';
  token: string;
  expiresIn: number;
};

// Key for storing user data in localStorage
const AUTH_USER_KEY = 'authUser';

/**
 * Get the current authenticated user from localStorage
 */
const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    
    // Check if token is expired
    if (isTokenExpired(user.token)) {
      logout();
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Check if the current user is authenticated
 */
const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

/**
 * Check if the current user has a specific role
 */
const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user?.role === role;
};

/**
 * Login user and save user data to localStorage
 */
const login = (userData: Omit<User, 'expiresIn'>, token: string): User => {
  try {
    // Decode token to get expiration
    const decodedToken: any = jwtDecode(token);
    const expiresIn = decodedToken.exp * 1000; // Convert to milliseconds
    
    const user: User = {
      ...userData,
      token,
      expiresIn,
    };
    
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Error during login:', error);
    throw new Error('Failed to process login');
  }
};

/**
 * Logout user by removing user data from localStorage
 */
const logout = (): void => {
  try {
    localStorage.removeItem(AUTH_USER_KEY);
    // Redirect to login page
    window.location.href = '/login';
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

/**
 * Check if the JWT token is expired
 */
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If there's an error, consider token as expired
  }
};

/**
 * Get the authorization header with JWT token
 */
const getAuthHeader = (): { Authorization: string } | {} => {
  const user = getCurrentUser();
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

/**
 * Get the JWT token
 */
const getToken = (): string | null => {
  const user = getCurrentUser();
  return user?.token || null;
};

/**
 * Check if the user has a specific permission
 * (You can extend this based on your permission system)
 */
const hasPermission = (permission: string): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Example permission check (extend based on your needs)
  switch (user.role) {
    case 'admin':
      return true;
    case 'doctor':
      return ['view_appointments', 'manage_own_appointments'].includes(permission);
    case 'patient':
      return ['view_own_appointments', 'book_appointments'].includes(permission);
    default:
      return false;
  }
};
