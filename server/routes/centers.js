const express = require('express');
const { getDb } = require('../database/database');
const router = express.Router();

// Get all medical centers
router.get('/', async (req, res) => {
  try {
    const { city, service } = req.query;
    
    let query = `
      SELECT 
        mc.*,
        c.name as city_name,
        c.region,
        GROUP_CONCAT(s.name) as services
      FROM medical_centers mc
      JOIN cities c ON mc.city_id = c.id
      LEFT JOIN center_services cs ON mc.id = cs.center_id
      LEFT JOIN services s ON cs.service_id = s.id
    `;
    
    let whereConditions = [];
    let params = [];
    
    if (city) {
      whereConditions.push("c.name = ?");
      params.push(city);
    }
    
    if (service) {
      whereConditions.push("s.name = ?");
      params.push(service);
    }
    
    if (whereConditions.length > 0) {
      query += " WHERE " + whereConditions.join(" AND ");
    }
    
    query += " GROUP BY mc.id ORDER BY mc.name";
    
    const centers = await getDb().prepare(query).all(...params);
    
    // Parse services string back to array
    const formattedCenters = centers.map(center => ({
      ...center,
      services: center.services ? center.services.split(',') : []
    }));
    
    res.json({ centers: formattedCenters });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Get medical center by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        mc.*,
        c.name as city_name,
        c.region,
        GROUP_CONCAT(s.name) as services
      FROM medical_centers mc
      JOIN cities c ON mc.city_id = c.id
      LEFT JOIN center_services cs ON mc.id = cs.center_id
      LEFT JOIN services s ON cs.service_id = s.id
      WHERE mc.id = ?
      GROUP BY mc.id
    `;
    
    const center = await getDb().prepare(query).get(id);
    
    if (!center || !center.id) {
      return res.status(404).json({ message: 'Medical center not found' });
    }
    
    // Parse services string back to array
    center.services = center.services ? center.services.split(',') : [];
    
    res.json({ center });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Get medical centers by city
router.get('/city/:cityName', async (req, res) => {
  try {
    const { cityName } = req.params;
    
    const query = `
      SELECT 
        mc.*,
        c.name as city_name,
        c.region,
        GROUP_CONCAT(s.name) as services
      FROM medical_centers mc
      JOIN cities c ON mc.city_id = c.id
      LEFT JOIN center_services cs ON mc.id = cs.center_id
      LEFT JOIN services s ON cs.service_id = s.id
      WHERE c.name = ?
      GROUP BY mc.id
      ORDER BY mc.name
    `;
    
    const centers = await getDb().prepare(query).all(cityName);
    
    // Parse services string back to array
    const formattedCenters = centers.map(center => ({
      ...center,
      services: center.services ? center.services.split(',') : []
    }));
    
    res.json({ centers: formattedCenters });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Get medical centers by service
router.get('/service/:serviceName', async (req, res) => {
  try {
    const { serviceName } = req.params;
    
    const query = `
      SELECT 
        mc.*,
        c.name as city_name,
        c.region,
        GROUP_CONCAT(s.name) as services
      FROM medical_centers mc
      JOIN cities c ON mc.city_id = c.id
      JOIN center_services cs ON mc.id = cs.center_id
      JOIN services s ON cs.service_id = s.id
      WHERE s.name = ?
      GROUP BY mc.id
      ORDER BY mc.name
    `;
    
    const centers = await getDb().prepare(query).all(serviceName);
    
    // Parse services string back to array
    const formattedCenters = centers.map(center => ({
      ...center,
      services: center.services ? center.services.split(',') : []
    }));
    
    res.json({ centers: formattedCenters });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Get nearby medical centers (by coordinates)
router.get('/nearby/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const { radius = 10 } = req.query; // Default 10km radius
    
    // Haversine formula for distance calculation
    const query = `
      SELECT 
        mc.*,
        c.name as city_name,
        c.region,
        GROUP_CONCAT(s.name) as services,
        (
          6371 * acos(
            cos(radians(?)) * cos(radians(mc.latitude)) * 
            cos(radians(mc.longitude) - radians(?)) + 
            sin(radians(?)) * sin(radians(mc.latitude))
          )
        ) AS distance
      FROM medical_centers mc
      JOIN cities c ON mc.city_id = c.id
      LEFT JOIN center_services cs ON mc.id = cs.center_id
      LEFT JOIN services s ON cs.service_id = s.id
      GROUP BY mc.id
      HAVING distance <= ?
      ORDER BY distance
    `;
    
    const centers = await getDb().prepare(query).all(lat, lng, lat, Number(radius));
    
    // Parse services string and format distance
    const formattedCenters = centers.map(center => ({
      ...center,
      services: center.services ? center.services.split(',') : [],
      distance: Math.round(center.distance * 100) / 100 // Round to 2 decimal places
    }));
    
    res.json({ centers: formattedCenters });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Get all services
router.get('/services/all', async (req, res) => {
  try {
    const services = await getDb().prepare("SELECT * FROM services ORDER BY name").all();
    res.json({ services });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Update medical center rating
router.put('/:id/rating', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    
    if (rating === undefined || rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 0 and 5' });
    }
    
    const result = await getDb().prepare("UPDATE medical_centers SET rating = ? WHERE id = ?").run(rating, id);
    
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Medical center not found' });
    }
    
    res.json({ message: 'Rating updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

module.exports = router;