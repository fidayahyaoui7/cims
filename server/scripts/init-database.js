const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Path to the database file
const dbPath = path.join(__dirname, '../../appointments.db');

// Remove existing database file if it exists
if (fs.existsSync(dbPath)) {
  console.log('Removing existing database file...');
  fs.unlinkSync(dbPath);
}

console.log('Creating new SQLite database...');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error creating database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to the SQLite database');
});

// Enable foreign keys
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');
  
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      type TEXT NOT NULL CHECK (type IN ('patient', 'doctor', 'admin')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('✅ Created users table');
    }
  });

  // Create cities table
  db.run(`
    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      region TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating cities table:', err.message);
    } else {
      console.log('✅ Created cities table');
    }
  });

  // Create hospitals table
  db.run(`
    CREATE TABLE IF NOT EXISTS hospitals (
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
    )
  `, (err) => {
    if (err) {
      console.error('Error creating hospitals table:', err.message);
    } else {
      console.log('✅ Created hospitals table');
    }
  });

  // Create services table
  db.run(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating services table:', err.message);
    } else {
      console.log('✅ Created services table');
    }
  });

  // Create hospital_services junction table
  db.run(`
    CREATE TABLE IF NOT EXISTS hospital_services (
      hospital_id INTEGER,
      service_id INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (hospital_id, service_id),
      FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating hospital_services table:', err.message);
    } else {
      console.log('✅ Created hospital_services table');
    }
  });

  // Create patient table
  db.run(`
    CREATE TABLE IF NOT EXISTS patient (
      user_id INTEGER PRIMARY KEY,
      date_of_birth TEXT,
      gender TEXT,
      blood_type TEXT,
      address TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating patient table:', err.message);
    } else {
      console.log('✅ Created patient table');
    }
  });

  // Create medecin table
  db.run(`
    CREATE TABLE IF NOT EXISTS medecin (
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
    )
  `, (err) => {
    if (err) {
      console.error('Error creating medecin table:', err.message);
    } else {
      console.log('✅ Created medecin table');
    }
  });

  // Create appointments table
  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
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
    )
  `, (err) => {
    if (err) {
      console.error('Error creating appointments table:', err.message);
    } else {
      console.log('✅ Created appointments table');
    }
  });

  // Create indexes for better performance
  db.run('CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_appointments_hospital ON appointments(hospital_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date)');
  
  console.log('\n✅ Database schema created successfully!');
  
  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('🔌 Database connection closed');
    }
  });
});
