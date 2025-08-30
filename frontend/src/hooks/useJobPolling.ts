import { useQuery } from '@tanstack/react-query';
import { apiClient, JobProgress, JobResult } from '@/lib/api';

export const useJobPolling = (jobId: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['job-status', jobId],
    queryFn: () => apiClient.getJobStatus(jobId!),
    enabled: enabled && !!jobId,
    refetchInterval: (data) => {
      // Stop polling if job is done or failed
      if (data?.status === 'done' || data?.status === 'failed') {
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
    refetchIntervalInBackground: false,
    retry: (failureCount, error) => {
      // Don't retry if job not found
      if (error.message.includes('Job not found')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useJobResult = (jobId: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['job-result', jobId],
    queryFn: () => apiClient.getJobResult(jobId!),
    enabled: enabled && !!jobId,
    retry: (failureCount, error) => {
      // Don't retry if job not found or still processing
      if (error.message.includes('Job not found') || 
          error.message.includes('still processing')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};