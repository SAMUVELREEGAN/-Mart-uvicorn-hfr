import { useCmsContent } from '../contexts';
import { Outlet, NavLink } from 'react-router-dom';
import { Icon } from '../utils/iconResolver';
import { useAuth } from '../contexts/AuthContext';
import './VendorLayout.css';

export default function VendorLayout() {
  const dashboardsConfig = useCmsContent('dashboards');
  const { businessType } = useAuth();
  const config = dashboardsConfig.vendor;

  const filteredNav = config.sidebarNav.filter(
    (item) => !item.showFor || item.showFor.includes(businessType)
  );

  return (
    <div className="vendor-layout">
      <aside className="vendor-layout__sidebar">
        <div className="vendor-layout__brand">
          <Icon name={config.brand.icon} />
          <span>{config.brand.label}</span>
        </div>
        <nav className="vendor-layout__nav">
          {filteredNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `vendor-layout__link ${isActive ? 'vendor-layout__link--active' : ''}`}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="vendor-layout__main">
        <Outlet />
      </main>
    </div>
  );
}
