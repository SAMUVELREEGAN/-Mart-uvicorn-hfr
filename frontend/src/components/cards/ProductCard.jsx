import { Link } from 'react-router-dom';
import Rating from '../common/Rating';
import Badge from '../common/Badge';
import Card from '../common/Card';
import cardConfig from '../../json/icons.json';
import { formatPrice } from '../../utils/helpers';
import './ProductCard.css';

export default function ProductCard({ product, onClick }) {
  const config = cardConfig.productCard;
  const hasPrice = product.price != null && product.price !== '' && !Number.isNaN(Number(product.price));
  const hasRating = product.rating != null && product.rating > 0;

  return (
    <Card hoverable className="product-card" onClick={onClick}>
      <Link to={`/products/${product.id}`} className="product-card__link">
        <div
          className="product-card__image-wrap"
          style={{ aspectRatio: config.imageAspectRatio || '4 / 3' }}
        >
          <img src={product.image} alt={product.name} className="product-card__image" loading="lazy" />
          {product.availability && (
            <Badge
              label={product.availability.replace('_', ' ')}
              variant={product.availability === 'in_stock' ? 'success' : product.availability === 'limited' ? 'warning' : 'danger'}
            />
          )}
        </div>
        <div className="product-card__details">
          <h3 className="product-card__name">{product.name}</h3>
          {hasPrice && (
            <div className="product-card__price">{formatPrice(product.price, config.pricePrefix)}</div>
          )}
          {hasRating && (
            <Rating value={product.rating} reviewCount={product.reviewCount} size="sm" />
          )}
        </div>
      </Link>
    </Card>
  );
}
