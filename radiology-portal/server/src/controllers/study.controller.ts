import { Request, Response } from 'express';
import { AppDataSource } from '../server';
import { Study } from '../models/Study';
import { User } from '../models/User';
import { FindOptionsWhere, ILike } from 'typeorm';

const studyRepository = AppDataSource.getRepository(Study);
const userRepository = AppDataSource.getRepository(User);

export const createStudy = async (req: Request, res: Response) => {
  try {
    const { 
      patientId, 
      studyUid, 
      studyDate, 
      modality, 
      description, 
      metadata 
    } = req.body;

    // Verify patient exists
    const patient = await userRepository.findOne({ 
      where: { id: patientId, role: 'patient' } 
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if study with this UID already exists
    const existingStudy = await studyRepository.findOne({ 
      where: { studyUid } 
    });

    if (existingStudy) {
      return res.status(400).json({ message: 'Study with this UID already exists' });
    }

    const study = studyRepository.create({
      patientId,
      studyUid,
      studyDate: studyDate || new Date(),
      modality,
      description,
      metadata,
      isReported: false
    });

    await studyRepository.save(study);
    
    // TODO: Send notification to patient about new study
    
    res.status(201).json(study);
  } catch (error) {
    console.error('Create study error:', error);
    res.status(500).json({ message: 'Error creating study' });
  }
};

export const getStudies = async (req: Request, res: Response) => {
  try {
    const { 
      patientId, 
      modality, 
      startDate, 
      endDate, 
      isReported,
      search
    } = req.query;
    
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const where: FindOptionsWhere<Study> = {};

    // Apply role-based filtering
    if (userRole === 'patient') {
      where.patientId = userId;
    } else if (patientId && (userRole === 'doctor' || userRole === 'radiologist' || userRole === 'admin')) {
      where.patientId = patientId as string;
    } else if (userRole !== 'admin') {
      // Doctors and radiologists can only see their patients' studies
      return res.status(403).json({ 
        message: 'Not authorized to view these studies' 
      });
    }

    // Apply filters
    if (modality) where.modality = modality as string;
    if (isReported !== undefined) where.isReported = isReported === 'true';
    
    if (startDate && endDate) {
      where.studyDate = Between(new Date(startDate as string), new Date(endDate as string));
    }

    if (search) {
      where.description = ILike(`%${search}%`);
    }

    const studies = await studyRepository.find({
      where,
      relations: ['patient'],
      order: { studyDate: 'DESC' }
    });

    res.json(studies);
  } catch (error) {
    console.error('Get studies error:', error);
    res.status(500).json({ message: 'Error fetching studies' });
  }
};

export const getStudyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const study = await studyRepository.findOne({
      where: { id },
      relations: ['patient']
    });

    if (!study) {
      return res.status(404).json({ message: 'Study not found' });
    }

    // Check permissions
    if (userRole === 'patient' && study.patientId !== userId) {
      return res.status(403).json({ 
        message: 'Not authorized to view this study' 
      });
    }

    // For doctors/radiologists, check if they have access to this patient
    if (userRole === 'doctor' || userRole === 'radiologist') {
      // TODO: Check if the doctor has access to this patient's studies
      // This could be implemented with a separate doctor_patient_assignments table
    }

    res.json(study);
  } catch (error) {
    console.error('Get study error:', error);
    res.status(500).json({ message: 'Error fetching study' });
  }
};

export const updateStudyReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { report } = req.body;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    // Only radiologists and admins can update reports
    if (userRole !== 'radiologist' && userRole !== 'admin') {
      return res.status(403).json({ 
        message: 'Not authorized to update study reports' 
      });
    }

    const study = await studyRepository.findOne({ 
      where: { id },
      relations: ['patient']
    });

    if (!study) {
      return res.status(404).json({ message: 'Study not found' });
    }

    // Update report
    study.report = report;
    study.isReported = true;
    study.reportedById = userId;
    study.reportedAt = new Date();
    study.updatedAt = new Date();

    await studyRepository.save(study);

    // TODO: Send notification to patient about the report

    res.json(study);
  } catch (error) {
    console.error('Update study report error:', error);
    res.status(500).json({ message: 'Error updating study report' });
  }
};

export const getStudyDicomMetadata = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // In a real implementation, this would fetch DICOM metadata from a PACS
    // using the study UID and return it
    
    // For now, we'll return a placeholder
    res.json({
      studyUid: id,
      patientName: 'Doe, John',
      studyDate: new Date().toISOString(),
      modality: 'CT',
      description: 'CT Head',
      numberOfInstances: 120,
      // Add more DICOM metadata as needed
    });
  } catch (error) {
    console.error('Get DICOM metadata error:', error);
    res.status(500).json({ message: 'Error fetching DICOM metadata' });
  }
};
