import { useState } from 'react';
import AdminCard from '../../components/AdminCard';
import AdminButton from '../../components/AdminButton';
import FormSection from '../../components/FormSection';
import { emptyTerms } from './constants';
import { deleteTerms, saveTerms } from './api';

export default function TermsPanel({ terms, onRefresh, toast, onConfirm }) {
  const [form, setForm] = useState(emptyTerms());
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const openEdit = (item) => {
    setEditing(item);
    setForm(item);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyTerms());
  };

  const handleSave = async () => {
    if (!form.title?.trim() || !form.content?.trim()) {
      toast.error('Title and content are required');
      return;
    }
    setSaving(true);
    try {
      await saveTerms(form, editing);
      toast.success(editing ? 'Terms updated' : 'Terms created');
      setEditing(null);
      setForm(emptyTerms());
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save terms');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (item) => {
    onConfirm({
      title: 'Delete terms?',
      message: `Remove "${item.title}"? Vendors will no longer see this terms block.`,
      onConfirm: async () => {
        await deleteTerms(item.id);
        toast.success('Terms deleted');
        onRefresh();
      },
    });
  };

  return (
    <div className="vc-panel">
      <div className="vc-panel-toolbar">
        <div>
          <h2>Terms & Conditions</h2>
          <p className="vc-panel-desc">Manage business and platform terms shown during registration</p>
        </div>
        <AdminButton label="Add Terms" icon="add" onClick={openCreate} />
      </div>

      <div className="vc-panel__grid vc-panel__grid--2">
        {terms.map((item) => (
          <AdminCard key={item.id} className="vc-terms-card">
            <div className="vc-terms-card__header">
              <span className="vc-badge">{item.type === 'business' ? 'Business' : 'Platform'}</span>
              <div className="vc-field-card__actions">
                <AdminButton label="Edit" icon="edit" size="sm" variant="secondary" title="Edit terms" onClick={() => openEdit(item)} />
                <AdminButton label="Delete" icon="delete" size="sm" variant="danger" title="Delete terms" onClick={() => handleDelete(item)} />
              </div>
            </div>
            <h3>{item.title}</h3>
            <p className="vc-terms-card__content">{item.content}</p>
            <p className="vc-terms-card__accept"><strong>Acceptance:</strong> {item.acceptanceLabel}</p>
          </AdminCard>
        ))}

        <AdminCard className="vc-terms-form">
          <FormSection
            title={editing ? 'Edit Terms' : 'New Terms'}
            description="Terms content and acceptance checkbox label"
          >
            <div className="adm-field-grid adm-field-grid--2">
              <div className="adm-field">
                <label className="adm-field__label">Terms Type</label>
                <select className="adm-input adm-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="business">Business Terms</option>
                  <option value="platform">Platform Terms</option>
                </select>
              </div>
              <div className="adm-field">
                <label className="adm-field__label">Title</label>
                <input className="adm-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="adm-field adm-field--full">
                <label className="adm-field__label">Content</label>
                <textarea className="adm-input adm-input--textarea" rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                <span className="adm-field__hint">Full terms text displayed to vendors before they accept</span>
              </div>
              <div className="adm-field adm-field--full">
                <label className="adm-field__label">Acceptance Checkbox Label</label>
                <input className="adm-input" value={form.acceptanceLabel} onChange={(e) => setForm({ ...form, acceptanceLabel: e.target.value })} />
              </div>
            </div>
            <div className="vc-panel-toolbar vc-panel-toolbar--footer">
              {editing && <AdminButton label="Cancel" icon="cancel" variant="ghost" onClick={() => { setEditing(null); setForm(emptyTerms()); }} />}
              <AdminButton label={saving ? 'Saving...' : 'Save Terms'} icon="save" onClick={handleSave} disabled={saving} />
            </div>
          </FormSection>
        </AdminCard>
      </div>
    </div>
  );
}
