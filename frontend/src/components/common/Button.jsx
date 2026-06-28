import { Icon } from '../../utils/iconResolver';
import './Button.css';

export default function Button({
  label,
  variant = 'primary',
  icon,
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  size = 'md',
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <Icon name={icon} className="btn__icon" />}
      {label && <span className="btn__label">{label}</span>}
    </button>
  );
}
