import { Request, Response } from 'express';
import { AppDataSource } from '../server';
import { Center } from '../models/Center';
import { Between, FindOptionsWhere, ILike } from 'typeorm';

const centerRepository = AppDataSource.getRepository(Center);

interface CenterQueryParams {
  city?: string;
  type?: string;
  search?: string;
  hasEmergency?: boolean;
  lat?: number;
  lng?: number;
  radius?: number; // in kilometers
}

export const createCenter = async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      address, 
      city, 
      country, 
      phone, 
      email, 
      coordinates, 
      workingHours, 
      description,
      type,
      hasEmergency,
      services
    } = req.body;

    const center = centerRepository.create({
      name,
      address,
      city,
      country,
      phone,
      email,
      coordinates: coordinates ? { type: 'Point', coordinates: [coordinates.lng, coordinates.lat] } : null,
      workingHours: workingHours || {
        monday: { open: '08:00', close: '18:00' },
        tuesday: { open: '08:00', close: '18:00' },
        wednesday: { open: '08:00', close: '18:00' },
        thursday: { open: '08:00', close: '18:00' },
        friday: { open: '08:00', close: '13:00' },
        saturday: { open: '09:00', close: '13:00' },
        sunday: { open: 'Closed', close: 'Closed' }
      },
      description,
      type,
      hasEmergency: hasEmergency || false,
      services: services || []
    });

    await centerRepository.save(center);
    res.status(201).json(center);
  } catch (error) {
    console.error('Create center error:', error);
    res.status(500).json({ message: 'Error creating center' });
  }
};

export const getCenters = async (req: Request, res: Response) => {
  try {
    const { 
      city, 
      type, 
      search, 
      hasEmergency,
      lat,
      lng,
      radius = 10, // default 10km radius
      page = 1,
      limit = 10
    } = req.query as unknown as CenterQueryParams & { page?: number; limit?: number };

    const where: FindOptionsWhere<Center> = {};
    
    if (city) where.city = ILike(`%${city}%`);
    if (type) where.type = type;
    if (hasEmergency !== undefined) where.hasEmergency = hasEmergency === 'true';
    
    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const skip = (page - 1) * limit;
    
    // If coordinates are provided, we'll sort by distance after fetching
    if (lat && lng) {
      // First get all centers matching the filters
      const centers = await centerRepository.find({
        where,
        relations: ['appointments']
      });

      // Calculate distances and filter by radius
      const centersWithDistance = centers.map(center => {
        if (!center.coordinates) return { ...center, distance: null };
        
        const distance = calculateDistance(
          lat, 
          lng, 
          center.coordinates.coordinates[1], 
          center.coordinates.coordinates[0]
        );
        
        return {
          ...center,
          distance
        };
      });

      // Filter by radius and sort by distance
      const filteredCenters = centersWithDistance
        .filter(center => radius === 0 || (center.distance !== null && center.distance <= radius))
        .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));

      // Apply pagination
      const paginatedCenters = filteredCenters.slice(skip, skip + limit);
      
      return res.json({
        data: paginatedCenters,
        pagination: {
          total: filteredCenters.length,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(filteredCenters.length / limit)
        }
      });
    }

    // If no coordinates, just do regular pagination
    const [centers, total] = await centerRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { name: 'ASC' }
    });

    res.json({
      data: centers,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get centers error:', error);
    res.status(500).json({ message: 'Error fetching centers' });
  }
};

export const getCenterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const center = await centerRepository.findOne({
      where: { id },
      relations: ['appointments']
    });

    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }

    res.json(center);
  } catch (error) {
    console.error('Get center error:', error);
    res.status(500).json({ message: 'Error fetching center' });
  }
};

export const updateCenter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If coordinates are being updated, format them correctly
    if (updateData.coordinates) {
      updateData.coordinates = {
        type: 'Point',
        coordinates: [
          updateData.coordinates.lng,
          updateData.coordinates.lat
        ]
      };
    }

    await centerRepository.update(id, updateData);
    const updatedCenter = await centerRepository.findOne({ where: { id } });
    
    if (!updatedCenter) {
      return res.status(404).json({ message: 'Center not found' });
    }

    res.json(updatedCenter);
  } catch (error) {
    console.error('Update center error:', error);
    res.status(500).json({ message: 'Error updating center' });
  }
};

export const deleteCenter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await centerRepository.delete(id);
    
    if (result.affected === 0) {
      return res.status(404).json({ message: 'Center not found' });
    }

    res.json({ message: 'Center deleted successfully' });
  } catch (error) {
    console.error('Delete center error:', error);
    res.status(500).json({ message: 'Error deleting center' });
  }
};

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return parseFloat(distance.toFixed(2));
}

function toRad(value: number): number {
  return value * Math.PI / 180;
}
