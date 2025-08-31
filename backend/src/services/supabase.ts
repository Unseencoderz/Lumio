import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/config';
import { logger } from '../utils/logger';
import { AnalysisResult } from '../types/job';

// Database types for Supabase
export interface JobHistoryRecord {
  id: number;
  user_id: string;
  filename: string;
  original_name: string;
  created_at: string;
  updated_at: string;
  status: 'processing' | 'completed' | 'failed';
  storage_path?: string;
  extracted_text?: string;
  analysis?: AnalysisResult;
  meta?: {
    engine: 'gemini-pro' | 'tesseract';
    processingTimeMs: number;
    piiDetected?: boolean;
    partialProcessing?: boolean;
    pagesProcessed?: number;
    totalPages?: number;
  };
  error_message?: string;
}

export interface CreateJobData {
  user_id: string;
  filename: string;
  original_name: string;
  storage_path?: string;
  status?: 'processing' | 'completed' | 'failed';
}

export interface UpdateJobData {
  status?: 'processing' | 'completed' | 'failed';
  extracted_text?: string;
  analysis?: AnalysisResult;
  meta?: JobHistoryRecord['meta'];
  error_message?: string;
}

export class SupabaseDatabaseService {
  private supabase: SupabaseClient;

  constructor() {
    if (!config.supabaseUrl || !config.supabaseServiceKey) {
      throw new Error('Supabase configuration is incomplete. Please provide SUPABASE_URL and SUPABASE_SERVICE_KEY');
    }

    this.supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);
    
    logger.info({ 
      url: config.supabaseUrl.replace(/\/\/.*@/, '//***@') // Hide credentials in logs
    }, 'Supabase database service initialized');
  }

  /**
   * Create a new job record in the database
   */
  async createJob(jobData: CreateJobData): Promise<JobHistoryRecord> {
    try {
      const { data, error } = await this.supabase
        .from('jobs')
        .insert([{
          user_id: jobData.user_id,
          filename: jobData.filename,
          original_name: jobData.original_name,
          storage_path: jobData.storage_path,
          status: jobData.status || 'processing',
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      logger.info({
        jobId: data.id,
        userId: jobData.user_id,
        filename: jobData.filename,
      }, 'Job record created in Supabase');

      return data;
    } catch (error) {
      logger.error({ 
        userId: jobData.user_id, 
        filename: jobData.filename, 
        error 
      }, 'Failed to create job record in Supabase');
      throw new Error(`Failed to create job record: ${error}`);
    }
  }

  /**
   * Update an existing job record
   */
  async updateJob(jobId: number, updateData: UpdateJobData): Promise<JobHistoryRecord> {
    try {
      const { data, error } = await this.supabase
        .from('jobs')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', jobId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      logger.info({
        jobId,
        status: updateData.status,
      }, 'Job record updated in Supabase');

      return data;
    } catch (error) {
      logger.error({ jobId, updateData, error }, 'Failed to update job record in Supabase');
      throw new Error(`Failed to update job record: ${error}`);
    }
  }

  /**
   * Get job history for a specific user
   */
  async getHistoryForUser(userId: string, page = 1, limit = 10): Promise<{
    jobs: JobHistoryRecord[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const offset = (page - 1) * limit;

      // Get total count
      const { count, error: countError } = await this.supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (countError) {
        throw countError;
      }

      // Get paginated results
      const { data, error } = await this.supabase
        .from('jobs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw error;
      }

      const total = count || 0;
      const hasMore = offset + limit < total;

      logger.info({
        userId,
        page,
        limit,
        total,
        returned: data?.length || 0,
      }, 'Job history retrieved from Supabase');

      return {
        jobs: data || [],
        total,
        hasMore,
      };
    } catch (error) {
      logger.error({ userId, page, limit, error }, 'Failed to get user history from Supabase');
      throw new Error(`Failed to get user history: ${error}`);
    }
  }

  /**
   * Get a specific job by ID and user ID (for security)
   */
  async getJobByIdAndUser(jobId: number, userId: string): Promise<JobHistoryRecord | null> {
    try {
      const { data, error } = await this.supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      logger.error({ jobId, userId, error }, 'Failed to get job from Supabase');
      throw new Error(`Failed to get job: ${error}`);
    }
  }

  /**
   * Delete a job record (for cleanup or user deletion)
   */
  async deleteJob(jobId: number, userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      logger.info({
        jobId,
        userId,
      }, 'Job record deleted from Supabase');
    } catch (error) {
      logger.error({ jobId, userId, error }, 'Failed to delete job from Supabase');
      throw new Error(`Failed to delete job: ${error}`);
    }
  }

  /**
   * Get job statistics for a user
   */
  async getUserJobStats(userId: string): Promise<{
    total: number;
    completed: number;
    processing: number;
    failed: number;
  }> {
    try {
      const { data, error } = await this.supabase
        .from('jobs')
        .select('status')
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      const stats = data.reduce((acc, job) => {
        acc.total++;
        acc[job.status]++;
        return acc;
      }, { total: 0, completed: 0, processing: 0, failed: 0 });

      return stats;
    } catch (error) {
      logger.error({ userId, error }, 'Failed to get user job stats from Supabase');
      throw new Error(`Failed to get user job stats: ${error}`);
    }
  }
}

// Factory function to create the database service
export const createSupabaseDatabaseService = (): SupabaseDatabaseService | null => {
  if (!config.useSupabase || !config.supabaseUrl || !config.supabaseServiceKey) {
    logger.info('Supabase database service disabled or not configured');
    return null;
  }
  
  return new SupabaseDatabaseService();
};

// Export singleton instance
export const supabaseDb = createSupabaseDatabaseService(); 