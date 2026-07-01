import { useCmsContent } from '../../contexts';
import { useState, useEffect } from 'react';
import { useLocation } from '../../contexts/LocationContext';
import Modal from '../modal/Modal';
import LocationMap from './LocationMap';

export default function LocationPickerModal({ isOpen, onClose }) {
  const headerConfig = useCmsContent('header');
  const { selectedLocation } = useLocation();
  const [pendingLocation, setPendingLocation] = useState(selectedLocation);
  const modalConfig = headerConfig.location.modal || {};

  useEffect(() => {
    if (isOpen) setPendingLocation(selectedLocation);
  }, [isOpen, selectedLocation]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalConfig.title || headerConfig.location.label}
      size={modalConfig.size || 'xl'}
    >
      <LocationMap
        variant="modal"
        draftLocation={pendingLocation}
        onDraftChange={setPendingLocation}
        onConfirm={onClose}
      />
    </Modal>
  );
}
