-- Create schema if not exists
CREATE SCHEMA IF NOT EXISTS public;

-- Set search path to public
SET search_path TO public;

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS consultation CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS radiology_results CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS hospital_services CASCADE;
DROP TABLE IF EXISTS medecin CASCADE;
DROP TABLE IF EXISTS patient CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS hospitals CASCADE;
DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (for authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    type VARCHAR(20) NOT NULL CHECK (type IN ('patient', 'doctor', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cities table
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Tunisian cities
INSERT INTO cities (name, region) VALUES 
('Tunis', 'Tunis'),
('Sfax', 'Sfax'),
('Sousse', 'Sousse'),
('Gabès', 'Gabès'),
('Bizerte', 'Bizerte'),
('Ariana', 'Ariana'),
('Monastir', 'Monastir'),
('Nabeul', 'Nabeul'),
('Kairouan', 'Kairouan'),
('La Marsa', 'Tunis'),
('Sidi Bouzid', 'Sidi Bouzid'),
('Médenine', 'Médenine'),
('Kasserine', 'Kasserine'),
('Gafsa', 'Gafsa'),
('La Soukra', 'Ariana'),
('Ben Arous', 'Ben Arous'),
('Tataouine', 'Tataouine'),
('Mahdia', 'Mahdia'),
('Zaghouan', 'Zaghouan'),
('Béja', 'Béja'),
('Jendouba', 'Jendouba'),
('Le Kef', 'Le Kef'),
('Siliana', 'Siliana'),
('Kébili', 'Kébili'),
('Tozeur', 'Tozeur'),
('Manouba', 'Manouba')
ON CONFLICT (name) DO NOTHING;

-- Hospitals table
CREATE TABLE hospitals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50),
    address TEXT,
    city_id INTEGER REFERENCES cities(id) ON DELETE SET NULL,
    phone VARCHAR(20),
    emergency_phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(200),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample hospitals
INSERT INTO hospitals (name, type, address, city_id, phone, emergency_phone, description) VALUES
('Hôpital Universitaire Mongi Slim', 'public', 'Avenue Mongi Slim, La Marsa 2078', 
    (SELECT id FROM cities WHERE name = 'La Marsa'), '71764325', '71764845, 71764033, 71764066',
    'Hôpital universitaire spécialisé en traumatologie et grands brûlés'),
('Hôpital Habib Thameur', 'public', 'Montfleury, Tunis', 
    (SELECT id FROM cities WHERE name = 'Tunis'), '71492773', '71397000',
    'Établissement public offrant divers services médicaux, dont l''imagerie médicale'),
('Hôpital Aziza Othmana', 'public', 'Place de la Kasbah, Tunis 1008', 
    (SELECT id FROM cities WHERE name = 'Tunis'), '71560763', '71570777',
    'Hôpital historique offrant divers services médicaux')
ON CONFLICT (name) DO NOTHING;

-- Create other tables (services, hospital_services, etc.)
-- Services table
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert common medical services
INSERT INTO services (name, description) VALUES 
('Cardiologie', 'Soins cardiaques et maladies cardiovasculaires'),
('Radiologie', 'Imagerie médicale et radiologie diagnostique'),
('Chirurgie', 'Interventions chirurgicales'),
('Pédiatrie', 'Soins médicaux pour enfants'),
('Gynécologie', 'Santé des femmes et soins gynécologiques'),
('Urgences', 'Service des urgences 24/7'),
('Laboratoire', 'Analyses médicales et biologiques'),
('Médecine interne', 'Médecine générale pour adultes')
ON CONFLICT (name) DO NOTHING;

-- Hospital services junction table
CREATE TABLE hospital_services (
    hospital_id INTEGER REFERENCES hospitals(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (hospital_id, service_id)
);

-- Patient table
CREATE TABLE patient (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_type VARCHAR(10),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Doctor table
CREATE TABLE medecin (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    speciality VARCHAR(100),
    license_number VARCHAR(50) UNIQUE,
    hospital_id INTEGER REFERENCES hospitals(id) ON DELETE SET NULL,
    consultation_fee DECIMAL(10, 2),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patient(user_id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES medecin(user_id) ON DELETE CASCADE,
    hospital_id INTEGER REFERENCES hospitals(id) ON DELETE SET NULL,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_medecin_hospital_id ON medecin(hospital_id);

-- Create admin user
INSERT INTO users (name, email, password_hash, type) VALUES 
('Admin', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (email) DO NOTHING;
