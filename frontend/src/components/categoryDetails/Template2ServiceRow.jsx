import { Link } from 'react-router-dom';
import Rating from '../common/Rating';
import { Icon } from '../../utils/iconResolver';
import { formatPrice } from '../../utils/helpers';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import './Template2ServiceRow.css';

export default function Template2ServiceRow({ service, layout = 'horizontal' }) {
  const servicePath = `/services/${service.id}`;
  const hasPrice = service.price != null
    && service.price !== ''
    && !Number.isNaN(Number(service.price));

  return (
    <article className={`tpl2-service-row tpl2-service-row--${layout}`}>
      <Link to={servicePath} className="tpl2-service-row__media" tabIndex={-1} aria-hidden="true">
        <img src={resolveMediaUrl(service.image)} alt="" loading="lazy" />
      </Link>

      <div className="tpl2-service-row__body">
        <Link to={servicePath} className="tpl2-service-row__title-link">
          <h3 className="tpl2-service-row__title">{service.name}</h3>
        </Link>

        {service.rating != null && (
          <div className="tpl2-service-row__rating">
            <Rating value={service.rating} reviewCount={service.reviewCount} size="sm" />
          </div>
        )}

        {(service.location || service.city) && (
          <p className="tpl2-service-row__meta">
            <Icon name="FaMapMarkerAlt" />
            <span>{service.location || service.city}</span>
          </p>
        )}

        {service.vendorName && (
          <p className="tpl2-service-row__meta tpl2-service-row__meta--vendor">
            <Icon name="FaStore" />
            <span>{service.vendorName}</span>
          </p>
        )}

        {hasPrice && (
          <p className="tpl2-service-row__price">{formatPrice(service.price)}</p>
        )}

        {service.description && (
          <p className="tpl2-service-row__desc">{service.description}</p>
        )}

        <div className="tpl2-service-row__actions">
          <Link to={servicePath} className="tpl2-service-row__btn tpl2-service-row__btn--primary">
            View Details
            <Icon name="FaArrowRight" />
          </Link>
        </div>
      </div>
    </article>
  );
}
