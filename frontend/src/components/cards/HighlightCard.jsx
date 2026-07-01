import { Link } from 'react-router-dom';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import { Icon } from '../../utils/iconResolver';
import './HighlightCard.css';

export default function HighlightCard({ category, isActive }) {
  const to = category.path || `/category/${category.id}`;
  return (
    <Link
      to={to}
      className={`highlight-card ${isActive ? 'highlight-card--active' : ''}`}
      style={{ '--card-color': category.color }}
    >
      {category.image && (
        <img src={resolveMediaUrl(category.image)} alt={category.title} className="highlight-card__image" loading="lazy" />
      )}
      <div className="highlight-card__overlay" />
      <div className="highlight-card__content">
        <h3 className="highlight-card__title">{category.title}</h3>
        {category.subtitle && (
          <p className="highlight-card__subtitle">{category.subtitle}</p>
        )}
        <span className="highlight-card__arrow" aria-hidden="true">
          <Icon name="FaChevronRight" />
        </span>
      </div>
    </Link>
  );
}
