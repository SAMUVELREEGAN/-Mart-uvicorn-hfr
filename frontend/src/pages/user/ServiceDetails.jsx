import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useServices } from '../../contexts/ServiceContext';
import { useReviews } from '../../contexts/ReviewContext';
import { useSimulatedLoading } from '../../hooks/useHelpers';
import formsConfig from '../../json/forms.json';
import buttonsConfig from '../../json/buttons.json';
import Rating from '../../components/common/Rating';
import Button from '../../components/common/Button';
import Carousel from '../../components/common/Carousel';
import Tabs from '../../components/common/Tabs';
import FormBuilder from '../../components/forms/FormBuilder';
import ErrorState from '../../components/common/ErrorState';
import { SkeletonDetails } from '../../components/skeleton/Skeleton';
import { Icon } from '../../utils/iconResolver';
import cardConfig from '../../json/icons.json';
import './Details.css';

export default function ServiceDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('description');
  const loading = useSimulatedLoading();
  const { getService } = useServices();
  const { getReviewsForTarget, addReview } = useReviews();
  const service = getService(id);
  const reviews = getReviewsForTarget(id, 'service');

  if (loading) return <SkeletonDetails />;

  if (!service) {
    return <ErrorState config={cardConfig.errorState.notFound} />;
  }

  const images = [service.image, ...(service.gallery || [])];

  const handleReview = (values) => {
    addReview(id, 'service', values);
  };

  const tabs = [
    {
      key: 'description',
      label: 'Description',
      content: <p className="details__text">{service.description}</p>,
    },
    {
      key: 'info',
      label: 'Service Info',
      content: (
        <dl className="details__specs">
          <div className="details__spec-row"><dt>Working Hours</dt><dd>{service.workingHours}</dd></div>
          <div className="details__spec-row"><dt>Service Area</dt><dd>{service.serviceArea}</dd></div>
        </dl>
      ),
    },
    {
      key: 'reviews',
      label: `Reviews (${reviews.length})`,
      content: (
        <div className="details__reviews">
          <FormBuilder fields={formsConfig.review} onSubmit={handleReview} submitKey="submitReview" />
          <div className="details__review-list">
            {reviews.map((review) => (
              <div key={review.id} className="details__review">
                <div className="details__review-header">
                  <strong>{review.userName}</strong>
                  <Rating value={review.rating} showValue={false} size="sm" />
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="details">
      <div className="details__main">
        <Carousel images={images} alt={service.name} />
        <div className="details__info">
          <h1 className="details__title">{service.name}</h1>
          <Rating value={service.rating} reviewCount={service.reviewCount} />
          <div className="details__meta">
            <span><Icon name="FaStore" /> {service.vendorName}</span>
            <span><Icon name="FaMapMarkerAlt" /> {service.city}</span>
          </div>
          <div className="details__actions">
            <Button label={buttonsConfig.book.label} icon={buttonsConfig.book.icon} variant="primary" size="lg" />
            <Button label={buttonsConfig.contact.label} icon={buttonsConfig.contact.icon} variant="secondary" />
          </div>
          <div className="details__contact">
            <p><Icon name="FaPhone" /> {service.contactPhone}</p>
            <p><Icon name="FaClock" /> {service.workingHours}</p>
            <p><Icon name="FaMapMarkedAlt" /> {service.serviceArea}</p>
          </div>
        </div>
      </div>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
