import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  FileText, 
  BarChart3, 
  MessageCircle, 
  Hash,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle,
  Brain,
  Github,
  Chrome,
  Star,
  Rocket
} from 'lucide-react';

export function LandingPage() {
  const features = [
    {
      icon: <FileText className="h-8 w-8 text-accent-cyan" />,
      title: 'Smart Text Extraction',
      description: 'Extract text from PDFs and images using advanced AI-powered OCR technology with Google Gemini Pro and Tesseract fallback.',
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-accent-violet" />,
      title: 'AI-Powered Analysis',
      description: 'Get detailed insights on readability, sentiment analysis, and engagement potential with comprehensive metrics.',
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-success" />,
      title: 'Platform Optimization',
      description: 'Generate optimized content for Twitter, Instagram, and LinkedIn with platform-specific character limits.',
    },
    {
      icon: <Hash className="h-8 w-8 text-warning" />,
      title: 'Smart Hashtags',
      description: 'AI-generated hashtags with relevance scores and detailed rationale for maximum reach and engagement.',
    },
    {
      icon: <Shield className="h-8 w-8 text-error" />,
      title: 'PII Detection',
      description: 'Automatic detection and redaction of personally identifiable information to protect your privacy.',
    },
    {
      icon: <Zap className="h-8 w-8 text-accent-cyan" />,
      title: 'Real-time Processing',
      description: 'Background job processing with real-time progress updates and instant results delivery.',
    },
  ];

  const benefits = [
    'Transform documents into engaging social media content',
    'Save hours of manual content creation',
    'Improve engagement with AI-optimized posts',
    'Maintain consistent brand voice across platforms',
    'Protect sensitive information automatically',
    'Scale your content strategy effortlessly',
  ];

  const techStack = [
    { name: 'Google Gemini Pro', icon: <Brain className="h-5 w-5" />, color: 'text-accent-cyan' },
    { name: 'GitHub', icon: <Github className="h-5 w-5" />, color: 'text-accent-violet' },
    { name: 'Chrome', icon: <Chrome className="h-5 w-5" />, color: 'text-success' },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border bg-elevated/95 backdrop-blur supports-[backdrop-filter]:bg-elevated/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3 group">
              <div className="brand-icon group-hover:animate-glow-pulse">
                <Brain className="h-5 w-5 text-accent-cyan" />
              </div>
              <span className="text-xl font-bold highlight-text">Lumio</span>
            </div>
            
            <nav className="flex items-center space-x-6">
              <Link
                to="/about"
                className="text-sm font-medium text-muted hover:text-accent-cyan transition-all duration-300"
              >
                About
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="sm" className="border-border hover:bg-surface hover:border-accent-cyan">
                  Sign In
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-b from-bg to-surface/20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <Badge variant="secondary" className="mb-4 bg-accent-gradient text-white border-0">
              <Brain className="h-4 w-4 mr-2" />
              Powered by Google Gemini Pro
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              Make every post{' '}
              <span className="highlight-text">
                shine
              </span>
            </h1>
            <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
              Transform your documents into engaging social media content with AI-powered 
              text extraction and optimization. Create compelling posts for Twitter, Instagram, 
              and LinkedIn in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8 btn-glow pulse-modern">
                  Try Now - It's Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="text-lg px-8 border-border hover:bg-surface hover:border-accent-violet">
                  Learn More
                </Button>
              </Link>
            </div>
            
            {/* Tech Stack Icons */}
            <div className="mt-12 flex justify-center items-center space-x-8">
              {techStack.map((tech, index) => (
                <div key={index} className="flex items-center space-x-2 text-muted">
                  <div className={`${tech.color}`}>
                    {tech.icon}
                  </div>
                  <span className="text-sm font-medium">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-text">Key Features</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Everything you need to create outstanding social media content from your documents
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-modern hover:shadow-glow-accent transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="icon-highlight group-hover:animate-glow-pulse">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg text-text">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-surface/20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-text">Why Choose <span className="highlight-text">Lumio</span>?</h2>
              <p className="text-lg text-muted mb-8">
                Stop wasting time manually creating social media content. Let AI do the heavy 
                lifting while you focus on what matters most - growing your audience and engagement.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <span className="text-text">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Card className="card-modern p-8 hover:shadow-glow-accent transition-all duration-300">
              <div className="text-center">
                <div className="brand-icon mx-auto mb-6 w-16 h-16">
                  <Rocket className="h-8 w-8 text-accent-cyan" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-text">Ready to Get Started?</h3>
                <p className="text-muted mb-6">
                  Join thousands of content creators who are already using Lumio 
                  to create amazing social media content.
                </p>
                <Link to="/dashboard">
                  <Button size="lg" className="w-full btn-glow">
                    Start Creating Now
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-accent-cyan/10 to-accent-violet/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-text">
              Transform Your Content Today
            </h2>
            <p className="text-lg text-muted mb-8">
              Experience the power of AI-driven content optimization. 
              Upload your first document and see the magic happen.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="text-lg px-12 btn-glow">
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-elevated">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="brand-icon">
                <Brain className="h-5 w-5 text-accent-cyan" />
              </div>
              <span className="text-xl font-bold highlight-text">Lumio</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted">
              <Link to="/about" className="hover:text-accent-cyan transition-all duration-300">
                About
              </Link>
              <span>Powered by <span className="highlight-text">Google Gemini Pro</span> & Tesseract</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
