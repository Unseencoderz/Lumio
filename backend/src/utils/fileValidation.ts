// CORRECT
import { FileTypeResult, fileTypeFromBuffer } from 'file-type';
import path from 'path';
import { logger } from './logger';

export interface FileValidationResult {
  isValid: boolean;
  mimeType?: string;
  extension?: string;
  error?: string;
}

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/tiff',
  'image/bmp',
  'image/webp',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.tiff', '.bmp', '.webp'];

export const validateFile = async (
  buffer: Buffer,
  originalName: string,
): Promise<FileValidationResult> => {
  try {
    // Check file size (this should be handled by multer, but double-check)
    if (buffer.length === 0) {
      return {
        isValid: false,
        error: 'File is empty',
      };
    }

    // Detect actual file type by magic bytes

const fileType: FileTypeResult | undefined = await fileTypeFromBuffer(buffer);
    
    if (!fileType) {
      return {
        isValid: false,
        error: 'Unable to determine file type',
      };
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(fileType.mime)) {
      return {
        isValid: false,
        error: `File type ${fileType.mime} is not supported. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
      };
    }

    // Validate file extension
    const extension = path.extname(originalName).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        isValid: false,
        error: `File extension ${extension} is not supported. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`,
      };
    }

    // Additional validation: ensure extension matches detected type
    const expectedExtensions: Record<string, string[]> = {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/tiff': ['.tiff', '.tif'],
      'image/bmp': ['.bmp'],
      'image/webp': ['.webp'],
    };

    const validExtensions = expectedExtensions[fileType.mime] || [];
    if (!validExtensions.includes(extension)) {
      return {
        isValid: false,
        error: `File extension ${extension} does not match detected type ${fileType.mime}`,
      };
    }

    return {
      isValid: true,
      mimeType: fileType.mime,
      extension: fileType.ext,
    };
  } catch (error) {
    logger.error(error, 'Error validating file');
    return {
      isValid: false,
      error: 'File validation failed',
    };
  }
};

export const sanitizeFilename = (filename: string): string => {
  // Remove path separators and other dangerous characters
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255); // Limit length
};