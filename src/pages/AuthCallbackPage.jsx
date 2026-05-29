import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const rawError = searchParams.get('error');
  const error = rawError ? decodeURIComponent(rawError).replace(/_/g, ' ') : null;

  useEffect(() => {
    if (error) {
      toast.error('Authentication failed', { description: error });
      const t = setTimeout(() => navigate('/login', { replace: true }), 2500);
      return () => clearTimeout(t);
    }
    navigate('/dashboard', { replace: true });
  }, [error, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        {error ? (
          <div className="text-destructive font-medium mb-4">{error}</div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  );
}
