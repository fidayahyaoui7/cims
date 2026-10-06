import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiCalendar, FiClock, FiCheckCircle, FiAlertCircle, FiUser, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'patient';
  
  // Mock data - replace with actual API calls
  const stats = {
    upcomingAppointments: 2,
    pendingRequests: 1,
    completedSessions: 12,
    totalPatients: 45 // Only for doctors/admins
  };

  const quickActions = [
    { 
      title: 'Book Appointment', 
      description: 'Schedule a new medical appointment',
      icon: <FiCalendar className="h-6 w-6 text-blue-500" />,
      link: '/search',
      roles: ['patient']
    },
    { 
      title: 'View Schedule', 
      description: 'Check your upcoming appointments',
      icon: <FiClock className="h-6 w-6 text-green-500" />,
      link: '/dashboard/appointments',
      roles: ['patient', 'doctor', 'admin']
    },
    { 
      title: 'Complete Profile', 
      description: 'Update your personal information',
      icon: <FiUser className="h-6 w-6 text-purple-500" />,
      link: '/dashboard/profile',
      roles: ['patient', 'doctor', 'admin']
    },
    { 
      title: 'View Patients', 
      description: 'Access patient records and history',
      icon: <FiUsers className="h-6 w-6 text-yellow-500" />,
      link: '/dashboard/patients',
      roles: ['doctor', 'admin']
    }
  ];

  const filteredQuickActions = quickActions.filter(action => 
    action.roles.includes(userRole)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.firstName || 'User'}!
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Here's what's happening with your {userRole} account today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Upcoming Appointments */}
        <div className="overflow-hidden bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-blue-50 dark:bg-blue-900/30">
                <FiCalendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 ml-5">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Upcoming Appointments</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.upcomingAppointments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="overflow-hidden bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-yellow-50 dark:bg-yellow-900/30">
                <FiAlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1 ml-5">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Pending Requests</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Completed Sessions */}
        <div className="overflow-hidden bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-green-50 dark:bg-green-900/30">
                <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 ml-5">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Completed Sessions</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.completedSessions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Patients (for doctors/admins) */}
        {(userRole === 'doctor' || userRole === 'admin') && (
          <div className="overflow-hidden bg-white rounded-lg shadow dark:bg-gray-800">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-purple-50 dark:bg-purple-900/30">
                  <FiUsers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 ml-5">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Patients</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalPatients}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-5 mt-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredQuickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="flex items-start p-4 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex-shrink-0 mt-1">
                {action.icon}
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{action.title}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity - You can add this section later */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
        <div className="mt-4 overflow-hidden bg-white shadow dark:bg-gray-800 sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            <li className="px-6 py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-2 bg-blue-100 rounded-full dark:bg-blue-900/30">
                  <FiCheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Appointment confirmed</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Your appointment with Dr. Smith has been confirmed for tomorrow at 10:00 AM</p>
                </div>
                <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">2 hours ago</div>
              </div>
            </li>
            {/* Add more activity items as needed */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
