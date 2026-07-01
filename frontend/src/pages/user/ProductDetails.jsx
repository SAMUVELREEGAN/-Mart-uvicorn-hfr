import { useCmsContent } from '../../contexts';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { useReviews } from '../../contexts/ReviewContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useSimulatedLoading } from '../../hooks/useHelpers';
import { formatPrice } from '../../utils/helpers';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import Rating from '../../components/common/Rating';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Carousel from '../../components/common/Carousel';
import Tabs from '../../components/common/Tabs';
import FormBuilder from '../../components/forms/FormBuilder';
import ErrorState from '../../components/common/ErrorState';
import { SkeletonDetails } from '../../components/skeleton/Skeleton';
import { Icon } from '../../utils/iconResolver';
import './Details.css';

export default function ProductDetails() {
  const formsConfig = useCmsContent('forms');
  const buttonsConfig = useCmsContent('buttons');
  const cardConfig = useCmsContent('icons');
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('description');
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const loading = useSimulatedLoading();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { getProduct } = useProducts();
  const { getReviewsForTarget, addReview } = useReviews();
  const product = getProduct(id);
  const reviews = getReviewsForTarget(id, 'product');

  if (loading) return <SkeletonDetails />;

  if (!product) {
    return <ErrorState config={cardConfig.errorState.notFound} />;
  }

  const images = [product.image, ...(product.gallery || [])].filter(Boolean).map(resolveMediaUrl);

  const handleReview = (values) => {
    addReview(id, 'product', values);
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    try {
      await addToCart(product.id, 1);
      setCartAdded(true);
      setTimeout(() => setCartAdded(false), 2000);
    } finally {
      setAddingToCart(false);
    }
  };

  const tabs = [
    {
      key: 'description',
      label: 'Description',
      content: <p className="details__text">{product.description}</p>,
    },
    {
      key: 'specifications',
      label: 'Specifications',
      content: (
        <dl className="details__specs">
          {Object.entries(product.specifications || {}).map(([key, val]) => (
            <div key={key} className="details__spec-row">
              <dt>{key}</dt>
              <dd>{val}</dd>
            </div>
          ))}
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
        <Carousel images={images} alt={product.name} />
        <div className="details__info">
          <Badge label={product.type} variant="primary" />
          <h1 className="details__title">{product.name}</h1>
          <Rating value={product.rating} reviewCount={product.reviewCount} />
          <div className="details__price">{formatPrice(product.price)}</div>
          <div className="details__meta">
            <span><Icon name="FaStore" /> {product.vendorName}</span>
            <span><Icon name="FaMapMarkerAlt" /> {product.location}</span>
          </div>
          <div className="details__actions">
            <Button label={buttonsConfig.buy.label} icon={buttonsConfig.buy.icon} variant="primary" size="lg" />
            <Button
              label={cartAdded ? 'Added!' : buttonsConfig.addToCart.label}
              icon={cartAdded ? buttonsConfig.success.icon : buttonsConfig.addToCart.icon}
              variant={cartAdded ? 'success' : buttonsConfig.addToCart.variant}
              size="lg"
              onClick={handleAddToCart}
              disabled={addingToCart}
            />
            <Button label={buttonsConfig.contact.label} icon={buttonsConfig.contact.icon} variant="secondary" />
          </div>
          <div className="details__contact">
            <p><Icon name="FaPhone" /> {product.contactPhone}</p>
            {product.contactEmail && <p><Icon name="FaEnvelope" /> {product.contactEmail}</p>}
          </div>
        </div>
      </div>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
