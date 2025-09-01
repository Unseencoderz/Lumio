import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { apiClient, AnalysisResult } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  copyToClipboard, 
  getSentimentColor, 
  getSentimentIcon 
} from '@/lib/utils';
import {
  Sparkles,
  Copy,
  Hash,
  Heart,
  TrendingUp,
  MessageCircle,
  Share2,
  Users,
  Loader2,
  Zap,
} from 'lucide-react';

const analyzeSchema = z.object({
  text: z.string()
    .min(10, 'Text must be at least 10 characters long')
    .max(50000, 'Text must not exceed 50,000 characters'),
  targets: z.array(z.enum(['twitter', 'instagram', 'linkedin'])).default(['twitter', 'instagram', 'linkedin']),
});

type AnalyzeForm = z.infer<typeof analyzeSchema>;

export function AnalyzePage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const form = useForm<AnalyzeForm>({
    resolver: zodResolver(analyzeSchema),
    defaultValues: {
      text: '',
      targets: ['twitter', 'instagram', 'linkedin'],
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: apiClient.analyzeText,
    onSuccess: (response) => {
      setResult(response.analysis);
      toast({
        title: 'Analysis complete',
        description: 'Your text has been analyzed successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Analysis failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const hashtagMutation = useMutation({
    mutationFn: apiClient.generateHashtags,
    onSuccess: (response) => {
      toast({
        title: 'Hashtags generated',
        description: `Generated ${response.hashtags.length} hashtags.`,
      });
      // You could update the UI to show just hashtags here
    },
    onError: (error) => {
      toast({
        title: 'Hashtag generation failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: AnalyzeForm) => {
    analyzeMutation.mutate(data);
  };

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

  const handleHashtagOnly = () => {
    const text = form.getValues('text');
    if (text.trim()) {
      hashtagMutation.mutate(text);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="h-6 w-6 text-accent-cyan" />
          <h1 className="text-3xl font-bold text-text">Direct Text Analysis</h1>
        </div>
        <p className="text-lg text-muted">
          Paste your text directly and get instant AI-powered analysis and optimization.
        </p>
      </div>

      {/* Input Form */}
      <Card className="card-modern border-border/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-text">Text Input</CardTitle>
          <CardDescription className="text-muted">
            Enter or paste your text below for analysis (10 - 50,000 characters).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Textarea
                {...form.register('text')}
                placeholder="Paste your text here..."
                className="min-h-[200px] resize-y border-border/50 focus:border-accent-cyan transition-colors duration-300"
                disabled={analyzeMutation.isPending}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-muted">
                  {form.watch('text')?.length || 0} / 50,000 characters
                </p>
                {form.formState.errors.text && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.text.message}
                  </p>
                )}
              </div>
            </div>

            {/* Platform Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text">Target Platforms</label>
              <div className="flex space-x-2">
                {['twitter', 'instagram', 'linkedin'].map((platform) => (
                  <Badge
                    key={platform}
                    variant={
                      form.watch('targets').includes(platform as any) 
                        ? 'default' 
                        : 'outline'
                    }
                    className={`cursor-pointer transition-all duration-300 ${
                      form.watch('targets').includes(platform as any)
                        ? 'bg-accent-gradient text-white border-0'
                        : 'border-border/50 hover:bg-surface/50 hover:border-accent-cyan'
                    }`}
                    onClick={() => {
                      const current = form.getValues('targets');
                      const updated = current.includes(platform as any)
                        ? current.filter(p => p !== platform)
                        : [...current, platform as any];
                      form.setValue('targets', updated);
                    }}
                  >
                    {platform === 'twitter' && <MessageCircle className="h-3 w-3 mr-1" />}
                    {platform === 'instagram' && <Share2 className="h-3 w-3 mr-1" />}
                    {platform === 'linkedin' && <Users className="h-3 w-3 mr-1" />}
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                type="submit"
                disabled={analyzeMutation.isPending || !form.watch('text')?.trim()}
                className="flex-1 bg-gradient-to-r from-accent-cyan to-accent-violet text-white border-0 shadow-glow-cyan hover:shadow-glow-accent transition-all duration-300 hover:scale-105"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Full Analysis
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleHashtagOnly}
                disabled={hashtagMutation.isPending || !form.watch('text')?.trim()}
                className="border-border/50 hover:bg-surface/50 hover:border-accent-cyan transition-all duration-300"
              >
                {hashtagMutation.isPending ? (
                  <Loader2 className="h-4 w-4" />
                ) : (
                  <Hash className="h-4 w-4" />
                )}
                Hashtags Only
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Sentiment */}
            <Card className="card-modern border-border/30 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2 text-text">
                  <Heart className="h-4 w-4 text-accent-cyan" />
                  <span>Sentiment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <span className="text-xl">
                    {getSentimentIcon(result.sentiment.label)}
                  </span>
                  <div>
                    <p className={`font-medium capitalize ${getSentimentColor(result.sentiment.label)}`}>
                      {result.sentiment.label}
                    </p>
                    <p className="text-xs text-muted">
                      {result.sentiment.score.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Engagement */}
            <Card className="card-modern border-border/30 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2 text-text">
                  <TrendingUp className="h-4 w-4 text-accent-violet" />
                  <span>Engagement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-text">
                    {Math.round(result.engagementScore * 100)}%
                  </div>
                  <div className="w-full bg-surface rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-accent-cyan to-accent-violet h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${result.engagementScore * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reading Grade */}
            <Card className="card-modern border-border/30 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-text">Reading Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-text">
                    Grade {result.readingGrade}
                  </div>
                  <p className="text-xs text-muted">
                    {result.wordCount} words
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabbed Content */}
          <Tabs defaultValue="social" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-surface/50 border border-border/30 backdrop-blur-sm">
              <TabsTrigger 
                value="social" 
                className="data-[state=active]:bg-accent-gradient data-[state=active]:text-white data-[state=active]:border-0 transition-all duration-300"
              >
                Social Media
              </TabsTrigger>
              <TabsTrigger 
                value="hashtags" 
                className="data-[state=active]:bg-accent-gradient data-[state=active]:text-white data-[state=active]:border-0 transition-all duration-300"
              >
                Hashtags & Emojis
              </TabsTrigger>
              <TabsTrigger 
                value="tips" 
                className="data-[state=active]:bg-accent-gradient data-[state=active]:text-white data-[state=active]:border-0 transition-all duration-300"
              >
                Engagement Tips
              </TabsTrigger>
            </TabsList>

            {/* Social Media Tab */}
            <TabsContent value="social" className="space-y-4">
              {form.watch('targets').includes('twitter') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      <span>Twitter/X</span>
                      <Badge variant="outline">{result.improvedText.twitter.length}/280</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Textarea
                        value={result.improvedText.twitter}
                        readOnly
                        className="min-h-[80px] resize-none"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleCopy(result.improvedText.twitter, 'Twitter post')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {form.watch('targets').includes('instagram') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Share2 className="h-4 w-4 text-pink-500" />
                      <span>Instagram</span>
                      <Badge variant="outline">{result.improvedText.instagram.length}/2200</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Textarea
                        value={result.improvedText.instagram}
                        readOnly
                        className="min-h-[120px] resize-none"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleCopy(result.improvedText.instagram, 'Instagram post')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {form.watch('targets').includes('linkedin') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-700" />
                      <span>LinkedIn</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Textarea
                        value={result.improvedText.linkedin}
                        readOnly
                        className="min-h-[150px] resize-none"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleCopy(result.improvedText.linkedin, 'LinkedIn post')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Hashtags & Emojis Tab */}
            <TabsContent value="hashtags" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Hash className="h-4 w-4" />
                    <span>Suggested Hashtags</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(result.hashtags || []).map((hashtag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => handleCopy(hashtag.tag, 'Hashtag')}
                      >
                        {hashtag.tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(
                      (result.hashtags || []).map(h => h.tag).join(' '),
                      'All hashtags'
                    )}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All Hashtags
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emoji Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    {result.emojiSuggestions.map((emoji, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-lg"
                        onClick={() => handleCopy(emoji, 'Emoji')}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tips Tab */}
            <TabsContent value="tips">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <span>Engagement Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.engagementTips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}