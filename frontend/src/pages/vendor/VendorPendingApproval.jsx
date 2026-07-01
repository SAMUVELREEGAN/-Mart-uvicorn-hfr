import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useVendorConfig } from '../../contexts/VendorConfigContext';
import { Icon } from '../../utils/iconResolver';
import { getVendorPostAuthPath } from '../../utils/vendorRedirect';
import './VendorRegistration.css';

export default function VendorPendingApproval() {
  const { vendor, isVendor } = useAuth();
  const { config } = useVendorConfig();
  const navigate = useNavigate();
  const ui = config.ui?.pendingApproval || {};

  useEffect(() => {
    if (!isVendor) return;
    if (vendor?.approvalStatus !== 'pending') {
      navigate(getVendorPostAuthPath(vendor), { replace: true });
    }
  }, [vendor, isVendor, navigate]);

  return (
    <div className="vendor-pending">
      <div className="vendor-pending__card">
        <Icon name={ui.icon || 'FaClock'} className="vendor-pending__icon" />
        <h1 className="vendor-pending__title">{ui.title}</h1>
        <p className="vendor-pending__message">{ui.message}</p>
        <span className="vendor-pending__status">{ui.statusLabel}</span>
      </div>
    </div>
  );
}
