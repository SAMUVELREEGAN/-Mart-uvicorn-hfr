import Input from '../common/Input';
import Select from '../common/Select';
import TextArea from '../common/TextArea';
import { useCategories } from '../../contexts/CategoryContext';
import './DynamicVendorField.css';

export default function DynamicVendorField({ field, value, error, onChange, values }) {
  const { productCategories, serviceCategories } = useCategories();

  const optionsMap = {
    productCategories: productCategories.map((c) => ({ value: c.id, label: c.name })),
    serviceCategories: serviceCategories.map((c) => ({ value: c.id, label: c.name })),
  };

  const common = {
    name: field.name,
    label: field.label,
    value: value ?? '',
    error,
    required: field.required,
    placeholder: field.placeholder,
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(field.name, ev.target.result);
    reader.readAsDataURL(file);
  };

  const options = field.options?.length
    ? field.options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
    : optionsMap[field.optionsKey] || [];

  switch (field.type) {
    case 'textarea':
      return (
        <TextArea
          {...common}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
    case 'select':
      return (
        <Select
          {...common}
          options={options}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
    case 'multiselect':
      return (
        <div className="dynamic-field">
          <label className="dynamic-field__label">
            {field.label}
            {field.required && <span className="dynamic-field__required">*</span>}
          </label>
          <select
            multiple
            className="dynamic-field__multiselect"
            value={Array.isArray(value) ? value : []}
            onChange={(e) => onChange(
              field.name,
              Array.from(e.target.selectedOptions, (o) => o.value),
            )}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {field.helpText && <p className="dynamic-field__help">{field.helpText}</p>}
          {error && <span className="dynamic-field__error">{error}</span>}
        </div>
      );
    case 'radio':
      return (
        <div className="dynamic-field">
          <span className="dynamic-field__label">
            {field.label}
            {field.required && <span className="dynamic-field__required">*</span>}
          </span>
          <div className="dynamic-field__radio-group">
            {options.map((opt) => (
              <label key={opt.value} className="dynamic-field__radio">
                <input
                  type="radio"
                  name={field.name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => onChange(field.name, opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {field.helpText && <p className="dynamic-field__help">{field.helpText}</p>}
          {error && <span className="dynamic-field__error">{error}</span>}
        </div>
      );
    case 'checkbox':
      return (
        <label className="dynamic-field__checkbox">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(field.name, e.target.checked)}
          />
          <span>{field.label}</span>
          {error && <span className="dynamic-field__error">{error}</span>}
        </label>
      );
    case 'file':
    case 'image':
      return (
        <div className="dynamic-field">
          <Input
            {...common}
            type="file"
            accept={field.type === 'image' ? 'image/*' : undefined}
            value=""
            onChange={handleFile}
          />
          {value && field.type === 'image' && (
            <img src={value} alt="" className="dynamic-field__preview" />
          )}
          {field.helpText && <p className="dynamic-field__help">{field.helpText}</p>}
        </div>
      );
    default:
      return (
        <Input
          {...common}
          type={field.type === 'mobile' ? 'tel' : field.type}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
  }
}
