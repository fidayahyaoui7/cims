import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaFilePdf, 
  FaFileImage, 
  FaFileAlt, 
  FaDownload, 
  FaSearch, 
  FaFilter,
  FaCalendarAlt
} from 'react-icons/fa';

const MedicalRecordsPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock data - replace with real data from your API
  const records = [
    {
      id: 1,
      title: 'Blood Test Results',
      type: 'lab',
      date: '2023-05-15',
      fileType: 'pdf',
      size: '2.4 MB',
      doctor: 'Dr. Smith'
    },
    {
      id: 2,
      title: 'X-Ray Scan',
      type: 'imaging',
      date: '2023-04-28',
      fileType: 'dicom',
      size: '15.7 MB',
      doctor: 'Dr. Johnson'
    },
    {
      id: 3,
      title: 'Prescription',
      type: 'prescription',
      date: '2023-04-10',
      fileType: 'pdf',
      size: '0.8 MB',
      doctor: 'Dr. Williams'
    },
    {
      id: 4,
      title: 'MRI Scan',
      type: 'imaging',
      date: '2023-03-22',
      fileType: 'dicom',
      size: '45.2 MB',
      doctor: 'Dr. Johnson'
    },
    {
      id: 5,
      title: 'Allergy Test Results',
      type: 'lab',
      date: '2023-03-15',
      fileType: 'pdf',
      size: '1.2 MB',
      doctor: 'Dr. Smith'
    }
  ];

  const filteredRecords = activeTab === 'all' 
    ? records 
    : records.filter(record => record.type === activeTab);

  const getFileIcon = (fileType) => {
    switch(fileType) {
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;
      case 'dicom':
        return <FaFileImage className="text-blue-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('medicalRecords.title')}</h1>
        <div className="mt-4 md:mt-0 flex space-x-2
          ">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('common.search')}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white">
              <option>{t('common.filters')}</option>
              <option>{t('medicalFilters.thisMonth')}</option>
              <option>{t('medicalFilters.last3Months')}</option>
              <option>{t('medicalFilters.thisYear')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {t('medicalRecords.allRecords')}
          </button>
          <button
            onClick={() => setActiveTab('lab')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'lab' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {t('medicalRecords.labResults')}
          </button>
          <button
            onClick={() => setActiveTab('imaging')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'imaging' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {t('medicalRecords.imaging')}
          </button>
          <button
            onClick={() => setActiveTab('prescription')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'prescription' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            {t('medicalRecords.prescriptions')}
          </button>
        </nav>
      </div>

      {/* Records Grid */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {filteredRecords.map((record) => (
            <li key={record.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {getFileIcon(record.fileType)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{record.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <FaCalendarAlt className="mr-1.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                      <span>{new Date(record.date).toLocaleDateString()}</span>
                      <span className="mx-1">•</span>
                      <span>{record.doctor}</span>
                      <span className="mx-1">•</span>
                      <span>{record.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-500">
                    <FaDownload className="h-5 w-5" />
                  </button>
                  {record.fileType === 'dicom' && (
                    <button 
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                      onClick={() => {/* Open in OHIF Viewer */}}
                    >
                      {t('medicalRecords.viewInViewer')}
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MedicalRecordsPage;
