import { Router } from 'express';
import { 
  createStudy, 
  getStudies, 
  getStudyById, 
  updateStudyReport,
  getStudyDicomMetadata
} from '../controllers/study.controller';
import { auth, authorize } from '../middleware/auth.middleware';

const router = Router();

// Apply auth middleware to all routes
router.use(auth);

// @route   POST api/studies
// @desc    Create a new study
// @access  Private (Admin, Radiologist)
router.post('/', authorize(['admin', 'radiologist']), createStudy);

// @route   GET api/studies
// @desc    Get all studies (filtered by user role)
// @access  Private
router.get('/', getStudies);

// @route   GET api/studies/:id
// @desc    Get study by ID
// @access  Private
router.get('/:id', getStudyById);

// @route   PATCH api/studies/:id/report
// @desc    Update study report
// @access  Private (Radiologist, Admin)
router.patch('/:id/report', authorize(['radiologist', 'admin']), updateStudyReport);

// @route   GET api/studies/:id/metadata
// @desc    Get DICOM metadata for a study
// @access  Private
router.get('/:id/metadata', getStudyDicomMetadata);

export default router;
