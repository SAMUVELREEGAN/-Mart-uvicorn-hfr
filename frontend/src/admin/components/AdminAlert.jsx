export default function AdminAlert({ type = 'info', children, onClose }) {
  return (
    <div className={`adm-alert adm-alert--${type}`} role="alert">
      <span>{children}</span>
      {onClose && (
        <button type="button" className="adm-alert__close" onClick={onClose} aria-label="Dismiss">×</button>
      )}
    </div>
  );
}
