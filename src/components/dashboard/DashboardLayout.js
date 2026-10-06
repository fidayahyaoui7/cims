import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingSpinner from '../common/LoadingSpinner';

const DashboardLayout = ({ isDarkMode, toggleDarkMode, isRTL, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const { user, loading } = useAuth();
  const location = useLocation();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  if (loading || !user) {
    return <LoadingSpinner fullScreen />;
  }

  const dir = isRTL ? 'rtl' : 'ltr';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900" dir={dir}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-30`}>
        <Sidebar user={user} isDarkMode={isDarkMode} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:pl-64">
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode} 
          isRTL={isRTL} 
          user={user}
        />
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto focus:outline-none p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
