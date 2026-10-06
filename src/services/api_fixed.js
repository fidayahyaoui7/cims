const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const USE_MOCK_ONLY = process.env.REACT_APP_USE_MOCK_ONLY === 'true';

// Mock data for development

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
  { id: 1, patient_id: 3, doctor_id: 1, date: '2023-06-15', status: 'scheduled' },
  { id: 2, patient_id: 3, doctor_id: 2, date: '2023-06-16', status: 'completed' },
];

const MOCK_CONSULTATIONS = [
  { id: 1, patient_id: 3, doctor_id: 1, prescription: 'Medication and rest' },
];

const MOCK_MESSAGES = [
  { id: 1, patient_id: 3, doctor_id: 1, message: 'Hello doctor', timestamp: '2023-06-10T10:00:00Z' },
];

// MOCK_CENTERS is an alias for MOCK_HOSPITALS for backward compatibility
const MOCK_CENTERS = MOCK_HOSPITALS;

// MOCK_APPOINTMENT_SLOTS for testing
const MOCK_APPOINTMENT_SLOTS = [
  { id: 1, doctor_id: 1, date: '2023-06-15', time: '09:00', available: true },
  { id: 2, doctor_id: 1, date: '2023-06-15', time: '10:00', available: true },
  { id: 3, doctor_id: 2, date: '2023-06-15', time: '11:00', available: true },
  { id: 4, doctor_id: 2, date: '2023-06-15', time: '14:00', available: true },
  { id: 5, doctor_id: 3, date: '2023-06-16', time: '09:00', available: true },
  { id: 6, doctor_id: 3, date: '2023-06-16', time: '10:00', available: true },
  { id: 7, doctor_id: 4, date: '2023-06-16', time: '11:00', available: true },
  { id: 8, doctor_id: 4, date: '2023-06-16', time: '14:00', available: true },
  { id: 9, doctor_id: 5, date: '2023-06-17', time: '09:00', available: true },
  { id: 10, doctor_id: 5, date: '2023-06-17', time: '10:00', available: true }
];

const MOCK_CENTERS_DETAILED = [
  {
    id: 1,
    name: 'Hôpital Charles Nicolle',
    address: 'Boulevard 9 Avril 1938, Tunis',
    phone: '71331000',
    city_id: 1,
    latitude: 36.8065,
    longitude: 10.1815,
    rating: 4.5,
    services: ['Cardiology', 'Pediatrics', 'General Medicine']
  },
  {
    id: 2,
    name: 'Hôpital Habib Thameur',
    address: 'Place du 7 Novembre, Tunis',
    phone: '71340000',
    city_id: 1,
    latitude: 36.8000,
    longitude: 10.1900,
    rating: 4.3,
    services: ['General Medicine', 'Pediatrics']
  },
  { 
    id: 3, 
    name: 'Polyclinique Les Berges du Lac', 
    address: 'Les Berges du Lac, Tunis', 
    phone: '71300002',
    city_id: 1,
    latitude: 36.8200,
    longitude: 10.2000,
    rating: 4.7,
    services: ['Cardiology', 'Gynecology']
  },
  { 
    id: 4, 
    name: 'Clinique El Manar', 
    address: 'Avenue Taieb Mhiri, Sousse', 
    phone: '73300001',
    city_id: 2,
    latitude: 35.8300,
    longitude: 10.6300,
    rating: 4.3,
    services: ['General Medicine', 'Orthopedics']
  },
  { 
    id: 5, 
    name: 'Hôpital Sahloul', 
    address: 'Route Ceinture, Sousse', 
    phone: '73300002',
    city_id: 2,
    latitude: 35.8400,
    longitude: 10.6000,
    rating: 4.0,
    services: ['Cardiology', 'Pediatrics', 'Gynecology']
  },
  { 
    id: 6, 
    name: 'Clinique Ennasr', 
    address: 'Avenue Hédi Nouira, Sfax', 
    phone: '74300001',
    city_id: 3,
    latitude: 34.7400,
    longitude: 10.7600,
    rating: 4.2,
    services: ['General Medicine', 'Dermatology']
  }
];


// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to set auth token
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const { requiresAuth = false, method = 'GET', data = null, params = {} } = options;
  
  const headers = { 'Content-Type': 'application/json' };
  if (requiresAuth) {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication required');
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (data) config.body = JSON.stringify(data);

  // Add query parameters
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value);
    }
  });
  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, config);
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Something went wrong');
    }
    
    return responseData;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// API Services
const authAPI = {
  // Register new user
  register: async (userData) => {
    if (USE_MOCK_ONLY) {
      const newUser = { ...userData, id: MOCK_USERS.length + 1 };
      MOCK_USERS.push(newUser);
      return { user: newUser, token: 'mock-token' };
    }
    return await apiCall('/auth/register', {
      method: 'POST',
      data: userData
    });
  },

  // Login user
  login: async ({ email, password, userType }) => {
    if (USE_MOCK_ONLY) {
      const user = MOCK_USERS.find(u => u.email === email && u.password === password && u.type === userType);
      if (!user) throw new Error('Invalid credentials');
      return { user, token: 'mock-token' };
    }
    return await apiCall('/auth/login', {
      method: 'POST',
      data: { email, password, userType }
    });
  },

  // Get user profile
  getProfile: async () => {
    if (USE_MOCK_ONLY) {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');
      // In a real app, you would decode the JWT to get user ID
      return MOCK_USERS[0]; // Return first user as mock
    }
    return await apiCall('/auth/me', { requiresAuth: true });
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return await apiCall('/auth/profile', {
      method: 'PUT',
      data: profileData,
      requiresAuth: true
    });
  },

  // Change password
  changePassword: async (passwordData) => {
    return await apiCall('/auth/change-password', {
      method: 'POST',
      data: passwordData,
      requiresAuth: true
    });
  },

  // Logout
  logout: () => {
    setAuthToken(null);
  }
};

// Cities API
const citiesAPI = {
  // Get all cities
  getAll: async (region) => {
    if (USE_MOCK_ONLY) {
      if (region) {
        return MOCK_CITIES.filter(city => city.region === region);
      }
      return MOCK_CITIES;
    }
    const url = region ? `/cities?region=${region}` : '/cities';
    return await apiCall(url);
  },

  // Get city by ID
  getById: async (id) => {
    if (USE_MOCK_ONLY) {
      return MOCK_CITIES.find(city => city.id === id);
    }
    return await apiCall(`/cities/${id}`);
  },

  // Get city by name
  getByName: async (name) => {
    if (USE_MOCK_ONLY) {
      return MOCK_CITIES.find(city => 
        city.name.toLowerCase() === name.toLowerCase()
      );
    }
    return await apiCall(`/cities/name/${name}`);
  },

  // Get cities by region
  getByRegion: async (region) => {
    if (USE_MOCK_ONLY) {
      return MOCK_CITIES.filter(city => city.region === region);
    }
    return await apiCall(`/cities/region/${region}`);
  },

  // Get all regions
  getRegions: async () => {
    if (USE_MOCK_ONLY) {
      return [...new Set(MOCK_CITIES.map(city => city.region))];
    }
    return await apiCall('/cities/regions');
  }
};

// Medical Centers API
const centersAPI = {
  // Get all centers
  getAll: async (filters = {}) => {
    if (USE_MOCK_ONLY) {
      let centers = [...MOCK_CENTERS];
      
      if (filters.cityId) {
        centers = centers.filter(center => center.city_id === parseInt(filters.cityId));
      }
      
      if (filters.service) {
        // In a real app, you would filter centers by service
        console.log('Filtering by service:', filters.service);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        centers = centers.filter(center => 
          center.name.toLowerCase().includes(searchLower) ||
          center.address.toLowerCase().includes(searchLower)
        );
      }
      
      return centers;
    }
    return await apiCall('/centers', { params: filters });
  },

  // Get center by ID
  getById: async (id) => {
    if (USE_MOCK_ONLY) {
      return MOCK_CENTERS.find(center => center.id === id);
    }
    return await apiCall(`/centers/${id}`);
  },

  // Get centers by city
  getByCity: async (cityName) => {
    if (USE_MOCK_ONLY) {
      return MOCK_CENTERS.filter(center => 
        center.address.toLowerCase().includes(cityName.toLowerCase())
      );
    }
    return await apiCall(`/centers/city/${cityName}`);
  },

  // Get centers by service
  getByService: async (serviceName) => {
    if (USE_MOCK_ONLY) {
      // This is a simplified example - in a real app, you would have a service mapping
      return MOCK_CENTERS;
    }
    return await apiCall(`/centers/service/${serviceName}`);
  },

  // Get nearby centers
  getNearby: async (lat, lng, radius = 10) => {
    if (USE_MOCK_ONLY) {
      // Calculate distance and filter by radius
      const centers = MOCK_CENTERS.map(center => {
        const distance = Math.sqrt(
          Math.pow(center.latitude - lat, 2) + Math.pow(center.longitude - lng, 2)
        ) * 111; // Rough conversion to km
        return { ...center, distance: Math.round(distance * 10) / 10 };
      }).filter(center => center.distance <= radius);
      
      return { centers: centers.sort((a, b) => a.distance - b.distance) };
    }
    return await apiCall(`/centers/nearby/${lat}/${lng}?radius=${radius}`);
  },

  // Get all services
  getServices: async () => {
    if (USE_MOCK_ONLY) {
      return MOCK_SERVICES;
    }
    return await apiCall('/centers/services');
  },

  // Update center rating
  updateRating: async (id, rating) => {
    if (USE_MOCK_ONLY) {
      const center = MOCK_CENTERS.find(c => c.id === id);
      if (center) {
        center.rating = rating;
        return { success: true };
      }
      throw new Error('Center not found');
    }
    return await apiCall(`/centers/${id}/rating`, {
      method: 'POST',
      data: { rating },
      requiresAuth: true
    });
  }
};

// Appointments API
const appointmentsAPI = {
  // Get all appointments
  getAll: async (filters = {}) => {
    if (USE_MOCK_ONLY) {
      return MOCK_APPOINTMENTS;
    }
    return await apiCall('/appointments', { params: filters });
  },

  // Get appointment by ID
  getById: async (id) => {
    if (USE_MOCK_ONLY) {
      return MOCK_APPOINTMENTS.find(apt => apt.id === id);
    }
    return await apiCall(`/appointments/${id}`);
  },

  // Create new appointment
  create: async (appointmentData) => {
    if (USE_MOCK_ONLY) {
      const newAppointment = {
        ...appointmentData,
        id: MOCK_APPOINTMENTS.length + 1,
        status: 'scheduled'
      };
      MOCK_APPOINTMENTS.push(newAppointment);
      return newAppointment;
    }
    return await apiCall('/appointments', {
      method: 'POST',
      data: appointmentData,
      requiresAuth: true
    });
  },

  // Update appointment status
  updateStatus: async (id, status) => {
    if (USE_MOCK_ONLY) {
      const appointment = MOCK_APPOINTMENTS.find(apt => apt.id === id);
      if (appointment) {
        appointment.status = status;
        return appointment;
      }
      throw new Error('Appointment not found');
    }
    return await apiCall(`/appointments/${id}/status`, {
      method: 'PUT',
      data: { status },
      requiresAuth: true
    });
  },

  // Cancel appointment
  cancel: async (id) => {
    if (USE_MOCK_ONLY) {
      const appointment = MOCK_APPOINTMENTS.find(apt => apt.id === id);
      if (appointment) {
        appointment.status = 'cancelled';
        return { success: true };
      }
      throw new Error('Appointment not found');
    }
    return await apiCall(`/appointments/${id}/cancel`, {
      method: 'POST',
      requiresAuth: true
    });
  },

  // Get available time slots
  getAvailableSlots: async (doctorId, date) => {
    if (USE_MOCK_ONLY) {
      // Filter slots for the specific doctor and date, then format them
      return MOCK_APPOINTMENT_SLOTS
        .filter(slot => slot.doctor_id === doctorId && slot.date === formatDateForAPI(new Date(date)))
        .map(slot => ({
          time: slot.time,
          available: slot.available
        }));
    }
    return await apiCall(`/appointments/slots/${doctorId}/${date}`);
  },

  // Get doctor's appointments
  getDoctorAppointments: async (doctorId, filters = {}) => {
    if (USE_MOCK_ONLY) {
      return MOCK_APPOINTMENTS.filter(apt => apt.doctor_id === doctorId);
    }
    return await apiCall(`/appointments/doctor/${doctorId}`, { params: filters });
  }
};

// Users API
const usersAPI = {
  // Get all doctors
  getDoctors: async (filters = {}) => {
    if (USE_MOCK_ONLY) {
      let doctors = MOCK_USERS.filter(user => user.type === 'doctor');
      
      if (filters.specialty) {
        // In a real app, you would filter by specialty
        console.log('Filtering doctors by specialty:', filters.specialty);
      }
      
      if (filters.center_id) {
        // In a real app, you would filter by center
        console.log('Filtering doctors by center:', filters.center_id);
      }
      
      return doctors;
    }
    return await apiCall('/doctors', { params: filters });
  },

  // Get doctor by ID
  getDoctorById: async (id) => {
    if (USE_MOCK_ONLY) {
      return MOCK_USERS.find(user => user.type === 'doctor' && user.doctor_id === id);
    }
    return await apiCall(`/doctors/${id}`);
  },

  // Get doctors by center
  getDoctorsByCenter: async (centerId) => {
    if (USE_MOCK_ONLY) {
      // In a real app, you would filter doctors by center
      return MOCK_USERS.filter(user => user.type === 'doctor');
    }
    return await apiCall(`/centers/${centerId}/doctors`);
  },

  // Get doctors by specialty
  getDoctorsBySpecialty: async (specialty) => {
    if (USE_MOCK_ONLY) {
      // In a real app, you would filter doctors by specialty
      return MOCK_USERS.filter(user => user.type === 'doctor');
    }
    return await apiCall(`/doctors/specialty/${specialty}`);
  },

  // Get all specialties
  getSpecialties: async () => {
    if (USE_MOCK_ONLY) {
      return ['Cardiology', 'Pediatrics', 'General Medicine', 'Dermatology'];
    }
    return await apiCall('/doctors/specialties');
  },

  // Get user profile
  getProfile: async () => {
    if (USE_MOCK_ONLY) {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');
      // In a real app, you would decode the JWT to get user ID
      return MOCK_USERS[0]; // Return first user as mock
    }
    return await apiCall('/users/me', { requiresAuth: true });
  },

  // Update user profile
  updateProfile: async (profileData) => {
    if (USE_MOCK_ONLY) {
      const user = MOCK_USERS[0]; // Mock update
      return { ...user, ...profileData };
    }
    return await apiCall('/users/profile', {
      method: 'PUT',
      data: profileData,
      requiresAuth: true
    });
  },

  // Get user's appointments
  getAppointments: async (filters = {}) => {
    if (USE_MOCK_ONLY) {
      // In a real app, you would filter by the logged-in user
      return MOCK_APPOINTMENTS;
    }
    return await apiCall('/users/appointments', { 
      params: filters,
      requiresAuth: true 
    });
  },

  // Get doctor's appointments (if user is a doctor)
  getDoctorAppointments: async () => {
    if (USE_MOCK_ONLY) {
      // In a real app, you would get the doctor's ID from the token
      const doctorId = 1; // Mock doctor ID
      return MOCK_APPOINTMENTS.filter(apt => apt.doctor_id === doctorId);
    }
    return await apiCall('/users/doctor/appointments', { requiresAuth: true });
  }
};

// Messages API
const messagesAPI = {
  // Get user's inbox
  getInbox: async () => {
    if (USE_MOCK_ONLY) {
      // In a real app, you would get the user's ID from the token
      const userId = 1; // Mock user ID
      
      // Get unique conversations for the user
      const userMessages = MOCK_MESSAGES.filter(
        msg => msg.sender_id === userId || msg.recipient_id === userId
      );
      
      // Group by conversation
      const conversations = {};
      userMessages.forEach(msg => {
        const otherUserId = msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
        if (!conversations[otherUserId]) {
          conversations[otherUserId] = {
            user: MOCK_USERS.find(u => u.id === otherUserId) || { id: otherUserId, name: 'Unknown User' },
            lastMessage: msg,
            unread: msg.status === 'unread' && msg.recipient_id === userId
          };
        }
      });
      
      return Object.values(conversations);
    }
    return await apiCall('/messages/inbox', { requiresAuth: true });
  },

  // Send a new message
  sendMessage: async (messageData) => {
    if (USE_MOCK_ONLY) {
      const newMessage = {
        ...messageData,
        id: MOCK_MESSAGES.length + 1,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
      MOCK_MESSAGES.push(newMessage);
      return newMessage;
    }
    return await apiCall('/messages', {
      method: 'POST',
      data: messageData,
      requiresAuth: true
    });
  },

  // Mark a message as read
  markAsRead: async (messageId) => {
    if (USE_MOCK_ONLY) {
      const message = MOCK_MESSAGES.find(m => m.id === messageId);
      if (message) {
        message.status = 'read';
        return { success: true };
      }
      throw new Error('Message not found');
    }
    return await apiCall(`/messages/${messageId}/read`, {
      method: 'PUT',
      requiresAuth: true
    });
  },

  // Get conversation between two users
  getConversation: async (userId1, userId2) => {
    if (USE_MOCK_ONLY) {
      return MOCK_MESSAGES.filter(
        msg => (msg.sender_id === userId1 && msg.recipient_id === userId2) ||
               (msg.sender_id === userId2 && msg.recipient_id === userId1)
      ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }
    return await apiCall(`/messages/conversation/${userId1}/${userId2}`, { 
      requiresAuth: true 
    });
  }
};

// Radiology API
const radiologyAPI = {
  // Get doctor's radiology results
  getDoctorResults: async () => {
    if (USE_MOCK_ONLY) {
      return [];
    }
    return await apiCall('/radiology/doctor/results', { requiresAuth: true });
  },

  // Get patient's radiology results
  getPatientResults: async () => {
    if (USE_MOCK_ONLY) {
      return [];
    }
    return await apiCall('/radiology/patient/results', { requiresAuth: true });
  },

  // Add a new radiology result
  addResult: async (resultData) => {
    return await apiCall('/radiology', {
      method: 'POST',
      data: resultData,
      requiresAuth: true
    });
  }
};

// Export all mock data for testing
export {
  MOCK_GOUVERNORATES,
  MOCK_CITIES,
  MOCK_DOCTORS,
  MOCK_HOSPITALS,
  MOCK_CENTERS,
  MOCK_APPOINTMENT_SLOTS,
  MOCK_SERVICES,
  MOCK_USERS
};

// Export all API services
const api = {
  auth: authAPI,
  cities: citiesAPI,
  centers: centersAPI,
  appointments: appointmentsAPI,
  users: usersAPI,
  messages: messagesAPI,
  radiology: radiologyAPI,
  getAuthToken,
  setAuthToken,
};

export default api;
