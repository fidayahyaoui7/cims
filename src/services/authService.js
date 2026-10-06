// Use the same base URL as defined in the .env file
const AUTH_API_BASE_URL = process.env.REACT_APP_AUTH_URL || 'http://localhost:5002/api';
const API_BASE_URL = AUTH_API_BASE_URL + (AUTH_API_BASE_URL.endsWith('/auth') ? '' : '/auth');

// Request password reset email
export const forgotPassword = async (email) => {
  try {
    const res = await fetch(`${AUTH_API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Failed to send reset link');
    }
    return data;
  } catch (error) {
    // Normalize error
    throw new Error(error.message || 'Failed to send reset link');
  }
};

export const loginUser = async (email, password, userType) => {
  try {
    // Support both signature styles: (email, password, userType) or ({email, password, userType})
    const payload =
      typeof email === 'object' && email !== null
        ? { email: email.email, password: email.password, userType: email.userType }
        : { email, password, userType };

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        userType: userType || 'patient' // Default to 'patient' if not specified
      }),
    });

    const data = await response.json();
    // Persist tokens if present (new backend)
    try {
      if (response.access) localStorage.setItem('access', response.access);
      if (response.refresh) localStorage.setItem('refresh', response.refresh);
      if (response.access) localStorage.setItem('token', response.access); // backward compat
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch {}
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.response) {
      const message = error.response.data?.message || 
                    error.response.data?.error || 
                    'Login failed. Please check your credentials and try again.';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Could not connect to the server. Please check your internet connection.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred during login.');
    }
  }
};

export const registerUser = async (userData) => {
  try {
    const registerUrl = `${API_BASE_URL}/register`;
    console.log('Sending registration request to:', registerUrl);
    console.log('Registration data:', JSON.stringify(userData, null, 2));
    
    const response = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Registration failed:', data);
      throw new Error(data.error || 'Registration failed');
    }
    
    console.log('Registration successful:', data);
    return data;

    // Error from backend
    if (response && response.error) {
      console.error('Registration error from backend:', response.error);
      throw new Error(response.error);
    }

    // Log the response structure for debugging
    console.log('Response keys:', Object.keys(response || {}));
    if (response) {
      console.log('Response has user property:', 'user' in response);
      console.log('Response has data property:', 'data' in response);
      console.log('Response has access/token:', 'access' in response || 'token' in response);
    }

    // Preferred new backend shape: { user, access, refresh }
    if (response && response.user) {
      console.log('Using response.user format');
      return {
        user: response.user,
        access: response.access || response.token || null,
        refresh: response.refresh || null,
      };
    }

    // Fallback: axios-like { data: { user, token } }
    if (response && response.data) {
      console.log('Using response.data format');
      const d = response.data;
      return {
        user: d.user || d,
        access: d.access || d.token || response.token || null,
        refresh: d.refresh || null,
      };
    }

    // Fallback: response is user object directly
    if (response && (response.id || response.email)) {
      console.log('Using direct user object format');
      return {
        user: response,
        access: response.access || response.token || null,
        refresh: response.refresh || null,
      };
    }

    // Unexpected shape—surface snippet for easier debugging
    const snippet = typeof response === 'object' ? JSON.stringify(response).slice(0, 200) : String(response);
    console.error('Unexpected registration response:', snippet);
    throw new Error('Unexpected response from server');
  } catch (error) {
    console.error('Error in registerUser:', error);
    // If we have a response with error data, use that
    if (error.response) {
      const errorData = await error.response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Registration failed');
    }
    // Otherwise, use the error message or a default message
    throw new Error(error.message || 'Registration failed. Please try again.');
  }
};

export const getCurrentUser = async () => {
  // Try to get user from localStorage first
  const userJson = localStorage.getItem('user');
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (error) {
      console.error('Error parsing user data:', error);
      // If there's an error parsing, clear the invalid data
      localStorage.removeItem('user');
      return null;
    }
  }
  
  // If no user in localStorage but we have a token, try to fetch the user
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }
  
  return null;
};

export const logoutUser = async () => {
  // Clear all auth-related items from localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  
  // If you have a logout endpoint, you can call it here
  try {
    await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

// Helpers to align with new flow
export function saveSession({ access, refresh, user }) {
  try {
    if (access) {
      localStorage.setItem('access', access);
      localStorage.setItem('token', access); // For backward compatibility
    }
    if (refresh) localStorage.setItem('refresh', refresh);
    if (user) localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

export function getAccess() {
  return localStorage.getItem('access') || localStorage.getItem('token');
}