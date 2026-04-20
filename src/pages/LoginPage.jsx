import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { getApiRootUrl } from '@/lib/api';
import { GoogleIcon, FacebookIcon, AppleIcon, GitHubIcon } from '@/components/SocialAuthIcons';
import { LogIn, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SOCIAL_BUTTON_CLASS = 'size-12 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors flex items-center justify-center shrink-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(formData.email, formData.password);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      const message = typeof err?.message === 'string' ? err.message : (err && typeof err === 'object' ? JSON.stringify(err) : String(err));
      setError(message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const supportedSocialProviders = ['google', 'github', 'facebook', 'apple'];
  const handleSocialLogin = (provider) => {
    if (supportedSocialProviders.includes(provider)) {
      window.location.href = `${getApiRootUrl()}/auth/${provider}`;
    } else {
      toast.info(`${provider} sign-in is not available.`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-[420px]">
        <Card className="border-border/80 shadow-xl shadow-black/5 dark:shadow-none rounded-2xl overflow-hidden">
          <CardHeader className="text-center space-y-3 pb-4 pt-8 sm:pt-10">
            <div className="flex justify-center">
              <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                <LogIn className="size-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">Sign in</CardTitle>
            <CardDescription className="text-muted-foreground text-sm max-w-[320px] mx-auto">
              Use your email or continue with Google, GitHub, Facebook, or Apple ID
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 sm:px-8 pb-8 sm:pb-10 space-y-6">
            {/* Social buttons */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              <Button type="button" variant="ghost" onClick={() => handleSocialLogin('google')} className={SOCIAL_BUTTON_CLASS} aria-label="Sign in with Google">
                <GoogleIcon className="size-6" />
              </Button>
              <Button type="button" variant="ghost" onClick={() => handleSocialLogin('facebook')} className={SOCIAL_BUTTON_CLASS} aria-label="Sign in with Facebook">
                <FacebookIcon className="size-6 text-[#1877F2]" />
              </Button>
              <Button type="button" variant="ghost" onClick={() => handleSocialLogin('apple')} className={SOCIAL_BUTTON_CLASS} aria-label="Sign in with Apple ID">
                <AppleIcon className="size-6 text-foreground" />
              </Button>
              <Button type="button" variant="ghost" onClick={() => handleSocialLogin('github')} className={SOCIAL_BUTTON_CLASS} aria-label="Sign in with GitHub">
                <GitHubIcon className="size-6" />
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="bg-card px-3 text-muted-foreground">Or with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm px-3 py-2.5">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{typeof error === 'string' ? error : (error?.message || String(error))}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="pl-10 h-11 rounded-xl border-border/80"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="pl-10 h-11 rounded-xl border-border/80"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className={cn(
                  'w-full h-12 rounded-xl font-semibold text-base',
                  loading ? 'opacity-70 pointer-events-none' : 'bg-foreground text-background hover:bg-foreground/90'
                )}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-5 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="font-medium text-foreground hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
