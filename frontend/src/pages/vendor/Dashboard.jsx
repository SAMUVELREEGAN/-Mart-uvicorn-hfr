import { useNavigate } from 'react-router-dom';
import dashboardsConfig from '../../json/dashboards.json';
import { useAuth } from '../../contexts/AuthContext';
import { useVendor } from '../../contexts/VendorContext';
import { Icon } from '../../utils/iconResolver';
import Card from '../../components/common/Card';
import DashboardSectionGrid from '../../components/common/DashboardSectionGrid';
import VendorProducts from './Products';
import VendorServices from './Services';
import './VendorPages.css';

function filterByBusinessType(items, businessType) {
  return items.filter((item) => !item.showFor || item.showFor.includes(businessType));
}

export default function Dashboard() {
  const { vendor, stats } = useVendor();
  const { businessType } = useAuth();
  const navigate = useNavigate();
  const config = dashboardsConfig.vendor;

  const showProducts = businessType === 'product' || businessType === 'both';
  const showServices = businessType === 'service' || businessType === 'both';

  const statCards = [
    ...(showProducts ? [{ key: 'totalProducts', label: 'Products', icon: 'FaBox', path: '/vendor/products' }] : []),
    ...(showServices ? [{ key: 'totalServices', label: 'Services', icon: 'FaConciergeBell', path: '/vendor/services' }] : []),
    ...(showProducts ? [{ key: 'avgProductRating', label: 'Avg Product Rating', icon: 'FaStar' }] : []),
    ...(showServices ? [{ key: 'avgServiceRating', label: 'Avg Service Rating', icon: 'FaStar' }] : []),
  ];

  const businessTypeLabel = config.businessTypeLabels[businessType] || businessType;

  const infoResolver = (key) => {
    if (key === 'businessType') return businessTypeLabel;
    return null;
  };

  const vendorFeatures = filterByBusinessType(config.vendorFeaturesSection.items, businessType);

  return (
    <div className="vendor-page vendor-dashboard">
      <h1 className="vendor-page__title">
        {config.welcome}, {vendor?.businessName || vendor?.ownerName}
      </h1>
      <p className="vendor-page__subtitle">{config.subtitle}</p>

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

      <section className="vendor-dashboard__section">
        <h2 className="vendor-page__section-title">{config.profileSection.title}</h2>
        <DashboardSectionGrid
          sections={config.profileSection.items}
          infoResolver={infoResolver}
        />
      </section>

      <section className="vendor-dashboard__section">
        <h2 className="vendor-page__section-title">{config.userFeaturesSection.title}</h2>
        <DashboardSectionGrid sections={config.userFeaturesSection.items} />
      </section>

      <section className="vendor-dashboard__section">
        <h2 className="vendor-page__section-title">{config.vendorFeaturesSection.title}</h2>
        <DashboardSectionGrid sections={vendorFeatures} />
      </section>

      {showProducts && (
        <section className="vendor-page__dashboard-section">
          <h2 className="vendor-page__section-title">
            <Icon name={config.overviewSection.productSection.icon} />
            {config.overviewSection.productSection.title}
          </h2>
          <VendorProducts embedded />
        </section>
      )}

      {showServices && (
        <section className="vendor-page__dashboard-section">
          <h2 className="vendor-page__section-title">
            <Icon name={config.overviewSection.serviceSection.icon} />
            {config.overviewSection.serviceSection.title}
          </h2>
          <VendorServices embedded />
        </section>
      )}
    </div>
  );
}
