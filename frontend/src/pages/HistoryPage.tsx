import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';
import { 
  History, 
  FileText, 
  Trash2, 
  Eye, 
  Calendar,
  BarChart3,
  Hash,
  MessageCircle,
  Users,
  Share2,
  Copy
} from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

interface AnalysisHistory {
  id: string;
  filename: string;
  createdAt: any;
  extractedText: string;
  analysis: {
    wordCount: number;
    sentiment: {
      label: 'positive' | 'neutral' | 'negative';
      score: number;
    };
    hashtags: Array<{
      tag: string;
      score: number;
    }>;
    improvedText: {
      twitter: string;
      instagram: string;
      linkedin: string;
    };
  };
}

export function HistoryPage() {
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<AnalysisHistory | null>(null);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'analyses'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AnalysisHistory[];
      
      setHistory(historyData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'analyses', id));
      toast({
        title: 'Analysis deleted',
        description: 'The analysis has been removed from your history.',
      });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Failed to delete the analysis.',
        variant: 'destructive',
      });
    }
  };

  const handleCopy = async (text: string, platform: string) => {
    try {
      await copyToClipboard(text);
      toast({
        title: 'Copied!',
        description: `${platform} content copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😔';
      default:
        return '😐';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your analysis history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <History className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Analysis History</h1>
            <p className="text-muted-foreground">
              View and manage your previous document analyses
            </p>
          </div>
        </div>
        <Badge variant="secondary">
          {history.length} {history.length === 1 ? 'analysis' : 'analyses'}
        </Badge>
      </div>

      {history.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No analyses yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by uploading a document or analyzing some text to see your history here.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.href = '/dashboard'}>
                <FileText className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/dashboard/analyze'}>
                Analyze Text
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {/* History List */}
          <div className="grid gap-4">
            {history.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{item.filename}</CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(item.createdAt.toDate(), { addSuffix: true })}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {selectedItem?.id === item.id ? 'Hide' : 'View'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Quick Stats */}
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span>{item.analysis.wordCount} words</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className={getSentimentColor(item.analysis.sentiment.label)}>
                        {getSentimentIcon(item.analysis.sentiment.label)}
                      </span>
                      <span className="capitalize">{item.analysis.sentiment.label}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span>{item.analysis.hashtags.length} hashtags</span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedItem?.id === item.id && (
                    <div className="space-y-6 border-t pt-6">
                      {/* Platform Content */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <Card className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <MessageCircle className="h-4 w-4 text-blue-500" />
                              <span className="font-semibold">Twitter</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(item.analysis.improvedText.twitter, 'Twitter')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {item.analysis.improvedText.twitter}
                          </p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {item.analysis.improvedText.twitter.length}/280
                          </Badge>
                        </Card>

                        <Card className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Share2 className="h-4 w-4 text-pink-500" />
                              <span className="font-semibold">Instagram</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(item.analysis.improvedText.instagram, 'Instagram')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {item.analysis.improvedText.instagram}
                          </p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {item.analysis.improvedText.instagram.length}/2200
                          </Badge>
                        </Card>

                        <Card className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-blue-700" />
                              <span className="font-semibold">LinkedIn</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(item.analysis.improvedText.linkedin, 'LinkedIn')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {item.analysis.improvedText.linkedin}
                          </p>
                        </Card>
                      </div>

                      {/* Hashtags */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center">
                          <Hash className="h-4 w-4 mr-2" />
                          Hashtags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {item.analysis.hashtags.slice(0, 10).map((hashtag, index) => (
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
                      </div>

                      {/* Original Text Preview */}
                      <div>
                        <h4 className="font-semibold mb-3">Original Text</h4>
                        <div className="bg-muted p-4 rounded-md">
                          <p className="text-sm line-clamp-4">
                            {item.extractedText}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}