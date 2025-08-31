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
  ExternalLink,
  Github,
  Chrome,
  Database,
  Server,
  Cloud,
  Cpu
} from 'lucide-react';

export function AboutPage() {
  const technologies = [
    {
      name: 'Google Gemini Pro',
      description: 'Advanced AI model for text analysis and content generation',
      type: 'AI Engine',
      icon: <Brain className="h-5 w-5 text-accent-cyan" />
    },
    {
      name: 'Tesseract',
      description: 'Open-source OCR engine for reliable text extraction fallback',
      type: 'OCR Engine',
      icon: <Cpu className="h-5 w-5 text-accent-violet" />
    },
    {
      name: 'React & TypeScript',
      description: 'Modern frontend framework with type safety',
      type: 'Frontend',
      icon: <Chrome className="h-5 w-5 text-success" />
    },
    {
      name: 'Node.js & Express',
      description: 'Scalable backend API with real-time processing',
      type: 'Backend',
      icon: <Server className="h-5 w-5 text-warning" />
    },
    {
      name: 'Firebase',
      description: 'Authentication, database, and cloud storage',
      type: 'Cloud Services',
      icon: <Cloud className="h-5 w-5 text-accent-cyan" />
    },
    {
      name: 'Redis',
      description: 'High-performance caching and job queue management',
      type: 'Infrastructure',
      icon: <Database className="h-5 w-5 text-accent-violet" />
    }
  ];

  const features = [
    {
      icon: <Brain className="h-6 w-6 text-accent-cyan" />,
      title: 'AI-Powered Intelligence',
      description: 'Leverages Google Gemini Pro for advanced text analysis, sentiment detection, and content optimization.'
    },
    {
      icon: <Shield className="h-6 w-6 text-accent-violet" />,
      title: 'Privacy & Security',
      description: 'Automatic PII detection and redaction. Your data is processed securely and never stored permanently.'
    },
    {
      icon: <Zap className="h-6 w-6 text-success" />,
      title: 'Lightning Fast',
      description: 'Real-time processing with background job queues. Get results in seconds, not minutes.'
    },
    {
      icon: <Users className="h-6 w-6 text-warning" />,
      title: 'Multi-Platform',
      description: 'Optimized content generation for Twitter, Instagram, LinkedIn, and more social platforms.'
    },
    {
      icon: <Target className="h-6 w-6 text-error" />,
      title: 'Precision Analytics',
      description: 'Detailed readability scores, engagement metrics, and actionable improvement suggestions.'
    },
    {
      icon: <Award className="h-6 w-6 text-accent-cyan" />,
      title: 'Production Ready',
      description: 'Enterprise-grade architecture with comprehensive error handling and monitoring.'
    }
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border bg-elevated/95 backdrop-blur supports-[backdrop-filter]:bg-elevated/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="brand-icon group-hover:animate-glow-pulse">
                <Brain className="h-5 w-5 text-accent-cyan" />
              </div>
              <span className="text-xl font-bold highlight-text">Lumio</span>
            </Link>
            
            <Link to="/">
              <Button variant="outline" size="sm" className="border-border hover:bg-surface hover:border-accent-cyan">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-bg to-surface/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4 bg-accent-gradient text-white border-0">
              <Brain className="h-4 w-4 mr-2" />
              About Lumio
            </Badge>
            <h1 className="text-4xl font-bold mb-6 text-text">
              Revolutionizing Content Creation with <span className="highlight-text">AI</span>
            </h1>
            <p className="text-xl text-muted mb-8">
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
              <h2 className="text-3xl font-bold mb-6 text-text">Our Mission</h2>
              <p className="text-lg text-muted mb-6">
                We believe that great content should be accessible to everyone. Our mission 
                is to democratize content creation by providing powerful AI tools that help 
                individuals and businesses create compelling social media posts from any document.
              </p>
              <p className="text-lg text-muted mb-6">
                Whether you're a content creator, marketer, educator, or business owner, 
                Lumio empowers you to transform your ideas and documents into 
                engaging content that resonates with your audience across all social platforms.
              </p>
              <Link to="/dashboard">
                <Button size="lg" className="btn-glow">
                  Start Creating
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="card-modern p-4 hover:shadow-glow-accent transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="icon-highlight">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-sm text-text">{feature.title}</h3>
                  </div>
                  <p className="text-xs text-muted">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-surface/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-text">Powered by Advanced Technology</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Built on a foundation of cutting-edge AI and modern web technologies 
              to deliver reliable, fast, and intelligent content processing.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, index) => (
              <Card key={index} className="card-modern p-6 hover:shadow-glow-accent transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="icon-highlight group-hover:animate-glow-pulse">
                      {tech.icon}
                    </div>
                    <h3 className="font-semibold text-text">{tech.name}</h3>
                  </div>
                  <Badge variant="outline" className="text-xs border-border">
                    {tech.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted">{tech.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-text">How <span className="highlight-text">Lumio</span> Works</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Our intelligent processing pipeline transforms your documents into 
              optimized social media content in just a few simple steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent-cyan/20">
                <span className="text-2xl font-bold text-accent-cyan">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-text">Upload Document</h3>
              <p className="text-muted">
                Upload your PDF or image file. We support multiple formats and 
                handle files up to 10MB with advanced preprocessing.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-violet/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent-violet/20">
                <span className="text-2xl font-bold text-accent-violet">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-text">AI Analysis</h3>
              <p className="text-muted">
                Our AI extracts text, analyzes sentiment, calculates readability, 
                and generates platform-specific optimizations automatically.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-success/20">
                <span className="text-2xl font-bold text-success">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-text">Get Results</h3>
              <p className="text-muted">
                Receive optimized content for each platform, smart hashtags, 
                engagement tips, and detailed analytics insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Powered By Section */}
      <section className="py-16 bg-gradient-to-r from-accent-cyan/5 to-accent-violet/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-text">Powered by Industry Leaders</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
              <div className="flex items-center space-x-3">
                <div className="brand-icon w-12 h-12">
                  <Brain className="h-6 w-6 text-accent-cyan" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-text">Google Gemini Pro</h3>
                  <p className="text-sm text-muted">Advanced AI Analysis</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="brand-icon w-12 h-12">
                  <Cpu className="h-6 w-6 text-accent-violet" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-text">Tesseract OCR</h3>
                  <p className="text-sm text-muted">Reliable Text Extraction</p>
                </div>
              </div>
            </div>
            
            <p className="text-lg text-muted mb-6">
              <strong>Note:</strong> Lumio is proudly powered by <span className="highlight-text">Google Gemini Pro</span> for 
              advanced AI capabilities and Tesseract for reliable OCR fallback, ensuring 
              the highest quality text extraction and analysis.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="btn-glow">
                  Try Lumio Now
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a 
                href="https://ai.google.dev/gemini-api" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="border-border hover:bg-surface hover:border-accent-cyan">
                  Learn About Gemini Pro
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-elevated">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link to="/" className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="brand-icon">
                <Brain className="h-5 w-5 text-accent-cyan" />
              </div>
              <span className="text-xl font-bold highlight-text">Lumio</span>
            </Link>
            <div className="flex items-center space-x-6 text-sm text-muted">
              <span>© 2024 Lumio. All rights reserved.</span>
              <span>Powered by <span className="highlight-text">Google Gemini Pro</span> & Tesseract</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}