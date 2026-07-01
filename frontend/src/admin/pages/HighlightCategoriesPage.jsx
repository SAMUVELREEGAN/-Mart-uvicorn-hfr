import { useCallback, useEffect, useMemo, useState } from 'react';
import adminApi from '../../services/adminApi';
import { uploadAdminFile, deleteAdminFile, previewUrl } from '../utils/upload';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminAlert from '../components/AdminAlert';
import AdminButton from '../components/AdminButton';
import FormSection from '../components/FormSection';
import AdminMultiSelect from '../components/AdminMultiSelect';
import SkeletonTable from '../components/SkeletonTable';
import '../styles/admin.css';

import { CATEGORY_DETAILS_TEMPLATE_OPTIONS } from '../../components/categoryDetails/categoryDetailsTemplates';

const emptyForm = () => ({
  title: '',
  mappingType: 'product',
  categorySlugs: [],
  subcategorySlugs: [],
  image: '',
  subtitle: '',
  status: 'active',
  detailsPageTemplate: 'template1',
});

export default function HighlightCategoriesPage() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [productCats, setProductCats] = useState([]);
  const [serviceCats, setServiceCats] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [mode, setMode] = useState('list');
  const [form, setForm] = useState(emptyForm());
  const [current, setCurrent] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadMeta = useCallback(async () => {
    try {
      const [pRes, sRes, subRes] = await Promise.all([
        adminApi.get('/categories/type/product'),
        adminApi.get('/categories/type/service'),
        adminApi.get('/admin/subcategories', { params: { limit: 200 } }),
      ]);
      setProductCats(pRes.data.data || []);
      setServiceCats(sRes.data.data || []);
      setSubcategories(subRes.data.data || []);
    } catch {
      /* lookup optional */
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get('/admin/highlight-categories', {
        params: { page, limit: 10, search, status },
      });
      setItems(data.data || []);
      setMeta(data.meta || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load highlight categories');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { loadMeta(); }, [loadMeta]);
  useEffect(() => { load(); }, [load]);

  const categoryOptions = useMemo(() => {
    if (form.mappingType === 'product') {
      return productCats.map((c) => ({ value: c.slug, label: c.name }));
    }
    if (form.mappingType === 'service') {
      return serviceCats.map((c) => ({ value: c.slug, label: c.name }));
    }
    return [
      ...productCats.map((c) => ({ value: c.slug, label: `${c.name} (Product)` })),
      ...serviceCats.map((c) => ({ value: c.slug, label: `${c.name} (Service)` })),
    ];
  }, [form.mappingType, productCats, serviceCats]);

  const subcategoryOptions = useMemo(() => {
    const parents = form.categorySlugs.length ? form.categorySlugs : null;
    return subcategories
      .filter((s) => !parents || parents.includes(s.parentSlug))
      .map((s) => ({ value: s.slug, label: `${s.name} (${s.parentSlug})` }));
  }, [subcategories, form.categorySlugs]);

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadAdminFile(file);
      setForm((prev) => ({ ...prev, image: url }));
      setMessage('Image uploaded');
    } catch {
      setError('Image upload failed');
    }
  };

  const removeImage = async () => {
    await deleteAdminFile(form.image);
    setForm((prev) => ({ ...prev, image: '' }));
  };

  const openCreate = () => {
    setForm(emptyForm());
    setCurrent(null);
    setMode('form');
    setError(null);
  };

  const openEdit = (item) => {
    setForm({
      title: item.title || '',
      mappingType: item.mappingType || 'product',
      categorySlugs: item.categorySlugs || [],
      subcategorySlugs: item.subcategorySlugs || [],
      image: item.image || '',
      subtitle: item.subtitle || '',
      status: item.status || 'active',
      detailsPageTemplate: item.detailsPageTemplate || 'template1',
    });
    setCurrent(item);
    setMode('form');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form };
      if (current) {
        await adminApi.put(`/admin/highlight-categories/${current.id}`, payload);
        setMessage('Highlight category updated');
      } else {
        await adminApi.post('/admin/highlight-categories', payload);
        setMessage('Highlight category created');
      }
      setMode('list');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete highlight "${item.title}"?`)) return;
    await adminApi.delete(`/admin/highlight-categories/${item.id}`);
    setMessage('Deleted');
    load();
  };

  const toggleStatus = async (item) => {
    await adminApi.patch(`/admin/highlight-categories/${item.id}/status`);
    setMessage('Status updated');
    load();
  };

  if (mode === 'form') {
    return (
      <div>
        <AdminPageHeader
          title={current ? 'Edit Highlight Category' : 'Create Highlight Category'}
          actions={<AdminButton variant="secondary" onClick={() => setMode('list')}>Back</AdminButton>}
        />
        {error && <AdminAlert type="error">{error}</AdminAlert>}
        <form onSubmit={handleSubmit}>
          <FormSection title="Highlight Details" description="Title and display settings for the home page card">
            <div className="adm-field-grid adm-field-grid--2">
              <div className="adm-field">
                <label className="adm-field__label" htmlFor="title">Title *</label>
                <input id="title" className="adm-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="adm-field">
                <label className="adm-field__label" htmlFor="mappingType">Type *</label>
                <select
                  id="mappingType"
                  className="adm-select"
                  value={form.mappingType}
                  onChange={(e) => setForm({ ...form, mappingType: e.target.value, categorySlugs: [], subcategorySlugs: [] })}
                  required
                >
                  <option value="product">Product</option>
                  <option value="service">Service</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div className="adm-field adm-field--full">
                <label className="adm-field__label" htmlFor="subtitle">Subtitle</label>
                <input id="subtitle" className="adm-input" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
              </div>
              <div className="adm-field adm-field--full">
                <label className="adm-field__label" htmlFor="detailsPageTemplate">Details Page Template</label>
                <select
                  id="detailsPageTemplate"
                  className="adm-select"
                  value={form.detailsPageTemplate}
                  onChange={(e) => setForm({ ...form, detailsPageTemplate: e.target.value })}
                >
                  {CATEGORY_DETAILS_TEMPLATE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="adm-field adm-field--full">
                <label className="adm-field__label">Card Image</label>
                <div className="adm-image-field">
                  <label className="adm-upload-btn">
                    Upload Image
                    <input type="file" accept=".svg,.png,.jpg,.jpeg,.webp,image/*" hidden onChange={uploadImage} />
                  </label>
                  {form.image && (
                    <div className="adm-image-preview">
                      <img src={previewUrl(form.image)} alt="" />
                      <AdminButton variant="ghost" onClick={removeImage}>Remove</AdminButton>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection title="Category Mapping" description="Categories are filtered by the selected type">
            <div className="adm-field">
              <label className="adm-field__label">Categories</label>
              <AdminMultiSelect
                options={categoryOptions}
                value={form.categorySlugs}
                onChange={(categorySlugs) => setForm({ ...form, categorySlugs, subcategorySlugs: [] })}
                placeholder="Select categories..."
              />
            </div>
          </FormSection>

          <FormSection title="Sub Category Mapping" description="Filtered by selected categories">
            <div className="adm-field">
              <label className="adm-field__label">Sub Categories</label>
              <AdminMultiSelect
                options={subcategoryOptions}
                value={form.subcategorySlugs}
                onChange={(subcategorySlugs) => setForm({ ...form, subcategorySlugs })}
                placeholder={form.categorySlugs.length ? 'Select sub categories...' : 'Select categories first'}
              />
            </div>
          </FormSection>

          <FormSection title="Publishing">
            <div className="adm-field">
              <label className="adm-field__label" htmlFor="status">Status</label>
              <select id="status" className="adm-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </FormSection>

          <div className="adm-form-actions">
            <AdminButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</AdminButton>
            <AdminButton variant="secondary" onClick={() => setMode('list')}>Cancel</AdminButton>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Highlight Categories"
        subtitle="Manage explore categories on the home page"
        actions={<AdminButton onClick={openCreate}>+ Create</AdminButton>}
      />
      {message && <AdminAlert type="success">{message}</AdminAlert>}
      {error && <AdminAlert type="error">{error}</AdminAlert>}

      <div className="adm-toolbar">
        <input className="adm-input" type="search" placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <select className="adm-select" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? <SkeletonTable rows={5} cols={7} /> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Template</th>
                <th>Categories</th>
                <th>Sub Categories</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.mappingType}</td>
                  <td>
                    {CATEGORY_DETAILS_TEMPLATE_OPTIONS.find((o) => o.value === (item.detailsPageTemplate || 'template1'))?.label
                      || item.detailsPageTemplate
                      || 'Template 1 (Default)'}
                  </td>
                  <td>{(item.categorySlugs || []).join(', ') || '—'}</td>
                  <td>{(item.subcategorySlugs || []).join(', ') || '—'}</td>
                  <td><span className={`status-badge status-badge--${item.status}`}>{item.status}</span></td>
                  <td>
                    <div className="adm-table__actions">
                      <AdminButton variant="secondary" onClick={() => openEdit(item)}>Edit</AdminButton>
                      <AdminButton variant="secondary" onClick={() => toggleStatus(item)}>Toggle</AdminButton>
                      <AdminButton variant="danger" onClick={() => handleDelete(item)}>Delete</AdminButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="adm-pagination">
        <AdminButton variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</AdminButton>
        <span>Page {meta.page} of {meta.totalPages}</span>
        <AdminButton variant="secondary" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)}>Next</AdminButton>
      </div>
    </div>
  );
}
