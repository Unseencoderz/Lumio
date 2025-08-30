import pdf from 'pdf-parse';
import * as pdfjsLib from 'pdfjs-dist';
import { createCanvas } from 'canvas';
import { logger } from '../utils/logger';
import { config } from '../config/config';

export interface PDFExtractionResult {
  text: string;
  hasTextLayer: boolean;
  totalPages: number;
  pagesProcessed: number;
  partialProcessing: boolean;
}

export class PDFService {
  async extractTextFromPDF(pdfBuffer: Buffer): Promise<PDFExtractionResult> {
    const startTime = Date.now();

    try {
      // Try extracting text using pdf-parse first
      const pdfData = await pdf(pdfBuffer);

      if (pdfData.text && pdfData.text.trim().length > 50) {
        logger.info({
          processingTimeMs: Date.now() - startTime,
          pages: pdfData.numpages,
          textLength: pdfData.text.length,
          method: 'text-layer',
        }, 'PDF text extraction completed');

        return {
          text: pdfData.text,
          hasTextLayer: true,
          totalPages: pdfData.numpages,
          pagesProcessed: pdfData.numpages,
          partialProcessing: false,
        };
      }

      // If insufficient text, render pages for OCR
      logger.info('PDF has no text layer, rendering pages for OCR');
      return await this.renderPDFPages(pdfBuffer);

    } catch (error) {
      logger.error(error, 'PDF text extraction failed');
      throw new Error('PDF processing failed');
    }
  }

  async renderPDFPages(pdfBuffer: Buffer): Promise<PDFExtractionResult> {
    const startTime = Date.now();

    try {
      const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
      const pdfDoc = await loadingTask.promise;
      const totalPages = pdfDoc.numPages;
      const maxPages = Math.min(totalPages, config.maxPdfPages);

      const renderedPages: Buffer[] = [];

      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        try {
          const page = await pdfDoc.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2.0 });

          const canvas = createCanvas(viewport.width, viewport.height);
          const context = canvas.getContext('2d');

          const renderContext = { canvasContext: context, viewport };
          await page.render(renderContext).promise;

          const imageBuffer = canvas.toBuffer('image/png');
          renderedPages.push(imageBuffer);

          logger.debug(`Rendered PDF page ${pageNum}/${maxPages}`);
        } catch (error) {
          logger.warn(error, `Failed to render PDF page ${pageNum}`);
        }
      }

      logger.info({
        processingTimeMs: Date.now() - startTime,
        totalPages,
        pagesProcessed: renderedPages.length,
        partialProcessing: maxPages < totalPages,
      }, 'PDF page rendering completed');

      return {
        text: '', // will be filled by OCR
        hasTextLayer: false,
        totalPages,
        pagesProcessed: renderedPages.length,
        partialProcessing: maxPages < totalPages,
      };

    } catch (error) {
      logger.error(error, 'PDF page rendering failed');
      throw new Error('PDF rendering failed');
    }
  }

  async extractImagesFromPDF(pdfBuffer: Buffer): Promise<Buffer[]> {
    try {
      const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
      const pdfDoc = await loadingTask.promise;
      const totalPages = pdfDoc.numPages;
      const maxPages = Math.min(totalPages, config.maxPdfPages);

      const images: Buffer[] = [];

      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        try {
          const page = await pdfDoc.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2.0 });

          const canvas = createCanvas(viewport.width, viewport.height);
          const context = canvas.getContext('2d');

          const renderContext = { canvasContext: context, viewport };
          await page.render(renderContext).promise;

          images.push(canvas.toBuffer('image/png'));
        } catch (error) {
          logger.warn(error, `Failed to extract image from PDF page ${pageNum}`);
        }
      }

      return images;
    } catch (error) {
      logger.error(error, 'PDF image extraction failed');
      throw new Error('PDF image extraction failed');
    }
  }
}

export const pdfService = new PDFService();
