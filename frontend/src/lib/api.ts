import axios from 'axios';
import { auth } from './firebase';

export interface JobProgress {
  id: string;
  status: 'processing' | 'done' | 'failed';
  progress: number;
  message?: string;
}

export interface AnalysisResult {
  wordCount: number;
  readingGrade: number;
  sentiment: {
    label: 'positive' | 'neutral' | 'negative';
    score: number;
  };
  hashtags: Array<{
    tag: string;
    score: number;
    rationale?: string;
  }>;
  emojiSuggestions: string[];
  engagementScore: number;
  engagementTips: string[];
  improvedText: {
    twitter: string;
    instagram: string;
    linkedin: string;
  };
}

export interface JobResult {
  id: string;
  filename: string;
  extractedText: string;
  analysis: AnalysisResult;
  meta: {
    engine: 'gemini-pro' | 'tesseract';
    processingTimeMs: number;
    piiDetected?: boolean;
    partialProcessing?: boolean;
    pagesProcessed?: number;
    totalPages?: number;
  };
}

export interface UploadResponse {
  id: string;
  filename: string;
  size: number;
  status: 'processing';
}

export interface AnalyzeRequest {
  text: string;
  targets?: ('twitter' | 'instagram' | 'linkedin')[];
}

export interface AnalyzeResponse {
  analysis: AnalysisResult;
}

export interface HashtagResponse {
  hashtags: Array<{
    tag: string;
    rationale: string;
  }>;
}

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Add authentication token if user is logged in
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.warn('Failed to get authentication token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    throw new Error(error.message || 'An unexpected error occurred');
  }
);

export const apiClient = {
  // Upload file
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Get job status
  getJobStatus: async (jobId: string): Promise<JobProgress> => {
    const response = await api.get<JobProgress>(`/status/${jobId}`);
    return response.data;
  },

  // Get job result
  getJobResult: async (jobId: string): Promise<JobResult> => {
    const response = await api.get<JobResult>(`/result/${jobId}`);
    return response.data;
  },

  // Delete job
  deleteJob: async (jobId: string): Promise<void> => {
    await api.delete(`/job/${jobId}`);
  },

  // Analyze text directly
  analyzeText: async (request: AnalyzeRequest): Promise<AnalyzeResponse> => {
    const response = await api.post<AnalyzeResponse>('/analyze', request);
    return response.data;
  },

  // Generate hashtags only
  generateHashtags: async (text: string): Promise<HashtagResponse> => {
    const response = await api.post<HashtagResponse>('/hashtags', { text });
    return response.data;
  },

  // Get queue stats
  getQueueStats: async () => {
    const response = await api.get('/queue/stats');
    return response.data;
  },

  // Save analysis to history
  saveAnalysis: async (analysisData: any) => {
    const response = await api.post('/history', analysisData);
    return response.data;
  },

  // Get analysis history
  getHistory: async (page = 1, limit = 10) => {
    const response = await api.get(`/history?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Delete analysis from history
  deleteAnalysis: async (id: string) => {
    await api.delete(`/history/${id}`);
  },
};