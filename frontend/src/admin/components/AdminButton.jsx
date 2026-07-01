import { iconFromLabel, resolveAdminIcon } from '../utils/adminIcons';

const VARIANT_CLASS = {
  primary: 'primary',
  secondary: 'secondary',
  outline: 'secondary',
  danger: 'danger',
  ghost: 'ghost',
};

export default function AdminButton({
  children,
  label,
  icon,
  size,
  variant = 'primary',
  type = 'button',
  disabled,
  onClick,
  className = '',
  title,
  iconOnly = false,
}) {
  const Icon = resolveAdminIcon(icon) || iconFromLabel(label);
  const text = label ?? children;
  const variantKey = VARIANT_CLASS[variant] || 'primary';
  const tooltip = title || (typeof text === 'string' ? text : undefined);

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={tooltip}
      aria-label={iconOnly && tooltip ? tooltip : undefined}
      className={[
        'adm-btn',
        `adm-btn--${variantKey}`,
        size === 'sm' ? 'adm-btn--sm' : '',
        iconOnly ? 'adm-btn--icon-only' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {Icon && <Icon className="adm-btn__icon" aria-hidden />}
      {!iconOnly && text}
    </button>
  );
}
