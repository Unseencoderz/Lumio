import { useJobPolling } from '@/hooks/useJobPolling';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Loader2, Sparkles, Zap, FileText } from 'lucide-react';

interface JobProgressProps {
  jobId: string;
  filename: string;
  onComplete: () => void;
  onError: (error: string) => void;
}

export function JobProgress({ jobId, filename, onComplete, onError }: JobProgressProps) {
  const { data: jobStatus, error, isError } = useJobPolling(jobId);

  // Handle job completion
  if (jobStatus?.status === 'done') {
    setTimeout(onComplete, 500); // Small delay for better UX
  }

  // Handle job failure
  if (jobStatus?.status === 'failed' || isError) {
    const errorMessage = jobStatus?.message || error?.message || 'Processing failed';
    setTimeout(() => onError(errorMessage), 500);
  }

  if (!jobStatus) {
    return (
      <Card className="card-modern border-border/30 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-cyan/20 to-accent-violet/20 rounded-full flex items-center justify-center border border-accent-cyan/30">
                <Loader2 className="h-8 w-8 text-accent-cyan animate-spin" />
              </div>
              <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-accent-cyan/10 to-accent-violet/10 rounded-full animate-ping"></div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-text mb-2">Initializing Processing</h3>
              <p className="text-muted">Setting up your document for AI analysis...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    switch (jobStatus.status) {
      case 'done':
        return <CheckCircle className="h-6 w-6 text-success" />;
      case 'failed':
        return <XCircle className="h-6 w-6 text-destructive" />;
      case 'processing':
        return <Clock className="h-6 w-6 text-accent-cyan" />;
      default:
        return <Loader2 className="h-6 w-6 text-accent-violet animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (jobStatus.status) {
      case 'done':
        return 'bg-success/20 text-success border-success/30';
      case 'failed':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'processing':
        return 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30';
      default:
        return 'bg-accent-violet/20 text-accent-violet border-accent-violet/30';
    }
  };

  const getStatusText = () => {
    switch (jobStatus.status) {
      case 'done':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'processing':
        return 'Processing';
      default:
        return 'Unknown';
    }
  };

  const getProgressColor = () => {
    if (jobStatus.status === 'done') return 'bg-success';
    if (jobStatus.status === 'failed') return 'bg-destructive';
    return 'bg-gradient-to-r from-accent-cyan to-accent-violet';
  };

  return (
    <Card className="card-modern border-border/30 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/5 via-accent-violet/5 to-success/5 opacity-50"></div>
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-cyan/20 to-accent-violet/20 rounded-full flex items-center justify-center border border-accent-cyan/30">
                <Zap className="h-5 w-5 text-accent-cyan" />
              </div>
              {jobStatus.status === 'processing' && (
                <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-accent-cyan/20 to-accent-violet/20 rounded-full animate-ping"></div>
              )}
            </div>
            <div>
              <CardTitle className="text-xl text-text">Processing Document</CardTitle>
              <p className="text-sm text-muted">AI-powered content analysis in progress</p>
            </div>
          </div>
          <Badge className={`${getStatusColor()} border backdrop-blur-sm`}>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="font-medium">{getStatusText()}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-6">
        <div>
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="font-medium text-text flex items-center space-x-2">
              <FileText className="h-4 w-4 text-muted" />
              {filename}
            </span>
            <span className="text-muted font-mono">{jobStatus.progress}%</span>
          </div>
          <div className="relative">
            <Progress 
              value={jobStatus.progress} 
              className={`h-3 ${getProgressColor()}`}
            />
            {jobStatus.status === 'processing' && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            )}
          </div>
        </div>

        {jobStatus.message && (
          <div className="bg-surface/50 p-4 rounded-lg border border-border/30 backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <Sparkles className="h-5 w-5 text-accent-cyan mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-text font-medium mb-1">Processing Update</p>
                <p className="text-sm text-muted">{jobStatus.message}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted bg-surface/30 p-3 rounded-lg border border-border/20">
          <span className="font-mono">Job ID: {jobId}</span>
          {jobStatus.status === 'processing' && (
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-accent-violet rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-success rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span>Processing...</span>
            </div>
          )}
        </div>

        {/* Processing Steps */}
        {jobStatus.status === 'processing' && (
          <div className="grid grid-cols-3 gap-4">
            <div className={`text-center p-3 rounded-lg transition-all duration-300 ${
              jobStatus.progress >= 25 ? 'bg-accent-cyan/20 border border-accent-cyan/30' : 'bg-surface/30 border border-border/20'
            }`}>
              <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                jobStatus.progress >= 25 ? 'bg-accent-cyan text-white' : 'bg-surface text-muted'
              }`}>
                {jobStatus.progress >= 25 ? <CheckCircle className="h-4 w-4" /> : <span className="text-xs">1</span>}
              </div>
              <p className="text-xs font-medium text-text">Text Extraction</p>
            </div>
            
            <div className={`text-center p-3 rounded-lg transition-all duration-300 ${
              jobStatus.progress >= 50 ? 'bg-accent-violet/20 border border-accent-violet/30' : 'bg-surface/30 border border-border/20'
            }`}>
              <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                jobStatus.progress >= 50 ? 'bg-accent-violet text-white' : 'bg-surface text-muted'
              }`}>
                {jobStatus.progress >= 50 ? <CheckCircle className="h-4 w-4" /> : <span className="text-xs">2</span>}
              </div>
              <p className="text-xs font-medium text-text">AI Analysis</p>
            </div>
            
            <div className={`text-center p-3 rounded-lg transition-all duration-300 ${
              jobStatus.progress >= 75 ? 'bg-success/20 border border-success/30' : 'bg-surface/30 border border-border/20'
            }`}>
              <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                jobStatus.progress >= 75 ? 'bg-success text-white' : 'bg-surface text-muted'
              }`}>
                {jobStatus.progress >= 75 ? <CheckCircle className="h-4 w-4" /> : <span className="text-xs">3</span>}
              </div>
              <p className="text-xs font-medium text-text">Content Generation</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}