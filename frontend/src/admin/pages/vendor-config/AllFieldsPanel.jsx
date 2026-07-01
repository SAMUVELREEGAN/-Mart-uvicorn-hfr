import { useState } from 'react';
import AdminCard from '../../components/AdminCard';
import AdminButton from '../../components/AdminButton';
import FieldEditor from './FieldEditor';
import { emptyField, fieldToEditorState, FIELD_TYPES } from './constants';
import { deleteField, saveField, toggleFieldStatus } from './api';

export default function AllFieldsPanel({ steps, sections, fields, onRefresh, toast, onConfirm }) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorField, setEditorField] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterStep, setFilterStep] = useState('');

  const filtered = fields
    .filter((f) => !filterStep || f.stepKey === filterStep)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const openAdd = () => {
    const stepKey = filterStep || steps[0]?.key || '';
    const section = sections.find((s) => s.stepKey === stepKey);
    setEditingField(null);
    setEditorField(fieldToEditorState(emptyField(stepKey, section?.id || '')));
    setEditorOpen(true);
  };

  const openEdit = (field) => {
    setEditingField(field);
    setEditorField(fieldToEditorState(field));
    setEditorOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveField(editorField, editingField);
      toast.success(editingField ? 'Field updated' : 'Field added');
      setEditorOpen(false);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save field');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="vc-panel">
      <div className="vc-panel-toolbar">
        <div>
          <h2>Form Fields</h2>
          <p className="vc-panel-desc">View and manage all registration fields across every step</p>
        </div>
        <div className="vc-panel-toolbar__actions">
          <select className="adm-input adm-select vc-filter" value={filterStep} onChange={(e) => setFilterStep(e.target.value)}>
            <option value="">All steps</option>
            {steps.map((s) => <option key={s.key} value={s.key}>{s.title}</option>)}
          </select>
          <AdminButton label="Add Field" icon="add" onClick={openAdd} />
        </div>
      </div>

      <AdminCard>
        <div className="vc-table-wrap">
          <table className="admin-table vc-fields-table">
            <thead>
              <tr>
                <th>Label</th>
                <th>Key</th>
                <th>Step</th>
                <th>Type</th>
                <th>Required</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="vc-empty-cell">No fields found</td></tr>
              ) : filtered.map((field) => (
                <tr key={field.id}>
                  <td><strong>{field.label}</strong></td>
                  <td><code>{field.name}</code></td>
                  <td>{field.stepKey}</td>
                  <td>{FIELD_TYPES.find((t) => t.value === field.type)?.label || field.type}</td>
                  <td>{field.required ? 'Yes' : 'No'}</td>
                  <td>
                    <span className={`vc-status-dot vc-status-dot--${field.status === 'inactive' ? 'off' : 'on'}`}>
                      {field.status === 'inactive' ? 'Disabled' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className="vc-field-card__actions">
                      <AdminButton label="Edit" icon="edit" size="sm" variant="secondary" title="Edit field" onClick={() => openEdit(field)} />
                      <AdminButton
                        label={field.status === 'inactive' ? 'Enable' : 'Disable'}
                        icon={field.status === 'inactive' ? 'enable' : 'disable'}
                        size="sm"
                        variant="outline"
                        title={field.status === 'inactive' ? 'Enable field' : 'Disable field'}
                        onClick={async () => {
                          const next = field.status === 'inactive' ? 'active' : 'inactive';
                          await toggleFieldStatus(field.id, next);
                          toast.success(next === 'active' ? 'Field enabled' : 'Field disabled');
                          onRefresh();
                        }}
                      />
                      <AdminButton
                        label="Delete"
                        icon="delete"
                        size="sm"
                        variant="danger"
                        title="Delete field"
                        onClick={() => onConfirm({
                          title: 'Delete field?',
                          message: `Remove "${field.label}"?`,
                          onConfirm: async () => {
                            await deleteField(field.id);
                            toast.success('Field deleted');
                            onRefresh();
                          },
                        })}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <FieldEditor
        open={editorOpen}
        field={editorField}
        sections={sections}
        stepFields={fields.filter((f) => f.stepKey === editorField?.stepKey)}
        onChange={setEditorField}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
