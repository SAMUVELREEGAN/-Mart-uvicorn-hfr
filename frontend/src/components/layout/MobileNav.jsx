import { useCmsContent } from '../../contexts';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../utils/iconResolver';
import { useAuth } from '../../contexts/AuthContext';
import Select from '../common/Select';
import { useLocation } from '../../contexts/LocationContext';
import './MobileNav.css';

export default function MobileNav({ isOpen, onClose }) {
  const headerConfig = useCmsContent('header');
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { locations, selectedLocation, selectLocation } = useLocation();
  const config = headerConfig.mobileMenu;

  const handleLocationChange = (e) => {
    const loc = locations.find((l) => l.id === e.target.value);
    if (loc) selectLocation(loc);
  };

  const handleNav = (path) => {
    onClose();
    navigate(path);
  };

  const visibleLinks = config.links.filter((link) => {
    if (link.hideWhenAuth && isAuthenticated) return false;
    if (link.authRequired && !isAuthenticated) return false;
    return true;
  });

  return (
    <>
      <div
        className={`mobile-nav-overlay ${isOpen ? 'mobile-nav-overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <aside
        className={`mobile-nav ${isOpen ? 'mobile-nav--open' : ''}`}
        aria-hidden={!isOpen}
        role="dialog"
        aria-label={config.title}
      >
        <div className="mobile-nav__header">
          <div>
            <h2 className="mobile-nav__title">{config.title}</h2>
            {config.subtitle && <p className="mobile-nav__subtitle">{config.subtitle}</p>}
          </div>
          <button type="button" className="mobile-nav__close" onClick={onClose} aria-label="Close menu">
            <Icon name={config.closeIcon} />
          </button>
        </div>

        <div className="mobile-nav__location">
          <span className="mobile-nav__location-label">{headerConfig.location.label}</span>
          <Select
            name="mobile-location"
            icon={headerConfig.location.icon}
            placeholder={headerConfig.location.placeholder}
            value={selectedLocation?.id || ''}
            onChange={handleLocationChange}
            options={locations}
          />
        </div>

        <nav className="mobile-nav__links">
          {visibleLinks.map((link, i) => (
            <button
              key={link.path}
              type="button"
              className={`mobile-nav__link ${link.highlight ? 'mobile-nav__link--highlight' : ''}`}
              onClick={() => handleNav(link.path)}
              style={{ animationDelay: isOpen ? `${i * 40 + 80}ms` : '0ms' }}
            >
              <span className="mobile-nav__link-icon-wrap">
                <Icon name={link.icon} className="mobile-nav__link-icon" />
              </span>
              <span className="mobile-nav__link-label">{link.label}</span>
              <Icon name="FaChevronRight" className="mobile-nav__link-arrow" />
            </button>
          ))}
        </nav>

        {isAuthenticated && (
          <div className="mobile-nav__footer">
            <button type="button" className="mobile-nav__logout" onClick={() => { logout(); onClose(); }}>
              <Icon name={headerConfig.actions.logout.icon} />
              <span>{headerConfig.actions.logout.label}</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
