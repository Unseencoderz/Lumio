import { Link, useLocation } from 'react-router-dom';
import { FileText, Sparkles, LogOut, User, History } from 'lucide-react';
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
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xl font-bold">Lumio</span>
              <p className="text-xs text-muted-foreground">Make every post shine</p>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link
              to="/dashboard"
              className={cn(
                'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary',
                location.pathname === '/dashboard' 
                  ? 'text-foreground' 
                  : 'text-muted-foreground'
              )}
            >
              <FileText className="h-4 w-4" />
              <span>Upload</span>
            </Link>
            
            <Link
              to="/dashboard/analyze"
              className={cn(
                'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary',
                location.pathname === '/dashboard/analyze' 
                  ? 'text-foreground' 
                  : 'text-muted-foreground'
              )}
            >
              <Sparkles className="h-4 w-4" />
              <span>Analyze Text</span>
            </Link>

            <Link
              to="/dashboard/history"
              className={cn(
                'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary',
                location.pathname === '/dashboard/history' 
                  ? 'text-foreground' 
                  : 'text-muted-foreground'
              )}
            >
              <History className="h-4 w-4" />
              <span>History</span>
            </Link>

            <div className="flex items-center space-x-3 pl-4 border-l">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
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