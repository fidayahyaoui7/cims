import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCalendarAlt, FaChevronRight, FaClock, FaMapMarkerAlt, FaUserMd } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AppointmentsListPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockAppointments = [
          {
            id: 1,
            date: '2023-06-15',
            time: '10:00 AM',
            doctor: 'Dr. Ahmed Ben Salah',
            specialty: 'Cardiology',
            hospital: 'Charles Nicolle Hospital',
            status: 'confirmed',
            type: 'upcoming'
          },
          {
            id: 2,
            date: '2023-06-20',
            time: '02:30 PM',
            doctor: 'Dr. Leila Trabelsi',
            specialty: 'Dermatology',
            hospital: 'Habib Thameur Hospital',
            status: 'pending',
            type: 'upcoming'
          },
          {
            id: 3,
            date: '2023-05-28',
            time: '09:15 AM',
            doctor: 'Dr. Mohamed Ali',
            specialty: 'General Medicine',
            hospital: 'La Rabta Hospital',
            status: 'completed',
            type: 'past'
          },
        ];
        
        setAppointments(mockAppointments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(
    appointment => appointment.type === activeTab
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            {t('myAppointments.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {t('myAppointments.subtitle')}
          </p>
        </div>
        <Link
          to="/patient/book-appointment"
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition duration-200"
        >
          <FaCalendarAlt className="mr-2" />
          {t('myAppointments.bookNew')}
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'upcoming'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {t('myAppointments.upcoming')} ({appointments.filter(a => a.type === 'upcoming').length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'past'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {t('myAppointments.past')} ({appointments.filter(a => a.type === 'past').length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                {t('myAppointments.noAppointments')}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {activeTab === 'upcoming'
                  ? t('myAppointments.noUpcomingAppointments')
                  : t('myAppointments.noPastAppointments')}
              </p>
              <div className="mt-6">
                <Link
                  to="/patient/book-appointment"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaCalendarAlt className="-ml-1 mr-2 h-5 w-5" />
                  {t('myAppointments.bookNow')}
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                        <FaCalendarAlt className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {appointment.doctor}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {appointment.specialty}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-4">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <FaClock className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            {formatDate(appointment.date)} at {appointment.time}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <FaMapMarkerAlt className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            {appointment.hospital}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === 'confirmed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : appointment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {t(`appointmentStatus.${appointment.status}`)}
                      </span>
                      <Link
                        to={`/patient/appointments/${appointment.id}`}
                        className="ml-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                      >
                        {t('common.viewDetails')}
                        <FaChevronRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsListPage;
