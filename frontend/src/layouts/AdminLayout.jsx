import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FaBox, FaCog, FaConciergeBell, FaHome, FaImage, FaList, FaQuestionCircle,
  FaShoppingCart, FaStar, FaStore, FaTachometerAlt, FaTags, FaThLarge, FaUser, FaUsers, FaClipboardList, FaClipboardCheck,
} from 'react-icons/fa';
import { useAdmin } from '../contexts/AdminContext';
import { adminNavGroups } from '../admin/config/nav';
import '../admin/styles/admin.css';

const iconMap = {
  dashboard: FaTachometerAlt,
  users: FaUsers,
  vendors: FaStore,
  products: FaBox,
  services: FaConciergeBell,
  categories: FaThLarge,
  subcategories: FaTags,
  brands: FaStore,
  orders: FaShoppingCart,
  bookings: FaList,
  reviews: FaStar,
  banners: FaImage,
  highlights: FaThLarge,
  sections: FaHome,
  faq: FaQuestionCircle,
  settings: FaCog,
  profile: FaUser,
  vendorConfig: FaClipboardList,
  vendorApplications: FaClipboardCheck,
};

export default function AdminLayout() {
  const { admin, loading, logout } = useAdmin();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  if (loading) return <div className="admin-loading">Loading admin panel...</div>;
  if (!admin) return null;

  return (
    <div className="admin-layout">
      <button type="button" className="admin-sidebar-toggle" onClick={() => setSidebarOpen((o) => !o)} aria-label="Toggle menu">☰</button>
      {sidebarOpen && <button type="button" className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />}

      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__brand">
          MartPlace
          <span>Admin Console</span>
        </div>
        <nav className="admin-sidebar__nav">
          {adminNavGroups.map((group) => (
            <div key={group.title} className={`admin-sidebar__group ${group.isCms ? 'admin-sidebar__group--cms' : ''}`}>
              <div className="admin-sidebar__group-title">{group.title}</div>
              {group.items.map((item) => {
                const Icon = iconMap[item.icon] || FaList;
                return (
                  <NavLink
                    key={item.key}
                    to={item.path}
                    end={item.end}
                    className="admin-sidebar__link"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon />
                    {item.title}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
        <Link to="/" className="admin-sidebar__link admin-sidebar__back" onClick={() => setSidebarOpen(false)}>
          ← Back to storefront
        </Link>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header__user">
            <span className="admin-header__name">{admin.name}</span>
            <span className="admin-header__email">{admin.email}</span>
          </div>
          <div className="admin-header__actions">
            <Link to="/admin/profile" className="admin-header__link">Profile</Link>
            <button type="button" onClick={handleLogout} className="admin-header__logout">Logout</button>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
