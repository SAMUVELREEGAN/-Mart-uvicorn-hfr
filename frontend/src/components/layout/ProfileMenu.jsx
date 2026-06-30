import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import headerConfig from '../../json/header.json';
import { Icon } from '../../utils/iconResolver';
import { useAuth } from '../../contexts/AuthContext';
import './ProfileMenu.css';

export default function ProfileMenu() {
  const { currentUser, user, logout, isVendor } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const config = headerConfig.profileMenu;

  const displayName = user?.name || currentUser?.businessName || currentUser?.name || currentUser?.email?.split('@')[0] || 'User';
  const avatar = user?.avatar || currentUser?.avatar || config.defaultAvatar;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItem = (item) => {
    setOpen(false);
    if (item.action === 'logout') {
      logout();
      navigate('/');
      return;
    }
    if (isVendor && item.path === '/profile') {
      navigate('/vendor/profile');
      return;
    }
    navigate(item.path);
  };

  const menuItems = isVendor ? config.vendorItems : config.items;

  return (
    <div className="profile-menu" ref={ref}>
      <button
        type="button"
        className="profile-menu__trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <img src={avatar} alt={displayName} className="profile-menu__avatar" />
        <span className="profile-menu__name">{displayName}</span>
        <Icon name="FaChevronDown" className={`profile-menu__chevron ${open ? 'profile-menu__chevron--open' : ''}`} />
      </button>

      {open && (
        <div className="profile-menu__dropdown">
          <div className="profile-menu__dropdown-header">
            <img src={avatar} alt="" className="profile-menu__dropdown-avatar" />
            <div>
              <p className="profile-menu__dropdown-name">{displayName}</p>
              <p className="profile-menu__dropdown-email">{currentUser?.email}</p>
            </div>
          </div>
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.dividerBefore && <div className="profile-menu__divider" />}
              <button type="button" className="profile-menu__item" onClick={() => handleItem(item)}>
                <Icon name={item.icon} className="profile-menu__item-icon" />
                <span>{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
