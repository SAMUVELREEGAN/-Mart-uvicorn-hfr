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
      <div className="consultant-card__image-wrap">
        <img src={consultant.image} alt={consultant.name} className="consultant-card__image" loading="lazy" />
      </div>
      <div className="consultant-card__body">
        <h3 className="consultant-card__name">{consultant.name}</h3>
        <p className="consultant-card__company">{consultant.company}</p>
        {consultant.rating > 0 && (
          <Rating value={consultant.rating} reviewCount={consultant.reviewCount} size="sm" />
        )}
        <div className="consultant-card__meta">
          <p className="consultant-card__experience">
            <Icon name="FaBriefcase" />
            <span>{consultant.experience} {cardConfig.experienceSuffix}</span>
          </p>
          <p className="consultant-card__city">
            <Icon name="FaMapMarkerAlt" />
            <span>{consultant.city}</span>
          </p>
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
