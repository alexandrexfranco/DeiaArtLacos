import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Protects routes that require authentication.
 * Redirects unauthenticated users to /login,
 * preserving the intended destination via `state.from`.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // While auth state is being resolved, render nothing (avoids flicker)
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
            </div>
        );
    }

    if (!user) {
        // Redirect to /login and remember where the user wanted to go
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
