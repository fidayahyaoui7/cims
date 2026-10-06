import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './HospitalDetailPage.css';

// Sample doctor data - in a real app, this would come from an API
const sampleDoctors = [
  { id: 1, name: 'Dr. Smith', specialty: 'Cardiologist', image: 'https://via.placeholder.com/100?text=Dr.+Smith' },
  { id: 2, name: 'Dr. Johnson', specialty: 'Pediatrician', image: 'https://via.placeholder.com/100?text=Dr.+Johnson' },
];

const HospitalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);

  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
      date: date.getDate(),
      fullDate: date
    };
  });

  // Sample time slots
  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00'];

  // In a real app, you would fetch the hospital data from an API
  useEffect(() => {
    const fetchHospital = async () => {
      try {
        // This would be an API call in a real app
        // const response = await fetch(`/api/hospitals/${id}`);
        // const data = await response.json();
        
        // For now, we'll use sample data
        const sampleData = {
          id: id,
          name: 'Medical Center',
          address: '123 Medical Street, City',
          phone: '+216 71 234 567',
          rating: 4.2,
          reviewCount: 24,
          description: 'A modern medical center providing comprehensive healthcare services with state-of-the-art facilities and experienced medical professionals.',
          services: [
            { name: 'General Medicine', available: true },
            { name: 'Pediatrics', available: true },
            { name: 'Cardiology', available: true },
            { name: 'Radiology', available: true }
          ],
          openingHours: [
            { day: 'monday', hours: '08:00 - 20:00' },
            { day: 'tuesday', hours: '08:00 - 20:00' },
            { day: 'wednesday', hours: '08:00 - 20:00' },
            { day: 'thursday', hours: '08:00 - 20:00' },
            { day: 'friday', hours: '08:00 - 20:00' },
            { day: 'saturday', hours: '09:00 - 17:00' },
            { day: 'sunday', hours: '09:00 - 13:00' },
          ],
          image: 'https://via.placeholder.com/800x400?text=Medical+Center'
        };
        
        setHospital(sampleData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hospital:', error);
        setLoading(false);
      }
    };

    fetchHospital();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!hospital) {
    return <div className="error">Hospital not found</div>;
  }

  const handleBookAppointment = () => {
    // Persist selected center to start the booking wizard
    const centerLite = {
      id: hospital.id,
      name: hospital.name,
      address: hospital.address,
      phone: hospital.phone,
      image: hospital.image,
    };
    localStorage.setItem('selectedCenter', JSON.stringify(centerLite));

    // If user already picked a slot in the sidebar, persist and move to patient info
    if (selectedTime) {
      const chosenDate = dates[selectedDate]?.fullDate || new Date();
      const dateStr = new Date(chosenDate).toISOString().split('T')[0];
      localStorage.setItem('selectedDateTime', JSON.stringify({ date: dateStr, time: selectedTime }));
      navigate('/booking/patient-info');
      return;
    }

    // Otherwise continue the step-by-step flow at the date/time step
    navigate('/booking/date-time');
  };

  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="main-container">
          <div className="center-detail">
            <button className="back-button" onClick={() => navigate(-1)}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path>
              </svg>
              {t('back')}
            </button>
            
            <div className="center-header">
              <div className="no-photo-placeholder">
                <img src={hospital.image} alt={hospital.name} className="hospital-image" />
              </div>
              
              <div className="center-info">
                <h1>{hospital.name}</h1>
                
                <div className="rating">
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`star ${star <= Math.floor(hospital.rating) ? 'filled' : ''}`}>
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                          <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
                        </svg>
                      </span>
                    ))}
                  </div>
                  <span className="review-count">({hospital.reviewCount} {t('reviews')})</span>
                </div>
                
                <div className="info-item">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" className="info-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path>
                  </svg>
                  <span>{hospital.address}</span>
                </div>
                
                <div className="info-item">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="info-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z"></path>
                  </svg>
                  <a href={`tel:${hospital.phone.replace(/\s+/g, '')}`}>{hospital.phone}</a>
                </div>
                
                <div className="info-item">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="info-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"></path>
                  </svg>
                  <div>
                    <p className="opening-status">
                      {t('open_today')}: {hospital.openingHours[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1].hours}
                    </p>
                    <button className="view-hours-btn">{t('view_all_hours')}</button>
                  </div>
                </div>
                
                <div className="action-buttons">
                  <a href={`tel:${hospital.phone.replace(/\s+/g, '')}`} className="btn btn-primary">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z"></path>
                    </svg>
                    {t('call_now')}
                  </a>
                  
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-outline"
                  >
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path>
                    </svg>
                    {t('get_directions')}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="center-content">
              <div className="main-content">
                <section className="about-section">
                  <h2>{t('about_center')}</h2>
                  <p>{hospital.description}</p>
                </section>
                
                <section className="services-section">
                  <h2>{t('services')}</h2>
                  <div className="services-grid">
                    {hospital.services.map((service, index) => (
                      <div key={index} className="service-item">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="service-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                          <path fill="none" d="M0 0h24v24H0z"></path>
                          <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 16H4V8h16v12z"></path>
                          <path d="M13 10h-2v3H8v2h3v3h2v-3h3v-2h-3z"></path>
                        </svg>
                        <div>
                          <h4>{service.name}</h4>
                          <p className={`status ${service.available ? 'available' : 'unavailable'}`}>
                            {service.available ? t('available') : t('unavailable')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                
                <section className="doctors-section">
                  <h2>{t('our_doctors')}</h2>
                  <div className="doctors-grid">
                    {sampleDoctors.map((doctor) => (
                      <div key={doctor.id} className="doctor-card">
                        <img src={doctor.image} alt={doctor.name} className="doctor-image" />
                        <div className="doctor-info">
                          <h4>{doctor.name}</h4>
                          <p className="specialty">{doctor.specialty}</p>
                          <p className="availability available">{t('available')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
              
              <div className="booking-sidebar">
                <div className="booking-card">
                  <h3>{t('book_appointment')}</h3>
                  
                  <div className="form-group">
                    <label>{t('select_date')}</label>
                    <div className="date-picker">
                      {dates.map((date, index) => (
                        <button 
                          key={index} 
                          className={`date-option ${selectedDate === index ? 'selected' : ''}`}
                          onClick={() => setSelectedDate(index)}
                        >
                          <span className="day">{date.day}</span>
                          <span className="date">{date.date}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>{t('select_time')}</label>
                    <div className="time-slots">
                      {timeSlots.map((time, index) => (
                        <button 
                          key={index} 
                          className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    className={`btn btn-primary book-now-btn`}
                    onClick={handleBookAppointment}
                  >
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="btn-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"></path>
                      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"></path>
                    </svg>
                    {t('book_now')}
                  </button>
                  
                  <p className="booking-note">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"></path>
                    </svg>
                    {t('appointment_duration')}: 30 {t('minutes')}
                  </p>
                </div>
                
                <div className="opening-hours">
                  <h4>{t('opening_hours')}</h4>
                  <ul>
                    {hospital.openingHours.map((day, index) => (
                      <li key={index}>
                        <span className="day">{t(day.day)}:</span>
                        <span className="hours">{day.hours}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HospitalDetailPage;
