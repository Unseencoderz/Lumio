import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/config';
import { logger } from '../utils/logger';
import { AppError } from '../middleware/errorHandler';
import { optionalAuth } from '../middleware/auth';
import { validateFile, sanitizeFilename } from '../utils/fileValidation';
import { jobQueue } from '../queues/jobQueue';
import { JobData } from '../types/job';
import { supabaseDb } from '../services/supabase';
import path from 'path';
import fs from 'fs/promises';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.maxFileSizeBytes,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    // Basic file type check (will be validated more thoroughly later)
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/tiff',
      'image/bmp',
      'image/webp',
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(`File type ${file.mimetype} is not supported`, 400));
    }
  },
});

// Ensure upload directory exists
const ensureUploadDir = async (): Promise<string> => {
  const uploadDir = path.join(process.cwd(), 'uploads');
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
  return uploadDir;
};

router.post('/upload', optionalAuth, upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    const { buffer, originalname, mimetype, size } = req.file;

    // Validate file
    const validation = await validateFile(buffer, originalname);
    if (!validation.isValid) {
      throw new AppError(validation.error || 'File validation failed', 400);
    }

    // Generate job ID and sanitize filename
    const jobId = `job-${uuidv4()}`;
    const sanitizedFilename = sanitizeFilename(originalname);
    const filename = `${jobId}_${sanitizedFilename}`;

    // Save file to disk (temporary storage)
    const uploadDir = await ensureUploadDir();
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    // Create job data
    const jobData: JobData = {
      id: jobId,
      filename,
      originalName: originalname,
      mimeType: validation.mimeType || mimetype,
      size,
      filePath,
      userId: req.user?.uid, // Optional user ID from authentication
    };

    // Save job record to Supabase if user is authenticated and Supabase is configured
    let supabaseJobId: number | undefined;
    if (req.user && supabaseDb) {
      try {
        const jobRecord = await supabaseDb.createJob({
          user_id: req.user.uid,
          filename: sanitizedFilename,
          original_name: originalname,
          storage_path: filePath,
          status: 'processing',
        });
        supabaseJobId = jobRecord.id;
        
        // Add Supabase job ID to job data for worker processing
        jobData.supabaseJobId = supabaseJobId;
      } catch (error) {
        logger.warn({ 
          jobId, 
          userId: req.user.uid, 
          error 
        }, 'Failed to save job to Supabase, continuing with processing');
      }
    }

    // Add job to queue
    await jobQueue.add('processDocument', jobData, {
      jobId,
      removeOnComplete: 10,
      removeOnFail: 5,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });

    logger.info({
      jobId,
      filename: sanitizedFilename,
      size,
      mimeType: validation.mimeType,
      userId: req.user?.uid,
      supabaseJobId,
    }, 'File uploaded and job queued');

    // Return job information
    res.status(201).json({
      id: jobId,
      filename: sanitizedFilename,
      size,
      status: 'processing',
    });

  } catch (error) {
    // Clean up file if it was saved
    if (req.file) {
      const jobId = `job-${uuidv4()}`;
      const filename = `${jobId}_${sanitizeFilename(req.file.originalname)}`;
      const uploadDir = await ensureUploadDir();
      const filePath = path.join(uploadDir, filename);
      
      try {
        await fs.unlink(filePath);
      } catch {
        // File might not have been saved, ignore error
      }
    }
    
    next(error);
  }
});

export { router as uploadRoutes };