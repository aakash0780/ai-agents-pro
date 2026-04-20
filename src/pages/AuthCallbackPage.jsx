import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function AuthCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { checkAuth } = useAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token');
            const errorParam = searchParams.get('error');

            if (errorParam) {
                setError(errorParam);
                toast.error('Authentication failed', { description: errorParam });
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            if (token) {
                try {
                    localStorage.setItem('authToken', token);
                    // Verify token and update user state
                    await checkAuth();
                    toast.success('Successfully logged in via social account');
                    navigate('/dashboard', { replace: true });
                } catch (err) {
                    console.error('Callback error:', err);
                    setError('Failed to verify session');
                    setTimeout(() => navigate('/login'), 2000);
                }
            } else {
                setError('No token received');
                setTimeout(() => navigate('/login'), 2000);
            }
        };

        handleCallback();
    }, [searchParams, navigate, checkAuth]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                {error ? (
                    <div className="text-destructive font-medium mb-4">
                        {error}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Completing secure sign in...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
