import './Badge.css';

export default function Badge({ label, variant = 'default', icon: IconComponent }) {
  return (
    <span className={`badge badge--${variant}`}>
      {IconComponent && <IconComponent className="badge__icon" />}
      {label}
    </span>
  );
}
