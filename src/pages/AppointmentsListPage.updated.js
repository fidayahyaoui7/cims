import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaSearch, 
  FaFilter,
  FaCalendarPlus,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaHospital,
  FaPhone,
  FaEnvelope,
  FaStethoscope,
  FaProcedures,
  FaBed,
  FaUserMd,
  FaExclamationTriangle
} from 'react-icons/fa';
import { appointmentsAPI } from '../services/api';
import { getCurrentUser } from '../services/authService';
import '../styles/AppointmentsListPage.css';

const AppointmentsListPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hospitalFilter, setHospitalFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isRTL = i18n.language === 'ar';
  const itemsPerPage = 5;

  // Fetch appointments from API
  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const user = getCurrentUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Prepare filters
      const filters = {
        page: currentPage,
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchTerm || undefined,
        hospital: hospitalFilter === 'all' ? undefined : hospitalFilter,
      };

      // Call the API
      const response = await appointmentsAPI.getUserAppointments(filters);
      
      setAppointments(response.data);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(t('appointments.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and when filters change
  useEffect(() => {
    fetchAppointments();
  }, [currentPage, statusFilter, searchTerm, hospitalFilter]);

  // Handle appointment cancellation
  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm(t('appointments.confirmCancel'))) return;
    
    try {
      setIsLoading(true);
      await appointmentsAPI.cancel(appointmentId);
      // Refresh the list
      await fetchAppointments();
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError(t('appointments.cancelError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reschedule
  const handleReschedule = (appointment) => {
    // Navigate to booking page with appointment data
    navigate('/booking', { state: { appointment } });
  };

  // Format date based on current language
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    };
    return new Date(dateString).toLocaleDateString(i18n.language, options);
  };

  // Format time
  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString(i18n.language, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Filter appointments based on search term and filters
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const matchesSearch = !searchTerm || 
        appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      const matchesHospital = hospitalFilter === 'all' || appointment.hospitalId === hospitalFilter;
      
      return matchesSearch && matchesStatus && matchesHospital;
    });
  }, [appointments, searchTerm, statusFilter, hospitalFilter]);

  // Pagination
  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAppointments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAppointments, currentPage]);

  // Get unique hospital names for filter
  const hospitalOptions = useMemo(() => {
    const hospitals = new Set();
    appointments.forEach(apt => {
      if (apt.hospitalName) {
        hospitals.add({
          id: apt.hospitalId,
          name: apt.hospitalName
        });
      }
    });
    return Array.from(hospitals);
  }, [appointments]);

  if (isLoading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">{t('common.error')}: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto p-4 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          {t('appointments.myAppointments')}
        </h1>
        <button
          onClick={() => navigate('/booking')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaCalendarPlus className="mr-2" />
          {t('appointments.bookNew')}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('appointments.searchPlaceholder')}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 flex items-center"
          >
            <FaFilter className="mr-2" />
            {t('common.filters')}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('appointments.filterByStatus')}
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">{t('appointments.allStatuses')}</option>
                <option value="scheduled">{t('appointments.status.scheduled')}</option>
                <option value="completed">{t('appointments.status.completed')}</option>
                <option value="cancelled">{t('appointments.status.cancelled')}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('appointments.filterByHospital')}
              </label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={hospitalFilter}
                onChange={(e) => setHospitalFilter(e.target.value)}
              >
                <option value="all">{t('appointments.allHospitals')}</option>
                {hospitalOptions.map(hospital => (
                  <option key={hospital.id} value={hospital.id}>
                    {hospital.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Appointments List */}
      {paginatedAppointments.length > 0 ? (
        <div className="space-y-4">
          {paginatedAppointments.map((appointment) => (
            <div 
              key={appointment.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaUserMd className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {appointment.doctorName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {appointment.specialty}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-4">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      appointment.status === 'scheduled' 
                        ? 'bg-green-100 text-green-800' 
                        : appointment.status === 'completed' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {t(`appointments.status.${appointment.status}`)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start">
                    <FaCalendarAlt className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {t('appointments.date')}
                      </p>
                      <p className="text-sm text-gray-900">
                        {formatDate(appointment.date)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaClock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {t('appointments.time')}
                      </p>
                      <p className="text-sm text-gray-900">
                        {formatTime(appointment.time)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {t('appointments.location')}
                      </p>
                      <p className="text-sm text-gray-900">
                        {appointment.hospitalName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  {appointment.status === 'scheduled' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleReschedule(appointment)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {t('appointments.reschedule')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        {t('appointments.cancel')}
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {t('appointments.viewDetails')}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t('common.previous')}
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t('common.next')}
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    {t('common.showingPage')}{' '}
                    <span className="font-medium">{currentPage}</span>{' '}
                    {t('common.of')}{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      aria-label={t('common.previous')}
                    >
                      <span className="sr-only">{t('common.previous')}</span>
                      <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Calculate page numbers to show (current page in the middle when possible)
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === pageNum 
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          } text-sm font-medium`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    )}
                    
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      aria-label={t('common.next')}
                    >
                      <span className="sr-only">{t('common.next')}</span>
                      <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {t('appointments.noAppointments')}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {t('appointments.noAppointmentsDescription')}
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate('/booking')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaCalendarPlus className="-ml-1 mr-2 h-5 w-5" />
              {t('appointments.bookAppointment')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsListPage;
