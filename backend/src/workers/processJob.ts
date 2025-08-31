import { Worker, Job } from 'bullmq';
import { redisClient } from '../utils/redis';
import { config } from '../config/config';
import { logger } from '../utils/logger';
import { JobData, JobResult, OCRResult } from '../types/job';
import { geminiService } from '../services/gemini';
import { tesseractService } from '../services/ocr';
import { pdfService } from '../services/pdf';
import { TextAnalysisService } from '../services/textAnalysis';
import { CacheService } from '../utils/cache';
import { supabaseDb } from '../services/supabase';
import fs from 'fs/promises';
import path from 'path';

export class DocumentProcessor {
  async processDocument(job: Job<JobData>): Promise<void> {
    const startTime = Date.now();
    const { id, filename, originalName, mimeType, size, filePath } = job.data;

    logger.info({
      jobId: id,
      filename: originalName,
      mimeType,
      size,
    }, 'Starting document processing');

    try {
      // Update progress
      await job.updateProgress(10);

      // Read file
      const fileBuffer = await fs.readFile(filePath);
      
      // Extract text based on file type
      let extractedText = '';
      let engine: 'gemini-pro' | 'tesseract' = 'tesseract';
      let piiDetected = false;
      let partialProcessing = false;
      let pagesProcessed: number | undefined;
      let totalPages: number | undefined;

      await job.updateProgress(20);

      if (mimeType === 'application/pdf') {
        // Process PDF
        const pdfResult = await pdfService.extractTextFromPDF(fileBuffer);
        
        if (pdfResult.hasTextLayer && pdfResult.text.trim()) {
          // PDF has text layer
          extractedText = pdfResult.text;
          engine = 'gemini-pro'; // Will try Gemini for analysis
        } else {
          // PDF needs OCR - render pages and process
          const images = await pdfService.extractImagesFromPDF(fileBuffer);
          extractedText = await this.processImages(images, job);
        }
        
        totalPages = pdfResult.totalPages;
        pagesProcessed = pdfResult.pagesProcessed;
        partialProcessing = pdfResult.partialProcessing;
        
      } else {
        // Process image
        extractedText = await this.processImage(fileBuffer, mimeType, job);
      }

      await job.updateProgress(60);

      // Check for PII (basic implementation)
      piiDetected = this.detectPII(extractedText);
      if (piiDetected) {
        extractedText = this.redactPII(extractedText);
      }

      // Check cache for analysis
      const cachedAnalysis = await CacheService.getCachedAnalysis(extractedText);
      let analysis;

      if (cachedAnalysis) {
        analysis = cachedAnalysis;
        logger.info({ jobId: id }, 'Using cached analysis');
      } else {
        // Perform analysis
        analysis = await this.analyzeText(extractedText, job);
        
        // Cache the analysis
        await CacheService.setCachedAnalysis(extractedText, analysis);
      }

      await job.updateProgress(90);

      // Create result
      const result: JobResult = {
        id,
        filename: originalName,
        extractedText,
        analysis,
        meta: {
          engine,
          processingTimeMs: Date.now() - startTime,
          ...(piiDetected !== undefined && { piiDetected }),
          ...(partialProcessing !== undefined && { partialProcessing }),
          ...(pagesProcessed !== undefined && { pagesProcessed }),
          ...(totalPages !== undefined && { totalPages }),
        },
      };

      // Store result in Redis with TTL
      const resultKey = `job_result:${id}`;
      await redisClient.setEx(
        resultKey,
        config.jobTtlSeconds,
        JSON.stringify(result)
      );

      // Update Supabase job record if available
      if (job.data.supabaseJobId && supabaseDb) {
        try {
          await supabaseDb.updateJob(job.data.supabaseJobId, {
            status: 'completed',
            extracted_text: extractedText,
            analysis: analysis,
            meta: result.meta,
          });
          logger.info({ 
            jobId: id, 
            supabaseJobId: job.data.supabaseJobId 
          }, 'Job result saved to Supabase');
        } catch (error) {
          logger.warn({ 
            jobId: id, 
            supabaseJobId: job.data.supabaseJobId, 
            error 
          }, 'Failed to update job in Supabase');
        }
      }

      await job.updateProgress(100);

      logger.info({
        jobId: id,
        processingTimeMs: Date.now() - startTime,
        textLength: extractedText.length,
        engine,
      }, 'Document processing completed');

    } catch (error) {
      // Update Supabase job record with error if available
      if (job.data.supabaseJobId && supabaseDb) {
        try {
          await supabaseDb.updateJob(job.data.supabaseJobId, {
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
          });
          logger.info({ 
            jobId: id, 
            supabaseJobId: job.data.supabaseJobId 
          }, 'Job failure saved to Supabase');
        } catch (supabaseError) {
          logger.warn({ 
            jobId: id, 
            supabaseJobId: job.data.supabaseJobId, 
            error: supabaseError 
          }, 'Failed to update job failure in Supabase');
        }
      }

      logger.error({
        jobId: id,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      }, 'Document processing failed');
      
      throw error;
    } finally {
      // Clean up uploaded file
      try {
        await fs.unlink(filePath);
        logger.debug({ filePath }, 'Cleaned up temporary file');
      } catch (error) {
        logger.warn({ filePath, error }, 'Failed to clean up temporary file');
      }
    }
  }

  private async processImage(imageBuffer: Buffer, mimeType: string, job: Job): Promise<string> {
    try {
      // Try Gemini OCR first
      await job.updateProgress(30);
      
      const ocrResult = await geminiService.withRetry(
        () => geminiService.extractTextFromImage(imageBuffer, mimeType),
        2,
        1000
      );
      
      logger.info({ confidence: ocrResult.confidence }, 'Gemini OCR completed');
      return ocrResult.text;
      
    } catch (error) {
      logger.warn(error, 'Gemini OCR failed, falling back to Tesseract');
      
      // Fallback to Tesseract
      await job.updateProgress(40);
      
      const ocrResult = await tesseractService.extractTextFromImage(imageBuffer);
      return ocrResult.text;
    }
  }

  private async processImages(images: Buffer[], job: Job): Promise<string> {
    const texts: string[] = [];
    const progressStep = 30 / images.length;
    let currentProgress = 30;

    for (const [index, imageBuffer] of images.entries()) {
      try {
        const text = await this.processImage(imageBuffer, 'image/png', job);
        if (text.trim()) {
          texts.push(text);
        }
        
        currentProgress += progressStep;
        await job.updateProgress(Math.round(currentProgress));
        
        logger.debug(`Processed page ${index + 1}/${images.length}`);
      } catch (error) {
        logger.warn(error, `Failed to process page ${index + 1}`);
      }
    }

    return texts.join('\n\n');
  }

  private async analyzeText(text: string, job: Job): Promise<any> {
    try {
      // Try Gemini analysis
      await job.updateProgress(70);
      
      const geminiResult = await geminiService.withRetry(
        () => geminiService.analyzeText(text),
        3,
        1000
      );

      // Convert to our format
      return {
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
        improvedText: geminiResult.improvedText,
      };

    } catch (error) {
      logger.warn(error, 'Gemini analysis failed, using basic analysis');
      
      // Fallback to basic analysis
      await job.updateProgress(80);
      return TextAnalysisService.createBasicAnalysis(text);
    }
  }

  private detectPII(text: string): boolean {
    // Basic PII detection patterns
    const piiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
      /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, // Credit card
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
      /\b\d{3}-\d{3}-\d{4}\b/g, // Phone number
    ];

    return piiPatterns.some(pattern => pattern.test(text));
  }

  private redactPII(text: string): string {
    return text
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED-SSN]')
      .replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, '[REDACTED-CARD]')
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[REDACTED-EMAIL]')
      .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[REDACTED-PHONE]');
  }
}

const processor = new DocumentProcessor();

// Create worker
export const startWorker = async (): Promise<Worker> => {
  // Get Redis connection options
  const redisConfig = config.redisHost && config.redisPort ? {
    host: config.redisHost,
    port: config.redisPort,
    username: config.redisUsername || 'default',
    ...(config.redisPassword && { password: config.redisPassword }),
  } : {
    host: 'localhost',
    port: 6379,
  };

  const worker = new Worker(
    'document-processing',
    async (job: Job<JobData>) => {
      await processor.processDocument(job);
    },
    {
      connection: redisConfig,
      concurrency: 2, // Process up to 2 jobs concurrently
      removeOnComplete: { count: 10 },
      removeOnFail: { count: 5 },
    }
  );

  worker.on('completed', (job) => {
    logger.info({ jobId: job.id }, 'Worker completed job');
  });

  worker.on('failed', (job, error) => {
    logger.error({
      jobId: job?.id,
      error: error.message,
    }, 'Worker job failed');
  });

  worker.on('error', (error) => {
    logger.error(error, 'Worker error');
  });

  logger.info('Document processing worker started');
  return worker;
};