import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { 
  Sparkles, 
  ArrowLeft,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff
} from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const resetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;
type ResetForm = z.infer<typeof resetSchema>;

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, signup, loginWithGoogle, loginWithGithub, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const resetForm = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: '' },
  });

  const handleLogin = async (data: LoginForm) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast({
        title: 'Welcome back!',
        description: 'You have been successfully logged in.',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An error occurred during login.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (data: SignupForm) => {
    setLoading(true);
    try {
      await signup(data.email, data.password, data.name);
      toast({
        title: 'Account created!',
        description: 'Welcome to Lumio. You can now start creating content.',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Signup failed',
        description: error instanceof Error ? error.message : 'An error occurred during signup.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (data: ResetForm) => {
    setLoading(true);
    try {
      await resetPassword(data.email);
      toast({
        title: 'Reset email sent',
        description: 'Check your email for password reset instructions.',
      });
      setMode('login');
    } catch (error) {
      toast({
        title: 'Reset failed',
        description: error instanceof Error ? error.message : 'An error occurred during password reset.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    try {
      if (provider === 'google') {
        await loginWithGoogle();
      } else {
        await loginWithGithub();
      }
      toast({
        title: 'Welcome!',
        description: `Successfully logged in with ${provider}.`,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Social login failed',
        description: error instanceof Error ? error.message : `An error occurred during ${provider} login.`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-surface/20 to-elevated">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Auth Header */}
            <div className="text-center mb-8">
              <div className="brand-icon mx-auto mb-4">
                <img 
                  src="/android-chrome-192x192.png" 
                  alt="Lumio" 
                  className="h-12 w-12" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <Sparkles className="h-12 w-12 text-accent-cyan hidden" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-cyan to-accent-violet bg-clip-text text-transparent mb-2">
                Welcome to Lumio
              </h1>
              <p className="text-muted">Make every post shine with AI</p>
            </div>

        <Card className="card-modern backdrop-blur-sm border-border/30 shadow-glow-accent">
          <CardHeader className="text-center">
            <CardTitle className="text-text">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && 'Reset Password'}
            </CardTitle>
            <CardDescription className="text-muted">
              {mode === 'login' && 'Sign in to your account to continue'}
              {mode === 'signup' && 'Join Lumio and start creating amazing content'}
              {mode === 'reset' && 'Enter your email to receive reset instructions'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            {mode !== 'reset' && (
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-border/50 hover:bg-surface/50 hover:border-accent-cyan transition-all duration-300 backdrop-blur-sm"
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                >
                  <img src="/google.png" alt="Google" className="h-4 w-4 mr-2" />
                  Continue with Google
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-border/50 hover:bg-surface/50 hover:border-accent-violet transition-all duration-300 backdrop-blur-sm"
                  onClick={() => handleSocialLogin('github')}
                  disabled={loading}
                >
                  <img src="/github.png" alt="GitHub" className="h-4 w-4 mr-2" />
                  Continue with GitHub
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/30" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted">
                      Or continue with email
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Login Form */}
            {mode === 'login' && (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-text">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 border-border/50 focus:border-accent-cyan transition-colors duration-300"
                      {...loginForm.register('email')}
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-text">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 border-border/50 focus:border-accent-cyan transition-colors duration-300"
                      {...loginForm.register('password')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-surface/50"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-accent-cyan to-accent-violet text-white border-0 shadow-glow-cyan hover:shadow-glow-accent transition-all duration-300 hover:scale-105" 
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            )}

            {/* Signup Form */}
            {mode === 'signup' && (
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-text">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10 border-border/50 focus:border-accent-cyan transition-colors duration-300"
                      {...signupForm.register('name')}
                    />
                  </div>
                  {signupForm.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {signupForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-text">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 border-border/50 focus:border-accent-cyan transition-colors duration-300"
                      {...signupForm.register('email')}
                    />
                  </div>
                  {signupForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-text">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      className="pl-10 pr-10 border-border/50 focus:border-accent-cyan transition-colors duration-300"
                      {...signupForm.register('password')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-surface/50"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-text">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      className="pl-10 border-border/50 focus:border-accent-cyan transition-colors duration-300"
                      {...signupForm.register('confirmPassword')}
                    />
                  </div>
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {signupForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-accent-cyan to-accent-violet text-white border-0 shadow-glow-cyan hover:shadow-glow-accent transition-all duration-300 hover:scale-105" 
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            )}

            {/* Reset Form */}
            {mode === 'reset' && (
              <form onSubmit={resetForm.handleSubmit(handleReset)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-text">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 border-border/50 focus:border-accent-cyan transition-colors duration-300"
                      {...resetForm.register('email')}
                    />
                  </div>
                  {resetForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {resetForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-accent-cyan to-accent-violet text-white border-0 shadow-glow-cyan hover:shadow-glow-accent transition-all duration-300 hover:scale-105" 
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Email'}
                </Button>
              </form>
            )}

            {/* Mode Switching */}
            <div className="text-center text-sm">
              {mode === 'login' && (
                <>
                  <p className="text-muted">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="text-accent-cyan hover:text-accent-violet transition-colors duration-300 font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-accent-cyan hover:text-accent-violet transition-colors duration-300 font-medium mt-2 block mx-auto"
                  >
                    Forgot password?
                  </button>
                </>
              )}

              {mode === 'signup' && (
                <p className="text-muted">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-accent-cyan hover:text-accent-violet transition-colors duration-300 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              )}

              {mode === 'reset' && (
                <p className="text-muted">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-accent-cyan hover:text-accent-violet transition-colors duration-300 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      </main>
    </div>
  );
}