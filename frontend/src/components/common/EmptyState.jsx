import { Icon } from '../../utils/iconResolver';
import Button from './Button';
import './EmptyState.css';

export default function EmptyState({ config, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Icon name={config.icon} />
      </div>
      <h3 className="empty-state__title">{config.title}</h3>
      <p className="empty-state__message">{config.message}</p>
      {actionLabel && onAction && (
        <Button label={actionLabel} variant="primary" onClick={onAction} />
      )}
    </div>
  );
}
