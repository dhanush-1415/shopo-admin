/**
 * Protected Route Component
 * Protects routes that require authentication
 */
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export function ProtectedRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = !!accessToken;
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

