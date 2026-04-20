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
    <div className="min-h-screen flex items-center justify-center bg-surface p-6">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <CardHeader className="text-center py-6 space-y-2">
          <div className="flex justify-center">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
              <Mail className="h-7 w-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-extrabold">Forgot password</CardTitle>
          <CardDescription className="text-sm text-muted-foreground max-w-[28rem] mx-auto">
            Enter your email and we&apos;ll send you a link to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8">
          {success ? (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-sm p-3 rounded-md flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>If an account exists with that email, we&apos;ve sent reset instructions.</span>
              </div>
              {resetLink && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">Development reset link:</p>
                  <a
                    href={resetLink}
                    className="text-primary hover:underline break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {resetLink}
                  </a>
                </div>
              )}
              <div className="text-center pt-2">
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Back to sign in
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
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 py-3 rounded-lg"
                    required
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
                    Sending…
                  </>
                ) : (
                  'Send reset link'
                )}
              </Button>
              <div className="text-center text-sm text-muted-foreground mt-4">
                Remember your password?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
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
