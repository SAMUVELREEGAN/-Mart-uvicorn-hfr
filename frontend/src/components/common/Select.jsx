import { Icon } from '../../utils/iconResolver';
import './Select.css';

export default function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder,
  error,
  required,
  icon,
  disabled = false,
}) {
  return (
    <div className={`select-group ${error ? 'select-group--error' : ''}`}>
      {label && (
        <label htmlFor={name} className="select-group__label">
          {label}
          {required && <span className="select-group__required">*</span>}
        </label>
      )}
      <div className="select-group__wrapper">
        {icon && <Icon name={icon} className="select-group__icon" />}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`select-group__select ${icon ? 'select-group__select--icon' : ''}`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value || opt.id} value={opt.value || opt.id}>
              {opt.label || opt.name}
            </option>
          ))}
        </select>
      </div>
      {error && <span className="select-group__error">{error}</span>}
    </div>
  );
}
