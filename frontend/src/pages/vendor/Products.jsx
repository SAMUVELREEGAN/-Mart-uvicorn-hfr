import { useCmsContent } from '../../contexts';
import { useState } from 'react';
import { useVendor } from '../../contexts/VendorContext';
import { useProducts } from '../../contexts/ProductContext';
import Button from '../../components/common/Button';
import Modal from '../../components/modal/Modal';
import FormBuilder from '../../components/forms/FormBuilder';
import ProductCard from '../../components/cards/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import './VendorPages.css';

export default function VendorProducts({ embedded = false }) {
  const formsConfig = useCmsContent('forms');
  const buttonsConfig = useCmsContent('buttons');
  const cardConfig = useCmsContent('icons');
  const { vendorProducts } = useVendor();
  const { addProduct, updateProduct, deleteProduct } = useProducts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleSubmit = (values) => {
    if (editing) {
      updateProduct(editing.id, values);
    } else {
      addProduct(values);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleEdit = (product) => {
    setEditing(product);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) deleteProduct(id);
  };

  const initialValues = editing ? {
    ...editing,
    gallery: (editing.gallery || []).join(', '),
    youtubeLinks: (editing.youtubeLinks || []).join(', '),
    specifications: editing.specifications
      ? Object.entries(editing.specifications).map(([k, v]) => `${k}: ${v}`).join('\n')
      : '',
  } : {};

  return (
    <div className={embedded ? 'vendor-page__embedded' : 'vendor-page'}>
      {!embedded && (
        <div className="vendor-page__header">
          <h1 className="vendor-page__title">My Products</h1>
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

      {vendorProducts.length === 0 ? (
        <EmptyState
          config={cardConfig.emptyState.products}
          actionLabel={buttonsConfig.add.label}
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="vendor-page__list">
          {vendorProducts.map((product) => (
            <div key={product.id} className="vendor-page__item">
              <ProductCard product={product} />
              <div className="vendor-page__actions">
                <Button label={buttonsConfig.edit.label} icon={buttonsConfig.edit.icon} variant="outline" size="sm" onClick={() => handleEdit(product)} />
                <Button label={buttonsConfig.delete.label} icon={buttonsConfig.delete.icon} variant="danger" size="sm" onClick={() => handleDelete(product.id)} />
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <FormBuilder
          fields={formsConfig.product}
          onSubmit={handleSubmit}
          submitKey="save"
          initialValues={initialValues}
          cancelAction={() => { setModalOpen(false); setEditing(null); }}
        />
      </Modal>
    </div>
  );
}
