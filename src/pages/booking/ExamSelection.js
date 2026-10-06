import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './booking.css';

const examTypes = [
  { id: 'radiographie', color: 'blue' },
  { id: 'echographie', color: 'green' },
  { id: 'scanner', color: 'purple' },
  { id: 'irm', color: 'indigo' },
  { id: 'mammographie', color: 'pink' },
  { id: 'osteodensitometrie', color: 'teal' }
];

export default function ExamSelection() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleExamSelect = (examId) => {
    localStorage.setItem('selectedExam', examId);
    navigate('/booking/region');
  };

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1>{t('booking_exam_title') || 'Choose your exam'}</h1>
        <p>{t('booking_exam_subtitle') || 'Select the type of radiology exam you want'}</p>
      </div>

      <div className="card-grid">
        {examTypes.map((exam) => (
          <button key={exam.id} className={`exam-card color-${exam.color}`} onClick={() => handleExamSelect(exam.id)}>
            <div className="exam-card-content">
              <h3 className="exam-name">{t(`exam_${exam.id}_name`)}</h3>
              <p className="exam-description">{t(`exam_${exam.id}_desc`)}</p>
              <div className="exam-details">
                <span className="chip">{t(`exam_${exam.id}_duration`)}</span>
                <span className="chip outline">{t(`exam_${exam.id}_price`)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
