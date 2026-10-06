import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaUserMd, 
  FaFileMedicalAlt, 
  FaChartLine,
  FaCalendarPlus,
  FaComments,
  FaHeartbeat,
  FaHeart
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
  const { t } = useTranslation();
  
  const stats = [
    { 
      title: t('dashboard.upcomingAppointments'), 
      value: 2, 
      icon: <FaCalendarAlt className="text-blue-500" />,
      link: '/patient/appointments'
    },
    { 
      title: t('dashboard.unreadMessages'), 
      value: 3, 
      icon: <FaComments className="text-purple-500" />,
      link: '/patient/messages'
    },
    { 
      title: t('dashboard.medicalRecords'), 
      value: 5, 
      icon: <FaFileMedicalAlt className="text-green-500" />,
      link: '/patient/medical-records'
    },
    { 
      title: t('dashboard.favoriteDoctors'), 
      value: 2, 
      icon: <FaHeart className="text-red-500" />,
      link: '/patient/favorites'
    },
  ];

  const quickActions = [
    {
      title: t('dashboard.bookAppointment'),
      description: t('dashboard.bookAppointmentDesc'),
      icon: <FaCalendarPlus className="text-2xl text-blue-500" />,
      link: '/patient/book-appointment',
      buttonText: t('dashboard.bookNow'),
      variant: 'primary'
    },
    {
      title: t('dashboard.healthTracker'),
      description: t('dashboard.healthTrackerDesc'),
      icon: <FaHeartbeat className="text-2xl text-red-500" />,
      link: '/patient/health-tracker',
      buttonText: t('dashboard.viewMetrics'),
      variant: 'secondary'
    },
    {
      title: t('dashboard.medicalHistory'),
      description: t('dashboard.medicalHistoryDesc'),
      icon: <FaFileMedicalAlt className="text-2xl text-green-500" />,
      link: '/patient/medical-records',
      buttonText: t('dashboard.viewRecords'),
      variant: 'outline'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('dashboard.welcomeBack')}, <span className="text-blue-600">John</span>!
        </h1>
        <p className="text-gray-600 mt-2">
          {t('dashboard.welcomeMessage')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link 
            to={stat.link} 
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-blue-50">
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
              </div>
              <p className="mt-4 text-gray-600">{action.description}</p>
              <Link 
                to={action.link}
                className={`mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-${action.variant === 'primary' ? 'blue' : action.variant === 'secondary' ? 'red' : 'gray'}-600 hover:bg-${action.variant === 'primary' ? 'blue' : action.variant === 'secondary' ? 'red' : 'gray'}-700`}
              >
                {action.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('dashboard.recentActivity')}
            </h2>
            <Link to="/patient/activity" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              {t('common.viewAll')}
            </Link>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <FaUserMd />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    {t('dashboard.appointmentConfirmed')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('dashboard.withDrSmith')} - {t('dashboard.tomorrowAt10')}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {t('common.xHoursAgo', { count: item })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
