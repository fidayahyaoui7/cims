import { Router } from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../auth';

const router = Router();

// Configure multer for in-memory file handling
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allow only certain file types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ] as string[];

    if (file.mimetype && allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// Initialize S3 client
const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT || 'http://minio:9000',
  forcePathStyle: true,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || 'minio',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minio123',
  },
});

// Upload a single file
router.post('/', upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const userId = req.user?.sub;
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase() || '';
    const fileName = `${uuidv4()}.${fileExtension}`;
    const key = `uploads/${userId}/${fileName}`;

    // Ensure required environment variables are set
    const bucket = process.env.STORAGE_BUCKET;
    if (!bucket) {
      throw new Error('STORAGE_BUCKET environment variable is not set');
    }

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: file.size,
      Metadata: {
        originalname: file.originalname,
        uploadedBy: userId || 'unknown',
      },
    });
    
    await s3.send(command);

    // Construct the public URL
    const publicUrlBase = process.env.S3_PUBLIC_URL || `http://localhost:9000/${bucket}`;
    const fileUrl = `${publicUrlBase}/${key}`;

    res.status(201).json({
      url: fileUrl,
      key,
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get a presigned URL for file upload (client-side upload)
router.get('/presigned-url', async (req: AuthRequest, res) => {
  const { fileName, fileType } = req.query;
  const userId = req.user?.sub;

  if (!fileName || !fileType) {
    return res.status(400).json({ error: 'File name and type are required' });
  }

  try {
    const bucket = process.env.STORAGE_BUCKET;
    if (!bucket) {
      throw new Error('STORAGE_BUCKET environment variable is not set');
    }
    
    const fileExtension = (fileName as string).split('.').pop()?.toLowerCase() || '';
    const fileKey = `uploads/${userId}/${uuidv4()}.${fileExtension}`;
    
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileKey,
      ContentType: fileType as string,
      Metadata: {
        uploadedBy: userId || 'unknown',
      },
    });

    // In a real implementation, you would generate a presigned URL here
    // For MinIO, you might need to use a different approach
    const publicUrlBase = process.env.S3_PUBLIC_URL || `http://localhost:9000/${bucket}`;
    const fileUrl = `${publicUrlBase}/${fileKey}`;

    res.json({
      uploadUrl: fileUrl,
      key: fileKey,
      method: 'PUT',
      headers: {
        'Content-Type': fileType,
      },
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

// List user's uploaded files
router.get('/', async (req: AuthRequest, res) => {
  const userId = req.user?.sub;
  const { prefix = '' } = req.query;

  try {
    // In a real implementation, you would list objects with the user's prefix
    // This is a simplified version
    res.json({
      files: [],
      prefix: `uploads/${userId}/${prefix}`,
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// Delete a file
router.delete('/:key', async (req: AuthRequest, res) => {
  const { key } = req.params;
  const userId = req.user?.sub;

  try {
    // Verify the file belongs to the user
    if (!key.startsWith(`uploads/${userId}/`)) {
      return res.status(403).json({ error: 'Not authorized to delete this file' });
    }

    // In a real implementation, you would delete the object from S3
    // await s3.deleteObject({
    //   Bucket: process.env.STORAGE_BUCKET || 'uploads',
    //   Key: key,
    // });

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;
