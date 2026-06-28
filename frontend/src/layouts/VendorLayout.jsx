import { Outlet, NavLink } from 'react-router-dom';
import sidebarConfig from '../json/sidebar.json';
import { Icon } from '../utils/iconResolver';
import { useAuth } from '../contexts/AuthContext';
import './VendorLayout.css';

export default function VendorLayout() {
  const { businessType } = useAuth();

  const filteredNav = sidebarConfig.vendorNav.filter(
    (item) => !item.showFor || item.showFor.includes(businessType)
  );

  return (
    <div className="vendor-layout">
      <aside className="vendor-layout__sidebar">
        <div className="vendor-layout__brand">
          <Icon name="FaStore" />
          <span>Vendor Panel</span>
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
