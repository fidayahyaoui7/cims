import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaUserMd, 
  FaHospital, 
  FaInfoCircle, 
  FaEdit,
  FaBriefcaseMedical,
  FaStethoscope,
  FaUserTie,
  FaPrint,
  FaUserCog
} from 'react-icons/fa';
import './Profile.css';
import ProfileActions from './ProfileActions';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Format user data for display
    const formatProfileData = (userData) => {
      const baseData = {
        ...userData,
        phone: userData.phone || 'Not provided',
        address: userData.address || 'Not provided',
        dateOfBirth: userData.dateOfBirth || userData.birthDate || 'Not provided',
        gender: userData.gender || 'Not specified',
        memberSince: userData.createdAt || userData.memberSince || new Date().toISOString(),
        lastLogin: userData.lastLogin || new Date().toISOString(),
      };

      // Add role-specific data
      switch(userData.role) {
        case 'doctor':
          return {
            ...baseData,
            specialty: userData.specialty || userData.specialization || 'General Practitioner',
            licenseNumber: userData.licenseNumber || userData.license || 'Not provided',
            hospital: userData.hospital || userData.hospitalName || 'Not specified',
            experience: userData.experience || userData.yearsOfExperience || '0',
            bio: userData.bio || userData.about || 'No biography available.',
            education: userData.education || 'Not provided',
            languages: userData.languages || ['English'],
            consultationFee: userData.consultationFee || 'Not specified'
          };
        case 'admin':
          return {
            ...baseData,
            department: userData.department || 'Administration',
            position: userData.position || 'Administrator',
            permissions: userData.permissions || ['manage_users', 'manage_content']
          };
        case 'patient':
        default:
          return {
            ...baseData,
            bloodType: userData.bloodType || 'Unknown',
            allergies: userData.allergies || 'None reported',
            emergencyContact: userData.emergencyContact || 'Not provided',
            insuranceProvider: userData.insuranceProvider || 'Not specified'
          };
      }
    };

    try {
      setProfileData(formatProfileData(user));
    } catch (err) {
      console.error('Error formatting profile data:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  const renderRoleBadge = (role) => {
    const roleConfig = {
      doctor: { bg: 'bg-blue-100 text-blue-800', icon: <FaStethoscope className="mr-1" /> },
      patient: { bg: 'bg-green-100 text-green-800', icon: <FaUser className="mr-1" /> },
      admin: { bg: 'bg-purple-100 text-purple-800', icon: <FaUserTie className="mr-1" /> },
      default: { bg: 'bg-gray-100 text-gray-800', icon: <FaUser className="mr-1" /> }
    };

    const { bg, icon } = roleConfig[role] || roleConfig.default;
    const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User';
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${bg}`}>
        {icon}
        {displayRole}
      </span>
    );
  };

  const renderPersonalInfo = () => (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <FaUser className="mr-2" />
        {t('profile.personalInfo')}
      </h2>
      <div className="space-y-3">
        <div className="flex items-center">
          <FaUser className="text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.fullName')}</p>
            <p className="text-gray-800 dark:text-white truncate">{`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Not provided'}</p>
          </div>
        </div>
        <div className="flex items-center">
          <FaEnvelope className="text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="text-gray-800 dark:text-white truncate">{user.email || 'Not provided'}</p>
          </div>
        </div>
        <div className="flex items-center">
          <FaPhone className="text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.phone')}</p>
            <p className="text-gray-800 dark:text-white">{profileData.phone}</p>
          </div>
        </div>
        <div className="flex items-start">
          <FaMapMarkerAlt className="text-gray-500 dark:text-gray-400 mr-3 mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.address')}</p>
            <p className="text-gray-800 dark:text-white">{profileData.address}</p>
          </div>
        </div>
        <div className="flex items-center">
          <FaCalendarAlt className="text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.dateOfBirth')}</p>
            <p className="text-gray-800 dark:text-white">
              {profileData.dateOfBirth === 'Not provided' 
                ? profileData.dateOfBirth 
                : new Date(profileData.dateOfBirth).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <FaUser className="text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.gender')}</p>
            <p className="text-gray-800 dark:text-white">{profileData.gender}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountInfo = () => (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        {t('profile.accountInfo')}
      </h2>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.accountType')}</p>
          <div className="mt-1">
            {renderRoleBadge(user.role)}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.memberSince')}</p>
          <p className="text-gray-800 dark:text-white">
            {new Date(profileData.memberSince).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.lastLogin')}</p>
          <p className="text-gray-800 dark:text-white">
            {new Date(profileData.lastLogin).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );

  const renderDoctorInfo = () => (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
      <h3 className="text-md font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <FaBriefcaseMedical className="mr-2" />
        {t('profile.professionalInfo')}
      </h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.specialty')}</p>
          <p className="text-gray-800 dark:text-white">{profileData.specialty}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.licenseNumber')}</p>
          <p className="text-gray-800 dark:text-white">{profileData.licenseNumber}</p>
        </div>
        <div className="flex items-start">
          <FaHospital className="text-gray-500 dark:text-gray-400 mr-3 mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.hospitalClinic')}</p>
            <p className="text-gray-800 dark:text-white">{profileData.hospital}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.experience')}</p>
          <p className="text-gray-800 dark:text-white">
            {profileData.experience} {profileData.experience === '1' ? 'year' : 'years'}
          </p>
        </div>
        {profileData.consultationFee && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.consultationFee')}</p>
            <p className="text-gray-800 dark:text-white">{profileData.consultationFee}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.languages')}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {Array.isArray(profileData.languages) ? (
              profileData.languages.map((lang, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {lang}
                </span>
              ))
            ) : (
              <span className="text-gray-800 dark:text-white">
                {profileData.languages || 'Not specified'}
              </span>
            )}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.bio')}</p>
          <p className="text-gray-800 dark:text-white mt-1 whitespace-pre-line">
            {profileData.bio}
          </p>
        </div>
      </div>
    </div>
  );

  const renderPatientInfo = () => (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
      <h3 className="text-md font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <FaBriefcaseMedical className="mr-2" />
        {t('profile.medicalInfo')}
      </h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.bloodType')}</p>
          <p className="text-gray-800 dark:text-white">{profileData.bloodType}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.allergies')}</p>
          <p className="text-gray-800 dark:text-white">{profileData.allergies}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.emergencyContact')}</p>
          <p className="text-gray-800 dark:text-white">{profileData.emergencyContact}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.insuranceProvider')}</p>
          <p className="text-gray-800 dark:text-white">{profileData.insuranceProvider}</p>
        </div>
      </div>
    </div>
  );

  const renderAdminInfo = () => (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
      <h3 className="text-md font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <FaUserTie className="mr-2" />
        {t('profile.adminInfo')}
      </h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.department')}</p>
          <p className="text-gray-800 dark:text-white">{profileData.department}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('profile.position')}</p>
          <p className="text-gray-800 dark:text-white">{profileData.position}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('profile.permissions')}</p>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(profileData.permissions) ? (
              profileData.permissions.map((permission, index) => (
                <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                  {permission}
                </span>
              ))
            ) : (
              <span className="text-gray-500 dark:text-gray-400">No specific permissions</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaInfoCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="avatar-container">
            <div className="avatar bg-white text-blue-600 flex items-center justify-center text-3xl font-bold">
              {(user.firstName?.charAt(0) || '').toUpperCase()}
              {(user.lastName?.charAt(0) || '').toUpperCase()}
            </div>
            <div className="user-info">
              <h1 className="text-2xl font-bold truncate">
                {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'}
              </h1>
              <div className="user-email">
                <FaEnvelope className="inline mr-2" />
                <span>{user.email}</span>
              </div>
              <div className="user-role">
                <span className="role-badge">{user.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Actions */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <ProfileActions user={user} />
        </div>
        
        {/* Profile Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderPersonalInfo()}
              {renderAccountInfo()}
            </div>

            {/* Role-specific information */}
            {user.role === 'doctor' && renderDoctorInfo()}
            {user.role === 'patient' && renderPatientInfo()}
            {user.role === 'admin' && renderAdminInfo()}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate('/dashboard/settings')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex-1 sm:flex-none sm:w-auto flex items-center justify-center"
            >
              <FaEdit className="mr-2" />
              {t('profile.editProfile')}
            </button>
            <button
              onClick={() => navigate('/dashboard/change-password')}
              className="px-4 py-2 border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex-1 sm:flex-none sm:w-auto"
            >
              {t('profile.changePassword')}
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-4 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-md transition-colors flex-1 sm:flex-none sm:w-auto"
            >
              {t('auth.signOut')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
