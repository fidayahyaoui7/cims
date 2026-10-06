import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { fr, arTN } from 'date-fns/locale';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { 
  DotsVerticalIcon, 
  DownloadIcon, 
  SearchIcon, 
  XIcon,
  XCircleIcon,
  ArrowsExpandIcon,
  ArrowsCollapseIcon
} from '@heroicons/react/outline';
import { Dialog, DialogOverlay, DialogTitle } from '@headlessui/react';
import OHIFViewer from '../../components/medical/OHIFViewer';
import { Box, Button, CircularProgress, IconButton, Tooltip } from '@mui/material';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface MedicalRecord {
  id: string;
  title: string;
  type: 'dicom' | 'pdf' | 'image' | 'lab' | 'note';
  date: string;
  doctor: string;
  specialty: string;
  fileUrl: string;
  thumbnailUrl?: string;
  description?: string;
}

const MedicalRecordsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewingDicom, setViewingDicom] = useState(false);
  const currentLanguage = i18n.language;
  const viewerContainerRef = useRef<HTMLDivElement>(null);

  // Record types for filtering
  const recordTypes = [
    { id: 'all', name: t('medicalRecords.filters.all') },
    { id: 'dicom', name: t('medicalRecords.filters.dicom') },
    { id: 'pdf', name: t('medicalRecords.filters.reports') },
    { id: 'image', name: t('medicalRecords.filters.images') },
    { id: 'lab', name: t('medicalRecords.filters.labResults') },
    { id: 'note', name: t('medicalRecords.filters.clinicalNotes') },
  ];

  // Fetch medical records
  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch('/api/medical-records', {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        // });
        // const data = await response.json();
        
        // Mock data
        const mockRecords: MedicalRecord[] = [
          {
            id: '1',
            title: 'Chest X-Ray',
            type: 'dicom',
            date: '2023-10-15T14:30:00',
            doctor: 'Dr. Sarah Johnson',
            specialty: 'Radiology',
            fileUrl: 'https://ohif-hack-diverse-cases.s3.amazonaws.com/dcm4chee-ecat7/1.3.6.1.4.1.14519.5.2.1.2744.7002.173296177149422890137170405296.dcm',
            thumbnailUrl: 'https://ohif-hack-diverse-cases.s3.amazonaws.com/thumbnails/chest-xray-thumb.jpg',
            description: 'Routine chest X-ray to monitor lung condition.'
          },
          {
            id: '2',
            title: 'Blood Test Results',
            type: 'lab',
            date: '2023-09-28T09:15:00',
            doctor: 'Dr. Michael Chen',
            specialty: 'Hematology',
            fileUrl: 'https://example.com/reports/blood-test-sep-2023.pdf',
            description: 'Complete blood count and metabolic panel.'
          },
          {
            id: '3',
            title: 'MRI Scan - Brain',
            type: 'dicom',
            date: '2023-08-10T11:20:00',
            doctor: 'Dr. Emily Davis',
            specialty: 'Neurology',
            fileUrl: 'https://ohif-hack-diverse-cases.s3.amazonaws.com/dcm4chee-ecat7/1.3.6.1.4.1.14519.5.2.1.2744.7002.173296177149422890137170405297.dcm',
            thumbnailUrl: 'https://ohif-hack-diverse-cases.s3.amazonaws.com/thumbnails/mri-brain-thumb.jpg',
            description: 'MRI scan of the brain with contrast.'
          },
          {
            id: '4',
            title: 'Doctor\'s Notes',
            type: 'note',
            date: '2023-07-22T16:45:00',
            doctor: 'Dr. Robert Wilson',
            specialty: 'Cardiology',
            fileUrl: 'https://example.com/notes/cardiology-jul-2023.pdf',
            description: 'Follow-up visit notes and treatment plan.'
          },
          {
            id: '5',
            title: 'CT Scan - Abdomen',
            type: 'dicom',
            date: '2023-06-05T10:00:00',
            doctor: 'Dr. Sarah Johnson',
            specialty: 'Radiology',
            fileUrl: 'https://ohif-hack-diverse-cases.s3.amazonaws.com/dcm4chee-ecat7/1.3.6.1.4.1.14519.5.2.1.2744.7002.173296177149422890137170405298.dcm',
            thumbnailUrl: 'https://ohif-hack-diverse-cases.s3.amazonaws.com/thumbnails/ct-abdomen-thumb.jpg',
            description: 'CT scan of the abdomen with contrast.'
          },
        ];
        
        setRecords(mockRecords);
        setFilteredRecords(mockRecords);
      } catch (error) {
        console.error('Error fetching medical records:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicalRecords();
  }, []);

  // Filter records based on search term and active filter
  useEffect(() => {
    let result = [...records];
    
    // Apply type filter
    if (activeFilter !== 'all') {
      result = result.filter(record => record.type === activeFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        record =>
          record.title.toLowerCase().includes(term) ||
          record.doctor.toLowerCase().includes(term) ||
          record.specialty.toLowerCase().includes(term) ||
          (record.description && record.description.toLowerCase().includes(term))
      );
    }
    
    setFilteredRecords(result);
  }, [searchTerm, activeFilter, records]);

  const handleRecordClick = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setPageNumber(1);
    setIsViewerOpen(true);
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedRecord(null);
    setPageNumber(1);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'dicom':
        return (
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'pdf':
        return (
          <div className="p-2 rounded-lg bg-red-100 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'image':
        return (
          <div className="p-2 rounded-lg bg-green-100 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'lab':
        return (
          <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'note':
        return (
          <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'PPP', {
      locale: currentLanguage === 'fr' ? fr : currentLanguage === 'ar' ? arTN : undefined
    });
  };

  if (isLoading && records.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('medicalRecords.title')}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t('medicalRecords.subtitle')}
        </p>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('medicalRecords.title')}</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="block w-48 pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              <option value="">{t('common.allTypes')}</option>
              <option value="dicom">DICOM</option>
              <option value="pdf">PDF</option>
              <option value="image">{t('common.image')}</option>
              <option value="lab">{t('common.labResults')}</option>
              <option value="note">{t('common.notes')}</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {recordTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                activeFilter === type.id
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveFilter(type.id)}
            >
              {type.name}
            </button>
          ))}
        </div>

        {filteredRecords.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                {t('medicalRecords.noRecordsFound')}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? t('medicalRecords.noMatchingRecords')
                  : t('medicalRecords.noRecordsDescription')}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-200 dark:border-gray-700"
                onClick={() => handleRecordClick(record)}
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {record.thumbnailUrl ? (
                        <img
                          className="h-16 w-16 object-cover rounded"
                          src={record.thumbnailUrl}
                          alt={record.title}
                        />
                      ) : (
                        getFileIcon(record.type)
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                          {record.title}
                        </h3>
                        <div className="ml-2 flex-shrink-0 flex">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(record.fileUrl, `${record.title}.${record.type}`);
                            }}
                          >
                            <DownloadIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {record.description}
                      </p>
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span>{formatDate(record.date)}</span>
                        <span className="mx-2">•</span>
                        <span>{record.doctor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={isViewerOpen}
        onClose={handleCloseViewer}
        className="fixed inset-0 z-50 overflow-y-auto"
        fullScreen={isFullscreen}
      >
        <div className="flex items-center justify-center min-h-screen">
          <DialogOverlay className="fixed inset-0 bg-black opacity-75" />
          <div
            className={`relative bg-white ${
              isFullscreen ? 'w-full h-full' : 'rounded-lg max-w-4xl w-full max-h-[90vh]'
            } overflow-hidden`}
            ref={viewerContainerRef}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <DialogTitle className="text-xl font-semibold">
                {selectedRecord?.title}
              </DialogTitle>
              <div className="flex space-x-2">
                <Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                  <IconButton
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    size="small"
                  >
                    {isFullscreen ? (
                      <ArrowsCollapseIcon className="h-5 w-5" />
                    ) : (
                      <ArrowsExpandIcon className="h-5 w-5" />
                    )}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Close">
                  <IconButton onClick={handleCloseViewer} size="small">
                    <XIcon className="h-5 w-5" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>

            <div
              className={`${
                isFullscreen ? 'h-[calc(100vh-64px)]' : 'max-h-[calc(90vh-60px)]'
              } overflow-auto`}
            >
              {selectedRecord?.type === 'dicom' ? (
                <Box sx={{ height: '100%' }}>
                  <OHIFViewer
                    studyInstanceUid={selectedRecord.id}
                    onClose={handleCloseViewer}
                  />
                </Box>
              ) : (
                <div className="p-4">
                  {selectedRecord?.type === 'pdf' && (
                    <Document
                      file={selectedRecord.fileUrl}
                      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                      loading={
                        <div className="flex justify-center items-center h-64">
                          <CircularProgress />
                        </div>
                      }
                    >
                      <Page
                        pageNumber={pageNumber}
                        width={Math.min(
                          800,
                          viewerContainerRef.current?.clientWidth || 800 - 32
                        )}
                        loading={
                          <div className="flex justify-center items-center h-64">
                            <CircularProgress />
                          </div>
                        }
                      />
                    </Document>
                  )}
                  {selectedRecord?.type === 'image' && (
                    <div className="flex justify-center">
                      <img
                        src={selectedRecord?.fileUrl || ''}
                        alt={selectedRecord?.title || 'Medical image'}
                        className="max-w-full max-h-[70vh] object-contain"
                        style={{
                          maxHeight: isFullscreen
                            ? 'calc(100vh - 200px)'
                            : '70vh',
                          maxWidth: '100%',
                        }}
                      />
                    </div>
                  )}
                  {(selectedRecord?.type === 'lab' || selectedRecord?.type === 'note') && (
                    <div className="h-full flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-24 w-24 text-gray-400">
                          {getFileIcon(selectedRecord?.type || 'note')}
                        </div>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">
                          {selectedRecord?.title || 'Untitled Document'}
                        </h3>
                        {selectedRecord?.description && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {selectedRecord.description}
                          </p>
                        )}
                        <div className="mt-6">
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() =>
                              selectedRecord &&
                              handleDownload(
                                selectedRecord.fileUrl,
                                `${selectedRecord.title || 'document'}.${selectedRecord.type || 'pdf'}`
                              )
                            }
                          >
                            <DownloadIcon className="-ml-1 mr-2 h-5 w-5" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedRecord?.type?.toUpperCase() || 'DOCUMENT'} •{' '}
                  {selectedRecord?.date
                    ? format(new Date(selectedRecord.date), 'MMMM d, yyyy')
                    : 'No date'}
                </p>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => {
                      // Implement share functionality
                      alert('Share functionality would be implemented here');
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    Share
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() =>
                      selectedRecord &&
                      handleDownload(
                        selectedRecord.fileUrl,
                        `${selectedRecord.title || 'document'}.${selectedRecord.type || 'pdf'}`
                      )
                    }
                  >
                    <DownloadIcon className="-ml-1 mr-2 h-5 w-5" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default MedicalRecordsPage;
