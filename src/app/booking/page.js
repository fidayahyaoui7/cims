'use client';

import ExamSelection from '@/components/booking/ExamSelection';

export default function BookingPage() {
  const handleExamSelect = (examId) => {
    localStorage.setItem('selectedExam', examId);
    window.location.href = '/booking/region';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <ExamSelection onSelect={handleExamSelect} selectedExam="" />
      </div>
    </div>
  );
}
