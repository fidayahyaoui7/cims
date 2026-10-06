import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToastContainer, toast } from 'react-toastify';
import PropTypes from 'prop-types';
import 'react-toastify/dist/ReactToastify.css';
import './PatientDashboard.css';
import { ErrorBoundary } from '../common/ErrorBoundary';
import DashboardSkeleton from './DashboardSkeleton';

// Tab components
const OverviewTab = () => <div>Overview Tab</div>;
const AppointmentsTab = () => <div>Appointments Tab</div>;
const MessagesTab = () => <div>Messages Tab</div>;
const ResultsTab = () => <div>Results Tab</div>;
const NearbyTab = () => <div>Nearby Centers Tab</div>;

const PatientDashboard = (props) => {
  // Initialize hooks at the top level
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState({ main: true, tabs: {} });
  const [error, setError] = useState(null);
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [results, setResults] = useState([]);
  const [nearbyCenters, setNearbyCenters] = useState([]);
  const isRTL = i18n?.language === 'ar' || false;

  // Tabs configuration
  const tabs = useMemo(() => [
    { id: 'overview', label: 'overview', icon: '📊', component: OverviewTab },
    { id: 'appointments', label: 'appointments', icon: '📅', component: AppointmentsTab },
    { id: 'messages', label: 'messages', icon: '✉️', component: MessagesTab },
    { id: 'results', label: 'results', icon: '📋', component: ResultsTab },
    { id: 'nearby', label: 'nearby_centers', icon: '📍', component: NearbyTab },
  ], []);

  const renderTabContent = useCallback(() => {
    const TabComponent = tabs.find(tab => tab.id === activeTab)?.component || OverviewTab;
    return <TabComponent />;
  }, [activeTab, tabs]);

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Add your data fetching logic here
        setIsLoading(prev => ({ ...prev, main: false }));
      } catch (err) {
        setError(err.message);
        toast.error(t('error.fetching_data'));
        setIsLoading(prev => ({ ...prev, main: false }));
      }
    };

    fetchData();
  }, [t]);

  if (isLoading.main) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{t('error.loading_dashboard')}</p>
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => window.location.reload()}
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="patient-dashboard">
        <div className="dashboard-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
              aria-label={t(tab.label)}
              aria-selected={activeTab === tab.id}
            >
              <span className="tab-icon" role="img" aria-hidden="true">
                {tab.icon}
              </span>
              <span className="tab-label">{t(tab.label)}</span>
              {tab.id === 'messages' && messages.filter((m) => !m.read).length > 0 && (
                <span className="badge bg-danger ms-2">
                  {messages.filter((m) => !m.read).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="dashboard-content">
          {renderTabContent()}
        </div>
        <ToastContainer position={isRTL ? 'top-left' : 'top-right'} rtl={isRTL} />
      </div>
    </ErrorBoundary>
  );
};

PatientDashboard.propTypes = {
  initialTab: PropTypes.string,
  user: PropTypes.object,
  appointments: PropTypes.array,
  messages: PropTypes.array,
  results: PropTypes.array,
  nearbyCenters: PropTypes.array,
  userPosition: PropTypes.object,
  onCancelAppointment: PropTypes.func,
  onSendMessage: PropTypes.func,
  onViewMessage: PropTypes.func,
  onCenterClick: PropTypes.func,
};

PatientDashboard.defaultProps = {
  initialTab: 'overview',
  appointments: [],
  messages: [],
  results: [],
  nearbyCenters: [],
  onCancelAppointment: () => {},
  onSendMessage: () => {},
  onViewMessage: () => {},
  onCenterClick: () => {},
};

export default PatientDashboard;
