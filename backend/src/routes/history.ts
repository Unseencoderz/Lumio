import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { supabaseDb } from '../services/supabase';
import { authenticateUser } from '../middleware/auth';
import { logger } from '../utils/logger';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Get user's job history
router.get('/history', authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!supabaseDb) {
      throw new AppError('History service not available. Supabase not configured.', 503);
    }

    const userId = req.user!.uid;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50); // Max 50 items per page

    const result = await supabaseDb.getHistoryForUser(userId, page, limit);

    logger.info({
      userId,
      page,
      limit,
      total: result.total,
      returned: result.jobs.length,
    }, 'User history retrieved');

    res.json({
      jobs: result.jobs,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
        hasNext: result.hasMore,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get specific job details
router.get('/history/:id', authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!supabaseDb) {
      throw new AppError('History service not available. Supabase not configured.', 503);
    }

    const jobId = parseInt(req.params.id);
    const userId = req.user!.uid;

    if (isNaN(jobId)) {
      throw new AppError('Invalid job ID', 400);
    }

    const job = await supabaseDb.getJobByIdAndUser(jobId, userId);

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    logger.info({
      userId,
      jobId,
    }, 'Job details retrieved');

    res.json(job);
  } catch (error) {
    next(error);
  }
});

// Delete job from history
router.delete('/history/:id', authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!supabaseDb) {
      throw new AppError('History service not available. Supabase not configured.', 503);
    }

    const jobId = parseInt(req.params.id);
    const userId = req.user!.uid;

    if (isNaN(jobId)) {
      throw new AppError('Invalid job ID', 400);
    }

    // Verify job exists and belongs to user before deletion
    const job = await supabaseDb.getJobByIdAndUser(jobId, userId);
    if (!job) {
      throw new AppError('Job not found', 404);
    }

    await supabaseDb.deleteJob(jobId, userId);

    logger.info({
      userId,
      jobId,
    }, 'Job deleted from history');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Get user job statistics
router.get('/history/stats', authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!supabaseDb) {
      throw new AppError('History service not available. Supabase not configured.', 503);
    }

    const userId = req.user!.uid;
    const stats = await supabaseDb.getUserJobStats(userId);

    logger.info({
      userId,
      stats,
    }, 'User job stats retrieved');

    res.json(stats);
  } catch (error) {
    next(error);
  }
});

export { router as historyRoutes };