-- Post Polish (Lumio) - Supabase Database Schema
-- This script sets up the job history tracking table in Supabase

-- Create the jobs table for tracking user document processing history
CREATE TABLE IF NOT EXISTS jobs (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL, -- Firebase UID
  filename TEXT NOT NULL, -- Sanitized filename used for storage
  original_name TEXT NOT NULL, -- Original filename as uploaded by user
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  storage_path TEXT, -- Path to file in storage (local or cloud)
  extracted_text TEXT, -- Text extracted from document
  analysis JSONB, -- AI analysis results (sentiment, hashtags, etc.)
  meta JSONB, -- Processing metadata (engine, timing, etc.)
  error_message TEXT -- Error message if processing failed
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_user_created ON jobs(user_id, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own jobs
CREATE POLICY "Users can view their own jobs" ON jobs
  FOR SELECT USING (user_id = auth.jwt() ->> 'sub');

-- Users can only insert jobs with their own user_id
CREATE POLICY "Users can insert their own jobs" ON jobs
  FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

-- Users can only update their own jobs
CREATE POLICY "Users can update their own jobs" ON jobs
  FOR UPDATE USING (user_id = auth.jwt() ->> 'sub');

-- Users can only delete their own jobs
CREATE POLICY "Users can delete their own jobs" ON jobs
  FOR DELETE USING (user_id = auth.jwt() ->> 'sub');

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_jobs_updated_at 
  BEFORE UPDATE ON jobs 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create a view for job statistics (optional, for analytics)
CREATE OR REPLACE VIEW user_job_stats AS
SELECT 
  user_id,
  COUNT(*) as total_jobs,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_jobs,
  COUNT(*) FILTER (WHERE status = 'processing') as processing_jobs,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_jobs,
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) * 1000) FILTER (WHERE status = 'completed') as avg_processing_time_ms,
  MAX(created_at) as last_job_at
FROM jobs
GROUP BY user_id;

-- Grant necessary permissions (adjust as needed for your setup)
-- Note: In Supabase, these permissions are typically managed through the dashboard
-- GRANT SELECT, INSERT, UPDATE, DELETE ON jobs TO authenticated;
-- GRANT USAGE ON SEQUENCE jobs_id_seq TO authenticated;

-- Sample queries for testing:
-- 
-- -- Insert a test job
-- INSERT INTO jobs (user_id, filename, original_name, status) 
-- VALUES ('test-user-123', 'test_document.pdf', 'document.pdf', 'processing');
-- 
-- -- Get user history
-- SELECT * FROM jobs WHERE user_id = 'test-user-123' ORDER BY created_at DESC;
-- 
-- -- Update job status
-- UPDATE jobs SET status = 'completed', extracted_text = 'Sample text' WHERE id = 1;
-- 
-- -- Get user stats
-- SELECT * FROM user_job_stats WHERE user_id = 'test-user-123'; 