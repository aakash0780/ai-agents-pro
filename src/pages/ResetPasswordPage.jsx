import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authAPI } from '@/lib/api';
import { Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) setError('Missing reset token. Please use the link from your email.');
  }, [token]);

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
      <div className="min-h-screen flex items-center justify-center bg-surface p-6">
        <Card className="w-full max-w-md rounded-2xl shadow-xl">
          <CardContent className="px-6 py-8">
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Missing reset token. Please use the link from your email or request a new one.</span>
            </div>
            <div className="text-center mt-4">
              <Link to="/forgot-password" className="text-primary hover:underline font-medium">
                Request new reset link
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-6">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <CardHeader className="text-center py-6 space-y-2">
          <div className="flex justify-center">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
              <Lock className="h-7 w-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-extrabold">Set new password</CardTitle>
          <CardDescription className="text-sm text-muted-foreground max-w-[28rem] mx-auto">
            Enter your new password below. Use at least 6 characters.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8">
          {success ? (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-sm p-3 rounded-md flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Password has been reset. Redirecting to sign in…</span>
              </div>
              <div className="text-center">
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Go to sign in
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 py-3 rounded-lg"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 py-3 rounded-lg"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full rounded-xl py-3 text-sm font-semibold bg-black text-white"
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
              <div className="text-center text-sm text-muted-foreground mt-4">
                <Link to="/login" className="text-primary hover:underline font-medium">
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
