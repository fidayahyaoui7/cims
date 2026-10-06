const db = require('../database/db');
const fs = require('fs');
const path = require('path');

async function checkSchema() {
  try {
    console.log('Checking database schema...');
    
    // Check if users table exists
    const usersTable = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
    );
    
    if (!usersTable) {
      console.error('❌ Users table does not exist');
      return false;
    }
    console.log('✅ Users table exists');
    
    // Check users table columns
    const userColumns = await db.all("PRAGMA table_info(users)");
    console.log('\nUsers table columns:');
    console.table(userColumns);
    
    // Check if patient table exists
    const patientTable = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='patient'"
    );
    
    if (patientTable) {
      console.log('\n✅ Patient table exists');
      const patientColumns = await db.all("PRAGMA table_info(patient)");
      console.table(patientColumns);
    } else {
      console.log('\nℹ️ Patient table does not exist');
    }
    
    // Check if medecin table exists
    const doctorTable = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='medecin'"
    );
    
    if (doctorTable) {
      console.log('\n✅ Medecin table exists');
      const doctorColumns = await db.all("PRAGMA table_info(medecin)");
      console.table(doctorColumns);
    } else {
      console.log('\nℹ️ Medecin table does not exist');
    }
    
    return true;
  } catch (error) {
    console.error('Error checking database schema:', error);
    return false;
  } finally {
    // Close the database connection
    db.close();
  }
}

// Run the check
checkSchema().then(success => {
  if (success) {
    console.log('\n✅ Database schema check completed successfully');
  } else {
    console.log('\n❌ Database schema check failed');
  }
});
