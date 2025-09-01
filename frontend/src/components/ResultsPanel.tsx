import { useState } from 'react';
import { useJobResult } from '@/hooks/useJobPolling';
import { 
  copyToClipboard, 
  formatDuration, 
  getSentimentColor, 
  getSentimentIcon
} from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Copy,
  Download,
  Edit3,
  Eye,
  Hash,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Users,
  Zap,
  Brain
} from 'lucide-react';

interface ResultsPanelProps {
  jobId: string;
  filename: string;
}

export function ResultsPanel({ jobId, filename }: ResultsPanelProps) {
  const { data: result, isLoading, error } = useJobResult(jobId);
  const [editableText, setEditableText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  if (isLoading) {
    return (
      <Card className="card-modern">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent-cyan border-t-transparent" />
            <span className="text-sm text-muted">Loading results...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="card-modern border-error hover:shadow-glow-accent transition-all duration-300">
        <CardContent className="p-6">
          <div className="text-center text-error">
            <p className="font-medium">Failed to load results</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  const handleCopy = async (text: string, label: string) => {
    try {
      await copyToClipboard(text);
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = () => {
    setEditableText(result.extractedText);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    // In a real app, you might want to re-analyze the edited text
    setIsEditing(false);
    toast({
      title: 'Text updated',
      description: 'Your changes have been saved.',
    });
  };

  const handleDownload = () => {
    const content = {
      filename,
      extractedText: result.extractedText,
      analysis: result.analysis,
      meta: result.meta,
    };
    
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/\.[^/.]+$/, '')}_analysis.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Downloaded',
      description: 'Analysis results downloaded successfully.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="card-modern hover:shadow-glow-accent transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <div className="icon-highlight">
                <Brain className="h-5 w-5 text-accent-cyan" />
              </div>
              <span className="text-text">Analysis Results</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleDownload} className="border-border hover:bg-surface hover:border-accent-cyan">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted">Engine</p>
              <p className="font-medium capitalize text-text">
                {result.meta.engine === 'gemini-pro' ? 'Gemini Pro' : 
                 result.meta.engine === 'tesseract' ? 'Tesseract' : 
                 String(result.meta.engine).replace('-', ' ')}
              </p>
            </div>
            <div>
              <p className="text-muted">Processing Time</p>
              <p className="font-medium text-text">{formatDuration(result.meta.processingTimeMs)}</p>
            </div>
            <div>
              <p className="text-muted">Word Count</p>
              <p className="font-medium text-text">{result.analysis.wordCount}</p>
            </div>
            <div>
              <p className="text-muted">Reading Grade</p>
              <p className="font-medium text-text">{result.analysis.readingGrade}</p>
            </div>
          </div>
          
          {result.meta.piiDetected && (
            <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-md">
              <p className="text-sm text-warning">
                ⚠️ PII detected and redacted in the extracted text.
              </p>
            </div>
          )}
          
          {result.meta.partialProcessing && (
            <div className="mt-4 p-3 bg-accent-cyan/10 border border-accent-cyan/20 rounded-md">
              <p className="text-sm text-accent-cyan">
                📄 Processed {result.meta.pagesProcessed} of {result.meta.totalPages} pages.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-surface border border-border">
          <TabsTrigger value="overview" className="data-[state=active]:bg-accent-gradient data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-accent-gradient data-[state=active]:text-white">Content</TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-accent-gradient data-[state=active]:text-white">Social Media</TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-accent-gradient data-[state=active]:text-white">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Sentiment Analysis */}
            <Card className="card-modern hover:shadow-glow-accent transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <div className="icon-highlight">
                    <Heart className="h-4 w-4 text-accent-violet" />
                  </div>
                  <span className="text-text">Sentiment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {getSentimentIcon(result.analysis.sentiment.label)}
                  </span>
                  <div>
                    <p className={`font-medium capitalize ${getSentimentColor(result.analysis.sentiment.label)}`}>
                      {result.analysis.sentiment.label}
                    </p>
                    <p className="text-sm text-muted">
                      Score: {result.analysis.sentiment.score.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Engagement Score */}
            <Card className="card-modern hover:shadow-glow-accent transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <div className="icon-highlight">
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                  <span className="text-text">Engagement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-text">
                      {Math.round(result.analysis.engagementScore * 100)}%
                    </span>
                    <Badge variant={result.analysis.engagementScore > 0.7 ? 'default' : 'secondary'} className="bg-accent-gradient text-white border-0">
                      {result.analysis.engagementScore > 0.7 ? 'High' : 
                       result.analysis.engagementScore > 0.4 ? 'Medium' : 'Low'}
                    </Badge>
                  </div>
                  <div className="w-full bg-surface rounded-full h-2 border border-border">
                    <div 
                      className="bg-accent-gradient h-2 rounded-full transition-all duration-300"
                      style={{ width: `${result.analysis.engagementScore * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Tips */}
          <Card className="card-modern hover:shadow-glow-accent transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <div className="icon-highlight">
                  <Zap className="h-4 w-4 text-accent-cyan" />
                </div>
                <span className="text-text">Engagement Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.analysis.engagementTips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-accent-cyan mt-1">•</span>
                    <span className="text-sm text-text">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card className="card-modern hover:shadow-glow-accent transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <div className="icon-highlight">
                    <Eye className="h-4 w-4 text-accent-violet" />
                  </div>
                  <span className="text-text">Extracted Text</span>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isEditing ? handleSaveEdit : handleEdit}
                  className="border-border hover:bg-surface hover:border-accent-cyan"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  {isEditing ? 'Save' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editableText}
                  onChange={(e) => setEditableText(e.target.value)}
                  className="min-h-[300px] font-mono text-sm bg-surface border-border text-text"
                  placeholder="Edit your text here..."
                />
              ) : (
                <div className="relative">
                  <pre className="whitespace-pre-wrap text-sm bg-surface p-4 rounded-md max-h-96 overflow-y-auto text-text border border-border">
                    {result.extractedText}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 border-border hover:bg-surface hover:border-accent-cyan"
                    onClick={() => handleCopy(result.extractedText, 'Extracted text')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hashtags */}
          <Card className="card-modern hover:shadow-glow-accent transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="icon-highlight">
                  <Hash className="h-4 w-4 text-success" />
                </div>
                <span className="text-text">Suggested Hashtags</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(result.analysis.hashtags || []).map((hashtag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent-gradient hover:text-white border-border hover:border-accent-cyan transition-all duration-300"
                    onClick={() => handleCopy(hashtag.tag, 'Hashtag')}
                  >
                    {hashtag.tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border hover:bg-surface hover:border-accent-cyan"
                  onClick={() => handleCopy(
                    (result.analysis.hashtags || []).map(h => h.tag).join(' '),
                    'All hashtags'
                  )}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All Hashtags
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emoji Suggestions */}
          <Card className="card-modern hover:shadow-glow-accent transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-text">Emoji Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                {result.analysis.emojiSuggestions.map((emoji, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-lg border-border hover:bg-surface hover:border-accent-violet"
                    onClick={() => handleCopy(emoji, 'Emoji')}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-4">
          {/* Twitter */}
          <Card className="card-modern hover:shadow-glow-accent transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="icon-highlight">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                </div>
                <span className="text-text">Twitter/X</span>
                <Badge variant="outline" className="border-border">{result.analysis.improvedText.twitter.length}/280</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Textarea
                  value={result.analysis.improvedText.twitter}
                  readOnly
                  className="min-h-[100px] resize-none bg-surface border-border text-text"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 border-border hover:bg-surface hover:border-accent-cyan"
                  onClick={() => handleCopy(result.analysis.improvedText.twitter, 'Twitter post')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Instagram */}
          <Card className="card-modern hover:shadow-glow-accent transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="icon-highlight">
                  <Share2 className="h-4 w-4 text-pink-500" />
                </div>
                <span className="text-text">Instagram</span>
                <Badge variant="outline" className="border-border">{result.analysis.improvedText.instagram.length}/2200</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Textarea
                  value={result.analysis.improvedText.instagram}
                  readOnly
                  className="min-h-[150px] resize-none bg-surface border-border text-text"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 border-border hover:bg-surface hover:border-accent-cyan"
                  onClick={() => handleCopy(result.analysis.improvedText.instagram, 'Instagram post')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* LinkedIn */}
          <Card className="card-modern hover:shadow-glow-accent transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="icon-highlight">
                  <Users className="h-4 w-4 text-blue-700" />
                </div>
                <span className="text-text">LinkedIn</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Textarea
                  value={result.analysis.improvedText.linkedin}
                  readOnly
                  className="min-h-[200px] resize-none bg-surface border-border text-text"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 border-border hover:bg-surface hover:border-accent-cyan"
                  onClick={() => handleCopy(result.analysis.improvedText.linkedin, 'LinkedIn post')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="card-modern hover:shadow-glow-accent transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-text">Content Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted">Word Count:</span>
                  <span className="font-medium text-text">{result.analysis.wordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Reading Grade:</span>
                  <span className="font-medium text-text">{result.analysis.readingGrade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Engagement Score:</span>
                  <span className="font-medium text-text">
                    {Math.round(result.analysis.engagementScore * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Hashtags Generated:</span>
                  <span className="font-medium text-text">{result.analysis.hashtags.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern hover:shadow-glow-accent transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-text">Processing Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted">AI Engine:</span>
                  <span className="font-medium text-text capitalize">
                    {result.meta.engine === 'gemini-pro' ? 'Gemini Pro' : 
                     result.meta.engine === 'tesseract' ? 'Tesseract' : 
                     String(result.meta.engine).replace('-', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Processing Time:</span>
                  <span className="font-medium text-text">
                    {formatDuration(result.meta.processingTimeMs)}
                  </span>
                </div>
                {result.meta.totalPages && (
                  <div className="flex justify-between">
                    <span className="text-muted">Pages Processed:</span>
                    <span className="font-medium text-text">
                      {result.meta.pagesProcessed}/{result.meta.totalPages}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted">PII Detected:</span>
                  <span className="font-medium text-text">
                    {result.meta.piiDetected ? 'Yes' : 'No'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Hashtags with Rationale */}
          <Card className="card-modern hover:shadow-glow-accent transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-text">Hashtag Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(result.analysis.hashtags || []).slice(0, 5).map((hashtag, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="border-border">{hashtag.tag}</Badge>
                        <span className="text-sm font-medium text-text">
                          Score: {Number(hashtag.score ?? 0).toFixed(2)}
                        </span>
                      </div>
                      {hashtag.rationale && (
                        <p className="text-sm text-muted mt-1">
                          {hashtag.rationale}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted hover:text-accent-cyan hover:bg-accent-cyan/10"
                      onClick={() => handleCopy(hashtag.tag, 'Hashtag')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}