import { Router } from 'express';
import { 
  createAppointment, 
  getAppointments, 
  getAppointmentById, 
  updateAppointmentStatus,
  deleteAppointment 
} from '../controllers/appointment.controller';
import { auth, authorize } from '../middleware/auth.middleware';

const router = Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   POST api/appointments
// @desc    Create a new appointment
// @access  Private
router.post('/', createAppointment);

// @route   GET api/appointments
// @desc    Get all appointments (filtered by user role)
// @access  Private
router.get('/', getAppointments);

// @route   GET api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', getAppointmentById);

// @route   PATCH api/appointments/:id/status
// @desc    Update appointment status
// @access  Private
router.patch('/:id/status', updateAppointmentStatus);

// @route   DELETE api/appointments/:id
// @desc    Delete an appointment
// @access  Private
router.delete('/:id', deleteAppointment);

export default router;
