import { Icon } from '../../utils/iconResolver';
import './Input.css';

export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required,
  icon,
  accept,
  disabled = false,
}) {
  return (
    <div className={`input-group ${error ? 'input-group--error' : ''}`}>
      {label && (
        <label htmlFor={name} className="input-group__label">
          {label}
          {required && <span className="input-group__required">*</span>}
        </label>
      )}
      <div className="input-group__wrapper">
        {icon && <Icon name={icon} className="input-group__icon" />}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          accept={accept}
          disabled={disabled}
          className={`input-group__input ${icon ? 'input-group__input--icon' : ''}`}
        />
      </div>
      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
}
