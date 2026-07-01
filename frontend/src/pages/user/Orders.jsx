import { useCmsContent } from '../../contexts';
import { useLocalStorage } from '../../hooks/useHelpers';
import EmptyState from '../../components/common/EmptyState';
import Card from '../../components/common/Card';
import { formatPrice } from '../../utils/helpers';
import './Profile.css';

export default function Orders() {
  const cardConfig = useCmsContent('icons');
  const [orders] = useLocalStorage('mart_orders', []);

  return (
    <div className="profile">
      <h1 className="profile__title">My Orders</h1>
      {orders.length === 0 ? (
        <EmptyState config={cardConfig.emptyState.orders} />
      ) : (
        <div className="profile__orders">
          {orders.map((order) => (
            <Card key={order.id} className="profile__order">
              <div className="profile__order-header">
                <span>Order #{order.id}</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              <p>{order.items?.length || 0} items</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
