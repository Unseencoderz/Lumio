import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/config';
import { logger } from '../utils/logger';

export interface StorageService {
  uploadFile(key: string, buffer: Buffer, mimeType: string): Promise<string>;
  getFile(key: string): Promise<Buffer>;
  deleteFile(key: string): Promise<void>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
}

export class LocalStorageService implements StorageService {
  private baseDir: string;

  constructor() {
    this.baseDir = path.join(process.cwd(), 'uploads');
    this.ensureDirectory();
  }

  private async ensureDirectory(): Promise<void> {
    try {
      await fs.access(this.baseDir);
    } catch {
      await fs.mkdir(this.baseDir, { recursive: true });
      logger.info(`Created local storage directory: ${this.baseDir}`);
    }
  }

  async uploadFile(key: string, buffer: Buffer, mimeType: string): Promise<string> {
    const filePath = path.join(this.baseDir, key);
    const dir = path.dirname(filePath);
    
    // Ensure subdirectory exists
    await fs.mkdir(dir, { recursive: true });
    
    await fs.writeFile(filePath, buffer);
    
    logger.info({
      key,
      size: buffer.length,
      mimeType,
      path: filePath,
    }, 'File uploaded to local storage');
    
    return filePath;
  }

  async getFile(key: string): Promise<Buffer> {
    const filePath = path.join(this.baseDir, key);
    
    try {
      const buffer = await fs.readFile(filePath);
      return buffer;
    } catch (error) {
      logger.error({ key, error }, 'Failed to read file from local storage');
      throw new Error(`File not found: ${key}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    const filePath = path.join(this.baseDir, key);
    
    try {
      await fs.unlink(filePath);
      logger.info({ key, path: filePath }, 'File deleted from local storage');
    } catch (error) {
      logger.warn({ key, error }, 'Failed to delete file from local storage');
      // Don't throw error for delete operations
    }
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    // For local storage, return a simple file path
    // In a real implementation, you might serve files through your web server
    return `file://${path.join(this.baseDir, key)}`;
  }
}

export class SupabaseStorageService implements StorageService {
  private supabase: any;
  private bucket: string;

  constructor() {
    if (!config.supabaseUrl || !config.supabaseServiceKey) {
      throw new Error('Supabase configuration is incomplete. Please provide SUPABASE_URL and SUPABASE_SERVICE_KEY');
    }

    this.supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);
    this.bucket = config.supabaseBucket;
    
    logger.info({ 
      bucket: this.bucket, 
      url: config.supabaseUrl.replace(/\/\/.*@/, '//***@') // Hide credentials in logs
    }, 'Supabase storage service initialized');
  }

  async uploadFile(key: string, buffer: Buffer, mimeType: string): Promise<string> {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucket)
        .upload(key, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) {
        throw error;
      }
      
      logger.info({
        key,
        bucket: this.bucket,
        size: buffer.length,
        mimeType,
        path: data.path,
      }, 'File uploaded to Supabase');
      
      return `supabase://${this.bucket}/${key}`;
    } catch (error) {
      logger.error({ key, bucket: this.bucket, error }, 'Failed to upload file to Supabase');
      throw new Error(`Failed to upload file to Supabase: ${error}`);
    }
  }

  async getFile(key: string): Promise<Buffer> {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucket)
        .download(key);

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('No file data received');
      }

      // Convert Blob to Buffer
      const arrayBuffer = await data.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      logger.error({ key, bucket: this.bucket, error }, 'Failed to get file from Supabase');
      throw new Error(`Failed to get file from Supabase: ${error}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const { error } = await this.supabase.storage
        .from(this.bucket)
        .remove([key]);

      if (error) {
        throw error;
      }

      logger.info({ key, bucket: this.bucket }, 'File deleted from Supabase');
    } catch (error) {
      logger.warn({ key, bucket: this.bucket, error }, 'Failed to delete file from Supabase');
      // Don't throw error for delete operations
    }
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucket)
        .createSignedUrl(key, expiresIn);

      if (error) {
        throw error;
      }

      return data.signedUrl;
    } catch (error) {
      logger.error({ key, bucket: this.bucket, error }, 'Failed to generate signed URL');
      throw new Error(`Failed to generate signed URL: ${error}`);
    }
  }
}

// Factory function to create the appropriate storage service
export const createStorageService = (): StorageService => {
  if (config.useSupabase) {
    return new SupabaseStorageService();
  } else {
    return new LocalStorageService();
  }
};

// Export singleton instance
export const storageService = createStorageService();