import './Skeleton.css';

export function Skeleton({ width, height, circle = false, className = '' }) {
  return (
    <div
      className={`skeleton ${circle ? 'skeleton--circle' : ''} ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`skeleton-text ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="skeleton skeleton--text"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ layout = 'horizontal' }) {
  return (
    <div className={`skeleton-card skeleton-card--${layout}`}>
      <Skeleton className="skeleton-card__image" height={layout === 'horizontal' ? 140 : 180} />
      <div className="skeleton-card__content">
        <Skeleton height={20} width="70%" />
        <Skeleton height={16} width="40%" />
        <SkeletonText lines={2} />
      </div>
    </div>
  );
}

export function SkeletonCategoryList({ count = 8 }) {
  return (
    <div className="skeleton-categories">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton-categories__item">
          <Skeleton circle width={48} height={48} />
          <Skeleton height={12} width={60} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonHighlightGrid({ count = 6 }) {
  return (
    <div className="skeleton-highlights">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className="skeleton-highlights__item" height={200} />
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="skeleton-hero">
      <Skeleton height={32} width="50%" />
      <Skeleton height={20} width="70%" />
      <div className="skeleton-hero__actions">
        <Skeleton height={44} width={160} />
        <Skeleton height={44} width={160} />
      </div>
    </div>
  );
}

export function SkeletonDetails() {
  return (
    <div className="skeleton-details">
      <Skeleton className="skeleton-details__image" height={400} />
      <div className="skeleton-details__info">
        <Skeleton height={32} width="60%" />
        <Skeleton height={20} width="30%" />
        <SkeletonText lines={4} />
        <Skeleton height={44} width={140} />
      </div>
    </div>
  );
}
