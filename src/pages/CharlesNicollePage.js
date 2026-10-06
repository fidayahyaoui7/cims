import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaClock, 
  FaCalendarAlt,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaRegClock,
  FaHospital,
  FaUserMd,
  FaCalendarDay
} from 'react-icons/fa';
import { BsCalendarCheck } from 'react-icons/bs';
import { MdOutlineMedicalServices } from 'react-icons/md';
import '../styles/CenterDetailPage.css';

const CharlesNicollePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');

  const hospital = {
    id: 'charles-nicolle',
    name: 'Hôpital Charles Nicolle',
    type: 'public',
    city: 'Tunis',
    address: 'Boulevard du 9 Avril 1938, Tunis 1006',
    phone: '71786000',
    website: 'rns.tn',
    services: ['Urgences', 'Chirurgie', 'Cardiologie', 'Neurologie', 'Pédiatrie', 'Imagerie Médicale'],
    coordinates: { lat: 36.8065, lng: 10.1815 },
    description: `Hôpital principal de Tunis avec diverses spécialités médicales. Le service d'imagerie médicale offre des soins de qualité avec une équipe médicale expérimentée et des équipements de pointe.`,
    rating: 4.2,
    reviews: 156,
    openNow: true,
    emergency: true,
    images: [
      'https://www.santetunisie.rns.tn/sites/default/files/styles/medium/public/2020-02/hopital-charles-nicolle.jpg',
      'https://www.santetunisie.rns.tn/sites/default/files/2020-02/hopital-charles-nicolle-1.jpg',
      'https://www.santetunisie.rns.tn/sites/default/files/2020-02/hopital-charles-nicolle-2.jpg'
    ],
    openingHours: {
      monday: { open: '07:00', close: '19:00', type: 'Consultations' },
      tuesday: { open: '07:00', close: '19:00', type: 'Consultations' },
      wednesday: { open: '07:00', close: '19:00', type: 'Consultations' },
      thursday: { open: '07:00', close: '19:00', type: 'Consultations' },
      friday: { open: '07:00', close: '13:00', type: 'Consultations' },
      saturday: { open: '09:00', close: '13:00', type: 'Consultations limitées' },
      sunday: { open: '00:00', close: '23:59', type: 'Urgences uniquement' }
    },
    emergencyHours: '24/7',
    staffSchedule: {
      medical: 'Service par roulement avec gardes 24/7',
      paramedical: 'Équipes en rotation selon les services',
      guards: 'Service de garde permanent pour les urgences'
    },
    doctors: [
      {
        id: 'doc-cn-001',
        name: 'Dr. Meriem Jerad',
        title: 'Professeur - Chef de service',
        specialty: 'Radiologie',
        phone: '',
        email: '',
        image: 'https://via.placeholder.com/200x200?text=Dr+Meriem+Jerad',
        schedule: 'Lundi-Vendredi: 08:00-16:00',
        services: ['Échographie', 'Mammographie', 'IRM']
      },
      {
        id: 'doc-cn-002',
        name: 'Dr. Aicha BEN MILED',
        title: 'Professeur Agrégé en Imagerie Médicale',
        specialty: 'Imagerie Médicale',
        phone: '+216 71 151 424',
        email: 'aycha.benmiled@gmail.com',
        image: 'https://via.placeholder.com/200x200?text=Dr+Aicha+Ben+Miled',
        schedule: 'Lundi-Mercredi-Vendredi: 08:00-14:00',
        services: ['Scanner', 'IRM', 'Échographie']
      },
      {
        id: 'doc-cn-003',
        name: 'Dr. Ons GHDES',
        title: 'Assistante Hospitalo Universitaire',
        specialty: 'Imagerie Médicale',
        phone: '+216 71 151 424',
        email: 'onsgm@yahoo.fr',
        image: 'https://via.placeholder.com/200x200?text=Dr+Ons+Ghdes',
        schedule: 'Mardi-Jeudi-Samedi: 08:00-13:00',
        services: ['Radiologie', 'Échographie', 'Mammographie']
      }
    ]
  };

  const handleBookAppointment = () => {
    if (selectedTime) {
      navigate(`/appointment?center=${hospital.id}&date=${selectedDate.toISOString().split('T')[0]}&time=${selectedTime}`);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === hospital.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? hospital.images.length - 1 : prevIndex - 1
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="star half" />);
      } else {
        stars.push(<FaStar key={i} className="star" />);
      }
    }
    return stars;
  };

  return (
    <div className="center-detail-page">
      <div className="container">
        <div className="center-header">
          <h1>{hospital.name}</h1>
          <div className="center-meta">
            <span className="center-type">{hospital.type === 'public' ? 'Hôpital Public' : 'Clinique Privée'}</span>
            <div className="rating">
              {renderStars(hospital.rating)}
              <span>({hospital.reviews})</span>
            </div>
          </div>
        </div>

        <div className="center-content">
          <div className="center-gallery">
            {hospital.images && hospital.images.length > 0 ? (
              <>
                <div className="gallery-image">
                  <img 
                    src={hospital.images[currentImageIndex]} 
                    alt={`${hospital.name} - ${currentImageIndex + 1}`} 
                  />
                  {hospital.images.length > 1 && (
                    <>
                      <button className="nav-button prev" onClick={prevImage}>
                        <FaChevronLeft />
                      </button>
                      <button className="nav-button next" onClick={nextImage}>
                        <FaChevronRight />
                      </button>
                      <div className="image-counter">
                        {currentImageIndex + 1} / {hospital.images.length}
                      </div>
                    </>
                  )}
                </div>
                {hospital.images.length > 1 && (
                  <div className="gallery-thumbnails">
                    {hospital.images.map((img, index) => (
                      <div 
                        key={index} 
                        className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`} 
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img src={img} alt={`Thumbnail ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="no-photo-placeholder">
                <FaHospital size={48} />
                <p>No photos available</p>
              </div>
            )}
          </div>

          <div className="center-info">
            <div className="info-section">
              <h3><FaMapMarkerAlt /> Adresse</h3>
              <p>{hospital.address}, {hospital.city}</p>
              
              <h3><FaPhone /> Contact</h3>
              <p>Téléphone: <a href={`tel:${hospital.phone}`}>{hospital.phone}</a></p>
              {hospital.website && (
                <p>Site web: <a href={`https://${hospital.website}`} target="_blank" rel="noopener noreferrer">{hospital.website}</a></p>
              )}
              
              <h3><FaClock /> Horaires d'ouverture</h3>
              <div className="opening-hours">
                {Object.entries(hospital.openingHours).map(([day, {open, close, type}]) => (
                  <div key={day} className="opening-hour">
                    <span className="day">{t(`days.${day}`)}:</span>
                    <span className="hours">
                      {day === 'sunday' && hospital.emergency ? 
                        'Urgences 24/7' : 
                        `${open} - ${close} ${type ? `(${type})` : ''}`
                      }
                    </span>
                  </div>
                ))}
              </div>

              {hospital.emergency && (
                <div className="emergency-info">
                  <h3><FaHospital /> Service d'Urgences</h3>
                  <p>Ouvert 24/7</p>
                </div>
              )}
            </div>

            <div className="services-section">
              <h3><MdOutlineMedicalServices /> Services</h3>
              <div className="services-grid">
                {hospital.services.map((service, index) => (
                  <div key={index} className="service-tag">
                    {service}
                  </div>
                ))}
              </div>
            </div>

            <div className="doctors-section">
              <h3><FaUserMd /> Médecins</h3>
              <div className="doctors-grid">
                {hospital.doctors.map((doctor) => (
                  <div key={doctor.id} className="doctor-card">
                    <div className="doctor-image">
                      <img src={doctor.image} alt={doctor.name} />
                    </div>
                    <div className="doctor-info">
                      <h4>{doctor.name}</h4>
                      <p className="doctor-title">{doctor.title}</p>
                      <p className="doctor-specialty">{doctor.specialty}</p>
                      <p className="doctor-schedule">
                        <FaCalendarDay /> {doctor.schedule}
                      </p>
                      {doctor.phone && (
                        <p className="doctor-phone">
                          <FaPhone /> {doctor.phone}
                        </p>
                      )}
                      <div className="doctor-services">
                        {doctor.services.map((service, idx) => (
                          <span key={idx} className="service-tag small">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="appointment-section">
            <h2><BsCalendarCheck /> Prendre un Rendez-vous</h2>
            <div className="appointment-form">
              <div className="form-group">
                <label>Date du rendez-vous</label>
                <div className="date-picker">
                  <FaCalendarAlt />
                  <input 
                    type="date" 
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Heure du rendez-vous</label>
                <div className="time-slots">
                  {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => (
                    <button
                      key={time}
                      className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                className="btn btn-primary book-btn"
                onClick={handleBookAppointment}
                disabled={!selectedTime}
              >
                Confirmer le rendez-vous
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharlesNicollePage;
