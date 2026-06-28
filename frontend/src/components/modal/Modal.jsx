import { useEffect } from 'react';
import { Icon } from '../../utils/iconResolver';
import './Modal.css';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal modal--${size}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          {title && <h2 className="modal__title">{title}</h2>}
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            <Icon name="FaTimes" />
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
