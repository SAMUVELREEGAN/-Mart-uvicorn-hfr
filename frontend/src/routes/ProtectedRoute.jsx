import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children, requireVendor = false }) {
  const { isAuthenticated, isVendor } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireVendor && !isVendor) return <Navigate to="/vendor/login" replace />;

  return children;
}
