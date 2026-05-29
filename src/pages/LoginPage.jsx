import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Lock, Mail, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { authAPI, getApiRootUrl } from '@/lib/api';
import { AppleIcon, FacebookIcon, GitHubIcon, GoogleIcon, LinkedInIcon } from '@/components/SocialAuthIcons';

const errorMessages = {
  google_failed: 'Google sign-in failed. Please try again.',
  facebook_failed: 'Facebook sign-in failed. Please try again.',
  github_failed: 'GitHub sign-in failed. Please try again.',
  apple_failed: 'Apple sign-in failed. Please try again.',
  linkedin_failed: 'LinkedIn sign-in failed. Please try again.',
  email_taken: 'An account with this email already exists.',
  missing_tokens: 'The sign-in response was missing tokens. Please try again.',
  parse_failed: 'We could not read the sign-in response. Please try again.',
};

const quotes = [
  {
    text: 'We reduced repetitive support queues within the first month.',
    author: 'Elena Brooks',
    company: 'Northstar Commerce',
  },
  {
    text: 'Lead qualification moved from manual triage to instant routing.',
    author: 'Rahul Menon',
    company: 'PulsePay',
  },
  {
    text: 'Prospects finally get answers after business hours.',
    author: 'Danielle Price',
    company: 'EduPilot',
  },
];

const socialProviders = [
  { id: 'google', label: 'Continue with Google', Icon: GoogleIcon },
  { id: 'facebook', label: 'Continue with Facebook', Icon: FacebookIcon },
  { id: 'github', label: 'GitHub', Icon: GitHubIcon },
  { id: 'apple', label: 'Apple', Icon: AppleIcon },
  { id: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon },
];

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-xs text-[#fb565b]">{message}</p>;
}

function AuthInput({ id, label, icon, error, className = '', children, ...props }) {
  const InputIcon = icon;

  return (
    <label className="block space-y-1.5" htmlFor={id}>
      <span className="text-[13px] text-[#b8b3b0]">{label}</span>
      <span className="relative block">
        <InputIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b949e]" />
        <input
          id={id}
          className={`h-12 w-full rounded-md border bg-[#101010] px-10 text-sm text-[#f2f2f2] outline-none transition placeholder:text-[#8b949e] focus:border-[#00d992] focus:ring-1 focus:ring-[#00d992]/30 ${
            error ? 'border-[#fb565b]' : 'border-[#3d3a39]'
          } ${className}`}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {children}
      </span>
      <FieldError message={error} />
    </label>
  );
}

function SocialButton({ provider, onClick, loadingProvider }) {
  const { Icon } = provider;
  const isLoading = loadingProvider === provider.id;
  return (
    <Motion.button
      type="button"
      onClick={() => onClick(provider.id)}
      disabled={!!loadingProvider}
      whileHover={{ scale: isLoading || loadingProvider ? 1 : 1.02 }}
      whileTap={{ scale: isLoading || loadingProvider ? 1 : 0.98 }}
      className="flex min-h-12 w-full items-center justify-center gap-3 rounded-md border border-[#3d3a39] bg-[#101010] px-4 py-3 text-sm font-medium text-[#f2f2f2] transition-colors hover:border-[#00d992] disabled:opacity-60"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Icon className={`h-5 w-5 ${provider.id === 'facebook' ? 'text-[#1877F2]' : provider.id === 'linkedin' ? 'text-[#0A66C2]' : ''}`} />
      )}
      <span>{provider.label}</span>
    </Motion.button>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const { login, loginWithOtp } = useAuth();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [mode, setMode] = useState('password');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', otp: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  const activeQuote = quotes[quoteIndex];
  const apiRoot = useMemo(() => getApiRootUrl(), []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setQuoteIndex((current) => (current + 1) % quotes.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const errorParam = params.get('error');
    if (errorParam) setError(errorMessages[errorParam] || errorParam.replaceAll('_', ' '));

    if (params.get('registered') === 'true') {
      toast.success('Account created! Please sign in.');
      setSuccess('Account created. Please sign in.');
    }
  }, [params]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: '' }));
    setError('');
  };

  const validatePasswordLogin = () => {
    const nextErrors = {};
    if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = 'Enter a valid email address.';
    if (!formData.password) nextErrors.password = 'Password is required.';
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateEmailOnly = () => {
    const nextErrors = {};
    if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = 'Enter a valid email address.';
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSocialLogin = (provider) => {
    setOauthLoading(provider);
    window.location.href = `${apiRoot}/auth/${provider}`;
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (!validatePasswordLogin()) return;

    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLinkSubmit = async (event) => {
    event.preventDefault();
    if (!validateEmailOnly()) return;

    setLoading(true);
    setError('');

    try {
      await authAPI.sendMagicLink(formData.email);
      setSuccess('Magic link sent. Check your email.');
    } catch (err) {
      setError(err?.message || 'Unable to send magic link.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!validateEmailOnly()) return;

    setLoading(true);
    setError('');

    try {
      await authAPI.sendOtp(formData.email);
      setMode('otp');
      setSuccess('OTP sent. Check your email.');
    } catch (err) {
      setError(err?.message || 'Unable to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    if (!validateEmailOnly()) return;
    if (!formData.otp.trim()) {
      setFieldErrors((current) => ({ ...current, otp: 'Enter the 6-digit code.' }));
      return;
    }

    setLoading(true);
    setError('');

    try {
      await loginWithOtp(formData.email, formData.otp);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#f2f2f2] lg:flex">
      <aside className="relative hidden min-h-screen w-1/2 overflow-hidden border-r border-[#3d3a39] bg-[#050507] lg:flex">
        <div className="absolute inset-0 auth-dot-grid opacity-70" />
        <div className="relative z-10 mx-auto flex w-full max-w-md flex-col justify-center px-10">
          <Motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#00d992]/40 bg-[#101010] text-[#00d992] logo-glow"
          >
            <Zap className="h-9 w-9" />
          </Motion.div>
          <h2 className="text-3xl font-normal text-[#f2f2f2]">AI Agents Pro</h2>
          <p className="mt-3 text-base leading-7 text-[#b8b3b0]">Transform your business with intelligent AI agents.</p>

          <div className="mt-10 space-y-3">
            {[
              ['500+', 'businesses automated'],
              ['10M+', 'conversations handled'],
              ['99.9%', 'uptime guaranteed'],
            ].map(([value, label], index) => (
              <Motion.div
                key={label}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, delay: index * 0.35, ease: 'easeInOut' }}
                className="rounded-lg border border-[#3d3a39] bg-[#101010]/80 p-4"
              >
                <p className="text-xl font-semibold text-[#00d992]">{value}</p>
                <p className="text-sm text-[#b8b3b0]">{label}</p>
              </Motion.div>
            ))}
          </div>

          <div className="mt-10 min-h-32 border-t border-[#3d3a39] pt-6">
            <AnimatePresence mode="wait">
              <Motion.blockquote
                key={activeQuote.text}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-lg leading-7 text-[#f2f2f2]">"{activeQuote.text}"</p>
                <footer className="mt-4 text-sm text-[#8b949e]">
                  {activeQuote.author}, {activeQuote.company}
                </footer>
              </Motion.blockquote>
            </AnimatePresence>
          </div>
        </div>
      </aside>

      <main className="flex min-h-screen flex-1 items-center justify-center overflow-y-auto px-4 py-24 sm:px-6 lg:w-1/2">
        <div className="w-full max-w-[440px]">
          <Motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-[#3d3a39] bg-[#101010] p-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:p-10"
          >
            <div className="mb-8">
              <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#f2f2f2] no-underline">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#3d3a39] text-[#00d992]">
                  <Zap className="h-4 w-4" />
                </span>
                AI Agents Pro
              </Link>
              <h1 className="text-[28px] font-normal text-[#f2f2f2]">Welcome back</h1>
              <p className="mt-1 text-sm text-[#8b949e]">Sign in to your account</p>
            </div>

            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {socialProviders.slice(0, 2).map((provider) => (
                  <SocialButton key={provider.id} provider={provider} onClick={handleSocialLogin} loadingProvider={oauthLoading} />
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {socialProviders.slice(2, 4).map((provider) => (
                  <SocialButton key={provider.id} provider={provider} onClick={handleSocialLogin} loadingProvider={oauthLoading} />
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <SocialButton provider={socialProviders[4]} onClick={handleSocialLogin} loadingProvider={oauthLoading} />
                <Motion.button
                  type="button"
                  onClick={() => {
                    setMode('magic');
                    setSuccess('');
                    setError('');
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex min-h-12 w-full items-center justify-center gap-3 rounded-md border border-[#3d3a39] bg-[#101010] px-4 py-3 text-sm font-medium text-[#f2f2f2] transition-colors hover:border-[#00d992]"
                >
                  <KeyRound className="h-5 w-5 text-[#00d992]" />
                  <span>Magic Link</span>
                </Motion.button>
              </div>
            </div>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-[#3d3a39]" />
              <span className="text-xs uppercase tracking-[0.18em] text-[#8b949e]">Or continue with email</span>
              <span className="h-px flex-1 bg-[#3d3a39]" />
            </div>

            {error ? (
              <Motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex gap-2 rounded-md border border-[#fb565b] bg-[#fb565b]/10 p-3 text-sm text-[#f2f2f2]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#fb565b]" />
                <span>{error}</span>
              </Motion.div>
            ) : null}

            {success ? (
              <Motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex gap-2 rounded-md border border-[#00d992] bg-[#00d992]/10 p-3 text-sm text-[#f2f2f2]"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00d992]" />
                <span>{success}</span>
              </Motion.div>
            ) : null}

            {mode === 'password' ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4" noValidate>
                <AuthInput
                  id="email"
                  label="Email address"
                  icon={Mail}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={updateField}
                  placeholder="you@example.com"
                  error={fieldErrors.email}
                />
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-[13px] text-[#b8b3b0]">Password</label>
                    <Link to="/forgot-password" className="text-xs font-medium text-[#00d992] no-underline hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <span className="relative block">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b949e]" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={updateField}
                      placeholder="Password"
                      className={`h-12 w-full rounded-md border bg-[#101010] px-10 pr-12 text-sm text-[#f2f2f2] outline-none transition placeholder:text-[#8b949e] focus:border-[#00d992] focus:ring-1 focus:ring-[#00d992]/30 ${
                        fieldErrors.password ? 'border-[#fb565b]' : 'border-[#3d3a39]'
                      }`}
                      aria-invalid={Boolean(fieldErrors.password)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b949e] transition-colors hover:text-[#f2f2f2]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </span>
                  <FieldError message={fieldErrors.password} />
                </div>

                <Motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.99 }}
                  className="flex h-12 w-full items-center justify-center rounded-md bg-[#00d992] text-sm font-bold text-[#050507] transition hover:bg-[#2fd6a1] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : 'Sign in'}
                </Motion.button>
              </form>
            ) : null}

            {mode === 'magic' ? (
              <form onSubmit={handleMagicLinkSubmit} className="space-y-4" noValidate>
                <AuthInput
                  id="magic-email"
                  label="Email address"
                  icon={Mail}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={updateField}
                  placeholder="you@example.com"
                  error={fieldErrors.email}
                />
                <Motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.99 }}
                  className="flex h-12 w-full items-center justify-center rounded-md bg-[#00d992] text-sm font-bold text-[#050507] transition hover:bg-[#2fd6a1] disabled:opacity-70"
                >
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Send Magic Link'}
                </Motion.button>
                <button type="button" onClick={handleSendOtp} className="w-full text-center text-sm text-[#00d992] hover:underline">
                  Send one-time code instead
                </button>
                <button type="button" onClick={() => setMode('password')} className="w-full text-center text-sm text-[#8b949e] hover:text-[#f2f2f2]">
                  Back to password login
                </button>
              </form>
            ) : null}

            {mode === 'otp' ? (
              <form onSubmit={handleOtpSubmit} className="space-y-4" noValidate>
                <AuthInput
                  id="otp-email"
                  label="Email address"
                  icon={Mail}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={updateField}
                  placeholder="you@example.com"
                  error={fieldErrors.email}
                />
                <AuthInput
                  id="otp"
                  label="One-time code"
                  icon={KeyRound}
                  name="otp"
                  inputMode="numeric"
                  value={formData.otp}
                  onChange={updateField}
                  placeholder="123456"
                  error={fieldErrors.otp}
                />
                <Motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.99 }}
                  className="flex h-12 w-full items-center justify-center rounded-md bg-[#00d992] text-sm font-bold text-[#050507] transition hover:bg-[#2fd6a1] disabled:opacity-70"
                >
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : 'Verify code'}
                </Motion.button>
                <button type="button" onClick={() => setMode('password')} className="w-full text-center text-sm text-[#8b949e] hover:text-[#f2f2f2]">
                  Back to password login
                </button>
              </form>
            ) : null}

            <div className="mt-6 space-y-3 text-center">
              <p className="text-sm text-[#8b949e]">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="font-medium text-[#00d992] no-underline hover:underline">
                  Sign up
                </Link>
              </p>
              <p className="text-[11px] leading-5 text-[#8b949e]">
                By signing in, you agree to our Terms and Privacy Policy.
              </p>
            </div>
          </Motion.section>

          <div className="mt-6 flex items-center justify-center text-sm text-[#8b949e]">
            <div className="mr-3 flex -space-x-2">
              {['NS', 'PP', 'VO', 'MF', 'EP'].map((item) => (
                <span key={item} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#050507] bg-[#101010] text-[10px] text-[#00d992]">
                  {item}
                </span>
              ))}
            </div>
            Join 500+ businesses
          </div>
        </div>
      </main>
    </div>
  );
}
