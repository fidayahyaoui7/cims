import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUserMd, FaHospital, FaHistory, FaFileMedical } from 'react-icons/fa';

const PatientDashboard = () => {
  const { currentUser } = useAuth();

  const stats = [
    { title: 'Upcoming Appointments', value: '3', icon: <FaCalendarAlt className="text-blue-500 text-2xl" />, link: '/appointments' },
    { title: 'Doctors', value: '5', icon: <FaUserMd className="text-green-500 text-2xl" />, link: '/doctors' },
    { title: 'Medical History', value: '12', icon: <FaFileMedical className="text-yellow-500 text-2xl" />, link: '/medical-history' },
    { title: 'Hospitals', value: '8', icon: <FaHospital className="text-red-500 text-2xl" />, link: '/hospitals' },
  ];

  const recentActivity = [
    { id: 1, title: 'Appointment Confirmed', description: 'Dr. Smith - Cardiology', time: '2 hours ago', type: 'appointment' },
    { id: 2, title: 'Prescription Updated', description: 'Updated medication list', time: '1 day ago', type: 'prescription' },
    { id: 3, title: 'Test Results', description: 'Blood work results available', time: '3 days ago', type: 'test' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Welcome back, {currentUser?.firstName || 'Patient'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here's what's happening with your health today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link 
            to={stat.link} 
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center"
          >
            <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 mr-4">
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/app/booking" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
          >
            Book Appointment
          </Link>
          <Link 
            to="/find-doctor" 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
          >
            Find a Doctor
          </Link>
          <Link 
            to="/medical-records" 
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
          >
            View Medical Records
          </Link>
          <Link 
            to="/hospitals" 
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
          >
            Find Hospitals
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Activity</h2>
          <Link to="/activity" className="text-blue-500 hover:underline text-sm">View All</Link>
        </div>
        <div className="space-y-4">
          {recentActivity.map(activity => (
            <div key={activity.id} className="flex items-start p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <div className={`p-2 rounded-full mr-3 ${
                activity.type === 'appointment' ? 'bg-blue-100 dark:bg-blue-900' : 
                activity.type === 'prescription' ? 'bg-green-100 dark:bg-green-900' : 
                'bg-yellow-100 dark:bg-yellow-900'
              }`}>
                {activity.type === 'appointment' && <FaCalendarAlt className="text-blue-500" />}
                {activity.type === 'prescription' && <FaFileMedical className="text-green-500" />}
                {activity.type === 'test' && <FaHistory className="text-yellow-500" />}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">{activity.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
