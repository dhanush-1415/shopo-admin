import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { login } from '@/api/services/authService';
import { useAuthStore } from '@/store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await login(email, password);

      if (response.success && response.data) {
        const { accessToken, user } = response.data;
        
        // Store authentication data
        setAuth(accessToken, user);
        
        toast.success(response.data.message || 'Login successful!');
        
        // Redirect to the page user was trying to access, or dashboard
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        toast.error(response.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      toast.error(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg border border-border shadow-lg p-8">
          {/* Logo/Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center mb-4">
              <span className="text-primary-foreground font-bold text-2xl">EA</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">E-Admin Panel</h1>
            <p className="text-muted-foreground text-sm mt-2">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@store.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
              <a
                href="#"
                className="text-sm text-primary hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info('Password reset feature coming soon!');
                }}
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a
              href="#"
              className="text-primary hover:underline font-medium"
              onClick={(e) => {
                e.preventDefault();
                toast.info('Sign up feature coming soon!');
              }}
            >
              Sign up
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          © 2025 E-Admin Panel. All rights reserved.
        </div>
      </div>
    </div>
  );
}