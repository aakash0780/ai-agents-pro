import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { getApiRootUrl } from '@/lib/api';
import { GoogleIcon, FacebookIcon, AppleIcon, GitHubIcon } from '@/components/SocialAuthIcons';
import { UserPlus, Mail, Lock, User, Phone, Building, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SOCIAL_BUTTON_CLASS = 'size-12 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors flex items-center justify-center shrink-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

export function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const supportedSocialProviders = ['google', 'github', 'facebook', 'apple'];
  const handleSocialLogin = (provider) => {
    if (supportedSocialProviders.includes(provider)) {
      window.location.href = `${getApiRootUrl()}/auth/${provider}`;
    } else {
      toast.info(`${provider} sign-up is not available.`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-[440px]">
        <Card className="border-border/80 shadow-xl shadow-black/5 dark:shadow-none rounded-2xl overflow-hidden">
          <CardHeader className="text-center space-y-3 pb-4 pt-8 sm:pt-10">
            <div className="flex justify-center">
              <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                <UserPlus className="size-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">Create an account</CardTitle>
            <CardDescription className="text-muted-foreground text-sm max-w-[320px] mx-auto">
              Sign up with Google, GitHub, Facebook, Apple ID, or email — free to try
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 sm:px-8 pb-8 sm:pb-10 space-y-6">
            {/* Social buttons */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              <Button type="button" variant="ghost" onClick={() => handleSocialLogin('google')} className={SOCIAL_BUTTON_CLASS} aria-label="Sign up with Google">
                <GoogleIcon className="size-6" />
              </Button>
              <Button type="button" variant="ghost" onClick={() => handleSocialLogin('facebook')} className={SOCIAL_BUTTON_CLASS} aria-label="Sign up with Facebook">
                <FacebookIcon className="size-6 text-[#1877F2]" />
              </Button>
              <Button type="button" variant="ghost" onClick={() => handleSocialLogin('apple')} className={SOCIAL_BUTTON_CLASS} aria-label="Sign up with Apple ID">
                <AppleIcon className="size-6 text-foreground" />
              </Button>
              <Button type="button" variant="ghost" onClick={() => handleSocialLogin('github')} className={SOCIAL_BUTTON_CLASS} aria-label="Sign up with GitHub">
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

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="name">Full name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={cn("pl-10 h-11 rounded-xl border-border/80 transition-all focus:ring-2", errors.name && "border-destructive focus-visible:ring-destructive/30")}
                    required
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                </div>
                {errors.name && (
                  <p id="name-error" className="text-sm text-destructive flex items-center gap-1 animate-in slide-in-from-left-1">
                    <AlertCircle className="size-3 shrink-0" /> {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className={cn("pl-10 h-11 rounded-xl border-border/80 transition-all focus:ring-2", errors.email && "border-destructive focus-visible:ring-destructive/30")}
                    required
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive flex items-center gap-1 animate-in slide-in-from-left-1">
                    <AlertCircle className="size-3 shrink-0" /> {errors.email}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91..."
                      className="pl-10 h-11 rounded-xl border-border/80"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company (optional)</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Acme Inc."
                      className="pl-10 h-11 rounded-xl border-border/80"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="At least 6 characters"
                    className={cn("pl-10 h-11 rounded-xl border-border/80 transition-all focus:ring-2", errors.password && "border-destructive focus-visible:ring-destructive/30")}
                    required
                    minLength={6}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                </div>
                {errors.password && (
                  <p id="password-error" className="text-sm text-destructive flex items-center gap-1 animate-in slide-in-from-left-1">
                    <AlertCircle className="size-3 shrink-0" /> {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className={cn("pl-10 h-11 rounded-xl border-border/80 transition-all focus:ring-2", errors.confirmPassword && "border-destructive focus-visible:ring-destructive/30")}
                    required
                    minLength={6}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
                  />
                </div>
                {errors.confirmPassword && (
                  <p id="confirm-error" className="text-sm text-destructive flex items-center gap-1 animate-in slide-in-from-left-1">
                    <AlertCircle className="size-3 shrink-0" /> {errors.confirmPassword}
                  </p>
                )}
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
                    Creating account…
                  </>
                ) : (
                  'Get started'
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-foreground hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
