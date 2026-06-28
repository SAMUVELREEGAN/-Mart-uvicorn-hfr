import { Icon } from '../../utils/iconResolver';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose, title, children, position = 'right' }) {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'sidebar-overlay--visible' : ''}`} onClick={onClose} />
      <aside className={`sidebar sidebar--${position} ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          {title && <h2 className="sidebar__title">{title}</h2>}
          <button type="button" className="sidebar__close" onClick={onClose} aria-label="Close">
            <Icon name="FaTimes" />
          </button>
        </div>
        <div className="sidebar__content">{children}</div>
      </aside>
    </>
  );
}
