import AdminCard from '../../components/AdminCard';
import { FIELD_TYPES } from './constants';
import './FormPreview.css';

function PreviewInput({ field }) {
  const common = {
    disabled: true,
    className: 'vc-preview__input',
    placeholder: field.placeholder || '',
  };

  switch (field.type) {
    case 'textarea':
      return <textarea {...common} rows={3} defaultValue={field.defaultValue || ''} />;
    case 'select':
      return (
        <select {...common}>
          <option>{field.placeholder || 'Select...'}</option>
          {(field.options || []).map((o) => (
            <option key={o.value}>{o.label}</option>
          ))}
        </select>
      );
    case 'radio':
      return (
        <div className="vc-preview__radio-group">
          {(field.options || []).map((o) => (
            <label key={o.value} className="vc-preview__radio">
              <input type="radio" disabled name={field.name} />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      );
    case 'checkbox':
      return (
        <label className="vc-preview__checkbox">
          <input type="checkbox" disabled />
          <span>{field.label}</span>
        </label>
      );
    case 'file':
    case 'image':
      return <div className="vc-preview__upload">Upload area</div>;
    default:
      return <input type={field.type === 'mobile' ? 'tel' : field.type} {...common} />;
  }
}

export default function FormPreview({ title, sections, fields, stepKey }) {
  const activeFields = fields
    .filter((f) => f.stepKey === stepKey && f.status !== 'inactive')
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const stepSections = sections
    .filter((s) => s.stepKey === stepKey && s.status !== 'inactive')
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const typeLabel = (type) => FIELD_TYPES.find((t) => t.value === type)?.label || type;

  return (
    <AdminCard className="vc-preview">
      <div className="vc-preview__header">
        <h3>{title || 'Live Preview'}</h3>
        <span className="vc-preview__badge">Preview</span>
      </div>
      <div className="vc-preview__body">
        {stepSections.length === 0 && activeFields.length === 0 && (
          <p className="vc-preview__empty">Add fields to see a live preview of the registration form.</p>
        )}
        {stepSections.map((section) => {
          const sectionFields = activeFields.filter((f) => f.sectionId === section.id);
          if (!sectionFields.length) return null;
          return (
            <div key={section.id} className="vc-preview__section">
              <h4>{section.title}</h4>
              {section.description && <p>{section.description}</p>}
              {sectionFields.map((field) => (
                <div key={field.id} className="vc-preview__field">
                  {field.type !== 'checkbox' && (
                    <label className="vc-preview__label">
                      {field.label}
                      {field.required && <span className="vc-preview__required">*</span>}
                    </label>
                  )}
                  <PreviewInput field={field} />
                  {field.helpText && <span className="vc-preview__help">{field.helpText}</span>}
                  <span className="vc-preview__type">{typeLabel(field.type)}</span>
                </div>
              ))}
            </div>
          );
        })}
        {activeFields.filter((f) => !f.sectionId).map((field) => (
          <div key={field.id} className="vc-preview__field">
            {field.type !== 'checkbox' && (
              <label className="vc-preview__label">
                {field.label}
                {field.required && <span className="vc-preview__required">*</span>}
              </label>
            )}
            <PreviewInput field={field} />
            {field.helpText && <span className="vc-preview__help">{field.helpText}</span>}
          </div>
        ))}
      </div>
    </AdminCard>
  );
}
