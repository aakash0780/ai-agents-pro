import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Check, Eye, EyeOff, KeyRound, Loader2, Lock, Mail, User, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { getApiRootUrl } from '@/lib/api';
import { AppleIcon, FacebookIcon, GitHubIcon, GoogleIcon, LinkedInIcon } from '@/components/SocialAuthIcons';

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

function getPasswordStrength(password) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-[#fb565b]', 'bg-[#fb565b]', 'bg-[#ffba00]', 'bg-[#2fd6a1]', 'bg-[#00d992]'];
  return { score, label: labels[score], color: colors[score] };
}

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

function SocialButton({ provider, onClick }) {
  const { Icon } = provider;
  return (
    <Motion.button
      type="button"
      onClick={() => onClick(provider.id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex min-h-12 w-full items-center justify-center gap-3 rounded-md border border-[#3d3a39] bg-[#101010] px-4 py-3 text-sm font-medium text-[#f2f2f2] transition-colors hover:border-[#00d992]"
    >
      <Icon className={`h-5 w-5 ${provider.id === 'facebook' ? 'text-[#1877F2]' : provider.id === 'linkedin' ? 'text-[#0A66C2]' : ''}`} />
      <span>{provider.label}</span>
    </Motion.button>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const activeQuote = quotes[quoteIndex];
  const apiRoot = useMemo(() => getApiRootUrl(), []);
  const passwordStrength = getPasswordStrength(formData.password);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setQuoteIndex((current) => (current + 1) % quotes.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: '' }));
    setError('');
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = 'Full name is required.';
    if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = 'Enter a valid email address.';
    if (formData.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.';
    if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.';
    if (!acceptedTerms) nextErrors.terms = 'You must accept the terms to continue.';
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${apiRoot}/auth/${provider}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/login?registered=true', { replace: true });
    } catch (err) {
      const message = err?.message || 'Unable to create account.';
      setError(message);
      toast.error(message);
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
          <p className="mt-3 text-base leading-7 text-[#b8b3b0]">Start your 14-day free trial with intelligent AI agents.</p>

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
              <h1 className="text-[28px] font-normal text-[#f2f2f2]">Create your account</h1>
              <p className="mt-1 text-sm text-[#8b949e]">Start your 14-day free trial. No credit card required.</p>
            </div>

            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {socialProviders.slice(0, 2).map((provider) => (
                  <SocialButton key={provider.id} provider={provider} onClick={handleSocialLogin} />
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {socialProviders.slice(2, 4).map((provider) => (
                  <SocialButton key={provider.id} provider={provider} onClick={handleSocialLogin} />
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <SocialButton provider={socialProviders[4]} onClick={handleSocialLogin} />
                <Motion.button
                  type="button"
                  onClick={() => navigate('/login')}
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

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <AuthInput
                id="name"
                label="Full Name"
                icon={User}
                name="name"
                type="text"
                value={formData.name}
                onChange={updateField}
                placeholder="Aakash Mali"
                error={fieldErrors.name}
              />
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
                <label htmlFor="password" className="text-[13px] text-[#b8b3b0]">Password</label>
                <span className="relative block">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b949e]" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={updateField}
                    placeholder="At least 8 characters"
                    className={`h-12 w-full rounded-md border bg-[#101010] px-10 pr-12 text-sm text-[#f2f2f2] outline-none transition placeholder:text-[#8b949e] focus:border-[#00d992] focus:ring-1 focus:ring-[#00d992]/30 ${
                      fieldErrors.password ? 'border-[#fb565b]' : 'border-[#3d3a39]'
                    }`}
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
                {formData.password ? (
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-4 gap-1">
                      {[1, 2, 3, 4].map((segment) => (
                        <span
                          key={segment}
                          className={`h-1.5 rounded-full ${passwordStrength.score >= segment ? passwordStrength.color : 'bg-[#3d3a39]'}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-[#8b949e]">Strength: {passwordStrength.label}</p>
                  </div>
                ) : null}
                <FieldError message={fieldErrors.password} />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-[13px] text-[#b8b3b0]">Confirm Password</label>
                <span className="relative block">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b949e]" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={updateField}
                    placeholder="Confirm password"
                    className={`h-12 w-full rounded-md border bg-[#101010] px-10 pr-12 text-sm text-[#f2f2f2] outline-none transition placeholder:text-[#8b949e] focus:border-[#00d992] focus:ring-1 focus:ring-[#00d992]/30 ${
                      fieldErrors.confirmPassword ? 'border-[#fb565b]' : 'border-[#3d3a39]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b949e] transition-colors hover:text-[#f2f2f2]"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
                <FieldError message={fieldErrors.confirmPassword} />
              </div>

              <div className="space-y-1">
                <label className="flex items-start gap-3 text-sm text-[#b8b3b0]">
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${acceptedTerms ? 'border-[#00d992] bg-[#00d992] text-[#050507]' : 'border-[#3d3a39] bg-[#101010]'}`}>
                    {acceptedTerms ? <Check className="h-3.5 w-3.5" /> : null}
                  </span>
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => {
                      setAcceptedTerms(event.target.checked);
                      setFieldErrors((current) => ({ ...current, terms: '' }));
                    }}
                    className="sr-only"
                  />
                  <span>I agree to the Terms of Service and Privacy Policy.</span>
                </label>
                <FieldError message={fieldErrors.terms} />
              </div>

              <Motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                className="flex h-12 w-full items-center justify-center rounded-md bg-[#00d992] text-sm font-bold text-[#050507] transition hover:bg-[#2fd6a1] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</> : 'Create Account'}
              </Motion.button>
            </form>

            <div className="mt-6 space-y-3 text-center">
              <p className="text-sm text-[#8b949e]">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-[#00d992] no-underline hover:underline">
                  Sign in
                </Link>
              </p>
              <p className="text-[11px] leading-5 text-[#8b949e]">
                By creating an account, you agree to our Terms and Privacy Policy.
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
