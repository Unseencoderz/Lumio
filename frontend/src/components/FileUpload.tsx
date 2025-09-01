import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import { Upload, AlertCircle, FileText, Image } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { formatBytes, cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface FileUploadProps {
  onUploadSuccess: (jobId: string, filename: string) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/tiff': ['.tiff', '.tif'],
  'image/bmp': ['.bmp'],
  'image/webp': ['.webp'],
};

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: apiClient.uploadFile,
    onSuccess: (response) => {
      console.log('Upload response:', response); // Debug log
      toast({
        title: 'Upload successful',
        description: `${(selectedFile?.name) || response.filename || 'File'} is now being processed.`,
      });
      onUploadSuccess(response.id, (selectedFile?.name) || response.filename || 'File');
      setSelectedFile(null);
    },
    onError: (error) => {
      console.error('Upload error:', error); // Debug log
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      let message = 'File rejected';
      
      if (rejection.errors.some((e: any) => e.code === 'file-too-large')) {
        message = `File too large. Maximum size is ${formatBytes(MAX_FILE_SIZE)}.`;
      } else if (rejection.errors.some((e: any) => e.code === 'file-invalid-type')) {
        message = 'File type not supported. Please upload a PDF or image file.';
      }
      
      toast({
        title: 'Invalid file',
        description: message,
        variant: 'destructive',
      });
      return;
    }

    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    disabled: uploadMutation.isPending,
  });

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-accent-cyan" />;
    }
    return <Image className="h-8 w-8 text-accent-violet" />;
  };

  return (
    <div className="space-y-4">
      <Card className="card-modern">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300',
              isDragActive 
                ? 'border-accent-cyan bg-accent-cyan/5 shadow-glow-cyan' 
                : 'border-border hover:border-accent-cyan/50 hover:bg-accent-cyan/5',
              uploadMutation.isPending && 'pointer-events-none opacity-50'
            )}
          >
            <input {...getInputProps()} />
            
            {uploadMutation.isPending ? (
              <div className="space-y-2">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-accent-cyan border-t-transparent" />
                <p className="text-sm text-muted">Uploading...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto h-12 w-12 text-muted group-hover:text-accent-cyan transition-colors duration-300">
                  <Upload className="h-full w-full" />
                </div>
                
                {isDragActive ? (
                  <p className="text-lg font-medium text-accent-cyan">Drop the file here</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-text">
                      Drag & drop a file here, or click to select
                    </p>
                    <p className="text-sm text-muted">
                      Supports PDF, JPEG, PNG, TIFF, BMP, WebP (max {formatBytes(MAX_FILE_SIZE)})
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedFile && (
        <Card className="card-modern hover:shadow-glow-accent transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="icon-highlight">
                  {getFileIcon(selectedFile)}
                </div>
                <div>
                  <p className="font-medium text-text">{selectedFile.name}</p>
                  <p className="text-sm text-muted">
                    {formatBytes(selectedFile.size)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeFile}
                  disabled={uploadMutation.isPending}
                  className="border-border hover:bg-surface hover:border-error text-error hover:text-error"
                >
                  Remove
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={uploadMutation.isPending}
                  size="sm"
                  className="btn-glow"
                >
                  Upload
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {uploadMutation.isError && (
        <Card className="card-modern border-error hover:shadow-glow-accent transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-error">
              <div className="icon-highlight">
                <AlertCircle className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium">Upload Error</p>
            </div>
            <p className="mt-1 text-sm text-muted">
              {uploadMutation.error?.message}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}