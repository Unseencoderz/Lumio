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
  ArrowRight,
  CheckCircle,
  Brain,
  Rocket,
  Star,
  TrendingUp,
  Users,
  Globe
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
    { name: 'Google Gemini Pro', icon: '/gemini.png', color: 'text-accent-cyan' },
    { name: 'Tesseract OCR', icon: '/tesseract.png', color: 'text-accent-violet' },
    { name: 'TypeScript', icon: '/typescript.png', color: 'text-success' },
    { name: 'Firebase', icon: '/firebase.png', color: 'text-warning' },
    { name: 'Redis', icon: '/redis.png', color: 'text-error' }
  ];

  const stats = [
    { number: '10K+', label: 'Documents Processed', icon: <FileText className="h-5 w-5" /> },
    { number: '99.9%', label: 'Uptime', icon: <TrendingUp className="h-5 w-5" /> },
    { number: '50+', label: 'Countries Served', icon: <Globe className="h-5 w-5" /> },
    { number: '4.9★', label: 'User Rating', icon: <Star className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/20 via-background to-accent-violet/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-cyan/10 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mx-auto max-w-5xl">
            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-accent-cyan/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-40 right-20 w-24 h-24 bg-accent-violet/10 rounded-full blur-2xl animate-pulse delay-1000" />
            <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-success/10 rounded-full blur-xl animate-pulse delay-2000" />
            
          
            
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-r from-text via-accent-cyan to-accent-violet bg-clip-text text-transparent">
              Make every post{' '}
              <span className="highlight-text animate-pulse">
                shine
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform your documents into engaging social media content with AI-powered 
              text extraction and optimization. Create compelling posts for Twitter, Instagram, 
              and LinkedIn in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-10 py-6 btn-glow pulse-modern shadow-glow-cyan hover:shadow-glow-cyan/50 transition-all duration-300">
                  <Sparkles className="mr-3 h-6 w-6" />
                  Try Now - It's Free
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="text-lg px-10 py-6 border-accent-violet/30 hover:bg-accent-violet/10 hover:border-accent-violet hover:shadow-glow-violet transition-all duration-300">
                  <Rocket className="mr-3 h-6 w-6" />
                  Learn More
                </Button>
              </Link>
            </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 bg-surface/50 rounded-2xl border border-border/50 group-hover:border-accent-cyan/50 group-hover:bg-accent-cyan/10 transition-all duration-300">
                    <div className="text-accent-cyan group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-text mb-1">{stat.number}</div>
                  <div className="text-sm text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* Tech Stack Icons */}
            <div className="mt-20">
              <div className="text-center mb-8">
                <h3 className="text-lg font-medium text-muted mb-4">Powered by Industry-Leading Technologies</h3>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto">
                {techStack.map((tech, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2 text-muted group hover:text-accent-cyan transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-surface/50 border border-border/50 group-hover:border-accent-cyan/50 group-hover:bg-accent-cyan/10 p-2.5 transition-all duration-300 group-hover:scale-110">
                      <img src={tech.icon} alt={tech.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-xs font-medium text-center max-w-20">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 border-accent-violet/30 text-accent-violet">
              <Zap className="h-4 w-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-accent-cyan to-accent-violet bg-clip-text text-transparent">
                create outstanding content
              </span>
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Advanced AI-powered tools designed to transform your documents into engaging social media content
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-modern hover:shadow-glow-accent group border-border/50 hover:border-accent-cyan/30 transition-all duration-500 bg-surface/30 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="icon-highlight group-hover:animate-glow-pulse group-hover:scale-110 transition-all duration-300">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg text-text group-hover:text-accent-cyan transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-gradient-to-br from-surface/20 via-background to-accent-cyan/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-cyan/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-6 border-success/30 text-success">
                <CheckCircle className="h-4 w-4 mr-2" />
                Why Choose Lumio
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-text">
                Stop wasting time on{' '}
                <span className="bg-gradient-to-r from-success to-accent-cyan bg-clip-text text-transparent">
                  manual content creation
                </span>
              </h2>
              <p className="text-xl text-muted mb-10 leading-relaxed">
                Let AI do the heavy lifting while you focus on what matters most - growing your audience and engagement.
              </p>
              <ul className="space-y-6">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-8 h-8 bg-success/10 rounded-full flex items-center justify-center border border-success/20 group-hover:bg-success/20 group-hover:border-success/40 transition-all duration-300">
                      <CheckCircle className="h-5 w-5 text-success group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-lg text-text group-hover:text-success transition-colors duration-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Card className="card-modern p-10 hover:shadow-glow-accent group border-accent-cyan/20 hover:border-accent-cyan/40 transition-all duration-500 bg-surface/20 backdrop-blur-sm">
              <div className="text-center">
                <div className="brand-icon mx-auto mb-8 w-20 h-20 group-hover:scale-110 transition-transform duration-500">
                  <Rocket className="h-10 w-10 text-accent-cyan" />
                </div>
                <h3 className="text-3xl font-bold mb-6 text-text">Ready to Get Started?</h3>
                <p className="text-lg text-muted mb-8 leading-relaxed">
                  Join thousands of content creators who are already using Lumio 
                  to create amazing social media content.
                </p>
                <Link to="/dashboard">
                  <Button size="lg" className="w-full btn-glow text-lg py-6 shadow-glow-cyan hover:shadow-glow-cyan/50 transition-all duration-300">
                    <Sparkles className="mr-3 h-6 w-6" />
                    Start Creating Now
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-accent-cyan/10 via-accent-violet/5 to-accent-cyan/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-cyan/10 via-transparent to-accent-violet/10" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-6 border-accent-cyan/30 text-accent-cyan">
              <Zap className="h-4 w-4 mr-2" />
              Get Started Today
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-text">
              Transform Your Content{' '}
              <span className="bg-gradient-to-r from-accent-cyan to-accent-violet bg-clip-text text-transparent">
                Today
              </span>
            </h2>
            <p className="text-xl text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience the power of AI-driven content optimization. 
              Upload your first document and see the magic happen.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="text-xl px-16 py-8 btn-glow shadow-glow-cyan hover:shadow-glow-cyan/50 transition-all duration-300">
                <Sparkles className="mr-3 h-7 w-7" />
                Get Started for Free
                <ArrowRight className="ml-3 h-7 w-7" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-16 bg-elevated/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="brand-icon group-hover:animate-glow-pulse">
              <img 
                src="/android-chrome-192x192.png" 
                alt="Lumio" 
                className="h-8 w-8" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <Brain className="h-8 w-8 text-accent-cyan hidden" />
            </div>
              <span className="text-2xl font-bold highlight-text">Lumio</span>
            </div>
            <div className="flex items-center space-x-8 text-sm text-muted">
              <Link to="/about" className="hover:text-accent-cyan transition-all duration-300">
                About
              </Link>
              <span className="flex items-center space-x-2">
                Powered by{' '}
                <span className="highlight-text"> Google Gemini Pro </span>
                {' '}& Tesseract
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
