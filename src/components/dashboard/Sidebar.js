import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiCalendar, 
  FiMessageSquare, 
  FiUser, 
  FiSettings, 
  FiChevronRight,
  FiPlusCircle,
  FiFileText,
  FiActivity,
  FiHeart,
  FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ user, isDarkMode }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  const patientNavItems = [
    { 
      name: 'Dashboard',
      icon: <FiHome className="h-5 w-5" />,
      path: '/dashboard/patient',
      roles: ['patient']
    },
    { 
      name: 'Appointments',
      icon: <FiCalendar className="h-5 w-5" />,
      path: '/dashboard/patient/appointments',
      roles: ['patient']
    },
    { 
      name: 'Messages',
      icon: <FiMessageSquare className="h-5 w-5" />,
      path: (user) => `/dashboard/${(user?.role || 'patient')}/messages`,
      roles: ['patient', 'doctor', 'admin']
    },
    { 
      name: 'Book Appointment',
      icon: <FiPlusCircle className="h-5 w-5" />,
      path: '/book-appointment',
      roles: ['patient']
    },
    { 
      name: 'Medical Records',
      icon: <FiFileText className="h-5 w-5" />,
      path: '/medical-records',
      roles: ['patient']
    },
    { 
      name: 'Health Tracker',
      icon: <FiActivity className="h-5 w-5" />,
      path: '/health-tracker',
      roles: ['patient']
    },
    { 
      name: 'Favorites',
      icon: <FiHeart className="h-5 w-5" />,
      path: '/favorites',
      roles: ['patient']
    },
    { 
      name: 'Profile',
      icon: <FiUser className="h-5 w-5" />,
      path: (user) => `/dashboard/${user?.role || 'patient'}/profile`,
      roles: ['patient', 'doctor', 'admin']
    },
  ];

  const commonNavItems = [
    { 
      name: 'Settings',
      icon: <FiSettings className="h-5 w-5" />,
      path: '/settings',
      roles: ['patient', 'doctor', 'admin']
    },
  ];

  const filteredNavItems = [...patientNavItems, ...commonNavItems].filter(item => 
    item.roles.includes(user?.role || 'patient')
  );

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transition-all duration-200 ${isExpanded ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        {isExpanded && (
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role?.charAt(0).toUpperCase() + (user?.role?.slice(1) || '')}
              </p>
            </div>
          </div>
        )}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
        >
          <FiChevronRight className={`h-5 w-5 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const path = typeof item.path === 'function' ? item.path(user) : item.path;
          return (
            <NavLink
              key={item.name}
              to={path}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg mx-2 transition-colors duration-200 ${isActive
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-100 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white'
                }`
              }
            >
              <span className={`${isExpanded ? 'mr-3' : 'mx-auto'}`}>
                {React.cloneElement(item.icon, {
                  className: 'h-5 w-5 flex-shrink-0'
                })}
              </span>
              {isExpanded && (
                <span className="truncate">
                  {item.name}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
        >
          <FiLogOut className="h-5 w-5 flex-shrink-0" />
          {isExpanded && <span className="ml-3">Sign out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
