-- ===========================
-- Supprimer toutes les tables si elles existent
-- ===========================
DROP TABLE IF EXISTS communiquer CASCADE;
DROP TABLE IF EXISTS consultation CASCADE;
DROP TABLE IF EXISTS rendez_vous CASCADE;
DROP TABLE IF EXISTS patient CASCADE;
DROP TABLE IF EXISTS medecin CASCADE;
DROP TABLE IF EXISTS service CASCADE;
DROP TABLE IF EXISTS hopital CASCADE;
DROP TABLE IF EXISTS gouver CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ===========================
-- Gouvernorats
-- ===========================
CREATE TABLE gouver (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL UNIQUE,
    region VARCHAR(50) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION
);

-- ===========================
-- Hôpitaux
-- ===========================
CREATE TABLE hopital (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    adress VARCHAR(50) NOT NULL,
    phone VARCHAR(50),
    gouver_id INT NOT NULL REFERENCES gouver(id)
);

-- ===========================
-- Services
-- ===========================
CREATE TABLE service (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    hopital_id INT NOT NULL REFERENCES hopital(id),
    UNIQUE(name, hopital_id)
);

-- ===========================
-- Users
-- ===========================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL, -- Increased length for hashed passwords
    phone VARCHAR(50),
    type VARCHAR(50) NOT NULL CHECK (type IN ('patient', 'doctor', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- Patients
-- ===========================
CREATE TABLE patient (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- Médecins
-- ===========================
CREATE TABLE medecin (
    id SERIAL PRIMARY KEY,
    speciality VARCHAR(50),
    license VARCHAR(50) UNIQUE,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id INT REFERENCES service(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- Rendez-vous
-- ===========================
CREATE TABLE rendez_vous (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    medecin_id INT NOT NULL REFERENCES medecin(id) ON DELETE CASCADE,
    daterv TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- Consultations
-- ===========================
CREATE TABLE consultation (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    medecin_id INT NOT NULL REFERENCES medecin(id) ON DELETE CASCADE,
    prescription TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- Messages
-- ===========================
CREATE TABLE communiquer (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    medecin_id INT NOT NULL REFERENCES medecin(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT false
);

-- ===========================
-- Fonction pour mettre à jour le champ updated_at
-- ===========================
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===========================
-- Triggers pour les timestamps
-- ===========================
CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_rendez_vous_modtime
BEFORE UPDATE ON rendez_vous
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_consultation_modtime
BEFORE UPDATE ON consultation
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- ===========================
-- Trigger pour forcer la cohérence type utilisateur
-- ===========================
CREATE OR REPLACE FUNCTION enforce_user_role()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'patient' THEN
        IF NOT EXISTS (SELECT 1 FROM patient WHERE user_id = NEW.id) THEN
            RAISE EXCEPTION 'User % est patient mais pas présent dans la table patient', NEW.id;
        END IF;
    ELSIF NEW.type = 'doctor' THEN
        IF NOT EXISTS (SELECT 1 FROM medecin WHERE user_id = NEW.id) THEN
            RAISE EXCEPTION 'User % est doctor mais pas présent dans la table medecin', NEW.id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER trg_enforce_user_role
AFTER INSERT OR UPDATE ON users
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION enforce_user_role();

-- ===========================
-- Index pour améliorer les performances
-- ===========================
CREATE INDEX idx_rendez_vous_patient_id ON rendez_vous(patient_id);
CREATE INDEX idx_rendez_vous_medecin_id ON rendez_vous(medecin_id);
CREATE INDEX idx_rendez_vous_daterv ON rendez_vous(daterv);
CREATE INDEX idx_consultation_patient_id ON consultation(patient_id);
CREATE INDEX idx_consultation_medecin_id ON consultation(medecin_id);
CREATE INDEX idx_communiquer_patient_id ON communiquer(patient_id);
CREATE INDEX idx_communiquer_medecin_id ON communiquer(medecin_id);

-- ===========================
-- Données initiales
-- ===========================
-- Insertion d'un administrateur par défaut (mot de passe: admin123)
INSERT INTO users (name, email, password, type) 
VALUES ('Admin', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insertion de quelques gouvernorats
INSERT INTO gouver (name, region) VALUES 
('Tunis', 'Tunis'),
('Ariana', 'Tunis'),
('Ben Arous', 'Tunis'),
('Manouba', 'Tunis'),
('Nabeul', 'Nord-Est'),
('Zaghouan', 'Nord-Est'),
('Bizerte', 'Nord-Est'),
('Béja', 'Nord-Ouest'),
('Jendouba', 'Nord-Ouest'),
('Le Kef', 'Nord-Ouest'),
('Siliana', 'Nord-Ouest'),
('Sousse', 'Centre-Est'),
('Monastir', 'Centre-Est'),
('Mahdia', 'Centre-Est'),
('Sfax', 'Centre-Est'),
('Kairouan', 'Centre-Ouest'),
('Kasserine', 'Centre-Ouest'),
('Sidi Bouzid', 'Centre-Ouest'),
('Gabès', 'Sud-Est'),
('Médenine', 'Sud-Est'),
('Tataouine', 'Sud-Est'),
('Gafsa', 'Sud-Ouest'),
('Tozeur', 'Sud-Ouest'),
('Kébili', 'Sud-Ouest');

-- ===========================
-- Vues utiles
-- ===========================
CREATE OR REPLACE VIEW vw_doctors AS
SELECT 
    m.id,
    u.name,
    u.email,
    u.phone,
    m.speciality,
    m.license,
    s.name as service_name,
    h.name as hospital_name,
    g.name as governorate
FROM medecin m
JOIN users u ON m.user_id = u.id
LEFT JOIN service s ON m.service_id = s.id
LEFT JOIN hopital h ON s.hopital_id = h.id
LEFT JOIN gouver g ON h.gouver_id = g.id;

CREATE OR REPLACE VIEW vw_patients AS
SELECT 
    p.id,
    u.name,
    u.email,
    u.phone,
    u.created_at as registration_date
FROM patient p
JOIN users u ON p.user_id = u.id;

-- ===========================
-- Fonctions utilitaires
-- ===========================
-- Fonction pour hacher les mots de passe (à utiliser dans les triggers ou l'application)
CREATE OR REPLACE FUNCTION hash_password()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.password IS NOT NULL AND NEW.password !~ '^\$2[ayb]\$.{56}$' THEN
        NEW.password = crypt(NEW.password, gen_salt('bf'));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Activer le hachage des mots de passe pour les nouveaux utilisateurs
CREATE TRIGGER trg_hash_password
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION hash_password();

-- Fonction pour vérifier un mot de passe
CREATE OR REPLACE FUNCTION verify_password(email_input VARCHAR, password_input VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    hashed_password TEXT;
BEGIN
    SELECT password INTO hashed_password 
    FROM users 
    WHERE email = email_input;
    
    IF hashed_password IS NULL THEN
        RETURN FALSE;
    END IF;
    
    RETURN hashed_password = crypt(password_input, hashed_password);
END;
$$ LANGUAGE plpgsql;
