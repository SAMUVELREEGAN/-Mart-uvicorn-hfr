import { useCmsContent } from '../../contexts';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../../utils/iconResolver';
import Search from '../common/Search';
import Button from '../common/Button';
import LocationPickerModal from '../common/LocationPickerModal';
import ProfileMenu from './ProfileMenu';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useLocation } from '../../contexts/LocationContext';
import './Header.css';

export default function Header() {
  const headerConfig = useCmsContent('header');
  const navigate = useNavigate();
  const { isAuthenticated, isVendor, user } = useAuth();
  const { itemCount } = useCart();
  const showCart = !isVendor || !!user;
  const { selectedLocation } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const config = headerConfig;
  const cartAction = config.actions?.cart || {
    label: 'Cart',
    icon: 'FaShoppingCart',
    path: '/cart',
  };

  useEffect(() => {
    if (!config.layout?.scrollShadow) return undefined;
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [config.layout?.scrollShadow]);

  const handleSearch = (query) => {
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleCartClick = () => {
    if (!user) {
      navigate(config.actions.login.path);
      return;
    }
    navigate(cartAction.path);
  };

  const selectedName = selectedLocation?.name || config.location.placeholder;

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <div className="header__inner">
          <Link to="/" className="header__logo">
            <span className="header__logo-mark">
              <Icon name={config.logo.icon} />
            </span>
            <span className="header__logo-text">{config.logo.text}</span>
          </Link>

          <button
            type="button"
            className="header__location"
            onClick={() => setLocationModalOpen(true)}
            aria-label={`${config.location.label}: ${selectedName}`}
          >
            <div className="header__location-icon" aria-hidden="true">
              <Icon name={config.location.icon} />
            </div>
            <div className="header__location-body">
              <span className="header__location-label">{config.location.label}</span>
              <span className="header__location-value">{selectedName}</span>
            </div>
          </button>

          <div className="header__search">
            <Search
              placeholder={config.search.placeholder}
              icon={config.search.icon}
              buttonIcon={config.search.buttonIcon}
              onSearch={handleSearch}
            />
          </div>

          <div className="header__actions">
            {showCart && (
              <button
                type="button"
                className="header__cart-btn"
                onClick={handleCartClick}
                aria-label={`${cartAction.label}${itemCount > 0 ? `, ${itemCount} items` : ''}`}
              >
                <Icon name={cartAction.icon} />
                {user && itemCount > 0 && (
                  <span className="header__cart-badge">{itemCount > 99 ? '99+' : itemCount}</span>
                )}
              </button>
            )}
            {!isVendor && (
              <button
                type="button"
                className="header__vendor-btn"
                onClick={() => navigate(config.actions.vendor.path)}
              >
                <Icon name={config.actions.vendor.icon} />
                <span className="header__vendor-label">{config.actions.vendor.label}</span>
                <span className="header__vendor-label--short">{config.actions.vendor.labelShort}</span>
              </button>
            )}
            {!isAuthenticated ? (
              <Button
                label={config.actions.login.label}
                icon={config.actions.login.icon}
                variant="primary"
                size="sm"
                onClick={() => navigate(config.actions.login.path)}
              />
            ) : (
              <ProfileMenu />
            )}
          </div>
        </div>
      </header>

      <LocationPickerModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />
    </>
  );
}
