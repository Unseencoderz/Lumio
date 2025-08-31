import { Link, useLocation } from 'react-router-dom';
import { FileText, Sparkles, LogOut, User, History, Zap, Brain, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export function Header() {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      toast({
        title: 'Logout failed',
        description: 'An error occurred during logout.',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="border-b border-border bg-elevated/95 backdrop-blur supports-[backdrop-filter]:bg-elevated/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="brand-icon group-hover:animate-glow-pulse">
              <Brain className="h-6 w-6 text-accent-cyan" />
            </div>
            <div>
              <span className="text-xl font-bold highlight-text">Lumio</span>
              <p className="text-xs text-muted">Powered by <span className="highlight-text">Gemini Pro</span></p>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-6">
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

            <div className="flex items-center space-x-3 pl-4 border-l border-border">
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
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}