import heroConfig from '../../json/hero.json';
import { Icon } from '../../utils/iconResolver';
import Rating from '../common/Rating';
import Button from '../common/Button';
import Card from '../common/Card';
import './ConsultantCard.css';

export default function ConsultantCard({ consultant, config }) {
  const cardConfig = config || heroConfig.homeContent.realEstateConsultants;

  return (
    <Card hoverable className="consultant-card">
      <div className="consultant-card__media">
        <img
          src={consultant.image}
          alt={consultant.name}
          className="consultant-card__image"
          loading="lazy"
        />
        <div className="consultant-card__media-overlay" aria-hidden="true" />
        {consultant.rating > 0 && (
          <div className="consultant-card__rating-badge">
            <Icon name="FaStar" />
            <span>{consultant.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="consultant-card__body">
        <div className="consultant-card__header">
          <h3 className="consultant-card__name">{consultant.name}</h3>
          <p className="consultant-card__company">{consultant.company}</p>
        </div>

        {consultant.rating > 0 && (
          <div className="consultant-card__rating-row">
            <Rating value={consultant.rating} reviewCount={consultant.reviewCount} size="sm" />
          </div>
        )}

        <div className="consultant-card__meta">
          <span className="consultant-card__pill">
            <Icon name="FaBriefcase" />
            {consultant.experience} {cardConfig.experienceSuffix}
          </span>
          <span className="consultant-card__pill">
            <Icon name="FaMapMarkerAlt" />
            {consultant.city}
          </span>
        </div>

        <a href={`tel:${consultant.phone}`} className="consultant-card__cta">
          <Button
            label={cardConfig.contactButton.label}
            icon={cardConfig.contactButton.icon}
            variant="primary"
            size="sm"
            fullWidth
          />
        </a>
      </div>
    </Card>
  );
}
