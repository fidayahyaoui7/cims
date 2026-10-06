-- Drop existing tables if they exist
DROP TABLE IF EXISTS consultation;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS radiology_results;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS hospital_services;
DROP TABLE IF EXISTS medecin;
DROP TABLE IF EXISTS patient;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS hospitals;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS users;

-- Users table (for authentication)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT,
    type TEXT NOT NULL CHECK (type IN ('patient', 'doctor', 'admin')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Cities table
CREATE TABLE cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    region TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Hospitals table
CREATE TABLE hospitals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT,
    address TEXT,
    city_id INTEGER,
    phone TEXT,
    emergency_phone TEXT,
    email TEXT,
    website TEXT,
    latitude REAL,
    longitude REAL,
    description TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL
);

-- Services table
CREATE TABLE services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Hospital services junction table
CREATE TABLE hospital_services (
    hospital_id INTEGER,
    service_id INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (hospital_id, service_id),
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Patient table
CREATE TABLE patient (
    user_id INTEGER PRIMARY KEY,
    date_of_birth TEXT,
    gender TEXT,
    blood_type TEXT,
    address TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Doctor table
CREATE TABLE medecin (
    user_id INTEGER PRIMARY KEY,
    speciality TEXT,
    license_number TEXT UNIQUE,
    hospital_id INTEGER,
    consultation_fee REAL,
    bio TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL
);

-- Appointments table
CREATE TABLE appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    doctor_id INTEGER,
    hospital_id INTEGER,
    appointment_date TEXT NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient(user_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES medecin(user_id) ON DELETE CASCADE,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_hospital ON appointments(hospital_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
