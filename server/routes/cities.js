const express = require('express');
const { getDb } = require('../database/database');

const router = express.Router();

// Get all cities
router.get('/', (req, res) => {
  const { region } = req.query;
  
  let query = "SELECT * FROM cities";
  let params = [];
  
  if (region && region !== 'all') {
    query += " WHERE region = ?";
    params.push(region);
  }
  
  query += " ORDER BY name";
  try {
    const cities = getDb().prepare(query).all(...params);
    res.json({ cities });
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
});

// Get city by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  try {
    const city = getDb().prepare("SELECT * FROM cities WHERE id = ?").get(id);
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.json({ city });
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
});

// Get city by name
router.get('/name/:name', (req, res) => {
  const { name } = req.params;
  try {
    const city = getDb().prepare("SELECT * FROM cities WHERE name = ?").get(name);
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.json({ city });
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
});

// Get cities by region
router.get('/region/:region', (req, res) => {
  const { region } = req.params;
  try {
    const cities = getDb().prepare("SELECT * FROM cities WHERE region = ? ORDER BY name").all(region);
    res.json({ cities });
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
});

// Get all regions
router.get('/regions/all', (req, res) => {
  try {
    const regions = getDb().prepare("SELECT DISTINCT region FROM cities ORDER BY region").all();
    res.json({ regions: regions.map(r => r.region) });
  } catch (err) {
    return res.status(500).json({ message: 'Database error' });
  }
});

module.exports = router;