import { Icon } from '../../utils/iconResolver';
import Button from './Button';
import './ErrorState.css';

export default function ErrorState({ config, onRetry }) {
  return (
    <div className="error-state">
      <div className="error-state__icon">
        <Icon name={config.icon} />
      </div>
      <h3 className="error-state__title">{config.title}</h3>
      <p className="error-state__message">{config.message}</p>
      {onRetry && <Button label="Try Again" variant="outline" onClick={onRetry} icon="FaRedo" />}
    </div>
  );
}
