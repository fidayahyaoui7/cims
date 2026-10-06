import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format, addMonths, subMonths, getDaysInMonth, 
         startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, 
         isBefore, isAfter, addDays, isSameMonth, isToday } from 'date-fns';
import '../../styles/DateTimeSelection.css';

const DateTimeSelection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ]);

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    // Don't allow going to past months
    const now = new Date();
    if (currentMonth.getMonth() > now.getMonth() || currentMonth.getFullYear() > now.getFullYear()) {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
  };

  const handleDateClick = (day) => {
    // Don't allow selecting past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isBefore(day, today) && !isSameDay(day, today)) {
      return;
    }
    
    setSelectedDate(day);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      const appointment = {
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        timestamp: selectedDate.toISOString()
      };
      localStorage.setItem('appointmentDateTime', JSON.stringify(appointment));
      navigate('/book/patient-info');
    }
  };

  // Generate days for the current month view
  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfMonth(monthStart);
    const endDate = endOfMonth(monthEnd);
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    eachDayOfInterval({ start: startDate, end: endDate }).forEach((day, i) => {
      const isDisabled = isBefore(day, today) && !isSameDay(day, today);
      const isSelected = selectedDate && isSameDay(day, selectedDate);
      const isCurrentDay = isToday(day);
      const isCurrentMonth = isSameMonth(day, currentMonth);
      
      return days.push(
        <div
          key={day.toString()}
          className={`day ${!isCurrentMonth ? 'inactive' : ''} ${
            isSelected ? 'selected' : ''
          } ${isDisabled ? 'disabled' : ''} ${isCurrentDay ? 'today' : ''}`}
          onClick={() => isCurrentMonth && !isDisabled && handleDateClick(day)}
        >
          {format(day, 'd')}
        </div>
      );
    });
    
    return days;
  };

  return (
    <div className="date-time-container">
      <div className="header">
        <h1>{t('select_datetime', 'Select Date & Time')}</h1>
      </div>
      
      <div className="content">
        <div className="calendar-container">
          <div className="calendar-header">
            <button onClick={prevMonth} disabled={currentMonth.getMonth() <= new Date().getMonth() && currentMonth.getFullYear() <= new Date().getFullYear()}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
            <button onClick={nextMonth}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          
          <div className="calendar">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
            {renderDays()}
          </div>
          
          {selectedDate && (
            <p className="selected-date">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </p>
          )}
        </div>
        
        {selectedDate && (
          <div className="time-container">
            <h3>{t('select_time', 'Select a Time')}</h3>
            <div className="time-slots">
              {availableTimes.map((time, index) => (
                <div
                  key={index}
                  className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button 
          className={`continue-btn ${!selectedDate || !selectedTime ? 'disabled' : ''}`}
          onClick={handleSubmit}
          disabled={!selectedDate || !selectedTime}
        >
          {t('continue', 'Continue')}
        </button>
      </div>
    </div>
  );
};

export default DateTimeSelection;
