import { Router, Request, Response, NextFunction } from 'express';
import { jobQueue } from '../queues/jobQueue';
import { redisClient } from '../utils/redis';
import { logger } from '../utils/logger';
import { AppError } from '../middleware/errorHandler';
import { JobProgress, JobResult } from '../types/job';

const router = Router();

// Get job status
router.get('/status/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id || !id.startsWith('job-')) {
      throw new AppError('Invalid job ID', 400);
    }

    // Get job from queue
    const job = await jobQueue.getJob(id);
    
    if (!job) {
      throw new AppError('Job not found', 404);
    }

    // Check if job is completed and result is cached
    const resultKey = `job_result:${id}`;
    const cachedResult = await redisClient.get(resultKey);
    
    let status: JobProgress['status'] = 'processing';
    let progress = 0;
    let message: string | undefined;

    if (job.finishedOn) {
      if (job.failedReason) {
        status = 'failed';
        message = job.failedReason;
      } else if (cachedResult) {
        status = 'done';
        progress = 100;
      }
    } else if (job.progress) {
      progress = typeof job.progress === 'number' ? job.progress : 0;
    }

    const response: JobProgress = {
      id,
      status,
      progress,
      message,
    };

    logger.debug({ jobId: id, status, progress }, 'Job status requested');

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get job result
router.get('/result/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id || !id.startsWith('job-')) {
      throw new AppError('Invalid job ID', 400);
    }

    // Get result from cache
    const resultKey = `job_result:${id}`;
    const cachedResult = await redisClient.get(resultKey);
    
    if (!cachedResult) {
      // Check if job exists and is still processing
      const job = await jobQueue.getJob(id);
      
      if (!job) {
        throw new AppError('Job not found', 404);
      }
      
      if (!job.finishedOn) {
        throw new AppError('Job is still processing', 202);
      }
      
      if (job.failedReason) {
        throw new AppError(`Job failed: ${job.failedReason}`, 500);
      }
      
      throw new AppError('Job result not available', 404);
    }

    const result: JobResult = JSON.parse(cachedResult);
    
    logger.info({ jobId: id }, 'Job result retrieved');

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Delete job and its result
router.delete('/job/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id || !id.startsWith('job-')) {
      throw new AppError('Invalid job ID', 400);
    }

    // Remove job from queue
    const job = await jobQueue.getJob(id);
    if (job) {
      await job.remove();
    }

    // Remove result from cache
    const resultKey = `job_result:${id}`;
    await redisClient.del(resultKey);

    logger.info({ jobId: id }, 'Job deleted');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Get job queue stats (for monitoring)
router.get('/queue/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [waiting, active, completed, failed] = await Promise.all([
      jobQueue.getWaiting(),
      jobQueue.getActive(),
      jobQueue.getCompleted(),
      jobQueue.getFailed(),
    ]);

    const stats = {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
});

export { router as jobRoutes };