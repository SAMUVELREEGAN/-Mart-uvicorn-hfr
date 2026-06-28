import { useState } from 'react';
import { useBrands } from '../../contexts/BrandContext';
import formsConfig from '../../json/forms.json';
import buttonsConfig from '../../json/buttons.json';
import Button from '../../components/common/Button';
import Modal from '../../components/modal/Modal';
import FormBuilder from '../../components/forms/FormBuilder';
import EmptyState from '../../components/common/EmptyState';
import cardConfig from '../../json/icons.json';
import './VendorPages.css';
import './VendorBrands.css';

function formToBrand(values) {
  return {
    name: values.name,
    logo: values.logo,
    coverBanner: values.coverBanner,
    description: values.description,
    overview: values.overview,
    photos: values.photos,
    youtubeLinks: values.youtubeLinks,
    website: values.website,
    contact: {
      phone: values.contactPhone,
      email: values.contactEmail,
      address: values.contactAddress,
    },
    socialMedia: {
      ...(values.socialFacebook && { facebook: values.socialFacebook }),
      ...(values.socialInstagram && { instagram: values.socialInstagram }),
      ...(values.socialTwitter && { twitter: values.socialTwitter }),
    },
    termsAndConditions: values.termsAndConditions,
    additionalDetails: values.additionalDetails,
  };
}

function brandToForm(brand) {
  return {
    ...brand,
    photos: (brand.photos || []).join(', '),
    youtubeLinks: (brand.youtubeLinks || []).join(', '),
    contactPhone: brand.contact?.phone || '',
    contactEmail: brand.contact?.email || '',
    contactAddress: brand.contact?.address || '',
    socialFacebook: brand.socialMedia?.facebook || '',
    socialInstagram: brand.socialMedia?.instagram || '',
    socialTwitter: brand.socialMedia?.twitter || '',
  };
}

export default function VendorBrands() {
  const { getVendorBrands, addBrand, updateBrand, deleteBrand } = useBrands();
  const vendorBrands = getVendorBrands();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleSubmit = (values) => {
    const data = formToBrand(values);
    if (editing) {
      updateBrand(editing.id, data);
    } else {
      addBrand(data);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleEdit = (brand) => {
    setEditing(brand);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this brand?')) deleteBrand(id);
  };

  const initialValues = editing ? brandToForm(editing) : {};

  return (
    <div className="vendor-page">
      <div className="vendor-page__header">
        <h1 className="vendor-page__title">Brand Management</h1>
        <Button
          label={buttonsConfig.add.label}
          icon={buttonsConfig.add.icon}
          variant="primary"
          onClick={() => { setEditing(null); setModalOpen(true); }}
        />
      </div>

      {vendorBrands.length === 0 ? (
        <EmptyState
          config={cardConfig.emptyState.brands}
          actionLabel={buttonsConfig.add.label}
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="vendor-brands__grid">
          {vendorBrands.map((brand) => (
            <article key={brand.id} className="vendor-brands__card">
              <img src={brand.coverBanner} alt="" className="vendor-brands__banner" />
              <div className="vendor-brands__body">
                <img src={brand.logo} alt={brand.name} className="vendor-brands__logo" />
                <h3 className="vendor-brands__name">{brand.name}</h3>
                <p className="vendor-brands__desc">{brand.description}</p>
                <div className="vendor-brands__actions">
                  <Button label={buttonsConfig.edit.label} icon={buttonsConfig.edit.icon} variant="outline" size="sm" onClick={() => handleEdit(brand)} />
                  <Button label={buttonsConfig.delete.label} icon={buttonsConfig.delete.icon} variant="danger" size="sm" onClick={() => handleDelete(brand.id)} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title={editing ? 'Edit Brand' : 'Create Brand'}>
        <FormBuilder
          fields={formsConfig.brand}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel={editing ? buttonsConfig.save.label : buttonsConfig.add.label}
        />
      </Modal>
    </div>
  );
}
