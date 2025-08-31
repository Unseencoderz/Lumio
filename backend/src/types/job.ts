export interface JobData {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  filePath: string;
  userId?: string;
  supabaseJobId?: number; // Link to Supabase job record
}

export interface JobProgress {
  id: string;
  status: 'processing' | 'done' | 'failed';
  progress: number; // 0-100
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

export interface OCRResult {
  text: string;
  lines: string[];
  confidence: number;
}

export interface GeminiAnalysisResponse {
  sentiment: {
    label: 'positive' | 'neutral' | 'negative';
    score: number;
  };
  readability: {
    fleschKincaidGrade: number;
    fleschScore: number;
  };
  hashtags: Array<{
    tag: string;
    score: number;
    rationale: string;
  }>;
  emojiSuggestions: string[];
  engagementTips: string[];
  improvedText: {
    twitter: string;
    instagram: string;
    linkedin: string;
  };
}