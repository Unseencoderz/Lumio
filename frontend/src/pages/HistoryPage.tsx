import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { HistoryList } from '@/components/HistoryList';
import { 
  History, 
  FileText, 
  Eye, 
  Copy,
  BarChart3,
  Hash,
  Users,
  Share2
} from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

interface JobHistoryItem {
  id: number;
  filename: string;
  original_name: string;
  created_at: string;
  updated_at: string;
  status: 'processing' | 'completed' | 'failed';
  storage_path?: string;
  extracted_text?: string;
  analysis?: {
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
  };
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

export function HistoryPage() {
  const [selectedJob, setSelectedJob] = useState<JobHistoryItem | null>(null);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const handleJobSelect = (job: JobHistoryItem) => {
    setSelectedJob(job);
  };

  const handleCopyContent = async (content: string, platform: string) => {
    try {
      await copyToClipboard(content);
      toast({
        title: 'Copied!',
        description: `${platform} content copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy content to clipboard.',
        variant: 'destructive',
      });
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <History className="h-16 w-16 text-muted mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text mb-2">
            Sign in to view your history
          </h1>
          <p className="text-muted">
            Your document analysis history will appear here after you sign in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2 flex items-center gap-3">
          <History className="h-8 w-8 text-accent-cyan" />
          Analysis History
        </h1>
        <p className="text-muted">
          View and manage your document analysis history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* History List */}
        <div className="lg:col-span-2">
          <HistoryList onJobSelect={handleJobSelect} />
        </div>

        {/* Job Details Panel */}
        <div className="lg:col-span-1">
          {selectedJob ? (
            <div className="space-y-4 sticky top-4">
              <Card className="card-modern hover:shadow-glow-accent transition-all duration-300 border-border/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-text">
                    <FileText className="h-5 w-5 text-accent-cyan" />
                    Job Details
                  </CardTitle>
                  <CardDescription className="text-muted">
                    {selectedJob.original_name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-text">Status:</span>
                      <div className="mt-1">
                        <Badge 
                          variant={
                            selectedJob.status === 'completed' ? 'default' :
                            selectedJob.status === 'failed' ? 'destructive' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {selectedJob.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-text">Engine:</span>
                      <div className="mt-1 text-muted">
                        {selectedJob.meta?.engine === 'gemini-pro' ? 'Gemini Pro' : 
                         selectedJob.meta?.engine === 'tesseract' ? 'Tesseract' : 
                         selectedJob.meta?.engine || 'Unknown'}
                      </div>
                    </div>
                    {selectedJob.meta?.processingTimeMs && (
                      <div>
                        <span className="font-medium text-text">Processing Time:</span>
                        <div className="mt-1 text-muted">
                          {Math.round(selectedJob.meta.processingTimeMs / 1000)}s
                        </div>
                      </div>
                    )}
                    {selectedJob.analysis?.wordCount && (
                      <div>
                        <span className="font-medium text-text">Word Count:</span>
                        <div className="mt-1 text-muted">
                          {selectedJob.analysis.wordCount.toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedJob.error_message && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <p className="text-sm text-destructive">
                        <strong>Error:</strong> {selectedJob.error_message}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Analysis Results */}
              {selectedJob.status === 'completed' && selectedJob.analysis && (
                <Card className="card-modern hover:shadow-glow-accent transition-all duration-300 border-border/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-text">
                      <BarChart3 className="h-5 w-5 text-accent-violet" />
                      Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Sentiment */}
                    <div>
                      <span className="font-medium text-sm text-text">Sentiment:</span>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge 
                          variant={
                            selectedJob.analysis.sentiment.label === 'positive' ? 'default' :
                            selectedJob.analysis.sentiment.label === 'negative' ? 'destructive' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {selectedJob.analysis.sentiment.label}
                        </Badge>
                        <span className="text-sm text-muted">
                          ({Math.round(selectedJob.analysis.sentiment.score * 100)}%)
                        </span>
                      </div>
                    </div>

                    {/* Reading Grade */}
                    {selectedJob.analysis.readingGrade && (
                      <div>
                        <span className="font-medium text-sm text-text">Reading Grade:</span>
                        <div className="mt-1 text-muted">
                          Grade {selectedJob.analysis.readingGrade.toFixed(1)}
                        </div>
                      </div>
                    )}

                    {/* Engagement Score */}
                    {selectedJob.analysis.engagementScore && (
                      <div>
                        <span className="font-medium text-sm text-text">Engagement Score:</span>
                        <div className="mt-1 text-muted">
                          {Math.round(selectedJob.analysis.engagementScore * 100)}%
                        </div>
                      </div>
                    )}

                    {/* Top Hashtags */}
                    {selectedJob.analysis.hashtags && selectedJob.analysis.hashtags.length > 0 && (
                      <div>
                        <span className="font-medium text-sm flex items-center gap-1 mb-2 text-text">
                          <Hash className="h-4 w-4 text-success" />
                          Top Hashtags:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {selectedJob.analysis.hashtags.slice(0, 5).map((hashtag, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-border/50 hover:bg-accent-gradient hover:text-white hover:border-accent-cyan transition-all duration-300">
                              {hashtag.tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Platform Content */}
              {selectedJob.status === 'completed' && selectedJob.analysis?.improvedText && (
                <Card className="card-modern hover:shadow-glow-accent transition-all duration-300 border-border/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-text">
                      <Share2 className="h-5 w-5 text-accent-cyan" />
                      Platform Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(selectedJob.analysis.improvedText).map(([platform, content]) => (
                      <div key={platform} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm capitalize flex items-center gap-1 text-text">
                            <Users className="h-4 w-4 text-muted" />
                            {platform}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyContent(content, platform)}
                            className="border-border/50 hover:bg-surface/50 hover:border-accent-cyan transition-all duration-300"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <div className="p-3 bg-surface/50 rounded-md text-sm text-text border border-border/30">
                          {content}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="sticky top-4 card-modern hover:shadow-glow-accent transition-all duration-300 border-border/30 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-muted mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text mb-2">
                    Select a job to view details
                  </h3>
                  <p className="text-muted">
                    Click on any job from your history to see detailed analysis results.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}