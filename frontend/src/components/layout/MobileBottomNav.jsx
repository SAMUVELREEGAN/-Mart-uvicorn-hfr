import { useCmsContent } from '../../contexts';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '../../utils/iconResolver';
import { useAuth } from '../../contexts/AuthContext';
import './MobileBottomNav.css';

export default function MobileBottomNav() {
  const headerConfig = useCmsContent('header');
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  const config = headerConfig.bottomNavigation;

  const isActive = (item) => {
    if (item.match === 'exact') return pathname === item.path;
    return pathname === item.path || pathname.startsWith(`${item.path}/`);
  };

  const resolvePath = (item) => {
    if (item.authRequired && !isAuthenticated) return item.guestPath || '/login';
    return item.path;
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {config.items.map((item) => {
        const path = resolvePath(item);
        const active = isActive({ ...item, path: item.path });
        return (
          <Link
            key={item.label}
            to={path}
            className={`mobile-bottom-nav__item ${active ? 'mobile-bottom-nav__item--active' : ''}`}
          >
            <Icon name={item.icon} className="mobile-bottom-nav__icon" />
            <span className="mobile-bottom-nav__label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
