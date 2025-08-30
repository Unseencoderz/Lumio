import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { db } from '../services/firebase';
import { authenticateUser } from '../middleware/auth';
import { logger } from '../utils/logger';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Schema for saving analysis
const saveAnalysisSchema = z.object({
  jobId: z.string(),
  filename: z.string(),
  extractedText: z.string(),
  analysis: z.object({
    wordCount: z.number(),
    readingGrade: z.number(),
    sentiment: z.object({
      label: z.enum(['positive', 'neutral', 'negative']),
      score: z.number(),
    }),
    hashtags: z.array(z.object({
      tag: z.string(),
      score: z.number(),
      rationale: z.string().optional(),
    })),
    emojiSuggestions: z.array(z.string()),
    engagementScore: z.number(),
    engagementTips: z.array(z.string()),
    improvedText: z.object({
      twitter: z.string(),
      instagram: z.string(),
      linkedin: z.string(),
    }),
  }),
  meta: z.object({
    engine: z.enum(['gemini-pro', 'tesseract']),
    processingTimeMs: z.number(),
    piiDetected: z.boolean().optional(),
    partialProcessing: z.boolean().optional(),
    pagesProcessed: z.number().optional(),
    totalPages: z.number().optional(),
  }),
});

// Save analysis to user's history
router.post('/history', authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = saveAnalysisSchema.parse(req.body);
    const userId = req.user!.uid;

    // Save to Firestore
    const docRef = await db.collection('analyses').add({
      userId,
      ...validatedData,
      createdAt: new Date(),
    });

    logger.info({
      userId,
      docId: docRef.id,
      filename: validatedData.filename,
    }, 'Analysis saved to history');

    res.status(201).json({
      success: true,
      id: docRef.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return next(new AppError(`Validation error: ${errorMessage}`, 400));
    }
    next(error);
  }
});

// Get user's analysis history
router.get('/history', authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.uid;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Get analyses for the user, ordered by creation date
    const snapshot = await db.collection('analyses')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset(offset)
      .get();

    const analyses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get total count for pagination
    const totalSnapshot = await db.collection('analyses')
      .where('userId', '==', userId)
      .get();

    const total = totalSnapshot.size;
    const totalPages = Math.ceil(total / limit);

    logger.info({
      userId,
      page,
      limit,
      total,
      returned: analyses.length,
    }, 'Analysis history retrieved');

    res.json({
      analyses,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Delete analysis from history
router.delete('/history/:id', authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.uid;

    // Check if the analysis belongs to the user
    const docRef = db.collection('analyses').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new AppError('Analysis not found', 404);
    }

    const data = doc.data();
    if (data?.userId !== userId) {
      throw new AppError('Unauthorized to delete this analysis', 403);
    }

    await docRef.delete();

    logger.info({
      userId,
      analysisId: id,
    }, 'Analysis deleted from history');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { router as historyRoutes };