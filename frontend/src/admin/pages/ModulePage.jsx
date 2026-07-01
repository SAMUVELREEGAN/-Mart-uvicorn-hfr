import { useCallback, useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import { uploadAdminFile, previewUrl } from '../utils/upload';
import { getFieldSections } from '../utils/formSections';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminAlert from '../components/AdminAlert';
import AdminButton from '../components/AdminButton';
import FormSection from '../components/FormSection';
import { AdminFieldGrid } from '../components/AdminField';
import SkeletonTable from '../components/SkeletonTable';
import '../styles/admin.css';

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function ModulePage({ config }) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState('list');
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const debouncedSearch = useDebounce(search);
  const endpoint = `/admin/${config.endpoint}`;
  const sections = getFieldSections(config);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await adminApi.get(endpoint, { params: { page, limit: 10, search: debouncedSearch, status } });
      setItems(data.data || []);
      setMeta(data.meta || { page: 1, totalPages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, debouncedSearch, status]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  const initForm = () => {
    const initial = {};
    config.fields.forEach((f) => {
      if (f.type === 'number') initial[f.name] = 0;
      else if (f.type === 'boolean') initial[f.name] = false;
      else initial[f.name] = '';
    });
    if (config.fields.find((f) => f.name === 'status')) initial.status = 'active';
    if (config.fields.find((f) => f.name === 'orderStatus')) initial.orderStatus = 'pending';
    if (config.fields.find((f) => f.name === 'bookingStatus')) initial.bookingStatus = 'pending';
    if (config.fields.find((f) => f.name === 'paymentStatus')) initial.paymentStatus = 'pending';
    return initial;
  };

  const openCreate = () => {
    setForm(initForm());
    setCurrent(null);
    setMode('form');
    setError(null);
    setMessage(null);
  };

  const openEdit = (item) => {
    const next = { ...item };
    if (next.bookingDate) next.bookingDate = String(next.bookingDate).slice(0, 10);
    setForm(next);
    setCurrent(item);
    setMode('form');
    setError(null);
    setMessage(null);
  };

  const openView = (item) => {
    setCurrent(item);
    setMode('view');
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete ${item.name || item.businessName || item.title || item.orderNumber || item.id}?`)) return;
    try {
      await adminApi.delete(`${endpoint}/${item.id}`);
      setMessage('Deleted successfully');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const toggleStatus = async (item) => {
    try {
      await adminApi.patch(`${endpoint}/${item.id}/status`);
      setMessage('Status updated');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Status update failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form };
      config.fields.forEach((f) => {
        if (f.type === 'number' && payload[f.name] !== '') payload[f.name] = Number(payload[f.name]);
        if (f.type === 'date' && payload[f.name]) payload[f.name] = new Date(payload[f.name]).toISOString();
      });
      if (current) {
        await adminApi.put(`${endpoint}/${current.id}`, payload);
        setMessage('Updated successfully');
      } else {
        await adminApi.post(endpoint, payload);
        setMessage('Created successfully');
      }
      setMode('list');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadAdminFile(file);
      setForm((prev) => ({ ...prev, [fieldName]: url }));
      setMessage('File uploaded');
    } catch (err) {
      setError('Upload failed');
    }
  };

  const renderCell = (col, item) => {
    if (['status', 'orderStatus', 'bookingStatus', 'paymentStatus'].includes(col)) {
      return <span className={`status-badge status-badge--${item[col]}`}>{item[col]}</span>;
    }
    if (col === 'enabled') return item.enabled ? 'Yes' : 'No';
    if ((col === 'image' || col === 'logo' || col === 'coverBanner' || col === 'bannerImage' || col === 'icon') && item[col]) {
      return <img src={previewUrl(item[col])} alt="" className="adm-table__thumb" />;
    }
    if (col === 'total' || col === 'price') return `$${Number(item[col] || 0).toLocaleString()}`;
    return String(item[col] ?? '');
  };

  if (mode === 'form') {
    return (
      <div>
        <AdminPageHeader
          title={current ? `Edit ${config.title}` : `Create ${config.title}`}
          actions={<AdminButton variant="secondary" onClick={() => setMode('list')}>Back to list</AdminButton>}
        />
        {error && <AdminAlert type="error">{error}</AdminAlert>}
        <form onSubmit={handleSubmit}>
          {sections.map((section) => (
            <FormSection
              key={section.id || section.title}
              title={section.title}
              description={section.description}
              collapsible={section.collapsible}
              defaultOpen={section.defaultOpen !== false}
            >
              <AdminFieldGrid
                fields={section.fieldDefs}
                form={form}
                setForm={setForm}
                uploadImage={uploadImage}
                columns={section.fieldDefs.some((f) => f.type === 'textarea' || f.type === 'image') ? 1 : 2}
              />
            </FormSection>
          ))}
          <div className="adm-form-actions">
            <AdminButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</AdminButton>
            <AdminButton variant="secondary" onClick={() => setMode('list')}>Cancel</AdminButton>
          </div>
        </form>
      </div>
    );
  }

  if (mode === 'view' && current) {
    return (
      <div>
        <AdminPageHeader
          title={`View ${config.title}`}
          actions={
            <>
              <AdminButton variant="secondary" onClick={() => setMode('list')}>Back</AdminButton>
              <AdminButton onClick={() => openEdit(current)}>Edit</AdminButton>
            </>
          }
        />
        {sections.map((section) => (
          <FormSection key={section.id || section.title} title={section.title} description={section.description}>
            <div className="adm-view-grid">
              {section.fieldDefs.map((field) => (
                <div key={field.name} className="adm-view-row">
                  <strong>{field.label}</strong>
                  {field.type === 'image' || field.type === 'icon' ? (
                    current[field.name] ? <img src={previewUrl(current[field.name])} alt="" className="adm-image-preview--icon" /> : <span>—</span>
                  ) : (
                    <span>{String(current[field.name] ?? '')}</span>
                  )}
                </div>
              ))}
            </div>
          </FormSection>
        ))}
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={config.title}
        subtitle={`Manage ${config.title.toLowerCase()} records`}
        actions={!config.readOnlyCreate && <AdminButton onClick={openCreate}>+ Create</AdminButton>}
      />
      {message && <AdminAlert type="success" onClose={() => setMessage(null)}>{message}</AdminAlert>}
      {error && <AdminAlert type="error" onClose={() => setError(null)}>{error}</AdminAlert>}

      <div className="adm-toolbar">
        <input type="search" className="adm-input" placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <select className="adm-select" style={{ maxWidth: 160 }} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <SkeletonTable rows={6} cols={config.columns.length + 1} />
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                {config.columns.map((col) => <th key={col}>{col}</th>)}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={config.columns.length + 1} className="adm-table__empty">No records found</td></tr>
              ) : items.map((item) => (
                <tr key={item.id}>
                  {config.columns.map((col) => <td key={col}>{renderCell(col, item)}</td>)}
                  <td>
                    <div className="adm-table__actions">
                      <AdminButton variant="secondary" onClick={() => openView(item)}>View</AdminButton>
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
        <span>Page {meta.page} of {meta.totalPages} · {meta.total} total</span>
        <AdminButton variant="secondary" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)}>Next</AdminButton>
      </div>
    </div>
  );
}
