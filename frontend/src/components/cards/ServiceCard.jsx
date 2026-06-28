import { Link } from 'react-router-dom';
import Rating from '../common/Rating';
import Card from '../common/Card';
import { Icon } from '../../utils/iconResolver';
import { truncateText } from '../../utils/helpers';
import cardConfig from '../../json/icons.json';
import './ServiceCard.css';

export default function ServiceCard({ service, onClick }) {
  const config = cardConfig.serviceCard;

  return (
    <Card hoverable className="service-card" onClick={onClick}>
      <Link to={`/services/${service.id}`} className="service-card__link">
        <div className="service-card__image-wrap">
          <img src={service.image} alt={service.name} className="service-card__image" loading="lazy" />
        </div>
        <div className="service-card__details">
          <h3 className="service-card__name">{service.name}</h3>
          <Rating value={service.rating} reviewCount={service.reviewCount} size="sm" />
          <div className="service-card__meta">
            <span className="service-card__vendor">
              <Icon name="FaStore" /> {service.vendorName}
            </span>
            <span className="service-card__city">
              <Icon name="FaMapMarkerAlt" /> {service.city}
            </span>
          </div>
          <p className="service-card__desc">
            {truncateText(service.description, config.descriptionMaxLength)}
          </p>
        </div>
      </Link>
    </Card>
  );
}
