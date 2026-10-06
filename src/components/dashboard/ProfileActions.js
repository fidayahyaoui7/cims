import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaComments, FaCog } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function ProfileActions({ user }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Example study UID - in a real app, this would come from your API
  const studyUID = '1.2.840.113619.2.55.3.604688437.783.1599760910.467';

  return (
    <div className="action-buttons">
      {/* View DICOM Studies in OHIF */}
      <button
        onClick={() => navigate(`/viewer?StudyInstanceUID=${studyUID}`)}
        className="btn btn-primary"
      >
        <FaEye className="mr-2" />
        {t('profile.viewMyImages')}
      </button>

      {/* Chat with Medical Team */}
      <button
        onClick={() => navigate(`/chat/${user.id}`)}
        className="btn btn-secondary"
      >
        <FaComments className="mr-2" />
        {t('profile.contactMedicalTeam')}
      </button>

      {/* Settings */}
      <button
        onClick={() => navigate('/dashboard/settings')}
        className="btn btn-outline"
      >
        <FaCog className="mr-2" />
        {t('common.settings')}
      </button>
    </div>
  );
}
