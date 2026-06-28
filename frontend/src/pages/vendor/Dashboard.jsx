import { useNavigate } from 'react-router-dom';
import sidebarConfig from '../../json/sidebar.json';
import { useAuth } from '../../contexts/AuthContext';
import { useVendor } from '../../contexts/VendorContext';
import { Icon } from '../../utils/iconResolver';
import Card from '../../components/common/Card';
import VendorProducts from './Products';
import VendorServices from './Services';
import './VendorPages.css';

export default function Dashboard() {
  const { vendor, stats } = useVendor();
  const { businessType } = useAuth();
  const navigate = useNavigate();
  const dashConfig = sidebarConfig.dashboard;

  const showProducts = businessType === 'product' || businessType === 'both';
  const showServices = businessType === 'service' || businessType === 'both';

  const statCards = [
    ...(showProducts ? [{ key: 'totalProducts', label: 'Products', icon: 'FaBox', path: '/vendor/products' }] : []),
    ...(showServices ? [{ key: 'totalServices', label: 'Services', icon: 'FaConciergeBell', path: '/vendor/services' }] : []),
    ...(showProducts ? [{ key: 'avgProductRating', label: 'Avg Product Rating', icon: 'FaStar' }] : []),
    ...(showServices ? [{ key: 'avgServiceRating', label: 'Avg Service Rating', icon: 'FaStar' }] : []),
  ];

  return (
    <div className="vendor-page">
      <h1 className="vendor-page__title">
        {dashConfig.welcome}, {vendor?.businessName || vendor?.ownerName}
      </h1>
      <p className="vendor-page__subtitle">{dashConfig.subtitle}</p>

      {statCards.length > 0 && (
        <div className="vendor-page__stats">
          {statCards.map((card) => (
            <Card
              key={card.key}
              hoverable={!!card.path}
              className="vendor-page__stat"
              onClick={card.path ? () => navigate(card.path) : undefined}
            >
              <Icon name={card.icon} className="vendor-page__stat-icon" />
              <div className="vendor-page__stat-value">{stats[card.key]}</div>
              <div className="vendor-page__stat-label">{card.label}</div>
            </Card>
          ))}
        </div>
      )}

      {showProducts && (
        <section className="vendor-page__dashboard-section">
          <h2 className="vendor-page__section-title">
            <Icon name={dashConfig.productSection.icon} />
            {dashConfig.productSection.title}
          </h2>
          <VendorProducts embedded />
        </section>
      )}

      {showServices && (
        <section className="vendor-page__dashboard-section">
          <h2 className="vendor-page__section-title">
            <Icon name={dashConfig.serviceSection.icon} />
            {dashConfig.serviceSection.title}
          </h2>
          <VendorServices embedded />
        </section>
      )}
    </div>
  );
}
