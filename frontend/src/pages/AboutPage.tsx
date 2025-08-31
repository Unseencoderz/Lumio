import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  ArrowLeft,
  Brain,
  Shield,
  Zap,
  Users,
  Target,
  Award,
  ExternalLink
} from 'lucide-react';

export function AboutPage() {
  const technologies = [
    {
      name: 'Google Gemini Pro',
      description: 'Advanced AI model for text analysis and content generation',
      type: 'AI Engine'
    },
    {
      name: 'Tesseract',
      description: 'Open-source OCR engine for reliable text extraction fallback',
      type: 'OCR Engine'
    },
    {
      name: 'React & TypeScript',
      description: 'Modern frontend framework with type safety',
      type: 'Frontend'
    },
    {
      name: 'Node.js & Express',
      description: 'Scalable backend API with real-time processing',
      type: 'Backend'
    },
    {
      name: 'Firebase',
      description: 'Authentication, database, and cloud storage',
      type: 'Cloud Services'
    },
    {
      name: 'Redis',
      description: 'High-performance caching and job queue management',
      type: 'Infrastructure'
    }
  ];

  const features = [
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: 'AI-Powered Intelligence',
      description: 'Leverages Google Gemini Pro for advanced text analysis, sentiment detection, and content optimization.'
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: 'Privacy & Security',
      description: 'Automatic PII detection and redaction. Your data is processed securely and never stored permanently.'
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: 'Lightning Fast',
      description: 'Real-time processing with background job queues. Get results in seconds, not minutes.'
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: 'Multi-Platform',
      description: 'Optimized content generation for Twitter, Instagram, LinkedIn, and more social platforms.'
    },
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      title: 'Precision Analytics',
      description: 'Detailed readability scores, engagement metrics, and actionable improvement suggestions.'
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: 'Production Ready',
      description: 'Enterprise-grade architecture with comprehensive error handling and monitoring.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold">Lumio</span>
            </Link>
            
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              About Lumio
            </Badge>
            <h1 className="text-4xl font-bold mb-6">
              Revolutionizing Content Creation with AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Lumio is an advanced AI-powered platform that transforms your documents 
              into engaging social media content. Built with cutting-edge technology and 
              designed for creators, marketers, and businesses who want to maximize their 
              social media impact.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                We believe that great content should be accessible to everyone. Our mission 
                is to democratize content creation by providing powerful AI tools that help 
                individuals and businesses create compelling social media posts from any document.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Whether you're a content creator, marketer, educator, or business owner, 
                Lumio empowers you to transform your ideas and documents into 
                engaging content that resonates with your audience across all social platforms.
              </p>
              <Link to="/dashboard">
                <Button size="lg">
                  Start Creating
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    {feature.icon}
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powered by Advanced Technology</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built on a foundation of cutting-edge AI and modern web technologies 
              to deliver reliable, fast, and intelligent content processing.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{tech.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {tech.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Lumio Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our intelligent processing pipeline transforms your documents into 
              optimized social media content in just a few simple steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Document</h3>
              <p className="text-muted-foreground">
                Upload your PDF or image file. We support multiple formats and 
                handle files up to 10MB with advanced preprocessing.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our AI extracts text, analyzes sentiment, calculates readability, 
                and generates platform-specific optimizations automatically.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Results</h3>
              <p className="text-muted-foreground">
                Receive optimized content for each platform, smart hashtags, 
                engagement tips, and detailed analytics insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Powered By Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Powered by Industry Leaders</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Google Gemini Pro</h3>
                  <p className="text-sm text-muted-foreground">Advanced AI Analysis</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Tesseract OCR</h3>
                  <p className="text-sm text-muted-foreground">Reliable Text Extraction</p>
                </div>
              </div>
            </div>
            
            <p className="text-lg text-muted-foreground mb-6">
              <strong>Note:</strong> Lumio is proudly powered by Google Gemini Pro for 
              advanced AI capabilities and Tesseract for reliable OCR fallback, ensuring 
              the highest quality text extraction and analysis.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg">
                  Try Lumio Now
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a 
                href="https://ai.google.dev/gemini-api" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg">
                  Learn About Gemini Pro
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold">Lumio</span>
            </Link>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>© 2024 Lumio. All rights reserved.</span>
              <span>Powered by Google Gemini Pro & Tesseract</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}