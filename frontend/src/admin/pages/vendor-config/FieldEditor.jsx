import FormSection from '../../components/FormSection';
import AdminButton from '../../components/AdminButton';
import { FaTimes } from 'react-icons/fa';
import {
  BUSINESS_TYPE_VALUES,
  FIELD_TYPES,
  OPTIONS_KEYS,
} from './constants';
import './FieldEditor.css';

function OptionRows({ options, onChange }) {
  const rows = options?.length ? options : [{ value: '', label: '' }];

  const updateRow = (index, key, val) => {
    const next = rows.map((r, i) => (i === index ? { ...r, [key]: val } : r));
    onChange(next);
  };

  return (
    <div className="vc-field-editor__options">
      {rows.map((row, index) => (
        <div key={index} className="vc-field-editor__option-row">
          <input className="adm-input" placeholder="Value" value={row.value} onChange={(e) => updateRow(index, 'value', e.target.value)} />
          <input className="adm-input" placeholder="Label" value={row.label} onChange={(e) => updateRow(index, 'label', e.target.value)} />
          <button type="button" className="vc-field-editor__remove" onClick={() => onChange(rows.filter((_, i) => i !== index))}>×</button>
        </div>
      ))}
      <button type="button" className="vc-field-editor__add-option" onClick={() => onChange([...rows, { value: '', label: '' }])}>+ Add option</button>
    </div>
  );
}

function FormField({ label, hint, required, children }) {
  return (
    <div className="adm-field">
      <label className="adm-field__label">
        {label}
        {required && <span className="adm-field__required">*</span>}
      </label>
      {children}
      {hint && <span className="adm-field__hint">{hint}</span>}
    </div>
  );
}

export default function FieldEditor({
  open,
  field,
  sections,
  stepFields,
  fixedStepKey,
  onChange,
  onClose,
  onSave,
  saving,
  errors = {},
}) {
  if (!open || !field) return null;

  const needsOptions = ['select', 'multiselect', 'radio'].includes(field.type);
  const sectionOptions = sections.filter((s) => !fixedStepKey || s.stepKey === fixedStepKey);
  const dependencyFields = stepFields.filter((f) => f.name !== field.name);
  const set = (patch) => onChange({ ...field, ...patch });

  return (
    <div className="vc-field-editor-overlay" role="dialog" aria-modal="true">
      <div className="vc-field-editor">
        <header className="vc-field-editor__header">
          <h2>{field.id ? 'Edit Field' : 'Add Field'}</h2>
          <button type="button" className="vc-field-editor__close" onClick={onClose} title="Close" aria-label="Close">
            <FaTimes />
          </button>
        </header>

        <div className="vc-field-editor__body">
          <FormSection title="Basic Information" description="Field identity and display settings">
            <div className="adm-field-grid adm-field-grid--2">
              <FormField label="Field Label" required hint="Shown above the input on the registration form">
                <input className="adm-input" value={field.label} onChange={(e) => set({ label: e.target.value })} />
              </FormField>
              <FormField label="Field Key" required hint="Unique identifier (e.g. fullName)">
                <input className="adm-input" value={field.name} onChange={(e) => set({ name: e.target.value })} />
              </FormField>
              <FormField label="Field Type" required>
                <select className="adm-input adm-select" value={field.type} onChange={(e) => set({ type: e.target.value })}>
                  {FIELD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </FormField>
              <FormField label="Section" hint="Group this field under a section">
                <select className="adm-input adm-select" value={field.sectionId || ''} onChange={(e) => set({ sectionId: e.target.value })}>
                  <option value="">No section</option>
                  {sectionOptions.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </FormField>
              <FormField label="Placeholder" fullWidth>
                <input className="adm-input" value={field.placeholder || ''} onChange={(e) => set({ placeholder: e.target.value })} />
              </FormField>
              <FormField label="Helper Text">
                <input className="adm-input" value={field.helpText || ''} onChange={(e) => set({ helpText: e.target.value })} />
              </FormField>
              <FormField label="Default Value">
                <input className="adm-input" value={field.defaultValue || ''} onChange={(e) => set({ defaultValue: e.target.value })} />
              </FormField>
            </div>
            <div className="vc-field-editor__toggles">
              <label className="vc-toggle">
                <input type="checkbox" checked={!!field.required} onChange={(e) => set({ required: e.target.checked })} />
                <span>Required field</span>
              </label>
              <label className="vc-toggle">
                <input type="checkbox" checked={field.status !== 'inactive'} onChange={(e) => set({ status: e.target.checked ? 'active' : 'inactive' })} />
                <span>Enabled</span>
              </label>
            </div>
          </FormSection>

          {needsOptions && (
            <FormSection title="Dropdown / Radio Options" description="Manual options or load from catalog">
              <FormField label="Dynamic Options Source" hint="Leave as manual or pick product/service categories">
                <select className="adm-input adm-select" value={field.optionsKey || ''} onChange={(e) => set({ optionsKey: e.target.value })}>
                  {OPTIONS_KEYS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </FormField>
              {!field.optionsKey && <OptionRows options={field.options} onChange={(options) => set({ options })} />}
            </FormSection>
          )}

          <FormSection title="Visibility Rules" description="Show this field only when another field matches">
            <FormField label="Depends On Field" hint="Usually businessType for category fields">
              <select className="adm-input adm-select" value={field.showWhenField || ''} onChange={(e) => set({ showWhenField: e.target.value })}>
                <option value="">Always visible</option>
                {dependencyFields.map((f) => <option key={f.id} value={f.name}>{f.label || f.name}</option>)}
              </select>
            </FormField>
            {field.showWhenField && (
              <div className="vc-field-editor__checkbox-group">
                <span className="adm-field__label">Show when value is</span>
                {BUSINESS_TYPE_VALUES.map((opt) => (
                  <label key={opt.value} className="vc-toggle">
                    <input
                      type="checkbox"
                      checked={(field.showWhenValues || []).includes(opt.value)}
                      onChange={(e) => {
                        const current = field.showWhenValues || [];
                        set({
                          showWhenValues: e.target.checked
                            ? [...current, opt.value]
                            : current.filter((v) => v !== opt.value),
                        });
                      }}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            )}
          </FormSection>

          <FormSection title="Validation Rules" description="Client-side validation for this field">
            <div className="adm-field-grid adm-field-grid--2">
              <FormField label="Pattern (regex)" hint="e.g. ^[+]?[0-9\\s-]{10,15}$ for phone">
                <input className="adm-input" value={field.validatePattern || ''} onChange={(e) => set({ validatePattern: e.target.value })} />
              </FormField>
              <FormField label="Minimum Length">
                <input className="adm-input" type="number" value={field.validateMinLength || ''} onChange={(e) => set({ validateMinLength: e.target.value })} />
              </FormField>
              <div className="adm-field adm-field--full">
                <FormField label="Validation Error Message">
                  <textarea className="adm-input adm-input--textarea" rows={2} value={field.validateMessage || ''} onChange={(e) => set({ validateMessage: e.target.value })} />
                </FormField>
              </div>
              <div className="adm-field adm-field--full">
                <FormField label="Required Error Message">
                  <input className="adm-input" value={field.validateRequiredMessage || ''} onChange={(e) => set({ validateRequiredMessage: e.target.value })} />
                </FormField>
              </div>
            </div>
          </FormSection>

          {errors.form && <p className="vc-field-editor__error">{errors.form}</p>}
        </div>

        <footer className="vc-field-editor__footer">
          <AdminButton label="Cancel" icon="cancel" variant="ghost" onClick={onClose} />
          <AdminButton label={saving ? 'Saving...' : 'Save Field'} icon="save" variant="primary" onClick={onSave} disabled={saving} />
        </footer>
      </div>
    </div>
  );
}
