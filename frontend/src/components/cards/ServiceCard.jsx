import { Link } from 'react-router-dom';
import Rating from '../common/Rating';
import Card from '../common/Card';
import { Icon } from '../../utils/iconResolver';
import { truncateText, formatPrice } from '../../utils/helpers';
import { useCategories } from '../../contexts/CategoryContext';
import cardConfig from '../../json/icons.json';
import './ServiceCard.css';

function formatCategoryLabel(categoryId) {
  if (!categoryId) return '';
  return categoryId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function ServiceCard({ service, onClick }) {
  const config = cardConfig.serviceCard;
  const { getCategoryById } = useCategories();
  const servicePath = `/services/${service.id}`;
  const fields = config.fields || [];

  const categoryName = service.category
    ? (getCategoryById(service.category)?.name || formatCategoryLabel(service.category))
    : null;

  const hasPrice = service.price != null
    && service.price !== ''
    && !Number.isNaN(Number(service.price));

  const primaryAction = config.actions?.primary;
  const secondaryAction = config.actions?.secondary;

  return (
    <Card hoverable className="service-card" onClick={onClick}>
      <div
        className="service-card__layout"
        style={{
          '--service-image-width': config.imageWidth || '192px',
          '--service-image-width-mobile': config.imageWidthMobile || '128px',
          '--service-image-aspect': config.imageAspectRatio || '4 / 3',
        }}
      >
        <Link to={servicePath} className="service-card__media" tabIndex={-1} aria-hidden="true">
          <img
            src={service.image}
            alt=""
            className="service-card__image"
            loading="lazy"
          />
        </Link>

        <div className="service-card__body">
          <div className="service-card__content">
            {fields.includes('category') && categoryName && (
              <span className="service-card__category">
                <Icon name={config.categoryIcon || 'FaTag'} />
                {categoryName}
              </span>
            )}

            <Link to={servicePath} className="service-card__title-link">
              <h3 className="service-card__name">{service.name}</h3>
            </Link>

            {fields.includes('rating') && (
              <div className="service-card__rating-row">
                <Rating value={service.rating} reviewCount={service.reviewCount} size="sm" />
              </div>
            )}

            {fields.includes('city') && service.city && (
              <p className="service-card__location">
                <Icon name={config.locationIcon || 'FaMapMarkerAlt'} />
                <span>{service.city}</span>
              </p>
            )}

            {fields.includes('price') && hasPrice && (
              <p className="service-card__price">
                {formatPrice(service.price, config.pricePrefix || '$')}
              </p>
            )}

            {fields.includes('description') && service.description && (
              <p className="service-card__desc">
                {truncateText(service.description, config.descriptionMaxLength)}
              </p>
            )}
          </div>

          {(primaryAction || secondaryAction) && (
            <div className="service-card__actions">
              {primaryAction && (
                <Link to={servicePath} className="service-card__cta service-card__cta--primary">
                  <span>{primaryAction.label}</span>
                  <Icon name={primaryAction.icon || 'FaArrowRight'} />
                </Link>
              )}
              {secondaryAction && (
                <Link to={servicePath} className="service-card__cta service-card__cta--secondary">
                  <Icon name={secondaryAction.icon || 'FaCalendarCheck'} />
                  <span>{secondaryAction.label}</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
