import { FaExclamationTriangle } from 'react-icons/fa';
import AdminButton from './AdminButton';
import './ConfirmDialog.css';

export default function ConfirmDialog({
  open,
  title = 'Confirm action',
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="adm-confirm-overlay" role="dialog" aria-modal="true">
      <div className="adm-confirm">
        <div className="adm-confirm__icon">
          <FaExclamationTriangle />
        </div>
        <h3 className="adm-confirm__title">{title}</h3>
        <p className="adm-confirm__message">{message}</p>
        <div className="adm-confirm__actions">
          <AdminButton label={cancelLabel} icon="cancel" variant="ghost" title={cancelLabel} onClick={onCancel} />
          <AdminButton label={confirmLabel} icon={variant === 'danger' ? 'delete' : 'save'} variant={variant} title={confirmLabel} onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}
