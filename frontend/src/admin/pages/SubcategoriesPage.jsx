import { useCallback, useEffect, useMemo, useState } from 'react';
import adminApi from '../../services/adminApi';
import { uploadAdminFile, deleteAdminFile, previewUrl } from '../utils/upload';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminAlert from '../components/AdminAlert';
import AdminButton from '../components/AdminButton';
import FormSection from '../components/FormSection';
import SkeletonTable from '../components/SkeletonTable';
import '../styles/admin.css';

const emptyForm = () => ({ parentSlug: '', name: '', icon: '', status: 'active' });

export default function SubcategoriesPage() {
  const [items, setItems] = useState([]);
  const [parents, setParents] = useState([]);
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

  const loadParents = useCallback(async () => {
    try {
      const [pRes, sRes] = await Promise.all([
        adminApi.get('/categories/type/product'),
        adminApi.get('/categories/type/service'),
      ]);
      const productCats = (pRes.data.data || []).map((c) => ({ value: c.slug, label: `${c.name} (Product)` }));
      const serviceCats = (sRes.data.data || []).map((c) => ({ value: c.slug, label: `${c.name} (Service)` }));
      setParents([...productCats, ...serviceCats]);
    } catch {
      setParents([]);
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get('/admin/subcategories', {
        params: { page, limit: 10, search, status },
      });
      setItems(data.data || []);
      setMeta(data.meta || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load sub categories');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { loadParents(); }, [loadParents]);
  useEffect(() => { load(); }, [load]);

  const parentLabel = useMemo(() => {
    const map = Object.fromEntries(parents.map((p) => [p.value, p.label]));
    return (slug) => map[slug] || slug;
  }, [parents]);

  const canEditDetails = Boolean(form.parentSlug);

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
      parentSlug: item.parentSlug || '',
      name: item.name || '',
      icon: item.icon || '',
      status: item.status || 'active',
    });
    setCurrent(item);
    setMode('form');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.parentSlug) {
      setError('Please select a parent category first');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (current) {
        await adminApi.put(`/admin/subcategories/${current.id}`, form);
        setMessage('Sub category updated');
      } else {
        await adminApi.post('/admin/subcategories', form);
        setMessage('Sub category created');
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
    if (!window.confirm(`Delete sub category "${item.name}"?`)) return;
    await adminApi.delete(`/admin/subcategories/${item.id}`);
    setMessage('Deleted');
    load();
  };

  const toggleStatus = async (item) => {
    await adminApi.patch(`/admin/subcategories/${item.id}/status`);
    setMessage('Status updated');
    load();
  };

  if (mode === 'form') {
    return (
      <div>
        <AdminPageHeader
          title={current ? 'Edit Sub Category' : 'Create Sub Category'}
          actions={<AdminButton variant="secondary" onClick={() => setMode('list')}>Back</AdminButton>}
        />
        {error && <AdminAlert type="error">{error}</AdminAlert>}
        <form onSubmit={handleSubmit}>
          <FormSection title="Sub Category Details" description="Select a parent category first, then add the sub category">
            <div className="adm-field-grid adm-field-grid--1">
              <div className="adm-field">
                <label className="adm-field__label" htmlFor="parentSlug">Parent Category *</label>
                <select
                  id="parentSlug"
                  className="adm-select"
                  value={form.parentSlug}
                  onChange={(e) => setForm({ ...form, parentSlug: e.target.value, name: '', icon: '' })}
                  required
                >
                  <option value="">Select parent category...</option>
                  {parents.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div className="adm-field">
                <label className="adm-field__label" htmlFor="name">Sub Category Name *</label>
                <input
                  id="name"
                  className="adm-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  disabled={!canEditDetails}
                />
              </div>
              <div className="adm-field">
                <label className="adm-field__label">Icon or Image</label>
                <div className="adm-image-field adm-image-field--icon">
                  <label className={`adm-upload-btn ${!canEditDetails ? 'adm-upload-btn--disabled' : ''}`}>
                    Upload Icon or Image (SVG, PNG, JPG, WEBP)
                    <input type="file" accept=".svg,.png,.jpg,.jpeg,.webp,image/*" hidden onChange={uploadIcon} disabled={!canEditDetails} />
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
                <label className="adm-field__label" htmlFor="status">Status</label>
                <select id="status" className="adm-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} disabled={!canEditDetails}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </FormSection>
          <div className="adm-form-actions">
            <AdminButton type="submit" disabled={saving || !canEditDetails}>{saving ? 'Saving...' : 'Save'}</AdminButton>
            <AdminButton variant="secondary" onClick={() => setMode('list')}>Cancel</AdminButton>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Sub Categories"
        subtitle="Manage sub categories under product and service categories"
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

      {loading ? <SkeletonTable rows={5} cols={5} /> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Name</th>
                <th>Parent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={5} className="adm-table__empty">No sub categories found</td></tr>
              ) : items.map((item) => (
                <tr key={item.id}>
                  <td>{item.icon ? <img src={previewUrl(item.icon)} alt="" className="adm-table__thumb" /> : '—'}</td>
                  <td>{item.name}</td>
                  <td>{parentLabel(item.parentSlug)}</td>
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
