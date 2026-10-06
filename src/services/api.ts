import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getCurrentUser, logoutUser as logout } from './authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Types
type Pagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

type ApiResponse<T> = {
  data: T;
  pagination?: Pagination;
  message?: string;
};

type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'confirmed';

type Appointment = {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  hospitalId: string;
  hospitalName: string;
  hospitalAddress: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

type AppointmentFilters = {
  status?: string;
  search?: string;
  hospital?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

// Create axios instance with base URL and headers
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const user = getCurrentUser();
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized (token expired or invalid)
      if (error.response.status === 401) {
        logout();
        window.location.href = '/login';
      }
      
      // Handle 403 Forbidden (insufficient permissions)
      if (error.response.status === 403) {
        console.error('Insufficient permissions');
      }
      
      // Handle 404 Not Found
      if (error.response.status === 404) {
        console.error('Resource not found');
      }
      
      // Handle 500 Internal Server Error
      if (error.response.status >= 500) {
        console.error('Server error:', error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response from server');
    } else {
      // Something happened in setting up the request
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API methods
const api = {
  // Appointments
  appointments: {
    // Get user's appointments with filters and pagination
    getUserAppointments: async (filters: AppointmentFilters = {}): Promise<ApiResponse<Appointment[]>> => {
      try {
        const response = await apiClient.get<ApiResponse<Appointment[]>>('/appointments/user', {
          params: {
            ...filters,
            page: filters.page || 1,
            pageSize: filters.pageSize || 10,
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }
    },

    // Get appointment by ID
    getAppointment: async (id: string): Promise<Appointment> => {
      try {
        const response = await apiClient.get<ApiResponse<Appointment>>(`/appointments/${id}`);
        return response.data.data;
      } catch (error) {
        console.error(`Error fetching appointment ${id}:`, error);
        throw error;
      }
    },

    // Book a new appointment
    bookAppointment: async (appointmentData: Omit<Appointment, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Appointment> => {
      try {
        const response = await apiClient.post<ApiResponse<Appointment>>('/appointments', appointmentData);
        return response.data.data;
      } catch (error) {
        console.error('Error booking appointment:', error);
        throw error;
      }
    },

    // Update appointment status
    updateStatus: async (id: string, status: AppointmentStatus, reason?: string): Promise<Appointment> => {
      try {
        const response = await apiClient.put<ApiResponse<Appointment>>(
          `/appointments/${id}/status`,
          { status, reason }
        );
        return response.data.data;
      } catch (error) {
        console.error(`Error updating appointment ${id} status:`, error);
        throw error;
      }
    },

    // Cancel an appointment
    cancel: async (id: string, reason?: string): Promise<void> => {
      try {
        await apiClient.post(`/appointments/${id}/cancel`, { reason });
      } catch (error) {
        console.error(`Error cancelling appointment ${id}:`, error);
        throw error;
      }
    },

    // Reschedule an appointment
    reschedule: async (id: string, newDate: string, newTime: string): Promise<Appointment> => {
      try {
        const response = await apiClient.put<ApiResponse<Appointment>>(
          `/appointments/${id}/reschedule`,
          { date: newDate, time: newTime }
        );
        return response.data.data;
      } catch (error) {
        console.error(`Error rescheduling appointment ${id}:`, error);
        throw error;
      }
    },
  },

  // Doctors
  doctors: {
    // Get all doctors with optional filters
    getDoctors: async (filters: { specialty?: string; hospitalId?: string } = {}) => {
      try {
        const response = await apiClient.get<ApiResponse<any[]>>('/doctors', { params: filters });
        return response.data;
      } catch (error) {
        console.error('Error fetching doctors:', error);
        throw error;
      }
    },
  },

  // Hospitals
  hospitals: {
    // Get all hospitals
    getHospitals: async () => {
      try {
        const response = await apiClient.get<ApiResponse<any[]>>('/hospitals');
        return response.data;
      } catch (error) {
        console.error('Error fetching hospitals:', error);
        throw error;
      }
    },
  },

  // User profile
  profile: {
    // Get current user profile
    getProfile: async () => {
      try {
        const response = await apiClient.get<ApiResponse<any>>('/profile');
        return response.data.data;
      } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
    },

    // Update user profile
    updateProfile: async (profileData: any) => {
      try {
        const response = await apiClient.put<ApiResponse<any>>('/profile', profileData);
        return response.data.data;
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    },
  },
};

export default api;

// For backward compatibility
export const appointmentsAPI = api.appointments;
export const doctorsAPI = api.doctors;
export const hospitalsAPI = api.hospitals;
