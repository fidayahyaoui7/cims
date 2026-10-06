const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database path
const dbPath = path.join(__dirname, 'database', 'appointments.db');

// Remove existing database file if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Removed existing database file');
}

// Create new database
console.log('Creating new database at:', dbPath);
const db = new sqlite3.Database(dbPath);

// Create appointments table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_type TEXT NOT NULL,
      center_id TEXT NOT NULL,
      center_name TEXT NOT NULL,
      appointment_date TEXT NOT NULL,
      patient_name TEXT NOT NULL,
      patient_email TEXT NOT NULL,
      patient_phone TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating appointments table:', err.message);
    } else {
      console.log('✅ Created appointments table');
      
      // Add test appointment
      const stmt = db.prepare(`
        INSERT INTO appointments (
          exam_type, center_id, center_name, appointment_date,
          patient_name, patient_email, patient_phone, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        'Radiographie',
        'tunis-center-1',
        'Tunis Medical Center',
        new Date().toISOString(),
        'Test Patient',
        'test@example.com',
        '12345678',
        'pending',
        function(err) {
          if (err) {
            console.error('Error adding test appointment:', err.message);
          } else {
            console.log('✅ Added test appointment with ID:', this.lastID);
          }
          
          // Verify data
          db.all('SELECT * FROM appointments', [], (err, rows) => {
            if (err) {
              console.error('Error reading appointments:', err.message);
            } else {
              console.log('\n📋 Appointments in database:');
              console.table(rows);
            }
            
            // Close the database connection
            db.close();
            console.log('✅ Database setup complete');
          });
        }
      );
      
      stmt.finalize();
    }
  });
});
