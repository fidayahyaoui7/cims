import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './booking.css';

const examTypes = [
  { id: 'xray', name: 'X-Ray', description: 'Standard X-ray imaging' },
  { id: 'mri', name: 'MRI', description: 'Magnetic Resonance Imaging' },
  { id: 'ct', name: 'CT Scan', description: 'Computed Tomography' },
  { id: 'ultrasound', name: 'Ultrasound', description: 'Sonography' },
  { id: 'mammogram', name: 'Mammogram', description: 'Breast X-ray' },
];

export default function RadiologyTypeSelection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState('');

  const handleSelect = (type) => {
    localStorage.setItem('selectedExam', JSON.stringify(type));
    navigate('/book/region');
  };

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1>{t('booking_exam_title') || 'Select Exam Type'}</h1>
        <p>{t('booking_exam_subtitle') || 'Choose the type of radiology exam you need'}</p>
      </div>

      <div className="card-grid">
        {examTypes.map((exam) => (
          <div 
            key={exam.id}
            className={`card ${selectedType === exam.id ? 'selected' : ''}`}
            onClick={() => setSelectedType(exam.id)}
          >
            <h3>{exam.name}</h3>
            <p className="muted">{exam.description}</p>
          </div>
        ))}
      </div>

      <div className="booking-actions">
        <button 
          className="btn primary" 
          disabled={!selectedType}
          onClick={() => handleSelect(selectedType)}
        >
          {t('next') || 'Next'}
        </button>
      </div>
    </div>
  );
}
