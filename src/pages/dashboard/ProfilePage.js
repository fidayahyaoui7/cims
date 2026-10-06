import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ProfilePage.css';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = () => {
      try {
        // Mock user data for development
        const mockUser = {
          id: 'dev-user-123',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'patient',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          joinDate: new Date().toLocaleDateString(),
          lastLogin: new Date().toLocaleString(),
          phone: '+216 12 345 678',
          address: '123 Main St, Tunis, Tunisia'
        };
        
        setUserData(mockUser);
      } catch (error) {
        console.error('Error setting up mock data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    // Load data immediately without auth check
    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="avatar-container">
            <img 
              src={userData?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || 'User')}&background=3b82f6&color=fff`} 
              alt={userData?.name}
              className="avatar"
            />
            <div className="user-info">
              <h1>{userData?.name || 'User'}</h1>
              <div className="user-email">
                <span>{userData?.email}</span>
              </div>
              <div className="user-role">
                <span className="role-badge">{userData?.role || 'User'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">12</div>
              <div className="stat-label">Appointments</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">5</div>
              <div className="stat-label">Upcoming</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">7</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="info-grid">
            <div>
              <h2 className="section-title">Personal Information</h2>
              <div className="info-group">
                <div className="info-label">Full Name</div>
                <div className="info-value">{userData?.name || 'Not provided'}</div>
              </div>
              <div className="info-group">
                <div className="info-label">Email</div>
                <div className="info-value">{userData?.email}</div>
              </div>
              <div className="info-group">
                <div className="info-label">Phone</div>
                <div className="info-value">{userData?.phone || 'Not provided'}</div>
              </div>
            </div>

            <div>
              <h2 className="section-title">Account Details</h2>
              <div className="info-group">
                <div className="info-label">Account Type</div>
                <div className="info-value capitalize">{userData?.role || 'Patient'}</div>
              </div>
              <div className="info-group">
                <div className="info-label">Member Since</div>
                <div className="info-value">{userData?.joinDate || 'Not available'}</div>
              </div>
              <div className="info-group">
                <div className="info-label">Last Login</div>
                <div className="info-value">{userData?.lastLogin || 'First login'}</div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="section-title">Contact Information</h2>
            <div className="info-grid">
              <div>
                <div className="info-group">
                  <div className="info-label">Address</div>
                  <div className="info-value">{userData?.address || 'Not provided'}</div>
                </div>
                <div className="info-group">
                  <div className="info-label">Emergency Contact</div>
                  <div className="info-value">{userData?.emergencyContact || 'Not provided'}</div>
                </div>
              </div>
              <div>
                <div className="info-group">
                  <div className="info-label">Preferred Language</div>
                  <div className="info-value">{userData?.language || 'English'}</div>
                </div>
                <div className="info-group">
                  <div className="info-label">Time Zone</div>
                  <div className="info-value">{userData?.timezone || 'GMT+1 (Tunis)'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn btn-outline" onClick={() => window.print()}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
              </svg>
              Print Profile
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/dashboard/settings')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
