import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFilePdf, 
  faFileImage, 
  faFileAlt,
  faFileDownload,
  faSearch,
  faFilter,
  faSort,
  faEllipsisV
} from '@fortawesome/free-solid-svg-icons';
import styles from '../Dashboard.module.css';

interface MedicalRecord {
  id: number;
  type: 'pdf' | 'image' | 'lab' | 'note' | 'dicom';
  title: string;
  date: string;
  description: string;
  fileSize: string;
}

const MedicalRecordsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const records: MedicalRecord[] = [
    {
      id: 1,
      type: 'pdf',
      title: 'Complete Blood Count (CBC)',
      date: '2023-08-30',
      description: 'Blood test results showing complete blood count',
      fileSize: '2.4 MB'
    },
    {
      id: 2,
      type: 'image',
      title: 'Chest X-Ray',
      date: '2023-08-28',
      description: 'Frontal and lateral chest X-ray images',
      fileSize: '4.7 MB'
    },
    {
      id: 3,
      type: 'lab',
      title: 'Lipid Panel Results',
      date: '2023-08-15',
      description: 'Cholesterol and triglyceride levels',
      fileSize: '1.8 MB'
    },
    {
      id: 4,
      type: 'note',
      title: 'Doctor Visit Summary',
      date: '2023-08-10',
      description: 'Summary of visit with Dr. Smith',
      fileSize: '0.5 MB'
    },
    {
      id: 5,
      type: 'dicom',
      title: 'MRI Scan - Brain',
      date: '2023-07-25',
      description: 'Magnetic resonance imaging of the brain',
      fileSize: '124.3 MB'
    },
    {
      id: 6,
      type: 'pdf',
      title: 'Prescription - Lisinopril',
      date: '2023-07-20',
      description: 'Prescription for blood pressure medication',
      fileSize: '0.8 MB'
    },
    {
      id: 7,
      type: 'lab',
      title: 'Thyroid Function Test',
      date: '2023-07-15',
      description: 'TSH, T3, and T4 levels',
      fileSize: '1.2 MB'
    },
    {
      id: 8,
      type: 'image',
      title: 'Knee X-Ray',
      date: '2023-07-05',
      description: 'X-ray of left knee - AP and lateral views',
      fileSize: '3.9 MB'
    }
  ];

  const filteredRecords = records
    .filter(record => {
      const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || record.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
    });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FontAwesomeIcon icon={faFilePdf} className={styles.recordIcon} style={{ color: '#e74c3c' }} />;
      case 'image':
        return <FontAwesomeIcon icon={faFileImage} className={styles.recordIcon} style={{ color: '#3498db' }} />;
      case 'dicom':
        return <FontAwesomeIcon icon={faFileImage} className={styles.recordIcon} style={{ color: '#9b59b6' }} />;
      case 'lab':
        return <FontAwesomeIcon icon={faFileAlt} className={styles.recordIcon} style={{ color: '#2ecc71' }} />;
      default:
        return <FontAwesomeIcon icon={faFileAlt} className={styles.recordIcon} style={{ color: '#7f8c8d' }} />;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.medicalRecordsContainer}>
      <div className={styles.recordsHeader}>
        <h2>Medical Records</h2>
        <div className={styles.recordsActions}>
          <div className={styles.searchBox}>
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <div className={styles.filterSelect}>
              <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} />
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={styles.selectInput}
              >
                <option value="all">All Types</option>
                <option value="pdf">PDF</option>
                <option value="image">Images</option>
                <option value="lab">Lab Results</option>
                <option value="note">Doctor Notes</option>
                <option value="dicom">DICOM</option>
              </select>
            </div>
            
            <div className={styles.sortSelect}>
              <FontAwesomeIcon icon={faSort} className={styles.sortIcon} />
              <select 
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-') as ['date' | 'name', 'asc' | 'desc'];
                  setSortBy(sort);
                  setSortOrder(order);
                }}
                className={styles.selectInput}
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.recordsGrid}>
        {filteredRecords.map(record => (
          <div key={record.id} className={styles.recordCard}>
            <div className={styles.recordHeader}>
              <div className={styles.recordTypeIcon}>
                {getFileIcon(record.type)}
              </div>
              <div className={styles.recordTitle}>
                <h4>{record.title}</h4>
                <span className={styles.recordDate}>{formatDate(record.date)}</span>
              </div>
              <button className={styles.recordMenuButton}>
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            </div>
            
            <p className={styles.recordDescription}>
              {record.description}
            </p>
            
            <div className={styles.recordFooter}>
              <span className={styles.recordFileSize}>
                {record.fileSize}
              </span>
              <div className={styles.recordActions}>
                <button className={styles.iconButton} title="Download">
                  <FontAwesomeIcon icon={faFileDownload} />
                </button>
                <button 
                  className={`${styles.primaryButton} ${styles.smallButton}`}
                  onClick={() => setSelectedRecord(record)}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredRecords.length === 0 && (
          <div className={styles.noRecords}>
            <div className={styles.noRecordsIcon}>📁</div>
            <h3>No records found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
      
      {selectedRecord && (
        <div className={styles.recordModal}>
          {/* Modal implementation would go here */}
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{selectedRecord.title}</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setSelectedRecord(null)}
              >
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Document viewer would be displayed here</p>
              <p>Type: {selectedRecord.type.toUpperCase()}</p>
              <p>Date: {formatDate(selectedRecord.date)}</p>
              <p>Size: {selectedRecord.fileSize}</p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.secondaryButton}>
                <FontAwesomeIcon icon={faFileDownload} className={styles.buttonIcon} />
                Download
              </button>
              <button 
                className={styles.primaryButton}
                onClick={() => setSelectedRecord(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordsSection;
