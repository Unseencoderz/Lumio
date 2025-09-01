import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { 
  FileText, 
  Eye, 
  Clock,
  CheckCircle,
  XCircle,
  Trash2,

} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

interface JobHistoryItem {
  id: number;
  filename: string;
  original_name: string;
  created_at: string;
  updated_at: string;
  status: 'processing' | 'completed' | 'failed';
  storage_path?: string;
  extracted_text?: string;
  analysis?: any;
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

interface HistoryResponse {
  jobs: JobHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface HistoryListProps {
  onJobSelect?: (job: JobHistoryItem) => void;
}

export function HistoryList({ onJobSelect }: HistoryListProps) {
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const {
    data: historyData,
    isLoading,
    error,
    refetch,
  } = useQuery<HistoryResponse>({
    queryKey: ['history', page],
    queryFn: () => apiClient.getHistory(page),
    staleTime: 30000, // 30 seconds
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      processing: 'secondary',
      completed: 'default',
      failed: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleDeleteJob = async (jobId: number, filename: string) => {
    try {
      await apiClient.deleteHistoryItem(jobId);
      toast({
        title: 'Job deleted',
        description: `${filename} has been removed from your history.`,
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Failed to delete the job from your history.',
        variant: 'destructive',
      });
    }
  };

  const handleViewJob = (job: JobHistoryItem) => {
    if (onJobSelect) {
      onJobSelect(job);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-surface/30 rounded w-1/3"></div>
                <div className="h-6 bg-surface/30 rounded w-20"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-surface/30 rounded w-1/4"></div>
                <div className="h-3 bg-surface/30 rounded w-1/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-destructive/30 bg-destructive/10">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-destructive">
            <XCircle className="h-5 w-5" />
            <div>
              <p className="font-medium">Failed to load history</p>
              <p className="text-sm text-destructive/90">
                {error instanceof Error ? error.message : 'An unknown error occurred'}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            className="mt-4"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!historyData?.jobs || historyData.jobs.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text mb-2">
              No history yet
            </h3>
            <p className="text-muted mb-4">
              Upload a document or analyze some text to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success state with data
  return (
    <div className="space-y-4">
      {/* Job Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-text">Your Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {historyData.pagination.total}
              </div>
              <div className="text-sm text-muted">Total Jobs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {historyData.jobs.filter(j => j.status === 'completed').length}
              </div>
              <div className="text-sm text-muted">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {historyData.jobs.filter(j => j.status === 'processing').length}
              </div>
              <div className="text-sm text-muted">Processing</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {historyData.jobs.filter(j => j.status === 'failed').length}
              </div>
              <div className="text-sm text-muted">Failed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job List */}
      {historyData.jobs.map((job) => (
        <Card key={job.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted" />
                <div>
                  <h3 className="font-medium text-text truncate max-w-xs">
                    {job.original_name}
                  </h3>
                  <p className="text-sm text-muted">
                    {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(job.status)}
                {getStatusBadge(job.status)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted">
                {job.meta && (
                  <div className="space-y-1">
                    <div>Engine: {job.meta.engine}</div>
                    {job.meta.processingTimeMs && (
                      <div>
                        Processing time: {Math.round(job.meta.processingTimeMs / 1000)}s
                      </div>
                    )}
                    {job.meta.pagesProcessed && job.meta.totalPages && (
                      <div>
                        Pages: {job.meta.pagesProcessed}/{job.meta.totalPages}
                      </div>
                    )}
                  </div>
                )}
                {job.error_message && (
                  <div className="text-destructive text-xs mt-1">
                    Error: {job.error_message}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {job.status === 'completed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewJob(job)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteJob(job.id, job.original_name)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Pagination */}
      {historyData.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={!historyData.pagination.hasPrev}
          >
            Previous
          </Button>
          
          <span className="text-sm text-muted">
            Page {historyData.pagination.page} of {historyData.pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={!historyData.pagination.hasNext}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
