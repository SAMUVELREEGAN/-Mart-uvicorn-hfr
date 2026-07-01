import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getVendorPostAuthPath } from '../utils/vendorRedirect';

export function ProtectedRoute({ children, requireVendor = false, requireApproved = false }) {
  const { isAuthenticated, isVendor, vendor, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireVendor && !isVendor) return <Navigate to="/vendor/login" replace />;

  if (requireApproved && vendor) {
    if (vendor.approvalStatus !== 'approved' || vendor.status !== 'active') {
      return <Navigate to={getVendorPostAuthPath(vendor)} replace />;
    }
  }

  return children;
}
