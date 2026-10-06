const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Database path
const dbPath = path.join(__dirname, 'database', 'appointments.db');
const dbDir = path.dirname(dbPath);

console.log('Setting up SQLite database...');

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

// SQL commands to create tables and insert test data
const sqlCommands = `
  -- Create appointments table
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
  );

  -- Insert test data
  INSERT INTO appointments (
    exam_type, center_id, center_name, appointment_date,
    patient_name, patient_email, patient_phone, status
  ) VALUES (
    'Radiologie', 'tunis-center-1', 'Tunis Medical Center',
    datetime('now', '+1 day'), 'Test User', 'test@example.com', '12345678', 'pending'
  ), (
    'Echographie', 'tunis-center-2', 'Tunis Imaging Center',
    datetime('now', '+2 days'), 'Another User', 'another@example.com', '87654321', 'confirmed'
  );

  -- Verify data
  SELECT '📋 Appointments in database:' as '';
  SELECT * FROM appointments;
`;

// Write SQL commands to a temporary file
const tempFile = path.join(__dirname, 'temp_setup.sql');
fs.writeFileSync(tempFile, sqlCommands);

// Execute SQLite commands
console.log('Creating database and tables...');
try {
  const output = execSync(`sqlite3 "${dbPath}" < "${tempFile}"`).toString();
  console.log(output);
  console.log(`✅ Database setup complete at: ${dbPath}`);
} catch (error) {
  console.error('❌ Error setting up database:');
  console.error(error.message);
  if (error.output) {
    console.error(error.output.toString());
  }
} finally {
  // Clean up temporary file
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
  }
}
