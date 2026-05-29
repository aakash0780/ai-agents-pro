import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authAPI } from '@/lib/api';
import { Lock, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

function getPasswordStrength(password) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
    password.length >= 12,
  ];
  const score = checks.filter(Boolean).length;
  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
  const tones = ['bg-red-500', 'bg-red-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500', 'bg-emerald-500'];
  return { score, label: labels[score], toneClass: tones[score] };
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) setError('Missing reset token. Please use the link from your email.');
  }, [token]);
  const passwordStrength = getPasswordStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authAPI.resetPassword(token, newPassword);
      setSuccess(true);
      toast.success('Password reset. You can now sign in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const message = typeof err?.message === 'string' ? err.message : (err && typeof err === 'object' ? JSON.stringify(err) : String(err));
      setError(message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050507] p-6 pt-24 text-[#f2f2f2]">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <span className="absolute left-[12%] top-28 h-px w-52 bg-gradient-to-r from-transparent via-[#00d992]/40 to-transparent" />
          <span className="absolute right-[16%] top-32 h-44 w-44 rounded-full border border-[#00d992]/10 shadow-[0_0_70px_rgba(0,217,146,0.08)]" />
        </div>
        <Card className="relative w-full max-w-md rounded-lg border-[#3d3a39] bg-[#101010]/95 shadow-[0_24px_80px_rgba(0,0,0,0.45),rgba(92,88,85,0.2)_0_0_18px] backdrop-blur">
          <CardContent className="px-6 py-8">
            <div className="flex items-center gap-2 rounded-md border border-[#fb565b]/30 bg-[#fb565b]/10 p-3 text-sm text-[#ffb4b4]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Missing reset token. Please use the link from your email or request a new one.</span>
            </div>
            <div className="text-center mt-4">
              <Link to="/forgot-password" className="font-medium text-[#00d992] hover:underline">
                Request new reset link
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <Lock className="h-7 w-7 text-[#00d992]" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-[#f2f2f2]">Set new password</CardTitle>
          <CardDescription className="mx-auto max-w-[28rem] text-sm leading-6 text-[#8b949e]">
            Enter your new password below. Use at least 6 characters.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8">
          {success ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-md border border-[#00d992]/25 bg-[#00d992]/10 p-3 text-sm text-[#bfffea]">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Password has been reset. Redirecting to sign in…</span>
              </div>
              <div className="text-center">
                <Link to="/login" className="font-medium text-[#00d992] hover:underline">
                  Go to sign in
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
                <Label htmlFor="newPassword" className="text-[#b8b3b0]">New password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-[#8b949e]" />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rounded-md border-[#3d3a39] bg-[#050507] py-3 pl-10 pr-12 text-[#f2f2f2] placeholder:text-[#8b949e] focus-visible:ring-[#00d992]"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] transition-colors hover:text-[#f2f2f2]"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {newPassword ? (
                  <div className="space-y-1">
                    <div className="h-1.5 w-full rounded-full bg-[#050507]">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-200 ${passwordStrength.toneClass}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-xs text-[#8b949e]">Strength: {passwordStrength.label}</p>
                  </div>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#b8b3b0]">Confirm password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-[#8b949e]" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rounded-md border-[#3d3a39] bg-[#050507] py-3 pl-10 pr-12 text-[#f2f2f2] placeholder:text-[#8b949e] focus-visible:ring-[#00d992]"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] transition-colors hover:text-[#f2f2f2]"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
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
                    Resetting…
                  </>
                ) : (
                  'Reset password'
                )}
              </Button>
              <div className="mt-4 text-center text-sm text-[#8b949e]">
                <Link to="/login" className="font-medium text-[#00d992] hover:underline">
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
