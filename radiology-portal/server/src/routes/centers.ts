import { Router } from 'express';
import { 
  createCenter, 
  getCenters, 
  getCenterById, 
  updateCenter, 
  deleteCenter 
} from '../controllers/center.controller';
import { auth, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getCenters);
router.get('/:id', getCenterById);

// Protected routes (require authentication)
router.use(auth);

// Admin-only routes
router.post('/', authorize(['admin']), createCenter);
router.put('/:id', authorize(['admin']), updateCenter);
router.delete('/:id', authorize(['admin']), deleteCenter);

export default router;
