import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authAPI } from '@/lib/api';
import { Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [resetLink, setResetLink] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setResetLink(null);
    try {
      const res = await authAPI.forgotPassword(email);
      setSuccess(true);
      if (res.resetLink) setResetLink(res.resetLink);
    } catch (err) {
      const message = typeof err?.message === 'string' ? err.message : (err && typeof err === 'object' ? JSON.stringify(err) : String(err));
      setError(message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050507] p-6 pt-24 text-[#f2f2f2]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute left-[12%] top-28 h-px w-52 bg-gradient-to-r from-transparent via-[#00d992]/40 to-transparent" />
        <span className="absolute right-[16%] top-32 h-44 w-44 rounded-full border border-[#00d992]/10 shadow-[0_0_70px_rgba(0,217,146,0.08)]" />
      </div>
      <Card className="relative w-full max-w-md rounded-lg border-[#3d3a39] bg-[#101010]/95 shadow-[0_24px_80px_rgba(0,0,0,0.45),rgba(92,88,85,0.2)_0_0_18px] backdrop-blur">
        <CardHeader className="text-center py-6 space-y-2">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-[#00d992]/35 bg-[#0d1512] shadow-[0_0_24px_rgba(0,217,146,0.18)]">
              <Mail className="h-7 w-7 text-[#00d992]" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-[#f2f2f2]">Forgot password</CardTitle>
          <CardDescription className="mx-auto max-w-[28rem] text-sm leading-6 text-[#8b949e]">
            Enter your email and we&apos;ll send you a link to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8">
          {success ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-md border border-[#00d992]/25 bg-[#00d992]/10 p-3 text-sm text-[#bfffea]">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>If an account exists with that email, we&apos;ve sent reset instructions.</span>
              </div>
              {resetLink && (
                <div className="space-y-1 text-sm text-[#8b949e]">
                  <p className="font-medium text-[#f2f2f2]">Development reset link:</p>
                  <a
                    href={resetLink}
                    className="break-all text-[#00d992] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {resetLink}
                  </a>
                </div>
              )}
              <div className="text-center pt-2">
                <Link to="/login" className="font-medium text-[#00d992] hover:underline">
                  Back to sign in
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-md border border-[#fb565b]/30 bg-[#fb565b]/10 p-3 text-sm text-[#ffb4b4]">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#b8b3b0]">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-[#8b949e]" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="rounded-md border-[#3d3a39] bg-[#050507] py-3 pl-10 text-[#f2f2f2] placeholder:text-[#8b949e] focus-visible:ring-[#00d992]"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full rounded-md border border-[#00d992]/60 bg-[#00d992] py-3 text-sm font-semibold text-[#050507] hover:bg-[#2fd6a1]"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending…
                  </>
                ) : (
                  'Send reset link'
                )}
              </Button>
              <div className="mt-4 text-center text-sm text-[#8b949e]">
                Remember your password?{' '}
                <Link to="/login" className="font-medium text-[#00d992] hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
