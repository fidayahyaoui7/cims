const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mon-app',
  password: process.env.DB_PASSWORD || '12345678',
  port: process.env.DB_PORT || 5432,
});

const hospitals = [
  {
    name: 'Hôpital Charles Nicolle',
    type: 'Public',
    address: 'Boulevard du 9 Avril 1938, Tunis',
    city: 'Tunis',
    phone: '+216 71 578 000',
    email: 'contact@rnt.health.tn',
    website: 'http://www.rns.tn',
    description: 'Principal hospital in Tunis with various medical specialties',
    latitude: 36.8065,
    longitude: 10.1815
  },
  
  {
    name: 'Hôpital La Rabta',
    type: 'Public',
    address: 'Jabbari, Tunis',
    city: 'Tunis',
    phone: '+216 71 578 200',
    email: 'contact@rabta.health.tn',
    description: 'University hospital with various medical departments',
    latitude: 36.8000,
    longitude: 10.1833
  },
 
  {
    name: 'Hôpital Habib Thameur',
    type: 'Public',
    address: 'Place de la Gare, Tunis',
    city: 'Tunis',
    phone: '+216 71 568 100',
    description: 'Public hospital with emergency services',
    latitude: 36.8009,
    longitude: 10.1803
  }
];

const services = [
  { name: 'Cardiology', description: 'Heart and cardiovascular system care' },
  { name: 'Dermatology', description: 'Skin, hair, and nail care' },
  { name: 'Neurology', description: 'Nervous system disorders' },
  { name: 'Ophthalmology', description: 'Eye care and vision services' },
  { name: 'Orthopedics', description: 'Bone and joint care' },
  { name: 'Pediatrics', description: 'Healthcare for children' },
  { name: 'Radiology', description: 'Diagnostic imaging services' },
  { name: 'Dentistry', description: 'Oral health and dental care' },
  { name: 'Emergency', description: '24/7 emergency medical services' },
  { name: 'Maternity', description: 'Prenatal and postnatal care' }
];

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Insert hospitals
    const hospitalIds = [];
    for (const hospital of hospitals) {
      const { rows } = await client.query(
        `INSERT INTO hospitals (name, type, address, city, phone, email, website, description, latitude, longitude)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id`,
        [
          hospital.name,
          hospital.type,
          hospital.address,
          hospital.city,
          hospital.phone,
          hospital.email,
          hospital.website,
          hospital.description,
          hospital.latitude,
          hospital.longitude
        ]
      );
      hospitalIds.push(rows[0].id);
    }
    
    // Insert services
    const serviceIds = [];
    for (const service of services) {
      const { rows } = await client.query(
        `INSERT INTO services (name, description)
         VALUES ($1, $2)
         RETURNING id`,
        [service.name, service.description]
      );
      serviceIds.push(rows[0].id);
    }
    
    // Associate services with hospitals
    for (let i = 0; i < hospitalIds.length; i++) {
      const hospitalId = hospitalIds[i];
      // Each hospital gets 3-5 random services
      const numServices = Math.floor(Math.random() * 3) + 3;
      const shuffled = [...serviceIds].sort(() => 0.5 - Math.random());
      const selectedServices = shuffled.slice(0, numServices);
      
      for (const serviceId of selectedServices) {
        await client.query(
          'INSERT INTO hospital_services (hospital_id, service_id) VALUES ($1, $2)',
          [hospitalId, serviceId]
        );
      }
    }
    
    await client.query('COMMIT');
    console.log('Database seeded successfully');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
