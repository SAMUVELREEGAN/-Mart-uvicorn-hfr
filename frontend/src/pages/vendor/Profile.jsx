import { useVendor } from '../../contexts/VendorContext';
import { Icon } from '../../utils/iconResolver';
import Card from '../../components/common/Card';
import './VendorPages.css';

export default function VendorProfile() {
  const { vendor } = useVendor();

  if (!vendor) return null;

  return (
    <div className="vendor-page">
      <h1 className="vendor-page__title">Business Profile</h1>
      <Card className="vendor-page__profile">
        <div className="vendor-page__profile-avatar">
          <Icon name="FaStore" />
        </div>
        <div className="vendor-page__profile-info">
          {[
            { label: 'Business Name', value: vendor.businessName },
            { label: 'Owner', value: vendor.ownerName },
            { label: 'Email', value: vendor.email },
            { label: 'Phone', value: vendor.phone },
            { label: 'Address', value: vendor.address },
            { label: 'Category', value: vendor.category },
          ].filter((f) => f.value).map((field) => (
            <div key={field.label} className="vendor-page__profile-field">
              <span className="vendor-page__profile-label">{field.label}</span>
              <span>{field.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
