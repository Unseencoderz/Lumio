import { useQuery } from '@tanstack/react-query';
import { apiClient, JobProgress, JobResult } from '@/lib/api';

type ApiError = Error & {
  response?: {
    status: number;
  };
};

export const useJobPolling = (jobId: string | null, enabled: boolean = true) => {
  return useQuery<JobProgress, ApiError>({
    queryKey: ['job-status', jobId],
    queryFn: () => apiClient.getJobStatus(jobId!),
    enabled: enabled && !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && (data.status === 'done' || data.status === 'failed')) {
        return false;
      }
      return 2000;
    },
    refetchIntervalInBackground: false,
    retry: (failureCount, error) => {
      if (error.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useJobResult = (jobId: string | null, enabled: boolean = true) => {
  return useQuery<JobResult, ApiError>({
    queryKey: ['job-result', jobId],
    queryFn: () => apiClient.getJobResult(jobId!),
    enabled: enabled && !!jobId,
    retry: (failureCount, error) => {
      if (error.response?.status === 404 || error.response?.status === 202) {
        return false;
      }
      return failureCount < 3;
    },
  });
};