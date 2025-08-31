import { Link, useLocation } from 'react-router-dom';
import { FileText, Sparkles, LogOut, User, History, Zap, Brain, Palette, Home, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export function Header() {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('.header-nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      // toast({ // Removed as per edit hint
      //   title: 'Logged out',
      //   description: 'You have been successfully logged out.',
      // });
    } catch (error) {
      // toast({ // Removed as per edit hint
      //   title: 'Logout failed',
      //   description: 'An error occurred during logout.',
      //   variant: 'destructive',
      // });
    }
  };

  return (
    <header className={cn(
      "border-b border-border bg-elevated/95 backdrop-blur supports-[backdrop-filter]:bg-elevated/60 sticky top-0 z-50 transition-all duration-300",
      isScrolled && "shadow-lg bg-elevated/98"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between header-nav">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="brand-icon group-hover:animate-glow-pulse">
              <img 
                src="/favicon-32x32.png" 
                alt="Lumio" 
                className="h-6 w-6" 
                onError={(e) => {
                  // Fallback to Brain icon if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <Brain className="h-6 w-6 text-accent-cyan hidden" />
            </div>
            <div>
              <span className="text-xl font-bold highlight-text">Lumio</span>
              <p className="text-xs text-muted">Powered by <span className="highlight-text">Gemini Pro</span></p>
            </div>
          </Link>
          
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Always show Home */}
            <Link
              to="/"
              className={cn(
                'flex items-center space-x-2 text-sm font-medium transition-all duration-300 hover:text-accent-cyan group',
                location.pathname === '/' 
                  ? 'text-text' 
                  : 'text-muted'
              )}
            >
              <div className="p-1.5 rounded-lg transition-all duration-300 group-hover:bg-accent-cyan/10 group-hover:shadow-glow-cyan">
                <Home className="h-4 w-4" />
              </div>
              <span>Home</span>
            </Link>

            {/* Show About for all users */}
            <Link
              to="/about"
              className={cn(
                'flex items-center space-x-2 text-sm font-medium transition-all duration-300 hover:text-accent-violet group',
                location.pathname === '/about' 
                  ? 'text-text' 
                  : 'text-muted'
              )}
            >
              <div className="p-1.5 rounded-lg transition-all duration-300 group-hover:bg-accent-violet/10 group-hover:shadow-glow-violet">
                <Palette className="h-4 w-4" />
              </div>
              <span>About</span>
            </Link>

            {/* Show dashboard navigation only for authenticated users */}
            {currentUser && (
              <>
                <Link
                  to="/dashboard"
                  className={cn(
                    'flex items-center space-x-2 text-sm font-medium transition-all duration-300 hover:text-accent-cyan group',
                    location.pathname === '/dashboard' 
                      ? 'text-text' 
                      : 'text-muted'
                  )}
                >
                  <div className="p-1.5 rounded-lg transition-all duration-300 group-hover:bg-accent-cyan/10 group-hover:shadow-glow-cyan">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span>Upload</span>
                </Link>
                
                <Link
                  to="/dashboard/analyze"
                  className={cn(
                    'flex items-center space-x-2 text-sm font-medium transition-all duration-300 hover:text-accent-violet group',
                    location.pathname === '/dashboard/analyze' 
                      ? 'text-text' 
                      : 'text-muted'
                  )}
                >
                  <div className="p-1.5 rounded-lg transition-all duration-300 group-hover:bg-accent-violet/10 group-hover:shadow-glow-violet">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span>Analyze Text</span>
                </Link>

                <Link
                  to="/dashboard/history"
                  className={cn(
                    'flex items-center space-x-2 text-sm font-medium transition-all duration-300 hover:text-success group',
                    location.pathname === '/dashboard/history' 
                      ? 'text-text' 
                      : 'text-muted'
                  )}
                >
                  <div className="p-1.5 rounded-lg transition-all duration-300 group-hover:bg-success/10">
                    <History className="h-4 w-4" />
                  </div>
                  <span>History</span>
                </Link>
              </>
            )}

            <div className="flex items-center space-x-3 pl-4 border-l border-border">
              {currentUser ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-surface border border-border">
                      <User className="h-4 w-4 text-muted" />
                    </div>
                    <span className="text-sm font-medium text-text">
                      {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-muted hover:text-text hover:bg-surface transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="border-border hover:bg-surface hover:border-accent-cyan">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-elevated/98 backdrop-blur">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Home Link */}
            <Link
              to="/"
              className={cn(
                'flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:bg-surface group',
                location.pathname === '/' 
                  ? 'text-text bg-surface/50' 
                  : 'text-muted'
              )}
            >
              <div className="p-1.5 rounded-lg transition-all duration-300 group-hover:bg-accent-cyan/10">
                <Home className="h-4 w-4" />
              </div>
              <span className="font-medium">Home</span>
            </Link>

            {/* Mobile About Link */}
            <Link
              to="/about"
              className={cn(
                'flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:bg-surface group',
                location.pathname === '/about' 
                  ? 'text-text bg-surface/50' 
                  : 'text-muted'
              )}
            >
              <div className="p-1.5 rounded-lg transition-all duration-300 group-hover:bg-accent-violet/10">
                <Palette className="h-4 w-4" />
              </div>
              <span className="font-medium">About</span>
            </Link>

            {/* Mobile Dashboard Links (for authenticated users) */}
            {currentUser && (
              <>
                <Link
                  to="/dashboard"
                  className={cn(
                    'flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:bg-surface group',
                    location.pathname === '/dashboard' 
                      ? 'text-text bg-surface/50' 
                      : 'text-muted'
                  )}
                >
                  <div className="p-1.5 rounded-lg transition-all duration-300 group-hover:bg-accent-cyan/10">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Upload</span>
                </Link>
                
                <Link
                  to="/dashboard/analyze"
                  className={cn(
                    'flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:bg-surface group',
                    location.pathname === '/dashboard/analyze' 
                      ? 'text-text bg-surface/50' 
                      : 'text-muted'
                  )}
                >
                  <div className="p-1.5 rounded-lg transition-all duration-300 group-hover:bg-accent-violet/10">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Analyze Text</span>
                </Link>

                <Link
                  to="/dashboard/history"
                  className={cn(
                    'flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:bg-surface group',
                    location.pathname === '/dashboard/history' 
                      ? 'text-text bg-surface/50' 
                      : 'text-muted'
                  )}
                >
                  <div className="p-1.5 rounded-lg transition-all duration-300 group-hover:bg-success/10">
                    <History className="h-4 w-4" />
                  </div>
                  <span className="font-medium">History</span>
                </Link>
              </>
            )}

            {/* Mobile User Section */}
            <div className="border-t border-border pt-4">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-surface/30 rounded-lg">
                    <div className="p-1.5 rounded-lg bg-surface border border-border">
                      <User className="h-4 w-4 text-muted" />
                    </div>
                    <span className="font-medium text-text">
                      {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted hover:text-text hover:bg-surface transition-all duration-300"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" className="w-full border-border hover:bg-surface hover:border-accent-cyan">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}