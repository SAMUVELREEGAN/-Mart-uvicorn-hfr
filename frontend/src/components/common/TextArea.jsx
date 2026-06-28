import { Icon } from '../../utils/iconResolver';
import './TextArea.css';

export default function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required,
  icon,
  rows = 4,
  disabled = false,
}) {
  return (
    <div className={`textarea-group ${error ? 'textarea-group--error' : ''}`}>
      {label && (
        <label htmlFor={name} className="textarea-group__label">
          {label}
          {required && <span className="textarea-group__required">*</span>}
        </label>
      )}
      <div className="textarea-group__wrapper">
        {icon && <Icon name={icon} className="textarea-group__icon" />}
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className="textarea-group__textarea"
        />
      </div>
      {error && <span className="textarea-group__error">{error}</span>}
    </div>
  );
}
