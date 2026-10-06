@echo off
echo Setting up SQLite database...

set DB_PATH=database\appointments.db

:: Create database directory if it doesn't exist
if not exist database mkdir database

:: Remove existing database file if it exists
if exist %DB_PATH% del %DB_PATH%

:: Create a new SQLite database and execute SQL commands
echo .open %DB_PATH%
echo Creating appointments table...
echo "
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
);

-- Verify data
SELECT '📋 Appointments in database:' as '';
SELECT * FROM appointments;
" | sqlite3 %DB_PATH% %1

echo.
echo ✅ Database setup complete at %CD%\%DB_PATH%
pause
