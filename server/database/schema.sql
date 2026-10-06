-- Drop existing tables if they exist
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

-- Services table
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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

-- Consultation table
CREATE TABLE consultation (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    diagnosis TEXT,
    prescription TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Radiology results table
CREATE TABLE radiology_results (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patient(user_id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES medecin(user_id) ON DELETE SET NULL,
    hospital_id INTEGER REFERENCES hospitals(id) ON DELETE SET NULL,
    test_type VARCHAR(100) NOT NULL,
    result_text TEXT,
    result_file_path TEXT,
    test_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX idx_medecin_hospital_id ON medecin(hospital_id);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_updated_at
BEFORE UPDATE ON patient
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medecin_updated_at
BEFORE UPDATE ON medecin
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultation_updated_at
BEFORE UPDATE ON consultation
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO cities (name, region) VALUES 
('Tunis', 'Tunis'),
('Sfax', 'Sfax'),
('Sousse', 'Sousse'),
('Kairouan', 'Kairouan'),
('Bizerte', 'Bizerte');

INSERT INTO services (name, description) VALUES
('Cardiology', 'Heart and cardiovascular system care'),
('Radiology', 'Medical imaging services'),
('Pediatrics', 'Child healthcare'),
('Neurology', 'Nervous system disorders'),
('Orthopedics', 'Musculoskeletal system care');

-- Insert a test admin user (password: admin123)
INSERT INTO users (name, email, password_hash, type) VALUES 
('Admin User', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert test data
-- First, insert a city
INSERT INTO cities (name, region) 
VALUES ('Tunis', 'Tunis') 
ON CONFLICT (name) DO NOTHING;

-- Then insert a hospital that references the city
WITH city_id AS (
    SELECT id FROM cities WHERE name = 'Tunis' LIMIT 1
),
new_hospital AS (
    INSERT INTO hospitals (name, type, address, city_id, phone, emergency_phone, email)
    SELECT 'Tunis Medical Center', 'Public', 'Avenue Habib Bourguiba, Tunis', 
           (SELECT id FROM city_id), '71300000', '198', 'contact@tunismedical.tn'
    WHERE NOT EXISTS (SELECT 1 FROM hospitals WHERE name = 'Tunis Medical Center')
    RETURNING id
)
-- Now insert the doctor with the hospital ID
INSERT INTO users (name, email, password_hash, type, phone)
SELECT 'Dr. Smith', 'doctor@example.com', 
       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
       'doctor', '+21612345678'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'doctor@example.com');

-- Now insert the doctor with the hospital ID
WITH hospital_id AS (
    SELECT id FROM hospitals WHERE name = 'Tunis Medical Center' LIMIT 1
),
user_id AS (
    SELECT id FROM users WHERE email = 'doctor@example.com' LIMIT 1
)
INSERT INTO medecin (user_id, speciality, license_number, hospital_id, consultation_fee, bio)
SELECT 
    (SELECT id FROM user_id), 
    'Cardiologist', 
    'CARD12345', 
    (SELECT id FROM hospital_id), 
    50.00, 
    'Experienced cardiologist with 10+ years of experience.'
WHERE NOT EXISTS (SELECT 1 FROM medecin WHERE license_number = 'CARD12345');

-- Insert a test patient (password: patient123)
WITH new_user AS (
    INSERT INTO users (name, email, password_hash, type, phone)
    VALUES ('John Doe', 'patient@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'patient', '+21687654321')
    RETURNING id
)
INSERT INTO patient (user_id, date_of_birth, gender, blood_type, address)
SELECT id, '1990-01-01', 'Male', 'O+', '123 Main St, Tunis, Tunisia'
FROM new_user;
