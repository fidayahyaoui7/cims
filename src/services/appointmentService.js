import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const appointmentService = {
  // Create a new appointment
  async createAppointment(appointmentData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/appointments`, appointmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Get all appointments for the current user
  async getAppointments() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  // Update an appointment
  async updateAppointment(id, appointmentData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/appointments/${id}`, appointmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  // Delete an appointment
  async deleteAppointment(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }
};

export default appointmentService;
