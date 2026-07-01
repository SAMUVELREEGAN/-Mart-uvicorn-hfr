import { useState } from 'react';
import AdminCard from '../../components/AdminCard';
import AdminButton from '../../components/AdminButton';
import FormSection from '../../components/FormSection';
import SortableList from '../../components/SortableList';
import { emptyStep } from './constants';
import { deleteStep, reorderSteps, saveStep } from './api';

export default function StepsPanel({ steps, onRefresh, toast, onConfirm }) {
  const [form, setForm] = useState(emptyStep());
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyStep(), sortOrder: steps.length });
    setShowForm(true);
  };

  const openEdit = (step) => {
    setEditing(step);
    setForm(step);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.key?.trim() || !form.title?.trim()) {
      toast.error('Step key and title are required');
      return;
    }
    setSaving(true);
    try {
      await saveStep(form, editing);
      toast.success(editing ? 'Step updated' : 'Step created');
      setShowForm(false);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save step');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (step) => {
    onConfirm({
      title: 'Delete registration step?',
      message: `Remove "${step.title}"? Fields linked to this step will remain in the database.`,
      onConfirm: async () => {
        await deleteStep(step.id);
        toast.success('Step deleted');
        onRefresh();
      },
    });
  };

  const handleReorder = async (next) => {
    await reorderSteps(next);
    toast.success('Step order updated');
    onRefresh();
  };

  return (
    <div className="vc-panel">
      <div className="vc-panel-toolbar">
        <div>
          <h2>Registration Steps</h2>
          <p className="vc-panel-desc">Configure the multi-step vendor registration flow</p>
        </div>
        <AdminButton label="Add Step" icon="add" onClick={openCreate} />
      </div>

      <div className="vc-panel__grid">
        <AdminCard>
          <SortableList
            items={steps}
            onReorder={handleReorder}
            renderItem={(step) => (
              <div className="vc-step-row">
                <div>
                  <strong>{step.title}</strong>
                  <span className="vc-field-card__meta">{step.key} · {step.stepType}</span>
                  {step.subtitle && <p className="vc-step-row__sub">{step.subtitle}</p>}
                </div>
                <div className="vc-field-card__actions">
                  <AdminButton label="Edit" icon="edit" size="sm" variant="secondary" title="Edit step" onClick={() => openEdit(step)} />
                  <AdminButton label="Delete" icon="delete" size="sm" variant="danger" title="Delete step" onClick={() => handleDelete(step)} />
                </div>
              </div>
            )}
          />
        </AdminCard>

        {showForm && (
          <AdminCard>
            <FormSection title={editing ? 'Edit Step' : 'New Step'} description="Define a step in the registration wizard">
              <div className="adm-field-grid adm-field-grid--2">
                <div className="adm-field">
                  <label className="adm-field__label">Step Key</label>
                  <input className="adm-input" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} disabled={!!editing} />
                  <span className="adm-field__hint">Unique identifier (e.g. personal, business)</span>
                </div>
                <div className="adm-field">
                  <label className="adm-field__label">Title</label>
                  <input className="adm-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="adm-field adm-field--full">
                  <label className="adm-field__label">Subtitle</label>
                  <input className="adm-input" value={form.subtitle || ''} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
                </div>
                <div className="adm-field">
                  <label className="adm-field__label">Step Type</label>
                  <select className="adm-input adm-select" value={form.stepType} onChange={(e) => setForm({ ...form, stepType: e.target.value })}>
                    <option value="form">Form</option>
                    <option value="terms">Terms</option>
                    <option value="pricing">Pricing</option>
                  </select>
                </div>
                {form.stepType === 'terms' && (
                  <div className="adm-field">
                    <label className="adm-field__label">Terms Type</label>
                    <select className="adm-input adm-select" value={form.termsType || ''} onChange={(e) => setForm({ ...form, termsType: e.target.value })}>
                      <option value="business">Business</option>
                      <option value="platform">Platform</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="vc-panel-toolbar vc-panel-toolbar--footer">
                <AdminButton label="Cancel" icon="cancel" variant="ghost" onClick={() => setShowForm(false)} />
                <AdminButton label={saving ? 'Saving...' : 'Save Step'} icon="save" onClick={handleSave} disabled={saving} />
              </div>
            </FormSection>
          </AdminCard>
        )}
      </div>
    </div>
  );
}
