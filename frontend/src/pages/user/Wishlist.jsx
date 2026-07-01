import { useCmsContent } from '../../contexts';
import { useLocalStorage } from '../../hooks/useHelpers';
import EmptyState from '../../components/common/EmptyState';
import ProductCard from '../../components/cards/ProductCard';
import './Profile.css';

export default function Wishlist() {
  const cardConfig = useCmsContent('icons');
  const [wishlist] = useLocalStorage('mart_wishlist', []);

  return (
    <div className="profile">
      <h1 className="profile__title">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <EmptyState config={cardConfig.emptyState.wishlist} />
      ) : (
        <div className="profile__grid">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
