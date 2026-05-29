import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * Wraps a route so it only renders when the user is authenticated.
 * Redirects to /login with a return URL otherwise.
 */
export function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground" role="status" aria-live="polite">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && String(user?.role || '').toUpperCase() !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
