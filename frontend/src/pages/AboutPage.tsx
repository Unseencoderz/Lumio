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
      icon: '/gemini.png'
    },
    {
      name: 'Tesseract',
      description: 'Open-source OCR engine for reliable text extraction fallback',
      type: 'OCR Engine',
      icon: '/tesseract.png'
    },
    {
      name: 'TypeScript',
      description: 'Modern frontend framework with type safety',
      type: 'Frontend',
      icon: '/typescript.png'
    },
    {
      name: 'Node.js',
      description: 'Scalable backend API with real-time processing',
      type: 'Backend',
      icon: <Server className="h-5 w-5 text-warning" />
    },
    {
      name: 'Firebase',
      description: 'Authentication, database, and cloud storage',
      type: 'Cloud Services',
      icon: '/firebase.png'
    },
    {
      name: 'Redis',
      description: 'High-performance caching and job queue management',
      type: 'Infrastructure',
      icon: '/redis.png'
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
    <div className="min-h-screen bg-gradient-to-br from-bg via-surface/20 to-elevated">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 via-transparent to-accent-violet/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">

            <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-accent-cyan to-accent-violet text-white border-0 shadow-glow-cyan animate-glow-pulse">
              <Brain className="h-4 w-4 mr-2" />
              About Lumio
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-8 text-text leading-tight">
              Revolutionizing Content Creation with{' '}
              <span className="bg-gradient-to-r from-accent-cyan via-accent-violet to-success bg-clip-text text-transparent animate-glow-pulse">
                AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted mb-10 leading-relaxed max-w-3xl mx-auto">
              Lumio is an advanced AI-powered platform that transforms your documents 
              into engaging social media content. Built with cutting-edge technology and 
              designed for creators, marketers, and businesses who want to maximize their 
              social media impact.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/5 via-transparent to-accent-violet/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-text leading-tight">
                Our{' '}
                <span className="bg-gradient-to-r from-accent-cyan to-accent-violet bg-clip-text text-transparent">
                  Mission
                </span>
              </h2>
              <p className="text-lg md:text-xl text-muted mb-6 leading-relaxed">
                We believe that great content should be accessible to everyone. Our mission 
                is to democratize content creation by providing powerful AI tools that help 
                individuals and businesses create compelling social media posts from any document.
              </p>
              <p className="text-lg md:text-xl text-muted mb-8 leading-relaxed">
                Whether you're a content creator, marketer, educator, or business owner, 
                Lumio empowers you to transform your ideas and documents into 
                engaging content that resonates with your audience across all social platforms.
              </p>
              <Link to="/dashboard">
                <Button size="lg" className="btn-glow text-lg px-8 py-6 h-auto">
                  Start Creating
                  <Sparkles className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="card-modern p-6 hover:shadow-glow-accent transition-all duration-300 group border-border/30 backdrop-blur-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="icon-highlight group-hover:animate-glow-pulse">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-sm text-text">{feature.title}</h3>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-surface/20 via-transparent to-elevated/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text leading-tight">
              Powered by{' '}
              <span className="bg-gradient-to-r from-accent-cyan to-accent-violet bg-clip-text text-transparent">
                Advanced Technology
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto leading-relaxed">
              Built on a foundation of cutting-edge AI and modern web technologies 
              to deliver reliable, fast, and intelligent content processing.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <Card key={index} className="card-modern p-8 hover:shadow-glow-accent transition-all duration-300 group border-border/30 backdrop-blur-sm hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="icon-highlight group-hover:animate-glow-pulse">
                      {typeof tech.icon === 'string' ? (
                        <img src={tech.icon} alt={tech.name} className="h-6 w-6 object-contain" />
                      ) : (
                        tech.icon
                      )}
                    </div>
                    <h3 className="font-semibold text-text text-lg">{tech.name}</h3>
                  </div>
                  <Badge variant="outline" className="text-xs border-border/50 bg-surface/50">
                    {tech.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted leading-relaxed">{tech.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-l from-accent-violet/5 via-transparent to-success/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text leading-tight">
              How{' '}
              <span className="bg-gradient-to-r from-accent-cyan to-accent-violet bg-clip-text text-transparent">
                Lumio
              </span>{' '}
              Works
            </h2>
            <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto leading-relaxed">
              Our intelligent processing pipeline transforms your documents into 
              optimized social media content in just a few simple steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-cyan/20 to-accent-cyan/40 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent-cyan/30 group-hover:shadow-glow-cyan transition-all duration-300">
                <span className="text-3xl font-bold text-accent-cyan">1</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-text">Upload Document</h3>
              <p className="text-muted leading-relaxed">
                Upload your PDF or image file. We support multiple formats and 
                handle files up to 10MB with advanced preprocessing.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-violet/20 to-accent-violet/40 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent-violet/30 group-hover:shadow-glow-accent transition-all duration-300">
                <span className="text-3xl font-bold text-accent-violet">2</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-text">AI Analysis</h3>
              <p className="text-muted leading-relaxed">
                Our AI extracts text, analyzes sentiment, calculates readability, 
                and generates platform-specific optimizations automatically.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-success/20 to-success/40 rounded-full flex items-center justify-center mx-auto mb-6 border border-success/30 group-hover:shadow-glow-accent transition-all duration-300">
                <span className="text-3xl font-bold text-success">3</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-text">Get Results</h3>
              <p className="text-muted leading-relaxed">
                Receive optimized content for each platform, smart hashtags, 
                engagement tips, and detailed analytics insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Powered By Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/10 via-accent-violet/5 to-success/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-text leading-tight">
              Powered by{' '}
              <span className="bg-gradient-to-r from-accent-cyan to-accent-violet bg-clip-text text-transparent">
                Industry Leaders
              </span>
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-10">
              <div className="flex items-center space-x-4 group">
                <div className="brand-icon w-16 h-16 group-hover:scale-110 transition-transform duration-300">
                  <img src="/gemini.png" alt="Google Gemini Pro" className="w-full h-full object-contain" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-text text-lg">Google Gemini Pro</h3>
                  <p className="text-sm text-muted">Advanced AI Analysis</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 group">
                <div className="brand-icon w-16 h-16 group-hover:scale-110 transition-transform duration-300">
                  <img src="/tesseract.png" alt="Tesseract OCR" className="w-full h-full object-contain" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-text text-lg">Tesseract OCR</h3>
                  <p className="text-sm text-muted">Reliable Text Extraction</p>
                </div>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-muted mb-8 leading-relaxed">
              <strong>Note:</strong> Lumio is proudly powered by{' '}
              <span className="bg-gradient-to-r from-accent-cyan to-accent-violet bg-clip-text text-transparent font-semibold">
                Google Gemini Pro
              </span>{' '}
              for advanced AI capabilities and Tesseract for reliable OCR fallback, ensuring 
              the highest quality text extraction and analysis.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="btn-glow text-lg px-8 py-6 h-auto">
                  Try Lumio Now
                  <Sparkles className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <a 
                href="https://ai.google.dev/gemini-api" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="border-border/50 hover:bg-surface/50 hover:border-accent-cyan text-lg px-8 py-6 h-auto backdrop-blur-sm transition-all duration-300">
                  Learn About Gemini Pro
                  <ExternalLink className="ml-3 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home Section */}
      <section className="py-12 bg-surface/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Link to="/">
              <Button variant="outline" size="lg" className="border-border/50 hover:bg-surface/50 hover:border-accent-cyan backdrop-blur-sm transition-all duration-300">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-16 bg-elevated/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link to="/" className="flex items-center space-x-3 mb-6 md:mb-0 group">
              <div className="brand-icon group-hover:scale-110 transition-transform duration-300">
                <img src="/android-chrome-192x192.png" alt="Lumio" className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-accent-cyan to-accent-violet bg-clip-text text-transparent">
                Lumio
              </span>
            </Link>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8 text-sm text-muted">
              <span>© 2024 Lumio. All rights reserved.</span>
              <span>
                Powered by{' '}
                <span className="bg-gradient-to-r from-accent-cyan to-accent-violet bg-clip-text text-transparent font-semibold">
                  Google Gemini Pro
                </span>{' '}
                & Tesseract
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}