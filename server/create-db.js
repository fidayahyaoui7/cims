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

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('Created database directory');
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
      return;
    }
    console.log('✅ Created appointments table');
    
    // Add test data
    const stmt = db.prepare(`
      INSERT INTO appointments (
        exam_type, center_id, center_name, appointment_date,
        patient_name, patient_email, patient_phone, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const testAppointments = [
      {
        examType: 'Radiologie',
        centerId: 'tunis-center-1',
        centerName: 'Tunis Medical Center',
        appointmentDate: new Date(Date.now() + 86400000).toISOString(),
        patientName: 'Test User',
        patientEmail: 'test@example.com',
        patientPhone: '12345678',
        status: 'pending'
      },
      {
        examType: 'Echographie',
        centerId: 'tunis-center-2',
        centerName: 'Tunis Imaging Center',
        appointmentDate: new Date(Date.now() + 172800000).toISOString(),
        patientName: 'Another User',
        patientEmail: 'another@example.com',
        patientPhone: '87654321',
        status: 'confirmed'
      }
    ];
    
    let completed = 0;
    testAppointments.forEach(appt => {
      stmt.run(
        appt.examType,
        appt.centerId,
        appt.centerName,
        appt.appointmentDate,
        appt.patientName,
        appt.patientEmail,
        appt.patientPhone,
        appt.status,
        (err) => {
          if (err) {
            console.error('Error adding test appointment:', err.message);
          } else {
            console.log(`✅ Added test appointment for ${appt.patientName}`);
          }
          
          completed++;
          if (completed === testAppointments.length) {
            stmt.finalize();
            verifyData();
          }
        }
      );
    });
  });
});

function verifyData() {
  console.log('\nVerifying data...');
  
  db.all('SELECT * FROM appointments', [], (err, rows) => {
    if (err) {
      console.error('Error reading appointments:', err.message);
      return;
    }
    
    console.log('\n📋 Appointments in database:');
    console.table(rows);
    
    console.log('\n✅ Database setup complete!');
    console.log('You can now run: node index.js to start the server');
    
    db.close();
  });
}
