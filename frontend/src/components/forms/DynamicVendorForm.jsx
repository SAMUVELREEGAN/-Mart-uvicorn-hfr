import DynamicVendorField from './DynamicVendorField';
import { isFieldVisible } from '../../utils/vendorFormUtils';
import './DynamicVendorForm.css';

export default function DynamicVendorForm({ sections, fields, values, errors, onChange }) {
  return (
    <div className="dynamic-vendor-form">
      {sections.map((section) => {
        const sectionFields = fields.filter(
          (f) => f.sectionId === section.id && isFieldVisible(f, values),
        );
        if (!sectionFields.length) return null;
        return (
          <div key={section.id} className="dynamic-vendor-form__section">
            <h3 className="dynamic-vendor-form__section-title">{section.title}</h3>
            {section.description && (
              <p className="dynamic-vendor-form__section-desc">{section.description}</p>
            )}
            <div className="dynamic-vendor-form__fields">
              {sectionFields.map((field) => (
                <DynamicVendorField
                  key={field.id || field.name}
                  field={field}
                  value={values[field.name]}
                  error={errors[field.name]}
                  onChange={onChange}
                  values={values}
                />
              ))}
            </div>
          </div>
        );
      })}
      {sections.length === 0 && fields.filter((f) => isFieldVisible(f, values)).map((field) => (
        <DynamicVendorField
          key={field.id || field.name}
          field={field}
          value={values[field.name]}
          error={errors[field.name]}
          onChange={onChange}
          values={values}
        />
      ))}
    </div>
  );
}
