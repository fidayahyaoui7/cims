import { Request, Response } from 'express';
import { AppDataSource } from '../server';
import { Appointment } from '../models/Appointment';
import { User } from '../models/User';
import { Center } from '../models/Center';
import { LessThan, MoreThan, Between, FindOptionsWhere, In } from 'typeorm';
import { auth } from '../middleware/auth.middleware';

const appointmentRepository = AppDataSource.getRepository(Appointment);
const userRepository = AppDataSource.getRepository(User);
const centerRepository = AppDataSource.getRepository(Center);

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { centerId, doctorId, appointmentDate, studyType, studyDescription, notes } = req.body;
    const patientId = (req as any).user.id;

    // Check if center exists
    const center = await centerRepository.findOne({ where: { id: centerId } });
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }

    // Check if doctor exists (if provided)
    if (doctorId) {
      const doctor = await userRepository.findOne({ 
        where: { 
          id: doctorId, 
          role: In(['doctor', 'radiologist']) 
        } 
      });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found or invalid role' });
      }
    }

    // Check for overlapping appointments
    const startDate = new Date(appointmentDate);
    const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 minutes duration

    const existingAppointment = await appointmentRepository.findOne({
      where: [
        {
          centerId,
          appointmentDate: Between(startDate, endDate),
          status: In(['scheduled', 'in_progress'])
        },
        {
          patientId,
          appointmentDate: Between(startDate, endDate),
          status: In(['scheduled', 'in_progress'])
        }
      ]
    });

    if (existingAppointment) {
      return res.status(400).json({ 
        message: 'There is already an appointment scheduled at this time',
        conflict: existingAppointment
      });
    }

    // Create appointment
    const appointment = appointmentRepository.create({
      patientId,
      centerId,
      doctorId,
      appointmentDate: startDate,
      studyType,
      studyDescription,
      notes,
      status: 'scheduled'
    });

    await appointmentRepository.save(appointment);

    // TODO: Send confirmation notification

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Error creating appointment' });
  }
};

export const getAppointments = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, status, centerId, patientId, doctorId } = req.query;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const where: FindOptionsWhere<Appointment> = {};
    
    // Filter by date range
    if (startDate && endDate) {
      where.appointmentDate = Between(new Date(startDate as string), new Date(endDate as string));
    }

    // Filter by status
    if (status) {
      where.status = status as string;
    }

    // Apply role-based filtering
    if (userRole === 'patient') {
      where.patientId = userId;
    } else if (userRole === 'doctor' || userRole === 'radiologist') {
      where.doctorId = userId;
    }

    // Additional filters
    if (centerId) {
      where.centerId = centerId as string;
    }
    if (patientId && (userRole === 'admin' || userRole === 'doctor' || userRole === 'radiologist')) {
      where.patientId = patientId as string;
    }
    if (doctorId && userRole === 'admin') {
      where.doctorId = doctorId as string;
    }

    const appointments = await appointmentRepository.find({
      where,
      relations: ['patient', 'center', 'doctor'],
      order: { appointmentDate: 'ASC' }
    });

    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};

export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const appointment = await appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'center', 'doctor']
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check permissions
    if (userRole === 'patient' && appointment.patientId !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }

    if ((userRole === 'doctor' || userRole === 'radiologist') && 
        appointment.doctorId !== userId && 
        appointment.patientId !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Error fetching appointment' });
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const appointment = await appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'center', 'doctor']
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check permissions
    if (userRole === 'patient' && appointment.patientId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    // Update status
    appointment.status = status;
    
    // Set completedAt if status is 'completed'
    if (status === 'completed') {
      appointment.completedAt = new Date();
    }

    await appointmentRepository.save(appointment);

    // TODO: Send status update notification

    res.json(appointment);
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ message: 'Error updating appointment status' });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const appointment = await appointmentRepository.findOne({
      where: { id }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check permissions
    if (userRole === 'patient' && appointment.patientId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this appointment' });
    }

    // Only allow cancellation if appointment is in the future
    if (new Date(appointment.appointmentDate) < new Date() && 
        appointment.status !== 'cancelled') {
      return res.status(400).json({ 
        message: 'Cannot delete past appointments. Please cancel instead.' 
      });
    }

    await appointmentRepository.remove(appointment);

    // TODO: Send cancellation notification

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ message: 'Error deleting appointment' });
  }
};
