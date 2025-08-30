import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { geminiService } from '../services/gemini';
import { TextAnalysisService } from '../services/textAnalysis';
import { CacheService } from '../utils/cache';
import { logger } from '../utils/logger';
import { AppError } from '../middleware/errorHandler';
import { AnalysisResult } from '../types/job';

const router = Router();

// Request validation schema
const analyzeRequestSchema = z.object({
  text: z.string().min(1, 'Text is required').max(50000, 'Text too long'),
  targets: z.array(z.enum(['twitter', 'instagram', 'linkedin'])).optional().default(['twitter', 'instagram', 'linkedin']),
});

// Direct text analysis endpoint
router.post('/analyze', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, targets } = analyzeRequestSchema.parse(req.body);

    logger.info({
      textLength: text.length,
      targets,
    }, 'Direct text analysis requested');

    // Check cache first
    const cachedResult = await CacheService.getCachedAnalysis(text);
    if (cachedResult) {
      logger.debug('Returning cached analysis result');
      return res.json({ analysis: cachedResult });
    }

    let analysis: AnalysisResult;

    try {
      // Try Gemini analysis first
      const geminiResult = await geminiService.withRetry(
        () => geminiService.analyzeText(text),
        3,
        1000
      );

      // Convert Gemini response to our format
      analysis = {
        wordCount: text.split(/\s+/).filter(w => w.length > 0).length,
        readingGrade: geminiResult.readability.fleschKincaidGrade,
        sentiment: geminiResult.sentiment,
        hashtags: geminiResult.hashtags.map(h => ({
          tag: h.tag,
          score: h.score,
          rationale: h.rationale,
        })),
        emojiSuggestions: geminiResult.emojiSuggestions,
        engagementScore: TextAnalysisService.calculateEngagementScore(text),
        engagementTips: geminiResult.engagementTips,
        improvedText: {
          twitter: targets.includes('twitter') ? geminiResult.improvedText.twitter : '',
          instagram: targets.includes('instagram') ? geminiResult.improvedText.instagram : '',
          linkedin: targets.includes('linkedin') ? geminiResult.improvedText.linkedin : '',
        },
      };

      logger.info('Gemini analysis completed successfully');
    } catch (error) {
      logger.warn(error, 'Gemini analysis failed, falling back to basic analysis');
      
      // Fallback to basic analysis
      analysis = TextAnalysisService.createBasicAnalysis(text);
      
      // Filter improved text based on targets
      analysis.improvedText = {
        twitter: targets.includes('twitter') ? analysis.improvedText.twitter : '',
        instagram: targets.includes('instagram') ? analysis.improvedText.instagram : '',
        linkedin: targets.includes('linkedin') ? analysis.improvedText.linkedin : '',
      };
    }

    // Cache the result
    await CacheService.setCachedAnalysis(text, analysis);

    res.json({ analysis });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return next(new AppError(`Validation error: ${errorMessage}`, 400));
    }
    next(error);
  }
});

// Hashtag-only endpoint (low-cost)
router.post('/hashtags', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = z.object({
      text: z.string().min(1, 'Text is required').max(10000, 'Text too long'),
    }).parse(req.body);

    logger.info({
      textLength: text.length,
    }, 'Hashtag generation requested');

    // Check cache first
    const cacheKey = CacheService.generateKey(`hashtags:${text}`);
    const cachedResult = await CacheService.get(cacheKey);
    if (cachedResult) {
      logger.debug('Returning cached hashtag result');
      return res.json(cachedResult);
    }

    let hashtags: Array<{ tag: string; rationale: string }>;

    try {
      // Try Gemini hashtag generation
      hashtags = await geminiService.withRetry(
        () => geminiService.generateHashtags(text),
        2,
        1000
      );

      logger.info('Gemini hashtag generation completed successfully');
    } catch (error) {
      logger.warn(error, 'Gemini hashtag generation failed, falling back to basic generation');
      
      // Fallback to basic hashtag generation
      const basicAnalysis = TextAnalysisService.createBasicAnalysis(text);
      hashtags = basicAnalysis.hashtags.map(h => ({
        tag: h.tag,
        rationale: `Popular term (score: ${h.score.toFixed(2)})`,
      }));
    }

    const result = { hashtags };
    
    // Cache the result for 1 hour
    await CacheService.set(cacheKey, result, 3600);

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return next(new AppError(`Validation error: ${errorMessage}`, 400));
    }
    next(error);
  }
});

export { router as analyzeRoutes };