import { AnalysisResult } from '../types/job';
import { logger } from '../utils/logger';

export class TextAnalysisService {
  // Calculate Flesch-Kincaid reading grade
  static calculateFleschKincaid(text: string): { grade: number; score: number } {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const syllables = words.reduce((total, word) => total + this.countSyllables(word), 0);

    if (sentences === 0 || words.length === 0) {
      return { grade: 0, score: 0 };
    }

    const avgSentenceLength = words.length / sentences;
    const avgSyllablesPerWord = syllables / words.length;

    const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    const grade = 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59;

    return {
      grade: Math.max(0, Math.round(grade * 10) / 10),
      score: Math.max(0, Math.min(100, Math.round(fleschScore * 10) / 10)),
    };
  }

  private static countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  // Simple sentiment analysis (basic implementation)
  static analyzeSentiment(text: string): { label: 'positive' | 'neutral' | 'negative'; score: number } {
    const positiveWords = [
      'amazing', 'awesome', 'excellent', 'fantastic', 'great', 'wonderful',
      'brilliant', 'outstanding', 'superb', 'magnificent', 'incredible',
      'perfect', 'beautiful', 'love', 'best', 'good', 'nice', 'happy',
      'excited', 'thrilled', 'delighted', 'pleased', 'satisfied'
    ];

    const negativeWords = [
      'terrible', 'awful', 'horrible', 'bad', 'worst', 'hate', 'disgusting',
      'disappointing', 'frustrating', 'annoying', 'sad', 'angry', 'upset',
      'depressed', 'worried', 'concerned', 'difficult', 'problem', 'issue',
      'fail', 'failed', 'broken', 'wrong', 'error', 'mistake'
    ];

    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });

    const totalSentimentWords = positiveCount + negativeCount;
    if (totalSentimentWords === 0) {
      return { label: 'neutral', score: 0 };
    }

    const sentimentScore = (positiveCount - negativeCount) / words.length;
    
    if (sentimentScore > 0.01) {
      return { label: 'positive', score: Math.min(1, sentimentScore * 10) };
    } else if (sentimentScore < -0.01) {
      return { label: 'negative', score: Math.max(-1, sentimentScore * 10) };
    } else {
      return { label: 'neutral', score: 0 };
    }
  }

  // Calculate engagement score based on various factors
  static calculateEngagementScore(text: string): number {
    let score = 0;
    
    // Length factor (optimal length gets higher score)
    const wordCount = text.split(/\s+/).length;
    if (wordCount >= 50 && wordCount <= 300) {
      score += 0.2;
    } else if (wordCount >= 20 && wordCount <= 500) {
      score += 0.1;
    }

    // Question marks increase engagement
    const questionCount = (text.match(/\?/g) || []).length;
    score += Math.min(0.2, questionCount * 0.1);

    // Exclamation marks (but not too many)
    const exclamationCount = (text.match(/!/g) || []).length;
    if (exclamationCount >= 1 && exclamationCount <= 3) {
      score += 0.1;
    }

    // Call-to-action words
    const ctaWords = ['click', 'share', 'comment', 'like', 'follow', 'subscribe', 'join', 'try', 'get', 'download'];
    const ctaCount = ctaWords.reduce((count, word) => {
      return count + (text.toLowerCase().includes(word) ? 1 : 0);
    }, 0);
    score += Math.min(0.2, ctaCount * 0.05);

    // Numbers and statistics
    const numberCount = (text.match(/\b\d+\b/g) || []).length;
    score += Math.min(0.15, numberCount * 0.03);

    return Math.min(1, Math.max(0, score));
  }

  // Generate basic engagement tips
  static generateEngagementTips(text: string): string[] {
    const tips: string[] = [];
    const wordCount = text.split(/\s+/).length;

    if (wordCount < 20) {
      tips.push('Add more detail to increase engagement');
    } else if (wordCount > 500) {
      tips.push('Consider shortening for better readability');
    }

    if (!text.includes('?')) {
      tips.push('Add questions to encourage interaction');
    }

    if (!/[!]/.test(text)) {
      tips.push('Use exclamation points to show enthusiasm');
    }

    const ctaWords = ['click', 'share', 'comment', 'like', 'follow'];
    const hasCTA = ctaWords.some(word => text.toLowerCase().includes(word));
    if (!hasCTA) {
      tips.push('Include a clear call-to-action');
    }

    // Ensure we always have at least 3 tips
    while (tips.length < 3) {
      const defaultTips = [
        'Use emojis to make content more engaging',
        'Share personal experiences or stories',
        'Post at optimal times for your audience',
        'Use trending hashtags relevant to your content',
        'Respond quickly to comments and messages',
      ];
      
      const unusedTips = defaultTips.filter(tip => !tips.includes(tip));
      if (unusedTips.length > 0) {
        tips.push(unusedTips[Math.floor(Math.random() * unusedTips.length)]);
      } else {
        break;
      }
    }

    return tips.slice(0, 3);
  }

  // Create basic analysis when Gemini is unavailable
  static createBasicAnalysis(text: string): AnalysisResult {
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    const readability = this.calculateFleschKincaid(text);
    const sentiment = this.analyzeSentiment(text);
    const engagementScore = this.calculateEngagementScore(text);
    const engagementTips = this.generateEngagementTips(text);

    // Generate basic hashtags based on common words
    const hashtags = this.generateBasicHashtags(text);

    // Generate basic emoji suggestions
    const emojiSuggestions = this.generateBasicEmojis(text, sentiment.label);

    // Create platform-specific versions
    const improvedText = {
      twitter: this.createTwitterVersion(text),
      instagram: this.createInstagramVersion(text),
      linkedin: this.createLinkedInVersion(text),
    };

    return {
      wordCount,
      readingGrade: readability.grade,
      sentiment,
      hashtags,
      emojiSuggestions,
      engagementScore,
      engagementTips,
      improvedText,
    };
  }

  private static generateBasicHashtags(text: string): Array<{ tag: string; score: number }> {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);

    const wordFreq: Record<string, number> = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    const sortedWords = Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    return sortedWords.map(([word, freq]) => ({
      tag: `#${word}`,
      score: Math.min(1, freq / words.length * 10),
    }));
  }

  private static generateBasicEmojis(text: string, sentiment: string): string[] {
    const positiveEmojis = ['🚀', '✨', '🔥', '💯', '🎉'];
    const neutralEmojis = ['📝', '💭', '🤔', '📊', '🎯'];
    const negativeEmojis = ['😔', '💭', '🤷', '📉', '⚠️'];

    switch (sentiment) {
      case 'positive':
        return positiveEmojis;
      case 'negative':
        return negativeEmojis;
      default:
        return neutralEmojis;
    }
  }

  private static createTwitterVersion(text: string): string {
    if (text.length <= 280) return text;
    
    // Truncate to fit Twitter's limit
    const truncated = text.substring(0, 270).trim();
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 200 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  }

  private static createInstagramVersion(text: string): string {
    if (text.length <= 2200) return text;
    
    // Truncate to fit Instagram's limit
    const truncated = text.substring(0, 2190).trim();
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 2000 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  }

  private static createLinkedInVersion(text: string): string {
    // LinkedIn doesn't have a strict character limit, but optimize for readability
    if (text.length <= 1300) return text;
    
    // Add line breaks for better readability
    const paragraphs = text.split('\n').filter(p => p.trim());
    if (paragraphs.length === 1) {
      // Split long paragraph into smaller ones
      const sentences = text.split(/[.!?]+/).filter(s => s.trim());
      const newParagraphs = [];
      let currentParagraph = '';
      
      sentences.forEach(sentence => {
        if (currentParagraph.length + sentence.length > 300) {
          if (currentParagraph) newParagraphs.push(currentParagraph.trim());
          currentParagraph = sentence.trim() + '.';
        } else {
          currentParagraph += sentence.trim() + '.';
        }
      });
      
      if (currentParagraph) newParagraphs.push(currentParagraph);
      return newParagraphs.join('\n\n');
    }
    
    return text;
  }
}