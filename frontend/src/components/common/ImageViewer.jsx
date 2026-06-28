import { useState } from 'react';
import Modal from '../modal/Modal';
import { Icon } from '../../utils/iconResolver';
import './ImageViewer.css';

export default function ImageViewer({ src, alt = 'Image', className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!src) return null;

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`image-viewer ${className}`}
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen(true)}
      />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="xl">
        <div className="image-viewer__modal">
          <img src={src} alt={alt} className="image-viewer__full" />
        </div>
      </Modal>
    </>
  );
}
