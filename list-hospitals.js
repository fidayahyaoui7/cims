const knex = require('knex');
const config = require('./knexfile');

async function listHospitals() {
  const db = knex(config.development);
  
  try {
    console.log('Fetching hospitals from the database...');
    const hospitals = await db('hospitals').select('id', 'name', 'city', 'type', 'phone');
    
    if (hospitals.length === 0) {
      console.log('No hospitals found in the database.');
    } else {
      console.log('\n=== Hospitals ===');
      console.table(hospitals);
      console.log(`Total hospitals: ${hospitals.length}`);
    }
    
  } catch (error) {
    console.error('Error fetching hospitals:', error.message);
  } finally {
    await db.destroy();
  }
}

listHospitals().catch(console.error);
