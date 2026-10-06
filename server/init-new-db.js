const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database', 'medical_centers.db');
const dbDir = path.dirname(dbPath);

// Create database directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`Created database directory: ${dbDir}`);
}

// Remove existing database file if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Removed existing database file');
}

console.log('Creating new SQLite database...');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON;');
  
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      type TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create hospitals table
  db.run(`
    CREATE TABLE IF NOT EXISTS hospitals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      city TEXT,
      phone TEXT,
      email TEXT,
      type TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create doctors table
  db.run(`
    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      speciality TEXT,
      license_number TEXT,
      hospital_id INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (hospital_id) REFERENCES hospitals (id) ON DELETE SET NULL
    )
  `);
  
  // Create appointments table
  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      hospital_id INTEGER,
      appointment_date TEXT NOT NULL,
      status TEXT DEFAULT 'scheduled',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (doctor_id) REFERENCES doctors (id) ON DELETE CASCADE,
      FOREIGN KEY (hospital_id) REFERENCES hospitals (id) ON DELETE SET NULL
    )
  `);
  
  console.log('Database tables created successfully');
  
  // Insert sample data
  db.serialize(() => {
    // Insert sample hospital
    db.run(
      `INSERT INTO hospitals (name, address, city, phone, email, type) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['General Hospital', '123 Main St', 'Tunis', '71234567', 'contact@generalhospital.tn', 'public'],
      function(err) {
        if (err) return console.error('Error inserting hospital:', err);
        const hospitalId = this.lastID;
        console.log('Inserted sample hospital with ID:', hospitalId);
        
        // Insert sample admin user
        const bcrypt = require('bcryptjs');
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync('admin123', salt);
        
        db.run(
          `INSERT INTO users (name, email, password_hash, type) 
           VALUES (?, ?, ?, ?)`,
          ['Admin', 'admin@example.com', hashedPassword, 'admin'],
          function(err) {
            if (err) return console.error('Error inserting admin user:', err);
            console.log('Inserted admin user with ID:', this.lastID);
            
            // Insert sample doctor
            db.run(
              `INSERT INTO users (name, email, password_hash, type) 
               VALUES (?, ?, ?, ?)`,
              ['Dr. Smith', 'dr.smith@example.com', hashedPassword, 'doctor'],
              function(err) {
                if (err) return console.error('Error inserting doctor user:', err);
                const doctorUserId = this.lastID;
                
                db.run(
                  `INSERT INTO doctors (user_id, speciality, hospital_id) 
                   VALUES (?, ?, ?)`,
                  [doctorUserId, 'Cardiology', hospitalId],
                  function(err) {
                    if (err) return console.error('Error inserting doctor:', err);
                    console.log('Inserted sample doctor with ID:', this.lastID);
                    
                    // Insert sample patient
                    db.run(
                      `INSERT INTO users (name, email, password_hash, type) 
                       VALUES (?, ?, ?, ?)`,
                      ['John Doe', 'john.doe@example.com', hashedPassword, 'patient'],
                      function(err) {
                        if (err) return console.error('Error inserting patient:', err);
                        const patientId = this.lastID;
                        console.log('Inserted sample patient with ID:', patientId);
                        
                        // Verify data
                        db.all('SELECT * FROM users', [], (err, rows) => {
                          if (err) return console.error('Error querying users:', err);
                          console.log('\nUsers in database:');
                          console.table(rows);
                          
                          db.all('SELECT * FROM hospitals', [], (err, rows) => {
                            if (err) return console.error('Error querying hospitals:', err);
                            console.log('\nHospitals in database:');
                            console.table(rows);
                            
                            db.all('SELECT * FROM doctors', [], (err, rows) => {
                              if (err) return console.error('Error querying doctors:', err);
                              console.log('\nDoctors in database:');
                              console.table(rows);
                              
                              console.log('\nDatabase initialization completed successfully!');
                              console.log(`Database file: ${dbPath}`);
                              db.close();
                            });
                          });
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});

// Handle database errors
db.on('error', (err) => {
  console.error('Database error:', err);
  process.exit(1);
});
