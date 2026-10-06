import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaMapMarkerAlt, 
  FaSearch, 
  FaFilter, 
  FaCalendarPlus, 
  FaUserMd,
  FaStarHalfAlt,
  FaDirections,
  FaEnvelope,
  FaChevronLeft,
  FaInfoCircle,
  FaFileAlt,
  FaFile,
  FaChevronRight
} from 'react-icons/fa';
import axios from 'axios';
import '../styles/AppointmentsListPage.css';

const AppointmentsListPage = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    date: '',
    search: ''
  });

  // Fetch appointments from the API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/appointments');
        setAppointments(response.data);
      } catch (err) {
        setError('Failed to load appointments');
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Handle booking a new appointment
  const handleBookAppointment = () => {
    navigate('/booking/region');
  };

  // Filter appointments based on filters
  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = filters.status === 'all' || appointment.status === filters.status;
    const matchesSearch = appointment.patientName.toLowerCase().includes(filters.search.toLowerCase()) ||
                         appointment.doctorName.toLowerCase().includes(filters.search.toLowerCase());
    const matchesDate = !filters.date || appointment.date === filters.date;
    
    return matchesStatus && matchesSearch && matchesDate;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes Rendez-vous</h1>
        <button
          onClick={handleBookAppointment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaCalendarPlus className="mr-2" />
          Nouveau Rendez-vous
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              className="w-full p-2 border rounded-lg"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">Tous</option>
              <option value="scheduled">Planifié</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded-lg"
              value={filters.date}
              onChange={(e) => setFilters({...filters, date: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full p-2 pl-10 border rounded-lg"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredAppointments.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
              <li key={appointment.id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaCalendarAlt className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {appointment.patientName}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FaUserMd className="mr-1" />
                          {appointment.doctorName}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaClock className="mr-1" />
                      {new Date(appointment.dateTime).toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <FaMapMarkerAlt className="mr-1" />
                      {appointment.location}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status === 'scheduled' ? 'Planifié' :
                       appointment.status === 'completed' ? 'Terminé' : 'Annulé'}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-500">Aucun rendez-vous trouvé</p>
            <button
              onClick={handleBookAppointment}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Prendre un rendez-vous
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsListPage;
