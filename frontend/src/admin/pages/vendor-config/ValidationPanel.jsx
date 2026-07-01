import { useEffect, useMemo, useState } from 'react';
import AdminCard from '../../components/AdminCard';
import AdminButton from '../../components/AdminButton';
import FormSection from '../../components/FormSection';
import { fieldToEditorState } from './constants';
import { saveField } from './api';

export default function ValidationPanel({ fields, onRefresh, toast }) {
  const [selectedId, setSelectedId] = useState(fields[0]?.id || '');
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const selected = useMemo(
    () => fields.find((f) => f.id === Number(selectedId)),
    [fields, selectedId],
  );

  const loadField = (field) => {
    if (!field) return;
    setSelectedId(String(field.id));
    setForm(fieldToEditorState(field));
  };

  useEffect(() => {
    if (selected) setForm(fieldToEditorState(selected));
  }, [selectedId, selected]);

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const original = fields.find((f) => f.id === form.id);
      await saveField(form, original);
      toast.success('Validation rules saved');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save validation');
    } finally {
      setSaving(false);
    }
  };

  if (!fields.length) {
    return <p className="vc-empty">Add form fields first to configure validation rules.</p>;
  }

  return (
    <div className="vc-panel">
      <div className="vc-panel-toolbar">
        <div>
          <h2>Field Validation</h2>
          <p className="vc-panel-desc">Set validation rules for individual registration fields</p>
        </div>
      </div>

      <div className="vc-panel__grid vc-panel__grid--2">
        <AdminCard>
          <FormSection title="Select Field" description="Choose a field to edit its validation rules">
            <div className="adm-field">
              <label className="adm-field__label">Field</label>
              <select className="adm-input adm-select" value={selectedId} onChange={(e) => loadField(fields.find((f) => f.id === Number(e.target.value)))}>
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>{f.label} ({f.stepKey})</option>
                ))}
              </select>
            </div>
          </FormSection>

          {form && (
            <FormSection title={`Validation — ${form.label}`} description="Rules applied when vendors submit the form">
              <div className="adm-field-grid adm-field-grid--2">
                <div className="adm-field adm-field--full">
                  <label className="vc-toggle">
                    <input type="checkbox" checked={!!form.required} onChange={(e) => setForm({ ...form, required: e.target.checked })} />
                    <span>Required field</span>
                  </label>
                </div>
                <div className="adm-field">
                  <label className="adm-field__label">Pattern (regex)</label>
                  <input className="adm-input" value={form.validatePattern || ''} onChange={(e) => setForm({ ...form, validatePattern: e.target.value })} />
                  <span className="adm-field__hint">Optional regex pattern for format validation</span>
                </div>
                <div className="adm-field">
                  <label className="adm-field__label">Minimum Length</label>
                  <input className="adm-input" type="number" min={0} value={form.validateMinLength || ''} onChange={(e) => setForm({ ...form, validateMinLength: e.target.value })} />
                </div>
                <div className="adm-field adm-field--full">
                  <label className="adm-field__label">Validation Error Message</label>
                  <textarea className="adm-input adm-input--textarea" rows={2} value={form.validateMessage || ''} onChange={(e) => setForm({ ...form, validateMessage: e.target.value })} />
                </div>
                <div className="adm-field adm-field--full">
                  <label className="adm-field__label">Required Error Message</label>
                  <input className="adm-input" value={form.validateRequiredMessage || ''} onChange={(e) => setForm({ ...form, validateRequiredMessage: e.target.value })} placeholder="Shown when a required field is empty" />
                </div>
              </div>
              <AdminButton label={saving ? 'Saving...' : 'Save Validation'} icon="save" onClick={handleSave} disabled={saving} />
            </FormSection>
          )}
        </AdminCard>

        <AdminCard>
          <FormSection title="Quick Reference" description="Common validation patterns">
            <ul className="vc-validation-ref">
              <li><strong>Email</strong> — use field type Email (built-in)</li>
              <li><strong>Mobile</strong> — pattern: ^[+]?[0-9\s-]&#123;10,15&#125;$</li>
              <li><strong>Pincode</strong> — pattern: ^[0-9]&#123;5,6&#125;$</li>
              <li><strong>Min length</strong> — set minimum character count for text fields</li>
            </ul>
          </FormSection>
        </AdminCard>
      </div>
    </div>
  );
}
