import React, { useState, useEffect } from 'react';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaCalendarAlt, 
  FaClock, 
  FaArrowLeft, 
  FaArrowRight,
  FaInfoCircle,
  FaCheck 
} from 'react-icons/fa';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, 
  isSameDay, isToday, isBefore, addMonths, subMonths, isSameMonth, isSameYear } from 'date-fns';
import './ModernDateTimePicker.css';

const MonthView = ({ month, year, selectedDate, onSelectDate, today }) => {
  const monthStart = startOfWeek(new Date(year, month, 1), { weekStartsOn: 1 });
  const monthEnd = endOfWeek(new Date(year, month + 1, 0), { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({
    start: monthStart,
    end: monthEnd
  });
  
  const weeks = [];
  let week = [];
  
  days.forEach((day, index) => {
    week.push(day);
    if (week.length === 7 || index === days.length - 1) {
      weeks.push(week);
      week = [];
    }
  });

  return (
    <div className="month-container">
      <div className="month-header">
        {format(new Date(year, month, 1), 'MMMM yyyy')}
      </div>
      <div className="calendar-grid">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        {weeks.flat().map((day, index) => {
          const isCurrentMonth = day.getMonth() === month;
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          const isPast = isBefore(day, today) && !isToday;
          
          return (
            <div 
              key={index}
              className={`calendar-cell 
                ${!isCurrentMonth ? 'other-month' : ''} 
                ${isToday ? 'today' : ''} 
                ${isSelected ? 'selected' : ''} 
                ${isPast ? 'disabled' : ''}`}
              onClick={() => !isPast && isCurrentMonth && onSelectDate(day)}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ModernDateTimePicker = ({ onDateTimeSelect, initialDate = null, onBack, onNext }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(initialDate ? new Date(initialDate) : today);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [monthsToShow] = useState(3); // Number of months to show
  
  // Generate array of months to display
  const months = Array.from({ length: monthsToShow }, (_, i) => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + i);
    return {
      month: date.getMonth(),
      year: date.getFullYear(),
      date: new Date(date.getFullYear(), date.getMonth(), 1)
    };
  });
  
  // Generate quick navigation dates (today, tomorrow, next week, etc.)
  const quickDates = [
    { label: 'Today', date: today },
    { label: 'Tomorrow', date: addDays(today, 1) },
    { label: 'Next Week', date: addDays(today, 7) },
    { label: 'In 2 Weeks', date: addDays(today, 14) },
    { label: 'Next Month', date: addMonths(today, 1) }
  ];
  
  // Generate time slots (9 AM to 5 PM in 30-minute intervals)
  const timeSlots = [];
  for (let hour = 9; hour < 17; hour++) {
    timeSlots.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      display: `${hour}:00 ${hour < 12 ? 'AM' : hour === 12 ? 'PM' : 'PM'}`,
      isAvailable: Math.random() > 0.3 // Randomly make some slots unavailable
    });
    timeSlots.push({
      time: `${hour.toString().padStart(2, '0')}:30`,
      display: `${hour}:30 ${hour < 12 ? 'AM' : 'PM'}`,
      isAvailable: Math.random() > 0.3 // Randomly make some slots unavailable
    });
  }

  const handleDateSelect = (date) => {
    if (date.isPast) return; // Don't allow selecting past dates
    
    setSelectedDate(date.date);
    setShowTimeSlots(true);
    
    // Reset time selection when changing date
    if (onDateTimeSelect) {
      onDateTimeSelect({
        date: format(date.date, 'yyyy-MM-dd'),
        time: '',
        dateTime: null
      });
    }
  };

  const handleTimeSelect = (time) => {
    if (!time.isAvailable) return;
    
    setSelectedTime(time.time);
  };

  const handleNext = () => {
    if (selectedDate && !showTimeSlots) {
      setShowTimeSlots(true);
    } else if (selectedDate && selectedTime) {
      // Handle form submission
      const dateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      
      if (onDateTimeSelect) {
        onDateTimeSelect({
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
          dateTime: dateTime.toISOString()
        });
      }
    } else if (onNext) {
      onNext();
    }
  };

  const navigateMonths = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + (direction === 'next' ? monthsToShow : -monthsToShow));
      return newDate;
    });
  };
  
  const handleBack = () => {
    if (showTimeSlots) {
      setShowTimeSlots(false);
    } else if (onBack) {
      onBack();
    }
  };
  
  const isNextDisabled = !selectedDate || (showTimeSlots && !timeSlots.some(slot => slot.isAvailable));
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const [showInfo, setShowInfo] = useState(false);
  
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="date-time-picker">
      {/* Header */}
      <header className="picker-header">
        <h1>Select Date & Time</h1>
        <h2>Choose your preferred appointment slot</h2>
        
        {/* Info Button */}
        <button 
          className="info-button" 
          onClick={toggleInfo}
          aria-label="Show appointment information"
        >
          <FaInfoCircle />
          <span>Appointment Info</span>
        </button>
        
        {/* Info Panel */}
        {showInfo && (
          <div className="info-panel">
            <h3>Appointment Information</h3>
            <ul>
              <li>1. Select your preferred date and time</li>
              <li>2. Review your appointment details</li>
              <li>3. Confirm your booking</li>
            </ul>
            <button 
              className="close-info"
              onClick={toggleInfo}
              aria-label="Close information panel"
            >
              Close
            </button>
          </div>
        )}
      </header>
      
      <div className="picker-content">
        {!showTimeSlots ? (
          <>
            <div className="date-navigation-container">
              <div className="section-title">
                <FaCalendarAlt className="icon" />
                <span>Select a Date</span>
              </div>
              
              <div className="quick-navigation">
                {quickDates.map((item, index) => {
                  const isSelected = selectedDate && isSameDay(selectedDate, item.date);
                  const isPast = isBefore(item.date, today) && !isSameDay(item.date, today);
                  
                  return (
                    <button
                      key={index}
                      className={`quick-date-btn ${isSelected ? 'selected' : ''} ${isPast ? 'disabled' : ''}`}
                      onClick={() => !isPast && handleDateSelect({ date: item.date, isPast: false })}
                      disabled={isPast}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
              
              <div className="month-navigation">
                <button 
                  className="nav-arrow"
                  onClick={() => navigateMonths('prev')}
                  aria-label="Previous months"
                >
                  <FaChevronLeft />
                </button>
                
                <div className="months-grid">
                  {months.map((monthData, index) => (
                    <MonthView
                      key={`${monthData.year}-${monthData.month}`}
                      month={monthData.month}
                      year={monthData.year}
                      selectedDate={selectedDate}
                      onSelectDate={(date) => handleDateSelect({ date, isPast: isBefore(date, today) && !isSameDay(date, today) })}
                      today={today}
                    />
                  ))}
                </div>
                
                <button 
                  className="nav-arrow"
                  onClick={() => navigateMonths('next')}
                  aria-label="Next months"
                >
                  <FaChevronRight />
                </button>
              </div>
              
              {selectedDate && (
                <div className="selected-date-preview">
                  Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Time Slot Selection */
          <div className="time-slots-container">
            <div className="section-title">
              <FaClock className="icon" />
              <span>Available Time Slots for {format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            
            {timeSlots.some(slot => slot.isAvailable) ? (
              <div className="time-slots">
                {timeSlots.map((slot, index) => (
                  <div 
                    key={index}
                    className={`time-slot ${!slot.isAvailable ? 'disabled' : ''}`}
                    onClick={() => slot.isAvailable && handleTimeSelect(slot)}
                  >
                    {slot.display}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-slots">
                <div className="no-slots-icon">
                  <FaCalendarAlt />
                </div>
                <p>No available slots for this date. Please select another date.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="navigation">
          <button 
            className="btn btn-back" 
            onClick={handleBack}
            aria-label="Go back to previous step"
          >
            <FaArrowLeft className="icon" /> Back
          </button>
          
          {showTimeSlots ? (
            <button 
              className="btn btn-confirm"
              onClick={handleNext}
              disabled={!selectedTime}
              aria-label="Confirm appointment time"
            >
              <FaCheck className="icon" /> Confirm Appointment
            </button>
          ) : (
            <button 
              className={`btn btn-next ${!selectedDate ? 'disabled' : ''}`} 
              onClick={handleNext}
              disabled={!selectedDate}
              aria-label="Proceed to time selection"
            >
              Select Time <FaClock className="icon" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernDateTimePicker;
