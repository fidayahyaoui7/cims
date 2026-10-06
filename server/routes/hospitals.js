const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get all hospitals with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      city,
      type,
      service,
      search,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 20
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = [];
    const params = [];

    if (city) {
      params.push(city);
      where.push(`c.name = $${params.length}`);
    }
    if (type) {
      params.push(type);
      where.push(`h.type = $${params.length}`);
    }
    if (service) {
      params.push(service);
      where.push(`s.name = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`, `%${search}%`);
      where.push(`(h.name ILIKE $${params.length - 1} OR h.address ILIKE $${params.length})`);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const sortField = ['name'].includes(sortBy) ? sortBy : 'name';
    const sortDir = sortOrder === 'desc' ? 'DESC' : 'ASC';

    const dataSql = `
      SELECT 
        h.id,
        h.name,
        h.type,
        h.address,
        h.phone,
        h.latitude,
        h.longitude,
        c.name AS city_name,
        COALESCE(
          json_agg(DISTINCT s.name) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) AS services
      FROM hospitals h
      LEFT JOIN cities c ON h.city_id = c.id
      LEFT JOIN hospital_services hs ON hs.hospital_id = h.id
      LEFT JOIN services s ON s.id = hs.service_id
      ${whereSql}
      GROUP BY h.id, c.name
      ORDER BY ${sortField} ${sortDir}
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const countSql = `
      SELECT COUNT(DISTINCT h.id) AS total
      FROM hospitals h
      LEFT JOIN cities c ON h.city_id = c.id
      LEFT JOIN hospital_services hs ON hs.hospital_id = h.id
      LEFT JOIN services s ON s.id = hs.service_id
      ${whereSql}
    `;

    const dataParams = [...params, parseInt(limit), offset];
    const [rows, countRow] = await Promise.all([
      db.getAll(dataSql, dataParams),
      db.getOne(countSql, params)
    ]);

    const total = parseInt(countRow?.total || 0);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      data: rows,
      pagination: {
        total,
        totalPages,
        currentPage: parseInt(page),
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
});

// Get hospital by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid hospital id' });
    }

    const hospital = await db.getOne(
      `
      SELECT 
        h.id,
        h.name,
        h.type,
        h.address,
        h.phone,
        h.emergency_phone,
        h.email,
        h.website,
        h.latitude,
        h.longitude,
        h.description,
        c.name AS city_name,
        c.region AS city_region,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object('id', s.id, 'name', s.name)
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) AS services
      FROM hospitals h
      LEFT JOIN cities c ON h.city_id = c.id
      LEFT JOIN hospital_services hs ON hs.hospital_id = h.id
      LEFT JOIN services s ON s.id = hs.service_id
      WHERE h.id = $1
      GROUP BY h.id, c.name, c.region
      `,
      [id]
    );

    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    res.json(hospital);
  } catch (error) {
    console.error('Error fetching hospital:', error);
    res.status(500).json({ error: 'Failed to fetch hospital' });
  }
});

// Search hospitals by name or address
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const rows = await db.getAll(
      `
      SELECT h.id, h.name, h.address, c.name AS city_name
      FROM hospitals h
      LEFT JOIN cities c ON h.city_id = c.id
      WHERE h.name ILIKE $1 OR h.address ILIKE $1
      ORDER BY h.name ASC
      LIMIT $2
      `,
      [
        `%${q}%`,
        parseInt(limit)
      ]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error searching hospitals:', error);
    res.status(500).json({ error: 'Failed to search hospitals' });
  }
});

// Get all available hospital types
router.get('/types', async (req, res) => {
  try {
    const rows = await db.getAll(`SELECT DISTINCT type FROM hospitals WHERE type IS NOT NULL ORDER BY type ASC`);
    res.json(rows.map(r => r.type));
  } catch (error) {
    console.error('Error fetching hospital types:', error);
    res.status(500).json({ error: 'Failed to fetch hospital types' });
  }
});

// Get all services with counts
router.get('/services/all', async (req, res) => {
  try {
    const rows = await db.getAll(
      `
      SELECT s.id, s.name, COUNT(hs.hospital_id) AS hospitals_count
      FROM services s
      LEFT JOIN hospital_services hs ON hs.service_id = s.id
      GROUP BY s.id, s.name
      ORDER BY s.name ASC
      `
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching all services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get all cities with hospitals
router.get('/cities', async (req, res) => {
  try {
    const rows = await db.getAll(
      `
      SELECT c.id, c.name, c.region, COUNT(h.id) AS hospitals_count
      FROM cities c
      LEFT JOIN hospitals h ON h.city_id = c.id
      GROUP BY c.id, c.name, c.region
      ORDER BY c.name ASC
      `
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// Get doctors for a service
router.get('/services/:id/doctors', async (req, res) => {
  try {
    const serviceId = parseInt(req.params.id, 10);
    if (Number.isNaN(serviceId)) {
      return res.status(400).json({ error: 'Invalid service id' });
    }
    const rows = await db.getAll(
      `
      SELECT 
        u.id AS user_id,
        u.name,
        u.email,
        u.phone,
        m.speciality,
        m.license_number,
        h.id AS hospital_id,
        h.name AS hospital_name
      FROM medecin m
      JOIN users u ON u.id = m.user_id
      LEFT JOIN hospitals h ON h.id = m.hospital_id
      LEFT JOIN hospital_services hs ON hs.hospital_id = h.id
      WHERE hs.service_id = $1
      ORDER BY u.name ASC
      `,
      [serviceId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

module.exports = router;
