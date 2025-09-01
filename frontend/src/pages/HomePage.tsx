import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { JobProgress } from '@/components/JobProgress';
import { ResultsPanel } from '@/components/ResultsPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { 
  FileText, 
  Sparkles, 
  Zap, 
  Target,
  Upload,
  BarChart3,
  MessageCircle,
  Hash
} from 'lucide-react';

type ProcessingState = 'upload' | 'processing' | 'completed' | 'error';

interface JobInfo {
  id: string;
  filename: string;
}

export function HomePage() {
  const [state, setState] = useState<ProcessingState>('upload');
  const [currentJob, setCurrentJob] = useState<JobInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUploadSuccess = (jobId: string, filename: string) => {
    setCurrentJob({ id: jobId, filename });
    setState('processing');
    setError(null);
  };

  const handleJobComplete = () => {
    setState('completed');
  };

  const handleJobError = (errorMessage: string) => {
    setState('error');
    setError(errorMessage);
  };

  const handleStartOver = () => {
    setState('upload');
    setCurrentJob(null);
    setError(null);
  };

  const features = [
    {
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      title: 'Smart Text Extraction',
      description: 'Extract text from PDFs and images using advanced AI-powered OCR technology.',
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-green-500" />,
      title: 'Content Analysis',
      description: 'Get detailed insights on readability, sentiment, and engagement potential.',
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-purple-500" />,
      title: 'Platform Optimization',
      description: 'Generate optimized content for Twitter, Instagram, and LinkedIn.',
    },
    {
      icon: <Hash className="h-6 w-6 text-orange-500" />,
      title: 'Smart Hashtags',
      description: 'AI-generated hashtags with relevance scores and rationale.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      

      {/* Main Content */}
      <div className="space-y-6">
        {state === 'upload' && (
          <>
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            
            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      {feature.icon}
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* How It Works */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>How It Works</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">1. Upload</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload your PDF or image file (up to 10MB)
                    </p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">2. Process</h3>
                    <p className="text-sm text-muted-foreground">
                      AI extracts text and analyzes content for optimization
                    </p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">3. Optimize</h3>
                    <p className="text-sm text-muted-foreground">
                      Get platform-specific content ready for social media
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {state === 'processing' && currentJob && (
          <JobProgress
            jobId={currentJob.id}
            filename={currentJob.filename}
            onComplete={handleJobComplete}
            onError={handleJobError}
          />
        )}

        {state === 'completed' && currentJob && (
          <>
            <ResultsPanel
              jobId={currentJob.id}
              filename={currentJob.filename}
            />
            
            <div className="text-center">
              <button
                onClick={handleStartOver}
                className="text-primary hover:text-primary/80 text-sm underline"
              >
                Process another document
              </button>
            </div>
          </>
        )}

        {state === 'error' && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Processing Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {error || 'An unexpected error occurred during processing.'}
              </p>
              <button
                onClick={handleStartOver}
                className="text-primary hover:text-primary/80 text-sm underline"
              >
                Try again
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}