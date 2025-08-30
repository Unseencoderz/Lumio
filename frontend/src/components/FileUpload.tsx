import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import { Upload, File, AlertCircle } from 'lucide-react';
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
      toast({
        title: 'Upload successful',
        description: `${response.filename} is now being processed.`,
      });
      onUploadSuccess(response.id, response.filename);
      setSelectedFile(null);
    },
    onError: (error) => {
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

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
              uploadMutation.isPending && 'pointer-events-none opacity-50'
            )}
          >
            <input {...getInputProps()} />
            
            {uploadMutation.isPending ? (
              <div className="space-y-2">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto h-12 w-12 text-muted-foreground">
                  <Upload className="h-full w-full" />
                </div>
                
                {isDragActive ? (
                  <p className="text-lg font-medium">Drop the file here</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-lg font-medium">
                      Drag & drop a file here, or click to select
                    </p>
                    <p className="text-sm text-muted-foreground">
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
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <File className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
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
                >
                  Remove
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={uploadMutation.isPending}
                  size="sm"
                >
                  Upload
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {uploadMutation.isError && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm font-medium">Upload Error</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {uploadMutation.error?.message}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}