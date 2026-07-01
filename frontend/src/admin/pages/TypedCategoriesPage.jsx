import { useCallback, useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import { uploadAdminFile, deleteAdminFile, previewUrl } from '../utils/upload';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminAlert from '../components/AdminAlert';
import AdminButton from '../components/AdminButton';
import FormSection from '../components/FormSection';
import SkeletonTable from '../components/SkeletonTable';
import '../styles/admin.css';

const emptyForm = () => ({
  name: '',
  icon: '',
  subscriptionType: 'free',
  price: '',
  status: 'active',
});

export default function TypedCategoriesPage({ categoryType, title }) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
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

  const isPaid = form.subscriptionType === 'paid';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get('/admin/categories', {
        params: { page, limit: 10, search, status, type: categoryType },
      });
      setItems(data.data || []);
      setMeta(data.meta || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, [page, search, status, categoryType]);

  useEffect(() => { load(); }, [load]);

  const uploadIcon = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadAdminFile(file);
      setForm((prev) => ({ ...prev, icon: url }));
      setMessage('Image uploaded');
    } catch {
      setError('Image upload failed');
    }
  };

  const removeIcon = async () => {
    await deleteAdminFile(form.icon);
    setForm((prev) => ({ ...prev, icon: '' }));
  };

  const openCreate = () => {
    setForm(emptyForm());
    setCurrent(null);
    setMode('form');
    setError(null);
  };

  const openEdit = (item) => {
    setForm({
      name: item.name || '',
      icon: item.icon || '',
      subscriptionType: item.subscriptionType || 'free',
      price: item.subscriptionType === 'paid' && item.price != null ? String(item.price) : '',
      status: item.status || 'active',
    });
    setCurrent(item);
    setMode('form');
    setError(null);
  };

  const handleSubscriptionChange = (subscriptionType) => {
    setForm((prev) => ({
      ...prev,
      subscriptionType,
      price: subscriptionType === 'free' ? '' : prev.price,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPaid && (form.price === '' || Number.isNaN(Number(form.price)))) {
      setError('Price is required for paid categories');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        icon: form.icon,
        subscriptionType: form.subscriptionType,
        price: isPaid ? Number(form.price) : 0,
        status: form.status,
        type: categoryType,
      };
      if (current) {
        await adminApi.put(`/admin/categories/${current.id}`, payload);
        setMessage('Category updated');
      } else {
        await adminApi.post('/admin/categories', payload);
        setMessage('Category created');
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
    if (!window.confirm(`Delete category "${item.name}"?`)) return;
    await adminApi.delete(`/admin/categories/${item.id}`);
    setMessage('Deleted');
    load();
  };

  const toggleStatus = async (item) => {
    await adminApi.patch(`/admin/categories/${item.id}/status`);
    setMessage('Status updated');
    load();
  };

  if (mode === 'form') {
    return (
      <div>
        <AdminPageHeader
          title={current ? `Edit ${title}` : `Create ${title}`}
          actions={<AdminButton variant="secondary" onClick={() => setMode('list')}>Back</AdminButton>}
        />
        {error && <AdminAlert type="error">{error}</AdminAlert>}
        <form onSubmit={handleSubmit}>
          <FormSection title="Category Details">
            <div className="adm-field-grid adm-field-grid--1">
              <div className="adm-field">
                <label className="adm-field__label" htmlFor="name">Category Name *</label>
                <input id="name" className="adm-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="adm-field">
                <label className="adm-field__label">Icon/Image Upload</label>
                <div className="adm-image-field adm-image-field--icon">
                  <label className="adm-upload-btn">
                    Upload Icon or Image (SVG, PNG, JPG, WEBP)
                    <input type="file" accept=".svg,.png,.jpg,.jpeg,.webp,image/*" hidden onChange={uploadIcon} />
                  </label>
                  {form.icon && (
                    <div className="adm-image-preview">
                      <img src={previewUrl(form.icon)} alt="" className="adm-image-preview--icon" />
                      <AdminButton type="button" variant="ghost" onClick={removeIcon}>Remove</AdminButton>
                    </div>
                  )}
                </div>
              </div>
              <div className="adm-field">
                <label className="adm-field__label" htmlFor="subscriptionType">Subscription Type *</label>
                <select
                  id="subscriptionType"
                  className="adm-select"
                  value={form.subscriptionType}
                  onChange={(e) => handleSubscriptionChange(e.target.value)}
                  required
                >
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              {isPaid && (
                <div className="adm-field">
                  <label className="adm-field__label" htmlFor="price">Price *</label>
                  <input
                    id="price"
                    className="adm-input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>
              )}
              <div className="adm-field">
                <label className="adm-field__label" htmlFor="status">Status</label>
                <select id="status" className="adm-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
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
        title={title}
        subtitle={`Manage ${categoryType} categories`}
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

      {loading ? <SkeletonTable rows={5} cols={6} /> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Name</th>
                <th>Subscription</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={6} className="adm-table__empty">No categories found</td></tr>
              ) : items.map((item) => (
                <tr key={item.id}>
                  <td>{item.icon ? <img src={previewUrl(item.icon)} alt="" className="adm-table__thumb" /> : '—'}</td>
                  <td>{item.name}</td>
                  <td>{item.subscriptionType === 'paid' ? 'Paid' : 'Free'}</td>
                  <td>{item.subscriptionType === 'paid' ? `$${Number(item.price || 0).toFixed(2)}` : '—'}</td>
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
