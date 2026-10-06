// Base URL for the API (should match your backend server port)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';
// Auth endpoints are under the same base URL
const AUTH_API_BASE_URL = process.env.REACT_APP_AUTH_URL || API_BASE_URL;

// Unified fetch-based API call helper (axios version removed)
const USE_MOCK_ONLY = process.env.REACT_APP_USE_MOCK_ONLY === 'true';

// Mock data for development
const MOCK_APPOINTMENT_SLOTS = [
  '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
];

const MOCK_GOUVERNORATES = [
  { id: 1, name: 'Tunis', region: 'North', latitude: 36.8065, longitude: 10.1815 },
  { id: 2, name: 'Sfax', region: 'South', latitude: 34.7406, longitude: 10.7603 },
  { id: 3, name: 'Sousse', region: 'Sahel', latitude: 35.8254, longitude: 10.6360 },
];

// Alias for MOCK_GOUVERNORATES to maintain backward compatibility
const MOCK_CITIES = MOCK_GOUVERNORATES;

const MOCK_DOCTORS = [
  { id: 1, name: 'Dr. Ahmed Ben Ali', specialty: 'Cardiology', center_id: 1, email: 'ahmed@example.com', phone: '12345678' },
  { id: 2, name: 'Dr. Fatma Mansouri', specialty: 'Pediatrics', center_id: 1, email: 'fatma@example.com', phone: '23456789' },
  { id: 3, name: 'Dr. Mohamed Trabelsi', specialty: 'General Medicine', center_id: 2, email: 'mohamed@example.com', phone: '34567890' },
  { id: 4, name: 'Dr. Salma Karray', specialty: 'Gynecology', center_id: 3, email: 'salma@example.com', phone: '45678901' },
  { id: 5, name: 'Dr. Hassen Ben Salem', specialty: 'Orthopedics', center_id: 4, email: 'hassen@example.com', phone: '56789012' }
];

const MOCK_HOSPITALS = [
  { id: 1, name: 'Hôpital Charles Nicolle', address: 'Boulevard 9 Avril 1938', phone: '71331000', governorate_id: 1 },
  { id: 2, name: 'Hôpital Habib Thameur', address: 'Place du 7 Novembre', phone: '71340000', governorate_id: 1 },
];

const MOCK_SERVICES = [
  { id: 1, name: 'Cardiology', hospital_id: 1 },
  { id: 2, name: 'Pediatrics', hospital_id: 1 },
  { id: 3, name: 'General Medicine', hospital_id: 2 },
];

const MOCK_USERS = [
  { id: 1, name: 'Dr. Ahmed Ben Ali', email: 'ahmed@example.com', password: 'hashed_password', phone: '12345678', type: 'doctor', doctor_id: 1 },
  { id: 2, name: 'Dr. Fatma Mansouri', email: 'fatma@example.com', password: 'hashed_password', phone: '23456789', type: 'doctor', doctor_id: 2 },
  { id: 3, name: 'Patient One', email: 'patient@example.com', password: 'hashed_password', phone: '34567890', type: 'patient', patient_id: 1 },
];

const MOCK_APPOINTMENTS = [
  { id: 1, patient_id: 1, doctor_id: 1, date: '2023-06-15', status: 'scheduled' },
  { id: 2, patient_id: 1, doctor_id: 2, date: '2023-06-16', status: 'completed' },
];

const MOCK_CONSULTATIONS = [
  { id: 1, patient_id: 1, doctor_id: 1, prescription: 'Medication and rest' },
];

const MOCK_MESSAGES = [
  { id: 1, patient_id: 1, doctor_id: 1, message: 'Hello doctor', timestamp: '2023-06-10T10:00:00Z' },
];

const MOCK_CENTERS = [
  { id: 1, name: 'Medical Center Principal - Tunis', city_id: 1, address: '123 Avenue Habib Bourguiba, Tunis', phone: '+216 71 123 456', latitude: 36.8065, longitude: 10.1815, hours: '24/7', rating: 4.8, distance: 0.5 },
  { id: 2, name: 'Hospital Regional Ariana', city_id: 2, address: '456 Rue de la Santé, Ariana', phone: '+216 71 234 567', latitude: 36.8625, longitude: 10.1956, hours: '24/7', rating: 4.5, distance: 2.1 },
  { id: 3, name: 'Centre Médical Ben Arous', city_id: 3, address: '789 Boulevard de la Paix, Ben Arous', phone: '+216 71 345 678', latitude: 36.7531, longitude: 10.2189, hours: '8:00-18:00', rating: 4.2, distance: 3.2 },
  { id: 4, name: 'Hôpital Manouba', city_id: 4, address: '321 Rue de l\'Hôpital, Manouba', phone: '+216 71 456 789', latitude: 36.8081, longitude: 10.0972, hours: '24/7', rating: 4.0, distance: 4.5 },
  { id: 5, name: 'Centre Hospitalier Bizerte', city_id: 5, address: '654 Avenue de la Mer, Bizerte', phone: '+216 72 123 456', latitude: 37.2744, longitude: 9.8739, hours: '24/7', rating: 4.3, distance: 15.2 }
];


// Simple JWT format validator
const isValidJwt = (token) => {
  if (!token || typeof token !== 'string') return false;
  // Protect against obviously bad/huge values (e.g., stored HTML)
  if (token.length > 5000) return false;
  if (token.toLowerCase().includes('<html')) return false;
  // Basic JWT structure check: x.y.z with URL-safe base64 charset
  const jwtRegex = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
  return jwtRegex.test(token);
};

// Helper function to get auth token (validated)
const getAuthToken = () => {
  try {
    const tok = localStorage.getItem('access') || localStorage.getItem('token');
    if (!isValidJwt(tok)) {
      // Clean up any corrupted tokens to avoid 431 (Request Header Fields Too Large)
      localStorage.removeItem('access');
      localStorage.removeItem('token');
      return null;
    }
    return tok;
  } catch {
    return null;
  }
};

// Helper function to set auth token
const setAuthToken = (token) => {
  if (token) {
    // Store under both keys for compatibility
    localStorage.setItem('token', token);
    localStorage.setItem('access', token);
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('access');
  }
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  // If mock only mode is enabled, throw error immediately to trigger mock data fallback
  if (USE_MOCK_ONLY) {
    throw new Error('Mock only mode enabled');
  }

  const token = options.skipAuth ? null : getAuthToken();
  
  // Build headers first
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  // Map axios-like options to fetch
  let body = options.body;
  if (body === undefined && options.data !== undefined) {
    // Support FormData directly
    if (typeof FormData !== 'undefined' && options.data instanceof FormData) {
      body = options.data;
      // Let the browser set correct multipart boundary
      delete headers['Content-Type'];
    } else if (typeof options.data === 'string') {
      body = options.data;
    } else {
      body = JSON.stringify(options.data);
    }
  }

  // Support axios-like params into querystring
  let endpointWithQuery = endpoint;
  if (options.params && typeof options.params === 'object') {
    const usp = new URLSearchParams();
    Object.entries(options.params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') usp.append(k, String(v));
    });
    const qs = usp.toString();
    if (qs) {
      endpointWithQuery += (endpoint.includes('?') ? '&' : '?') + qs;
    }
  }

  const config = {
    method: options.method || (body ? 'POST' : 'GET'),
    headers,
    body,
    // Allow passing through other fetch options (signal, etc.)
    ...options,
  };

  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Support absolute URLs (starting with http) to allow multiple backends
    const url = /^https?:\/\//i.test(endpointWithQuery)
      ? endpointWithQuery
      : `${API_BASE_URL}${endpointWithQuery}`;

    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Safely parse body: handle empty or non-JSON responses
    const contentType = response.headers.get('content-type') || '';
    let data;
    try {
      const text = await response.text();
      if (!text) {
        data = {};
      } else if (contentType.toLowerCase().includes('application/json')) {
        try {
          data = JSON.parse(text);
        } catch {
          // Fallback if invalid JSON with JSON content-type
          data = { raw: text };
        }
      } else {
        // Non-JSON payload
        data = { raw: text };
      }
    } catch {
      data = {};
    }

    if (!response.ok) {
      const msg = (data && (data.message || data.error)) || response.statusText || 'API request failed';
      throw new Error(msg);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    
    // Handle specific error types
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await apiCall(`${AUTH_API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
      skipAuth: true,
    });
    
    // Normalize tokens from new backend { access, refresh, user }
    if (response.access || response.token) {
      const tok = response.access || response.token;
      setAuthToken(tok); // store under both keys
      try { localStorage.setItem('access', tok); } catch {}
    }
    if (response.refresh) {
      try { localStorage.setItem('refresh', response.refresh); } catch {}
    }
    if (response.user) {
      try { localStorage.setItem('user', JSON.stringify(response.user)); } catch {}
    }
    
    return response;
  },

  // Login user
  login: async ({ email, password, userType }) => {
    const response = await apiCall(`${AUTH_API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password, userType }),
      skipAuth: true,
    });
    
    if (response.access || response.token) {
      const tok = response.access || response.token;
      setAuthToken(tok);
      try { localStorage.setItem('access', tok); } catch {}
    }
    if (response.refresh) {
      try { localStorage.setItem('refresh', response.refresh); } catch {}
    }
    if (response.user) {
      try { localStorage.setItem('user', JSON.stringify(response.user)); } catch {}
    }
    
    return response;
  },

  // Get user profile
  getProfile: async () => ({
    user: {
      name: 'Dr. Example',
      email: 'doctor@example.com',
      phone: '+216 71 123 456',
      doctorInfo: {
        specialty: 'Cardiology',
        license_number: 'DOC123456',
        experience_years: 12,
        center_name: 'Medical Center Principal - Tunis'
      }
    }
  }),

  // Update user profile
  updateProfile: async (profileData) => {
    return await apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Change password
  changePassword: async (passwordData) => {
    return await apiCall('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  // Logout
  logout: () => {
    const refresh = localStorage.getItem('refresh');
    if (refresh) {
      // Fire and forget; don't block UI
      apiCall(`${AUTH_API_BASE_URL}/auth/logout`, {
        method: 'POST',
        body: JSON.stringify({ token: refresh })
      }).catch(() => {});
    }
    setAuthToken(null);
    try {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('user');
    } catch {}
  },
};

// Cities API calls
export const citiesAPI = {
  // Get all cities
  getAll: async (region) => {
    try {
      const params = region && region !== 'all' ? `?region=${region}` : '';
      const response = await apiCall(`/cities${params}`);
      return response;
    } catch (error) {
      console.log('Using mock data for cities');
      let cities = [...MOCK_CITIES];
      if (region && region !== 'all') {
        cities = MOCK_CITIES.filter(city => city.region === region);
      }
      return { cities };
    }
  },

  // Get city by ID
  getById: async (id) => {
    try {
      return await apiCall(`/cities/${id}`);
    } catch (error) {
      console.log('Using mock data for city by ID');
      const city = MOCK_CITIES.find(c => c.id === parseInt(id));
      if (!city) throw new Error('City not found');
      return { city };
    }
  },

  // Get city by name
  getByName: async (name) => {
    try {
      return await apiCall(`/cities/name/${name}`);
    } catch (error) {
      console.log('Using mock data for city by name');
      const city = MOCK_CITIES.find(c => c.name.toLowerCase() === name.toLowerCase());
      if (!city) throw new Error('City not found');
      return { city };
    }
  },

  // Get cities by region
  getByRegion: async (region) => {
    try {
      return await apiCall(`/cities/region/${region}`);
    } catch (error) {
      console.log('Using mock data for cities by region');
      const cities = MOCK_CITIES.filter(city => city.region === region);
      return { cities };
    }
  },

  // Get all regions
  getRegions: async () => {
    try {
      return await apiCall('/cities/regions/all');
    } catch (error) {
      console.log('Using mock data for regions');
      const regions = [...new Set(MOCK_CITIES.map(city => city.region))];
      return { regions };
    }
  },
};

// Medical Centers API calls
export const centersAPI = {
  // Get all centers
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.service) params.append('service', filters.service);
      
      const queryString = params.toString();
      const endpoint = queryString ? `/centers?${queryString}` : '/centers';
      return await apiCall(endpoint);
    } catch (error) {
      console.log('Using mock data for centers');
      let centers = MOCK_CENTERS;
      if (filters.city) {
        const city = MOCK_CITIES.find(c => c.name.toLowerCase() === filters.city.toLowerCase());
        if (city) {
          centers = MOCK_CENTERS.filter(center => center.city_id === city.id);
        }
      }
      return { centers };
    }
  },

  // Get center by ID
  getById: async (id) => {
    try {
      return await apiCall(`/centers/${id}`);
    } catch (error) {
      console.log('Using mock data for center by ID');
      const center = MOCK_CENTERS.find(c => c.id === parseInt(id));
      if (!center) throw new Error('Center not found');
      return { center };
    }
  },

  // Get centers by city
  getByCity: async (cityName) => {
    try {
      return await apiCall(`/centers/city/${encodeURIComponent(cityName)}`);
    } catch (error) {
      console.log('Using mock data for centers by city');
      const city = MOCK_CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase());
      if (!city) return { centers: [] };
      const centers = MOCK_CENTERS.filter(center => center.city_id === city.id);
      return { centers };
    }
  },

  // Get centers by service
  getByService: async (serviceName) => {
    try {
      return await apiCall(`/centers/service/${serviceName}`);
    } catch (error) {
      console.log('Using mock data for centers by service');
      // For mock data, return all centers since we don't have service mapping
      return { centers: MOCK_CENTERS };
    }
  },

  // Get nearby centers
  getNearby: async (lat, lng, radius = 10) => {
    try {
      return await apiCall(`/centers/nearby/${lat}/${lng}?radius=${radius}`);
    } catch (error) {
      console.log('Using mock data for nearby centers');
      // Calculate distance and filter by radius
      const centers = MOCK_CENTERS.map(center => {
        const distance = Math.sqrt(
          Math.pow(center.latitude - lat, 2) + Math.pow(center.longitude - lng, 2)
        ) * 111; // Rough conversion to km
        return { ...center, distance: Math.round(distance * 10) / 10 };
      }).filter(center => center.distance <= radius);
      
      return { centers: centers.sort((a, b) => a.distance - b.distance) };
    }
  },

  // Get all services
  getServices: async () => {
    try {
      return await apiCall('/centers/services/all');
    } catch (error) {
      console.log('Using mock data for services');
      return { services: [] };
    }
  },

  // Update center rating
  updateRating: async (id, rating) => {
    try {
      return await apiCall(`/centers/${id}/rating`, {
        method: 'PUT',
        body: JSON.stringify({ rating }),
      });
    } catch (error) {
      console.log('Using mock data for rating update');
      return { success: true, message: 'Rating updated (mock)' };
    }
  },
};

// Appointments API calls
export const appointmentsAPI = {
  // Get all appointments
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.date) params.append('date', filters.date);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/appointments?${queryString}` : '/appointments';
    return await apiCall(endpoint);
  },

  // Get appointment by ID
  getById: async (id) => {
    return await apiCall(`/appointments/${id}`);
  },

  // Create new appointment
  create: async (appointmentData) => {
    try {
      return await apiCall('/appointments', {
        method: 'POST',
        body: JSON.stringify(appointmentData),
      });
    } catch (error) {
      console.log('Using mock data for appointment creation');
      return { success: true, message: 'Appointment created (mock)', id: Date.now() };
    }
  },

  // Update appointment status
  updateStatus: async (id, status) => {
    return await apiCall(`/appointments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Cancel appointment
  cancel: async (id) => {
    return await apiCall(`/appointments/${id}`, {
      method: 'DELETE',
    });
  },

  // Get available time slots
  getAvailableSlots: async (doctorId, date) => {
    try {
      return await apiCall(`/appointments/slots/${doctorId}/${date}`);
    } catch (error) {
      console.log('Using mock data for available slots');
      return { availableSlots: MOCK_APPOINTMENT_SLOTS };
    }
  },

  // Get doctor's appointments
  getDoctorAppointments: async (doctorId, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.date) params.append('date', filters.date);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/appointments/doctor/${doctorId}?${queryString}` : `/appointments/doctor/${doctorId}`;
    return await apiCall(endpoint);
  },
};

// Users API calls
export const usersAPI = {
  // Get all doctors
  getDoctors: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.specialty) params.append('specialty', filters.specialty);
      if (filters.centerId) params.append('centerId', filters.centerId);
      
      const queryString = params.toString();
      const endpoint = queryString ? `/users/doctors?${queryString}` : '/users/doctors';
      return await apiCall(endpoint);
    } catch (error) {
      console.log('Using mock data for doctors');
      let doctors = MOCK_DOCTORS;
      if (filters.centerId) {
        doctors = MOCK_DOCTORS.filter(doctor => doctor.center_id === parseInt(filters.centerId));
      }
      if (filters.specialty) {
        doctors = doctors.filter(doctor => 
          doctor.specialty.toLowerCase().includes(filters.specialty.toLowerCase())
        );
      }
      return { doctors };
    }
  },

  // Get doctor by ID
  getDoctorById: async (id) => {
    try {
      return await apiCall(`/users/doctors/${id}`);
    } catch (error) {
      console.log('Using mock data for doctor by ID');
      const doctor = MOCK_DOCTORS.find(d => d.id === parseInt(id));
      if (!doctor) throw new Error('Doctor not found');
      return { doctor };
    }
  },

  // Get doctors by center
  getDoctorsByCenter: async (centerId) => {
    try {
      return await apiCall(`/users/doctors/center/${centerId}`);
    } catch (error) {
      console.log('Using mock data for doctors by center');
      const doctors = MOCK_DOCTORS.filter(doctor => doctor.center_id === parseInt(centerId));
      return { doctors };
    }
  },

  // Get doctors by specialty
  getDoctorsBySpecialty: async (specialty) => {
    try {
      return await apiCall(`/users/doctors/specialty/${specialty}`);
    } catch (error) {
      console.log('Using mock data for doctors by specialty');
      const doctors = MOCK_DOCTORS.filter(doctor => 
        doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
      );
      return { doctors };
    }
  },

  // Get all specialties
  getSpecialties: async () => {
    try {
      return await apiCall('/users/specialties');
    } catch (error) {
      console.log('Using mock data for specialties');
      const specialties = [...new Set(MOCK_DOCTORS.map(doctor => doctor.specialty))];
      return { specialties };
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      return await apiCall('/users/profile');
    } catch (error) {
      console.log('Using mock data for user profile');
      // Mock profile for development
      const mockUser = {
        user: {
          name: 'Dr. Mock Example',
          email: 'doctor@example.com',
          userType: 'doctor',
          phone: '+216 71 123 456',
          doctorInfo: {
            specialty: 'Cardiology',
            license_number: 'DOC123456',
            experience_years: 12,
            center_name: 'Medical Center Principal - Tunis'
          }
        }
      };
      return mockUser;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      return await apiCall('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    } catch (error) {
      console.log('Using mock data for profile update');
      return { success: true, message: 'Profile updated (mock)' };
    }
  },

  // Get user's appointments
  getAppointments: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.date) params.append('date', filters.date);
      
      const queryString = params.toString();
      const endpoint = queryString ? `/users/appointments?${queryString}` : '/users/appointments';
      return await apiCall(endpoint);
    } catch (error) {
      console.log('Using mock data for user appointments');
      return { 
        appointments: [
          {
            id: 1,
            appointment_date: '2023-07-15T10:00:00.000Z',
            status: 'confirmed',
            doctor_name: 'Dr. Smith',
            doctor_specialty: 'Cardiology',
            center_name: 'Medical Center Principal - Tunis'
          },
          {
            id: 2,
            appointment_date: '2023-07-20T14:30:00.000Z',
            status: 'pending',
            doctor_name: 'Dr. Johnson',
            doctor_specialty: 'Dermatology',
            center_name: 'Hospital Regional Ariana'
          }
        ] 
      };
    }
  },

  // Get doctor's appointments (if user is a doctor)
  getDoctorAppointments: async () => {
    try {
      // This endpoint gets the appointments for the currently logged-in doctor
      return await apiCall('/users/doctor/appointments');
    } catch (error) {
      console.log('Using mock data for doctor appointments');
      // Mock data for development
      return { 
        appointments: [
          {
            id: 101,
            appointment_date: '2023-08-10T11:00:00.000Z',
            status: 'confirmed',
            patient_name: 'Alice Wonderland',
            patient_email: 'alice@example.com',
            notes: 'Follow-up checkup.'
          },
          {
            id: 102,
            appointment_date: '2023-08-12T15:00:00.000Z',
            status: 'completed',
            patient_name: 'Bob Builder',
            patient_email: 'bob@example.com',
            notes: 'Annual physical exam.'
          }
        ] 
      };
    }
  },
};

// Messages API calls
export const messagesAPI = {
  // Get user's inbox
  getInbox: async () => {
    try {
      return await apiCall('/messages/inbox');
    } catch (error) {
      console.log('Using mock data for inbox');
      return {
        messages: [
          {
            id: 1,
            sender_name: 'Dr. Smith',
            subject: 'Your recent test results',
            body: 'Hello, please find your test results attached.',
            created_at: '2023-08-15T10:00:00.000Z',
            is_read: false,
          },
          {
            id: 2,
            sender_name: 'Admin',
            subject: 'Appointment Reminder',
            body: 'This is a reminder for your appointment tomorrow at 2 PM.',
            created_at: '2023-08-14T16:30:00.000Z',
            is_read: true,
          },
        ],
      };
    }
  },

  // Send a new message
  sendMessage: async (messageData) => {
    return await apiCall('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  // Mark a message as read
  markAsRead: async (messageId) => {
    return await apiCall(`/messages/${messageId}/read`, {
      method: 'PUT',
    });
  },
};

// Radiology API calls
export const radiologyAPI = {
  // Get doctor's radiology results
  getDoctorResults: async () => {
    if (USE_MOCK_ONLY) {
      return [];
    }
    return await apiCall('/radiology/results/doctor');
  },

  // Get patient's radiology results
  getPatientResults: async () => {
    if (USE_MOCK_ONLY) {
      return [];
    }
    return await apiCall('/radiology/results/patient');
  },

  // Add a new radiology result
  addResult: async (resultData) => {
    return await apiCall('/radiology', {
      method: 'POST',
      data: resultData
    });
  }
};

// Auth API calls
const api = {
  auth: {
    login: async (loginData) => {
      try {
        const response = await apiCall(`${AUTH_API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        });
        
        if (response.access || response.token) {
          const tok = response.access || response.token;
          setAuthToken(tok);
          try { localStorage.setItem('access', tok); } catch {}
        }
        if (response.refresh) {
          try { localStorage.setItem('refresh', response.refresh); } catch {}
        }
        if (response.user) {
          try { localStorage.setItem('user', JSON.stringify(response.user)); } catch {}
        }
        return response;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    register: async (registerData) => {
      try {
        const response = await apiCall(`${AUTH_API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerData),
        });
        
        if (response.access || response.token) {
          const tok = response.access || response.token;
          setAuthToken(tok);
          try { localStorage.setItem('access', tok); } catch {}
        }
        if (response.refresh) {
          try { localStorage.setItem('refresh', response.refresh); } catch {}
        }
        if (response.user) {
          try { localStorage.setItem('user', JSON.stringify(response.user)); } catch {}
        }
        return response;
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    },
  },
  governorates: {
    getAll: async () => {
      if (USE_MOCK_ONLY) return MOCK_GOUVERNORATES;
      return apiCall('/governorates');
    },
    getById: async (id) => {
      if (USE_MOCK_ONLY) return MOCK_GOUVERNORATES.find(g => g.id === id);
      return apiCall(`/governorates/${id}`);
    }
  },
  hospitals: {
    getAll: async (governorateId = null) => {
      try {
        const url = governorateId 
          ? `/hospitals/governorate/${governorateId}`
          : '/hospitals';
        const response = await apiCall(url);
        return response;
      } catch (error) {
        console.error('Error getting hospitals:', error);
        // Fallback to mock data if API call fails
        return MOCK_HOSPITALS.filter(hospital => 
          !governorateId || hospital.governorate_id === governorateId
        );
      }
    },
    getById: async (id) => {
      try {
        const response = await apiCall(`/hospitals/${id}`);
        return response;
      } catch (error) {
        console.error(`Error getting hospital ${id}:`, error);
        // Fallback to mock data if API call fails
        return MOCK_HOSPITALS.find(hospital => hospital.id === id);
      }
    },
    getServices: async (hospitalId) => {
      try {
        const response = await apiCall(`/hospitals/${hospitalId}/services`);
        return response;
      } catch (error) {
        console.error(`Error getting services for hospital ${hospitalId}:`, error);
        // Fallback to mock data if API call fails
        return MOCK_SERVICES.filter(service => service.hospital_id === hospitalId);
      }
    },
    getDoctors: async (serviceId) => {
      try {
        const response = await apiCall(`/hospitals/services/${serviceId}/doctors`);
        return response;
      } catch (error) {
        console.error(`Error getting doctors for service ${serviceId}:`, error);
        // Fallback to mock data if API call fails
        return MOCK_DOCTORS.filter(doctor => 
          MOCK_SERVICES.some(s => s.id === serviceId && s.hospital_id === doctor.hospital_id)
        );
      }
    }
  },
  services: {
    getAll: async (hospitalId = null) => {
      if (USE_MOCK_ONLY) {
        return hospitalId 
          ? MOCK_SERVICES.filter(s => s.hospital_id === hospitalId)
          : MOCK_SERVICES;
      }
      const url = hospitalId ? `/services?hospital_id=${hospitalId}` : '/services';
      return apiCall(url);
    },
    getById: async (id) => {
      if (USE_MOCK_ONLY) return MOCK_SERVICES.find(s => s.id === id);
      return apiCall(`/services/${id}`);
    },
  },
  doctors: {
    getAll: async (filters = {}) => {
      if (USE_MOCK_ONLY) {
        let doctors = MOCK_DOCTORS;
        if (filters.service_id) {
          doctors = doctors.filter(d => d.service_id === parseInt(filters.service_id));
        }
        if (filters.speciality) {
          doctors = doctors.filter(d => d.speciality === filters.speciality);
        }
        return doctors;
      }
      return apiCall('/doctors', { params: filters });
    },
    getById: async (id) => {
      if (USE_MOCK_ONLY) return MOCK_DOCTORS.find(d => d.id === id);
      return apiCall(`/doctors/${id}`);
    },
  },
  appointments: {
    create: async (appointmentData) => {
      return apiCall('/appointments', {
        method: 'POST',
        data: appointmentData,
        requiresAuth: true,
      });
    },
    getByPatient: async (patientId) => {
      if (USE_MOCK_ONLY) return MOCK_APPOINTMENTS.filter(a => a.patient_id === patientId);
      return apiCall(`/appointments/patient/${patientId}`, { requiresAuth: true });
    },
    getByDoctor: async (doctorId) => {
      if (USE_MOCK_ONLY) return MOCK_APPOINTMENTS.filter(a => a.doctor_id === doctorId);
      return apiCall(`/appointments/doctor/${doctorId}`, { requiresAuth: true });
    },
  },
  consultations: {
    create: async (consultationData) => {
      return apiCall('/consultations', {
        method: 'POST',
        data: consultationData,
        requiresAuth: true,
      });
    },
    getByPatient: async (patientId) => {
      if (USE_MOCK_ONLY) return MOCK_CONSULTATIONS.filter(c => c.patient_id === patientId);
      return apiCall(`/consultations/patient/${patientId}`, { requiresAuth: true });
    },
  },
  messages: {
    send: async (messageData) => {
      return apiCall('/messages', {
        method: 'POST',
        data: messageData,
        requiresAuth: true,
      });
    },
    getConversation: async (patientId, doctorId) => {
      if (USE_MOCK_ONLY) return MOCK_MESSAGES.filter(m => 
        (m.patient_id === patientId && m.doctor_id === doctorId) ||
        (m.patient_id === doctorId && m.doctor_id === patientId)
      );
      return apiCall(`/messages/conversation/${patientId}/${doctorId}`, { requiresAuth: true });
    },
  },
  getAuthToken,
  setAuthToken,
};

export default api;