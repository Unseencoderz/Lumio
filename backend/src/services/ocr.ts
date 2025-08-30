import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import { logger } from '../utils/logger';
import { OCRResult } from '../types/job';

export class TesseractService {
  async extractTextFromImage(imageBuffer: Buffer): Promise<OCRResult> {
    const startTime = Date.now();
    
    try {
      // Preprocess image for better OCR accuracy
      const preprocessedBuffer = await this.preprocessImage(imageBuffer);
      
      const { data } = await Tesseract.recognize(preprocessedBuffer, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            logger.debug(`Tesseract progress: ${Math.round(m.progress * 100)}%`);
          }
        },
      });

      const lines = data.text.split('\n').filter(line => line.trim().length > 0);
      
      const result: OCRResult = {
        text: data.text,
        lines,
        confidence: data.confidence / 100, // Convert to 0-1 scale
      };

      logger.info({
        processingTimeMs: Date.now() - startTime,
        confidence: result.confidence,
        textLength: result.text.length,
        linesCount: lines.length,
      }, 'Tesseract OCR completed');

      return result;
    } catch (error) {
      logger.error(error, 'Tesseract OCR failed');
      throw new Error('OCR extraction failed');
    }
  }

  private async preprocessImage(imageBuffer: Buffer): Promise<Buffer> {
    try {
      // Image preprocessing for better OCR accuracy
      const processed = await sharp(imageBuffer)
        .resize(2000, 2000, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .greyscale()
        .normalize()
        .sharpen()
        .png()
        .toBuffer();

      return processed;
    } catch (error) {
      logger.warn(error, 'Image preprocessing failed, using original');
      return imageBuffer;
    }
  }

  // Advanced preprocessing for difficult images
  async preprocessImageAdvanced(imageBuffer: Buffer): Promise<Buffer> {
    try {
      const processed = await sharp(imageBuffer)
        .resize(2000, 2000, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .greyscale()
        .normalize()
        .linear(1.2, -(128 * 1.2) + 128) // Increase contrast
        .sharpen({ sigma: 1, flat: 1, jagged: 2 })
        .threshold(128) // Binarize
        .png()
        .toBuffer();

      return processed;
    } catch (error) {
      logger.warn(error, 'Advanced image preprocessing failed');
      return this.preprocessImage(imageBuffer);
    }
  }
}

export const tesseractService = new TesseractService();