import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCmsContent } from '../../contexts';
import { useCart } from '../../contexts/CartContext';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { SkeletonDetails } from '../../components/skeleton/Skeleton';
import { formatPrice } from '../../utils/helpers';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import { Icon } from '../../utils/iconResolver';
import './Cart.css';

export default function Cart() {
  const catalogConfig = useCmsContent('catalog');
  const cardConfig = useCmsContent('icons');
  const buttonsConfig = useCmsContent('buttons');
  const cartConfig = catalogConfig.cart;
  const navigate = useNavigate();
  const { items, subtotal, loading, updateQuantity, removeItem } = useCart();
  const [updatingId, setUpdatingId] = useState(null);

  const handleQuantity = async (productId, nextQty) => {
    if (nextQty < 1) return;
    setUpdatingId(productId);
    try {
      await updateQuantity(productId, nextQty);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (productId) => {
    setUpdatingId(productId);
    try {
      await removeItem(productId);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && items.length === 0) {
    return <SkeletonDetails />;
  }

  return (
    <div className="profile cart">
      <h1 className="cart__title">{cartConfig.title}</h1>

      {items.length === 0 ? (
        <EmptyState config={cardConfig.emptyState.cart} />
      ) : (
        <>
          <div className={`cart__table-wrap ${updatingId ? 'cart__updating' : ''}`}>
            <table className="cart__table">
              <thead>
                <tr>
                  <th>{cartConfig.columns.product}</th>
                  <th>{cartConfig.columns.price}</th>
                  <th>{cartConfig.columns.quantity}</th>
                  <th>{cartConfig.columns.total}</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const { product, productId, quantity, lineTotal } = item;
                  const busy = updatingId === productId;
                  return (
                    <tr key={productId}>
                      <td>
                        <div className="cart__product">
                          <img
                            src={resolveMediaUrl(product.image)}
                            alt={product.name}
                            className="cart__image"
                          />
                          <Link to={`/products/${productId}`} className="cart__product-name">
                            {product.name}
                          </Link>
                        </div>
                      </td>
                      <td className="cart__price">{formatPrice(product.price)}</td>
                      <td>
                        <div className="cart__qty">
                          <button
                            type="button"
                            className="cart__qty-btn"
                            onClick={() => handleQuantity(productId, quantity - 1)}
                            disabled={busy || quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Icon name="FaMinus" />
                          </button>
                          <span className="cart__qty-value">{quantity}</span>
                          <button
                            type="button"
                            className="cart__qty-btn"
                            onClick={() => handleQuantity(productId, quantity + 1)}
                            disabled={busy}
                            aria-label="Increase quantity"
                          >
                            <Icon name="FaPlus" />
                          </button>
                        </div>
                      </td>
                      <td className="cart__line-total">{formatPrice(lineTotal)}</td>
                      <td>
                        <button
                          type="button"
                          className="cart__remove-btn"
                          onClick={() => handleRemove(productId)}
                          disabled={busy}
                          title={cartConfig.removeLabel}
                          aria-label={cartConfig.removeLabel}
                        >
                          <Icon name={buttonsConfig.delete.icon} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="cart__footer">
            <div className="cart__summary">
              <span className="cart__summary-label">{cartConfig.subtotalLabel}</span>
              <span className="cart__summary-total">{formatPrice(subtotal)}</span>
            </div>
            <div className="cart__actions">
              <Button
                label={cartConfig.continueShopping.label}
                icon={cartConfig.continueShopping.icon}
                variant="outline"
                onClick={() => navigate(cartConfig.continueShopping.path)}
              />
              <Button
                label={cartConfig.checkout.label}
                icon={cartConfig.checkout.icon}
                variant="primary"
                onClick={() => navigate(cartConfig.checkout.path)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
