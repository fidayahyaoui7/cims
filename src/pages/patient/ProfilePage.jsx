import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaUser, 
  FaEnvelope,
  FaTint,
  FaRulerVertical,
  FaWeight, 
  FaPhone, 
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaVenusMars,
  FaEdit,
  FaSave,
  FaTimes
} from 'react-icons/fa';

const ProfilePage = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data - replace with real data from your auth context
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+216 12 345 678',
    address: '123 Main St, Tunis, Tunisia',
    birthDate: '1985-06-15',
    gender: 'male',
    bloodType: 'A+',
    height: '175 cm',
    weight: '72 kg'
  });

  const [formData, setFormData] = useState({ ...user });

  const handleEdit = () => {
    setFormData({ ...user });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setUser({ ...formData });
    setIsEditing(false);
    // Here you would typically make an API call to update the user's profile
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderField = (label, name, icon, type = 'text') => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        {isEditing ? (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="mt-1 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        ) : (
          <div className="mt-1 pl-10 py-2 text-gray-900">
            {user[name]}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('profile.title')}</h1>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaEdit className="mr-2" />
            {t('common.edit')}
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaTimes className="mr-2" />
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaSave className="mr-2" />
              {t('common.save')}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {t('profile.personalInformation')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {t('profile.personalInformationDescription')}
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              {renderField(
                t('profile.firstName'),
                'firstName',
                <FaUser className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <div className="sm:col-span-3">
              {renderField(
                t('profile.lastName'),
                'lastName',
                <FaUser className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <div className="sm:col-span-6">
              {renderField(
                t('profile.email'),
                'email',
                <FaEnvelope className="h-4 w-4 text-gray-400" />,
                'email'
              )}
            </div>
            <div className="sm:col-span-3">
              {renderField(
                t('profile.phone'),
                'phone',
                <FaPhone className="h-4 w-4 text-gray-400" />,
                'tel'
              )}
            </div>
            <div className="sm:col-span-3">
              {renderField(
                t('profile.birthDate'),
                'birthDate',
                <FaBirthdayCake className="h-4 w-4 text-gray-400" />,
                'date'
              )}
            </div>
            <div className="sm:col-span-6">
              {renderField(
                t('profile.address'),
                'address',
                <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <div className="sm:col-span-3">
              {renderField(
                t('profile.gender'),
                'gender',
                <FaVenusMars className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {t('profile.medicalInformation')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {t('profile.medicalInformationDescription')}
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              {renderField(
                t('profile.bloodType'),
                'bloodType',
                <FaTint className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <div className="sm:col-span-2">
              {renderField(
                t('profile.height'),
                'height',
                <FaRulerVertical className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <div className="sm:col-span-2">
              {renderField(
                t('profile.weight'),
                'weight',
                <FaWeight className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {t('profile.accountSettings')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {t('profile.accountSettingsDescription')}
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {t('profile.changePassword')}
                </h4>
                <p className="text-sm text-gray-500">
                  {t('profile.changePasswordDescription')}
                </p>
              </div>
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {t('common.change')}
              </button>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {t('profile.twoFactorAuth')}
                </h4>
                <p className="text-sm text-gray-500">
                  {t('profile.twoFactorAuthDescription')}
                </p>
              </div>
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {t('common.enable')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
