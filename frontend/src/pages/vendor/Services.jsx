import { useState } from 'react';
import { useVendor } from '../../contexts/VendorContext';
import { useServices } from '../../contexts/ServiceContext';
import formsConfig from '../../json/forms.json';
import buttonsConfig from '../../json/buttons.json';
import Button from '../../components/common/Button';
import Modal from '../../components/modal/Modal';
import FormBuilder from '../../components/forms/FormBuilder';
import ServiceCard from '../../components/cards/ServiceCard';
import EmptyState from '../../components/common/EmptyState';
import cardConfig from '../../json/icons.json';
import './VendorPages.css';

export default function VendorServices({ embedded = false }) {
  const { vendorServices } = useVendor();
  const { addService, updateService, deleteService } = useServices();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleSubmit = (values) => {
    if (editing) {
      updateService(editing.id, values);
    } else {
      addService(values);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleEdit = (service) => {
    setEditing(service);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this service?')) deleteService(id);
  };

  const initialValues = editing ? {
    ...editing,
    gallery: (editing.gallery || []).join(', '),
    youtubeLinks: (editing.youtubeLinks || []).join(', '),
  } : {};

  return (
    <div className={embedded ? 'vendor-page__embedded' : 'vendor-page'}>
      {!embedded && (
        <div className="vendor-page__header">
          <h1 className="vendor-page__title">My Services</h1>
          <Button
            label={buttonsConfig.add.label}
            icon={buttonsConfig.add.icon}
            variant="primary"
            onClick={() => { setEditing(null); setModalOpen(true); }}
          />
        </div>
      )}

      {embedded && (
        <div className="vendor-page__embedded-header">
          <Button
            label={buttonsConfig.add.label}
            icon={buttonsConfig.add.icon}
            variant="primary"
            size="sm"
            onClick={() => { setEditing(null); setModalOpen(true); }}
          />
        </div>
      )}

      {vendorServices.length === 0 ? (
        <EmptyState
          config={cardConfig.emptyState.services}
          actionLabel={buttonsConfig.add.label}
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="vendor-page__grid">
          {vendorServices.map((service) => (
            <div key={service.id} className="vendor-page__item">
              <ServiceCard service={service} />
              <div className="vendor-page__actions">
                <Button label={buttonsConfig.edit.label} icon={buttonsConfig.edit.icon} variant="outline" size="sm" onClick={() => handleEdit(service)} />
                <Button label={buttonsConfig.delete.label} icon={buttonsConfig.delete.icon} variant="danger" size="sm" onClick={() => handleDelete(service.id)} />
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? 'Edit Service' : 'Add Service'}
        size="lg"
      >
        <FormBuilder
          fields={formsConfig.service}
          onSubmit={handleSubmit}
          submitKey="save"
          initialValues={initialValues}
          cancelAction={() => { setModalOpen(false); setEditing(null); }}
        />
      </Modal>
    </div>
  );
}
