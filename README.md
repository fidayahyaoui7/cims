# Medical Centers of Tunisia - Complete Healthcare Management System

A comprehensive medical appointment booking and healthcare management system for Tunisia with user authentication, role-based access, and professional healthcare features.

## Features

### 1. User Authentication & Account Management
- **Patient Accounts**: Complete patient registration with medical history
- **Doctor Accounts**: Professional medical staff accounts with license verification
- **Secure Login**: Role-based authentication system
- **Profile Management**: Comprehensive user profiles with medical information
- **Email & Phone Verification**: Contact information for notifications

### 2. Patient Dashboard
- **Appointment Management**: View, book, and manage medical appointments
- **Medical Records**: Access to personal medical history and test results
- **Secure Messaging**: Direct communication with healthcare providers
- **Health Statistics**: Overview of medical activity and upcoming appointments
- **Profile Management**: Update personal and medical information

### 3. Doctor Dashboard
- **Patient Management**: Complete patient list with medical histories
- **Appointment Scheduling**: Manage patient appointments and consultations
- **Medical Records**: Create and update patient medical records
- **Secure Messaging**: Communicate with patients and colleagues
- **Professional Profile**: Medical license and specialty management

### 4. Online Appointment Booking with Geolocation
- **Geolocation-based center discovery**: Users can allow location access to find nearby medical centers
- **Interactive appointment booking**: Multi-step booking process with date and time selection
- **Real-time availability**: Shows available time slots for each medical center
- **Professional UI/UX**: Clean, medical-grade interface without emojis

### 5. Interactive Map System
- **Leaflet.js integration**: Interactive map showing all 24 Tunisian cities
- **Hierarchical display**: Click on cities to view their medical centers
- **Custom markers**: Different markers for cities and medical centers
- **Full-screen map experience**: Professional map interface

### 6. Multi-Page Navigation
- **Homepage**: Region-based city selection with professional design
- **City Pages**: Detailed view of medical centers in each city
- **Center Detail Pages**: Comprehensive information about each medical center
- **Appointment Pages**: Complete booking workflow

### 7. Professional Medical Interface
- **Medical terminology**: Proper healthcare terminology throughout
- **Professional styling**: Clean, medical-grade design
- **Responsive design**: Works on all devices
- **Accessibility**: Professional accessibility standards

## Technical Stack

### Frontend
- **React 19.1.1**: Modern React with hooks and functional components
- **React Router DOM**: Client-side routing for multi-page application
- **Leaflet.js**: Interactive mapping library
- **CSS3**: Modern styling with gradients and animations

### Authentication & User Management
- **Local Storage**: User session management (ready for backend integration)
- **Role-based Access**: Patient and Doctor account types
- **Form Validation**: Comprehensive input validation
- **Professional UI**: Medical-grade authentication interfaces

### Dependencies
- `react`: ^19.1.1
- `react-dom`: ^19.1.1
- `react-router-dom`: ^6.x
- `leaflet`: ^1.9.4
- `react-leaflet`: ^4.2.1

## Project Structure

```
src/
├── App.js                           # Main application with routing
├── App.css                         # Global styles
├── HomePage.js                     # Landing page with city selection
├── HomePage.css                    # Homepage styles
├── CityPage.js                     # City-specific medical centers
├── CityPage.css                    # City page styles
├── CenterDetailPage.js             # Detailed medical center information
├── CenterDetailPage.css            # Center detail styles
├── AppointmentPage.js              # Appointment booking system
├── AppointmentPage.css             # Appointment page styles
├── MapComponent.js                 # Interactive map component
├── components/
│   ├── auth/
│   │   ├── LoginPage.js            # User authentication
│   │   ├── RegisterPage.js         # User registration
│   │   └── Auth.css                # Authentication styles
│   ├── patient/
│   │   ├── PatientDashboard.js     # Patient dashboard
│   │   └── PatientDashboard.css    # Patient dashboard styles
│   └── doctor/
│       ├── DoctorDashboard.js      # Doctor dashboard
│       └── DoctorDashboard.css     # Doctor dashboard styles
└── index.js                       # Application entry point
```

## Installation and Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mon-app
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## Usage

### For Patients
1. **Create Account**: Register with personal and medical information
2. **Browse Cities**: Select a region (North, Central, South) or view all cities
3. **Find Centers**: Click on a city to see available medical centers
4. **View Details**: Click on a medical center for detailed information
5. **Book Appointment**: Use the appointment booking system with geolocation
6. **Access Dashboard**: Manage appointments, view medical records, and message doctors
7. **Interactive Map**: Use the map to visually explore medical facilities

### For Medical Professionals
1. **Professional Registration**: Register with medical license and credentials
2. **Patient Management**: View and manage patient lists and medical records
3. **Appointment Scheduling**: Manage patient appointments and consultations
4. **Medical Records**: Create and update patient medical information
5. **Secure Messaging**: Communicate with patients and colleagues
6. **Professional Profile**: Manage medical credentials and specialties

### For Medical Centers
- Professional center profiles with contact information
- Service listings and specialties
- Operating hours and availability
- Location coordinates and directions

## Database Schema (PostgreSQL)

```sql
-- Users table (patients and doctors)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('patient', 'doctor')),
    date_of_birth DATE,
    gender VARCHAR(10),
    address TEXT,
    emergency_contact VARCHAR(50),
    medical_license VARCHAR(100), -- For doctors only
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES users(id),
    doctor_id INTEGER REFERENCES users(id),
    center_id INTEGER NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_type VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical records table
CREATE TABLE medical_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES users(id),
    doctor_id INTEGER REFERENCES users(id),
    record_type VARCHAR(100) NOT NULL,
    record_date DATE NOT NULL,
    results TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    file_path VARCHAR(500), -- For DICOM images
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id),
    receiver_id INTEGER REFERENCES users(id),
    subject VARCHAR(255),
    message_text TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal',
    read_status BOOLEAN DEFAULT FALSE,
    encrypted BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical centers table
CREATE TABLE medical_centers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    services TEXT[],
    operating_hours TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Future Enhancements

### 1. Backend Integration
- **Node.js + Express**: RESTful API for appointment management
- **PostgreSQL**: Database for patient and appointment data
- **Google Maps API**: Enhanced geolocation services
- **JWT Authentication**: Secure token-based authentication

### 2. Notification System
- **Twilio**: SMS notifications for appointments
- **SendGrid**: Email confirmations and reminders
- **Agenda.js**: Automated notification scheduling
- **Push Notifications**: Real-time mobile notifications

### 3. Medical Imaging
- **OHIF Viewer**: DICOM image viewing capabilities
- **PACS Integration**: Medical imaging system connection
- **DICOMweb**: Standard medical imaging protocols
- **Image Storage**: Secure medical image storage

### 4. Secure Messaging
- **Socket.io**: Real-time messaging between patients and doctors
- **Message Encryption**: Secure communication protocols
- **File Sharing**: Secure document and image sharing
- **Message History**: Complete conversation history

### 5. Multilingual Support
- **i18next**: Internationalization framework
- **Language Files**: French (fr.json), Arabic (ar.json), English (en.json)
- **RTL Support**: Arabic language support
- **Cultural Adaptation**: Localized medical terminology

### 6. Advanced Features
- **Telemedicine**: Video consultation capabilities
- **Prescription Management**: Digital prescription system
- **Lab Results**: Automated lab result integration
- **Health Analytics**: Patient health trend analysis

### 7. DevOps & Deployment
- **GitHub Actions**: CI/CD pipeline
- **Docker**: Containerized deployment
- **Render/Railway**: Cloud deployment platforms
- **SSL Certificates**: Secure HTTPS deployment

## Security Features

- **Role-based Access Control**: Different permissions for patients and doctors
- **Data Encryption**: Secure storage of sensitive medical information
- **Session Management**: Secure user session handling
- **Input Validation**: Comprehensive form validation and sanitization
- **Professional Standards**: HIPAA-compliant design patterns

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Medical Centers of Tunisia** - Professional Healthcare Management System
