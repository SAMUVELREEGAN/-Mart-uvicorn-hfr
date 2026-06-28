import { Icon } from '../../utils/iconResolver';
import './Rating.css';

export default function Rating({ value = 0, max = 5, onChange, size = 'md', showValue = true, reviewCount }) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  const interactive = typeof onChange === 'function';

  return (
    <div className={`rating rating--${size}`}>
      <div className="rating__stars">
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            className={`rating__star ${star <= Math.round(value) ? 'rating__star--active' : ''} ${interactive ? 'rating__star--interactive' : ''}`}
            onClick={interactive ? () => onChange(star) : undefined}
            disabled={!interactive}
            aria-label={`${star} star`}
          >
            <Icon name="FaStar" />
          </button>
        ))}
      </div>
      {showValue && (
        <span className="rating__value">
          {value > 0 ? value.toFixed(1) : '0.0'}
          {reviewCount !== undefined && (
            <span className="rating__count">({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
}
