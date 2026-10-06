import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeartbeat, FaCalendarCheck, FaCommentMedical, FaUser, FaCog, FaPlus, FaFileMedical } from 'react-icons/fa';
import './AppointmentsPage.css';

// Helper function to format appointment date
const formatAppointmentDate = (dateString?: string): string => {
  if (!dateString) return 'Today';
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

interface Appointment {
  id: string;
  time: string;
  date?: string;
  doctor: string;
  specialty: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'scheduled';
  notes?: string;
}

export default function AppointmentsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('appointments');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAppointments, setCurrentAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data for current appointments (today)
        const mockCurrentAppointments: Appointment[] = [
          {
            id: '1',
            time: '10:30 AM',
            doctor: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            status: 'confirmed',
            notes: 'Annual checkup'
          },
          {
            id: '2',
            time: '2:15 PM',
            doctor: 'Dr. Michael Chen',
            specialty: 'Dermatology',
            status: 'pending',
            notes: 'Skin condition follow-up'
          }
        ];

        // Mock data for upcoming appointments
        const mockUpcomingAppointments: Appointment[] = [
          {
            id: '3',
            time: '9:00 AM',
            date: 'Aug 30',
            doctor: 'Dr. Emily Rodriguez',
            specialty: 'General Checkup',
            status: 'scheduled',
            notes: 'Routine examination'
          },
          {
            id: '4',
            time: '11:30 AM',
            date: 'Sep 5',
            doctor: 'Dr. Robert Kim',
            specialty: 'Orthopedics',
            status: 'scheduled',
            notes: 'Knee pain consultation'
          }
        ];

        setCurrentAppointments(mockCurrentAppointments);
        setUpcomingAppointments(mockUpcomingAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/patient/${tab}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge badge-primary">Confirmed</span>;
      case 'pending':
        return <span className="badge badge-warning">Pending</span>;
      case 'scheduled':
        return <span className="badge badge-success">Scheduled</span>;
      case 'cancelled':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="appointments-container">
        <div className="loading-spinner">Loading appointments...</div>
      </div>
    );
  }

  // Determine which appointments to display based on active tab
  const displayedAppointments = activeTab === 'upcoming' ? upcomingAppointments : currentAppointments;

  return (
    <div className="appointments-container">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <FaHeartbeat />
            <span>MediSchedule</span>
          </div>
          <div className="user-info">
            <div className="user-avatar">JD</div>
            <div>
              <div>John Doe</div>
              <div style={{ fontSize: '0.9em', opacity: 0.8 }}>patient1@gmail.com</div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <div className="appointments-content">
          {displayedAppointments.length === 0 ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {activeTab === 'upcoming' 
                  ? t('appointments.noUpcomingAppointments')
                  : t('appointments.noPastAppointments')}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {activeTab === 'upcoming' 
                  ? t('appointments.scheduleAppointmentPrompt')
                  : t('appointments.pastAppointmentsWillAppearHere')}
              </p>
              {activeTab === 'upcoming' && (
                <div className="mt-6">
                  <Link
                    to="/patient/book-appointment"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                    {t('appointments.bookAppointment')}
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayedAppointments.map((appointment) => (
                  <li key={appointment.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {appointment.doctor}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        {getStatusBadge(appointment.status)}
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {formatAppointmentDate(appointment.date)}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-300 sm:mt-0 sm:ml-6">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm2 5a1 1 0 10-2 0v1h2V7zm0 2v4a1 1 0 102 0v-4a1 1 0 10-2 0zm4-2a1 1 0 10-2 0v4a1 1 0 102 0V7z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {appointment.specialty}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-300 sm:mt-0">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            // TODO: Implement view details or edit functionality
                          }}
                        >
                          {t('common.viewDetails')}
                        </button>
                      </div>
                    </div>
                    {appointment.notes && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                          <span className="font-medium">{t('appointments.notes')}:</span> {appointment.notes}
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
