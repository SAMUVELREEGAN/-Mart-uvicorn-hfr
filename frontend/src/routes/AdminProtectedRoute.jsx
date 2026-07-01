import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

export function AdminProtectedRoute({ children }) {
  const { admin, loading } = useAdmin();
  const location = useLocation();
  const hasToken = Boolean(localStorage.getItem('admin_access_token'));

  if (!hasToken) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
