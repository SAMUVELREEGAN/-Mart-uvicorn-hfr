import { useCmsContent } from '../../contexts';
import { useVendor } from '../../contexts/VendorContext';
import { useReviews } from '../../contexts/ReviewContext';
import Rating from '../../components/common/Rating';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import './VendorPages.css';

export default function VendorReviews() {
  const cardConfig = useCmsContent('icons');
  const { vendor } = useVendor();
  const { getVendorReviews } = useReviews();
  const reviews = getVendorReviews(vendor?.id);

  return (
    <div className="vendor-page">
      <h1 className="vendor-page__title">Customer Reviews</h1>
      <p className="vendor-page__subtitle">{reviews.length} total reviews</p>

      {reviews.length === 0 ? (
        <EmptyState config={cardConfig.emptyState.reviews} />
      ) : (
        <div className="vendor-page__reviews">
          {reviews.map((review) => (
            <Card key={review.id} className="vendor-page__review">
              <div className="vendor-page__review-header">
                <strong>{review.userName}</strong>
                <Rating value={review.rating} showValue={false} size="sm" />
              </div>
              <p className="vendor-page__review-type">{review.targetType}</p>
              <p>{review.comment}</p>
              <span className="vendor-page__review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
