import { useState } from 'react';
import AdminCard from '../../components/AdminCard';
import AdminButton from '../../components/AdminButton';
import FormSection from '../../components/FormSection';
import SortableList from '../../components/SortableList';
import FormPreview from './FormPreview';
import FieldEditor from './FieldEditor';
import { emptyField, emptySection, fieldToEditorState } from './constants';
import { deleteField, deleteSection, reorderFields, saveField, saveSection, toggleFieldStatus } from './api';

function FieldCard({ field, onEdit, onDelete, onToggle }) {
  return (
    <div className="vc-field-card__content">
      <div className="vc-field-card__info">
        <strong>{field.label}</strong>
        <span className="vc-field-card__meta">{field.name} · {field.type}</span>
        <div className="vc-field-card__badges">
          {field.required && <span className="vc-badge vc-badge--required">Required</span>}
          {field.status === 'inactive' && <span className="vc-badge vc-badge--disabled">Disabled</span>}
        </div>
      </div>
      <div className="vc-field-card__actions">
        <AdminButton
          label={field.status === 'inactive' ? 'Enable' : 'Disable'}
          icon={field.status === 'inactive' ? 'enable' : 'disable'}
          size="sm"
          variant="outline"
          title={field.status === 'inactive' ? 'Enable field' : 'Disable field'}
          onClick={() => onToggle(field)}
        />
        <AdminButton label="Edit" icon="edit" size="sm" variant="secondary" title="Edit field" onClick={() => onEdit(field)} />
        <AdminButton label="Delete" icon="delete" size="sm" variant="danger" title="Delete field" onClick={() => onDelete(field)} />
      </div>
    </div>
  );
}

export default function StepBuilderPanel({
  stepKey,
  title,
  description,
  steps,
  sections,
  fields,
  onRefresh,
  toast,
  onConfirm,
}) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorField, setEditorField] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [saving, setSaving] = useState(false);
  const [sectionForm, setSectionForm] = useState(emptySection(stepKey));
  const [editingSection, setEditingSection] = useState(null);
  const [showSectionForm, setShowSectionForm] = useState(false);

  const stepFields = fields.filter((f) => f.stepKey === stepKey).sort((a, b) => a.sortOrder - b.sortOrder);
  const stepSections = sections.filter((s) => s.stepKey === stepKey).sort((a, b) => a.sortOrder - b.sortOrder);
  const stepMeta = steps.find((s) => s.key === stepKey);

  const openAddField = () => {
    setEditingField(null);
    setEditorField(fieldToEditorState(emptyField(stepKey, stepSections[0]?.id || '')));
    setEditorOpen(true);
  };

  const openEditField = (field) => {
    setEditingField(field);
    setEditorField(fieldToEditorState(field));
    setEditorOpen(true);
  };

  const handleSaveField = async () => {
    if (!editorField.label?.trim() || !editorField.name?.trim()) {
      return;
    }
    setSaving(true);
    try {
      await saveField({ ...editorField, stepKey }, editingField);
      toast.success(editingField ? 'Field updated' : 'Field added');
      setEditorOpen(false);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save field');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteField = (field) => {
    onConfirm({
      title: 'Delete field?',
      message: `Remove "${field.label}" from the registration form? This cannot be undone.`,
      onConfirm: async () => {
        await deleteField(field.id);
        toast.success('Field deleted');
        onRefresh();
      },
    });
  };

  const handleToggleField = async (field) => {
    const next = field.status === 'inactive' ? 'active' : 'inactive';
    await toggleFieldStatus(field.id, next);
    toast.success(next === 'active' ? 'Field enabled' : 'Field disabled');
    onRefresh();
  };

  const handleReorder = async (next) => {
    await reorderFields(next);
    toast.success('Field order updated');
    onRefresh();
  };

  const handleSaveSection = async () => {
    if (!sectionForm.title?.trim()) return;
    setSaving(true);
    try {
      await saveSection({ ...sectionForm, stepKey }, editingSection);
      toast.success(editingSection ? 'Section updated' : 'Section added');
      setShowSectionForm(false);
      setEditingSection(null);
      setSectionForm(emptySection(stepKey));
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save section');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSection = (section) => {
    onConfirm({
      title: 'Delete section?',
      message: `Remove section "${section.title}"? Fields in this section will remain but lose their grouping.`,
      onConfirm: async () => {
        await deleteSection(section.id);
        toast.success('Section deleted');
        onRefresh();
      },
    });
  };

  return (
    <div className="vc-step-builder">
      <div className="vc-step-builder__intro">
        <h2>{title}</h2>
        <p>{description}</p>
        {stepMeta && <p className="vc-step-builder__meta">Step key: <code>{stepKey}</code></p>}
      </div>

      <div className="vc-step-builder__grid">
        <div className="vc-step-builder__main">
          <AdminCard>
            <div className="vc-panel-toolbar">
              <h3>Form Fields</h3>
              <AdminButton label="Add Field" icon="add" onClick={openAddField} />
            </div>
            {stepFields.length === 0 ? (
              <p className="vc-empty">No fields yet. Click &quot;Add Field&quot; to build this step.</p>
            ) : (
              <SortableList
                items={stepFields}
                onReorder={handleReorder}
                renderItem={(field) => (
                  <FieldCard
                    field={field}
                    onEdit={openEditField}
                    onDelete={handleDeleteField}
                    onToggle={handleToggleField}
                  />
                )}
              />
            )}
          </AdminCard>

          <AdminCard className="vc-sections-card">
            <div className="vc-panel-toolbar">
              <h3>Sections</h3>
              <AdminButton
                label="Add Section"
                icon="add"
                variant="outline"
                onClick={() => {
                  setEditingSection(null);
                  setSectionForm({ ...emptySection(stepKey), sortOrder: stepSections.length });
                  setShowSectionForm(true);
                }}
              />
            </div>
            {showSectionForm && (
              <FormSection title={editingSection ? 'Edit Section' : 'New Section'}>
                <div className="adm-field-grid adm-field-grid--2">
                  <div className="adm-field adm-field--full">
                    <label className="adm-field__label">Section Title</label>
                    <input className="adm-input" value={sectionForm.title} onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })} />
                  </div>
                  <div className="adm-field adm-field--full">
                    <label className="adm-field__label">Description</label>
                    <textarea className="adm-input adm-input--textarea" rows={2} value={sectionForm.description} onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })} />
                  </div>
                </div>
                <div className="vc-panel-toolbar vc-panel-toolbar--footer">
                  <AdminButton label="Cancel" icon="cancel" variant="ghost" onClick={() => setShowSectionForm(false)} />
                  <AdminButton label={saving ? 'Saving...' : 'Save Section'} icon="save" onClick={handleSaveSection} disabled={saving} />
                </div>
              </FormSection>
            )}
            <div className="vc-section-list">
              {stepSections.map((section) => (
                <div key={section.id} className="vc-section-item">
                  <div>
                    <strong>{section.title}</strong>
                    {section.description && <p>{section.description}</p>}
                  </div>
                  <div className="vc-field-card__actions">
                    <AdminButton label="Edit" icon="edit" size="sm" variant="secondary" title="Edit section" onClick={() => { setEditingSection(section); setSectionForm(section); setShowSectionForm(true); }} />
                    <AdminButton label="Delete" icon="delete" size="sm" variant="danger" title="Delete section" onClick={() => handleDeleteSection(section)} />
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        <FormPreview title={`${title} Preview`} sections={sections} fields={fields} stepKey={stepKey} />
      </div>

      <FieldEditor
        open={editorOpen}
        field={editorField}
        sections={sections}
        stepFields={stepFields}
        fixedStepKey={stepKey}
        onChange={setEditorField}
        onClose={() => setEditorOpen(false)}
        onSave={handleSaveField}
        saving={saving}
      />
    </div>
  );
}
