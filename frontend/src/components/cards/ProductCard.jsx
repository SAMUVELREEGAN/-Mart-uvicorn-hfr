import { Link } from 'react-router-dom';
import Rating from '../common/Rating';
import Badge from '../common/Badge';
import Card from '../common/Card';
import { Icon } from '../../utils/iconResolver';
import { truncateText, formatPrice } from '../../utils/helpers';
import cardConfig from '../../json/icons.json';
import './ProductCard.css';

export default function ProductCard({ product, onClick }) {
  const config = cardConfig.productCard;

  return (
    <Card hoverable className="product-card" onClick={onClick}>
      <Link to={`/products/${product.id}`} className="product-card__link">
        <div className="product-card__image-wrap">
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
          <div className="product-card__price">{formatPrice(product.price, config.pricePrefix)}</div>
          <Rating value={product.rating} reviewCount={product.reviewCount} size="sm" />
          <div className="product-card__meta">
            <span className="product-card__vendor">
              <Icon name="FaStore" /> {product.vendorName}
            </span>
            <span className="product-card__location">
              <Icon name="FaMapMarkerAlt" /> {product.location}
            </span>
          </div>
          <p className="product-card__desc">
            {truncateText(product.description, config.descriptionMaxLength)}
          </p>
        </div>
      </Link>
    </Card>
  );
}
