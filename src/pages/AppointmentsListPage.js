import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { appointmentService } from '../services/appointmentService';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hospitalFilter, setHospitalFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isRTL = i18n.language === 'ar';
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const user = getCurrentUser();
        
        if (!user) {
          console.log('No user found, redirecting to login');
          navigate('/login');
          return;
        }
        
        console.log('Fetching appointments for user:', user.id);
        
        // Fetch appointments from the API
        const appointments = await appointmentService.getAppointments();
        
        console.log('Appointments loaded successfully:', appointments);
        setAppointments(appointments);
        setTotalPages(Math.ceil(appointments.length / itemsPerPage));
        
      } catch (error) {
        console.error('Error fetching appointments:', error);
        
        // Fallback to mock data if API fails (for development)
        if (process.env.NODE_ENV === 'development') {
          console.warn('Using mock data as fallback');
          const mockAppointments = [
            {
              id: '1',
              examType: 'Radiography',
              centerId: 'tunis-center-1',
              centerName: 'Centre Hospitalo-Universitaire Sahloul',
              appointmentDate: new Date(Date.now() + 86400000).toISOString(),
              patientName: 'Mohamed Ali',
              patientEmail: 'mohamed.ali@example.com',
              patientPhone: '12345678',
              status: 'confirmed',
              hospitalType: 'university',
              hospitalCity: 'Sousse',
              hospitalAddress: 'Rue Taher Hadded, Sousse 4000',
              hospitalPhone: '+216 73 369 000',
              hospitalServices: ['Radiography', 'CT Scan', 'MRI', 'Ultrasound', 'Mammography'],
              emergency: true
            }
          ];
          setAppointments(mockAppointments);
          setTotalPages(1);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointments();
  }, [navigate]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const matchesSearch = searchTerm === '' || 
        appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.centerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.hospitalCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.examType?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        appointment.status === statusFilter;
      
      const matchesHospitalType = hospitalFilter === 'all' || 
        appointment.hospitalType === hospitalFilter;
      
      return matchesSearch && matchesStatus && matchesHospitalType;
    });
  }, [appointments, searchTerm, statusFilter, hospitalFilter]);

  const hospitalTypesList = useMemo(() => {
    const types = new Set();
    appointments.forEach(appt => types.add(appt.hospitalType));
    return Array.from(types);
  }, [appointments]);

  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAppointments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAppointments, currentPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredAppointments.length / itemsPerPage));
  }, [filteredAppointments]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, hospitalFilter]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      setAppointments(prevAppointments => 
        prevAppointments.map(appt => 
          appt.id === appointmentId ? { ...appt, status: newStatus } : appt
        )
      );
      
      console.log(`Appointment ${appointmentId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(i18n.language, options);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-lg">{t('loading')}...</p>
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <FaCalendarPlus className="text-5xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t('noAppointments.title')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('noAppointments.description')}
          </p>
          <button
            onClick={() => navigate('/app/booking')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            {t('bookAppointment')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 ${isRTL ? 'rtl' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t('myAppointments')}</h1>
          <p className="mt-2 text-gray-600">
            {t('viewAndManageYourAppointments')}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t('searchAppointments')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaFilter className="h-4 w-4 mr-2" />
              {t('filters_label')}
            </button>
            
            <button
              onClick={() => navigate('/app/booking')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaCalendarPlus className="h-4 w-4 mr-2" />
              {t('newAppointment')}
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('status')}
                  </label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">{t('allStatuses')}</option>
                    <option value="pending">{t('pending')}</option>
                    <option value="confirmed">{t('confirmed')}</option>
                    <option value="cancelled">{t('cancelled')}</option>
                    <option value="completed">{t('completed')}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('hospitalType')}
                  </label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={hospitalFilter}
                    onChange={(e) => setHospitalFilter(e.target.value)}
                  >
                    <option value="all">{t('allTypes')}</option>
                    <option value="public">Public</option>
                    <option value="university">University</option>
                    <option value="private">Private</option>
                    <option value="regional">Regional</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {paginatedAppointments.map((appointment) => {
              const hospitalType = appointment.hospitalType;
              
              return (
                <li key={appointment.id} className="hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="h-10 w-10 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: hospitalType === 'public' ? '#3b82f6' : hospitalType === 'university' ? '#8b5cf6' : hospitalType === 'private' ? '#10b981' : '#f59e0b' }}
                        >
                          <FaHospital className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.centerName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaMapMarkerAlt className="h-3.5 w-3.5 mr-1" />
                            {appointment.hospitalCity}
                            <span className="mx-2">•</span>
                            <span 
                              className="px-2 py-0.5 text-xs rounded-full"
                              style={{ 
                                backgroundColor: `${hospitalType === 'public' ? '#3b82f620' : hospitalType === 'university' ? '#8b5cf620' : hospitalType === 'private' ? '#10b98120' : '#f59e0b20'}`,
                                color: hospitalType === 'public' ? '#3b82f6' : hospitalType === 'university' ? '#8b5cf6' : hospitalType === 'private' ? '#10b981' : '#f59e0b'
                              }}
                            >
                              {hospitalType.charAt(0).toUpperCase() + hospitalType.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span 
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : appointment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : appointment.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {t(appointment.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">{t('appointmentDetails')}</h4>
                            <div className="space-y-2">
                              <div className="flex items-start">
                                <FaCalendarAlt className="flex-shrink-0 mt-0.5 mr-2 h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-sm text-gray-900 font-medium">{t('dateTime')}</p>
                                  <p className="text-sm text-gray-500">{formatDate(appointment.appointmentDate)}</p>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <FaStethoscope className="flex-shrink-0 mt-0.5 mr-2 h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-sm text-gray-900 font-medium">{t('examType')}</p>
                                  <p className="text-sm text-gray-500">{appointment.examType}</p>
                                </div>
                              </div>
                              {appointment.emergency && (
                                <div className="flex items-center text-red-600">
                                  <FaExclamationTriangle className="h-4 w-4 mr-2" />
                                  <span className="text-sm font-medium">{t('emergency')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">{t('hospitalDetails')}</h4>
                            <div className="space-y-2">
                              <div className="flex items-start">
                                <FaMapMarkerAlt className="flex-shrink-0 mt-0.5 mr-2 h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-sm text-gray-900 font-medium">{t('address')}</p>
                                  <p className="text-sm text-gray-500">
                                    {appointment.hospitalAddress || t('notSpecified')}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <FaPhone className="flex-shrink-0 mt-0.5 mr-2 h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-sm text-gray-900 font-medium">{t('contact')}</p>
                                  <p className="text-sm text-gray-500">
                                    {appointment.hospitalPhone || t('notAvailable')}
                                  </p>
                                </div>
                              </div>
                              {appointment.hospitalServices && (
                                <div className="flex items-start">
                                  <FaProcedures className="flex-shrink-0 mt-0.5 mr-2 h-4 w-4 text-gray-500" />
                                  <div>
                                    <p className="text-sm text-gray-900 font-medium">{t('availableServices')}</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {appointment.hospitalServices.slice(0, 3).map((service, index) => (
                                        <span 
                                          key={index}
                                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                        >
                                          {service}
                                        </span>
                                      ))}
                                      {appointment.hospitalServices.length > 3 && (
                                        <span className="text-xs text-gray-500 self-center">
                                          +{appointment.hospitalServices.length - 3} {t('more')}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                    
                    <div className="mt-4 flex justify-end space-x-3">
                      {appointment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            {t('confirm')}
                          </button>
                          <button
                            onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            {t('cancel')}
                          </button>
                        </>
                      )}
                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'completed')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          {t('markAsCompleted')}
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/appointments/${appointment.id}`)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {t('viewDetails')}
                      </button>
                    </div>
                </li>
              );
            })}
          </ul>
          
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t('previous')}
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {t('next')}
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    {t('showing')} <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> {t('to')}{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredAppointments.length)}
                    </span>{' '}
                    {t('of')} <span className="font-medium">{filteredAppointments.length}</span> {t('results')}
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">{t('previous')}</span>
                      <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">{t('next')}</span>
                      <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AppointmentsListPage;
