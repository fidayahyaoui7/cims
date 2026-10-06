const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const USE_MOCK_ONLY = process.env.REACT_APP_USE_MOCK_ONLY === 'true';

// Mock data for development
const MOCK_GOUVERNORATES = [
  { id: 1, name: 'Tunis', region: 'North', latitude: 36.8065, longitude: 10.1815 },
  { id: 2, name: 'Sfax', region: 'South', latitude: 34.7406, longitude: 10.7603 },
  { id: 3, name: 'Sousse', region: 'Sahel', latitude: 35.8254, longitude: 10.6360 },
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

const MOCK_DOCTORS = [
  { id: 1, speciality: 'Cardiologist', license: 'MD12345', service_id: 1 },
  { id: 2, speciality: 'Pediatrician', license: 'MD12346', service_id: 2 },
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

// Helper functions
const getAuthToken = () => localStorage.getItem('token');

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

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
  login: async (credentials) => {
    if (USE_MOCK_ONLY) {
      const user = MOCK_USERS.find(u => u.email === credentials.email && u.password === credentials.password);
      if (!user) throw new Error('Invalid credentials');
      const token = `mock-token-${user.id}`;
      setAuthToken(token);
      return { token, user };
    }
    return apiCall('/auth/login', { method: 'POST', data: credentials });
  },
  
  register: async (userData) => {
    if (USE_MOCK_ONLY) {
      const newUser = { ...userData, id: MOCK_USERS.length + 1 };
      MOCK_USERS.push(newUser);
      const token = `mock-token-${newUser.id}`;
      setAuthToken(token);
      return { token, user: newUser };
    }
    return apiCall('/auth/register', { method: 'POST', data: userData });
  },
  
  logout: () => {
    setAuthToken(null);
  },
  
  getProfile: async () => {
    if (USE_MOCK_ONLY) {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');
      const userId = parseInt(token.split('-').pop());
      return MOCK_USERS.find(u => u.id === userId);
    }
    return apiCall('/auth/me', { requiresAuth: true });
  }
};

const governoratesAPI = {
  getAll: async () => {
    if (USE_MOCK_ONLY) return MOCK_GOUVERNORATES;
    return apiCall('/governorates');
  },
  
  getById: async (id) => {
    if (USE_MOCK_ONLY) return MOCK_GOUVERNORATES.find(g => g.id === id);
    return apiCall(`/governorates/${id}`);
  }
};

const hospitalsAPI = {
  getAll: async (governorateId = null) => {
    if (USE_MOCK_ONLY) {
      return governorateId 
        ? MOCK_HOSPITALS.filter(h => h.governorate_id === governorateId)
        : MOCK_HOSPITALS;
    }
    const url = governorateId ? `/hospitals?governorate_id=${governorateId}` : '/hospitals';
    return apiCall(url);
  },
  
  getById: async (id) => {
    if (USE_MOCK_ONLY) return MOCK_HOSPITALS.find(h => h.id === id);
    return apiCall(`/hospitals/${id}`);
  }
};

const servicesAPI = {
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
  }
};

const doctorsAPI = {
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
  }
};

const appointmentsAPI = {
  create: async (appointmentData) => {
    if (USE_MOCK_ONLY) {
      const newAppointment = {
        id: MOCK_APPOINTMENTS.length + 1,
        ...appointmentData,
        status: 'scheduled'
      };
      MOCK_APPOINTMENTS.push(newAppointment);
      return newAppointment;
    }
    return apiCall('/appointments', { method: 'POST', data: appointmentData, requiresAuth: true });
  },
  
  getByPatient: async (patientId) => {
    if (USE_MOCK_ONLY) return MOCK_APPOINTMENTS.filter(a => a.patient_id === patientId);
    return apiCall(`/appointments/patient/${patientId}`, { requiresAuth: true });
  },
  
  getByDoctor: async (doctorId) => {
    if (USE_MOCK_ONLY) return MOCK_APPOINTMENTS.filter(a => a.doctor_id === doctorId);
    return apiCall(`/appointments/doctor/${doctorId}`, { requiresAuth: true });
  },
  
  updateStatus: async (id, status) => {
    if (USE_MOCK_ONLY) {
      const appointment = MOCK_APPOINTMENTS.find(a => a.id === id);
      if (appointment) appointment.status = status;
      return appointment;
    }
    return apiCall(`/appointments/${id}/status`, { method: 'PATCH', data: { status }, requiresAuth: true });
  },
  
  cancel: async (id) => {
    if (USE_MOCK_ONLY) {
      const index = MOCK_APPOINTMENTS.findIndex(a => a.id === id);
      if (index !== -1) MOCK_APPOINTMENTS.splice(index, 1);
      return { success: true };
    }
    return apiCall(`/appointments/${id}`, { method: 'DELETE', requiresAuth: true });
  }
};

const consultationsAPI = {
  create: async (consultationData) => {
    if (USE_MOCK_ONLY) {
      const newConsultation = {
        id: MOCK_CONSULTATIONS.length + 1,
        ...consultationData,
        created_at: new Date().toISOString()
      };
      MOCK_CONSULTATIONS.push(newConsultation);
      return newConsultation;
    }
    return apiCall('/consultations', { method: 'POST', data: consultationData, requiresAuth: true });
  },
  
  getByPatient: async (patientId) => {
    if (USE_MOCK_ONLY) return MOCK_CONSULTATIONS.filter(c => c.patient_id === patientId);
    return apiCall(`/consultations/patient/${patientId}`, { requiresAuth: true });
  }
};

const messagesAPI = {
  send: async (messageData) => {
    if (USE_MOCK_ONLY) {
      const newMessage = {
        id: MOCK_MESSAGES.length + 1,
        ...messageData,
        timestamp: new Date().toISOString()
      };
      MOCK_MESSAGES.push(newMessage);
      return newMessage;
    }
    return apiCall('/messages', { method: 'POST', data: messageData, requiresAuth: true });
  },
  
  getConversation: async (patientId, doctorId) => {
    if (USE_MOCK_ONLY) {
      return MOCK_MESSAGES.filter(m => 
        (m.patient_id === patientId && m.doctor_id === doctorId) ||
        (m.patient_id === doctorId && m.doctor_id === patientId)
      ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }
    return apiCall(`/messages/conversation/${patientId}/${doctorId}`, { requiresAuth: true });
  },
  
  getInbox: async () => {
    if (USE_MOCK_ONLY) {
      // Group messages by conversation
      const conversations = {};
      MOCK_MESSAGES.forEach(msg => {
        const key = [msg.patient_id, msg.doctor_id].sort().join('_');
        if (!conversations[key]) {
          conversations[key] = {
            participants: [msg.patient_id, msg.doctor_id],
            lastMessage: msg,
            unread: 0
          };
        } else if (new Date(msg.timestamp) > new Date(conversations[key].lastMessage.timestamp)) {
          conversations[key].lastMessage = msg;
        }
      });
      return Object.values(conversations);
    }
    return apiCall('/messages/inbox', { requiresAuth: true });
  }
};

// Export all API services
const api = {
  auth: authAPI,
  governorates: governoratesAPI,
  hospitals: hospitalsAPI,
  services: servicesAPI,
  doctors: doctorsAPI,
  appointments: appointmentsAPI,
  consultations: consultationsAPI,
  messages: messagesAPI,
  getAuthToken,
  setAuthToken,
  apiCall // Export for testing
};

export default api;
