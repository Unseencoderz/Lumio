import { useJobPolling } from '@/hooks/useJobPolling';
import { formatDuration } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

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
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading job status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    switch (jobStatus.status) {
      case 'done':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Loader2 className="h-5 w-5 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (jobStatus.status) {
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Processing Document</CardTitle>
          <Badge className={getStatusColor()}>
            <div className="flex items-center space-x-1">
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">{filename}</span>
            <span className="text-muted-foreground">{jobStatus.progress}%</span>
          </div>
          <Progress value={jobStatus.progress} className="h-2" />
        </div>

        {jobStatus.message && (
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
            {jobStatus.message}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Job ID: {jobId}</span>
          {jobStatus.status === 'processing' && (
            <div className="flex items-center space-x-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Processing...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}