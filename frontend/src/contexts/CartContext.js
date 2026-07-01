import { createContext, useContext, useCallback, useState, useEffect, useMemo } from 'react';
import api, { getData } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const EMPTY_CART = { items: [], subtotal: 0, itemCount: 0 };

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(EMPTY_CART);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(EMPTY_CART);
      return EMPTY_CART;
    }
    setLoading(true);
    try {
      const res = await api.get('/cart');
      const data = getData(res) || EMPTY_CART;
      setCart(data);
      return data;
    } catch {
      setCart(EMPTY_CART);
      return EMPTY_CART;
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    const res = await api.post('/cart/items', { productId, quantity });
    const data = getData(res) || EMPTY_CART;
    setCart(data);
    return data;
  }, []);

  const updateQuantity = useCallback(async (productId, quantity) => {
    const res = await api.patch(`/cart/items/${productId}`, { quantity });
    const data = getData(res) || EMPTY_CART;
    setCart(data);
    return data;
  }, []);

  const removeItem = useCallback(async (productId) => {
    const res = await api.delete(`/cart/items/${productId}`);
    const data = getData(res) || EMPTY_CART;
    setCart(data);
    return data;
  }, []);

  const clearCart = useCallback(async () => {
    const res = await api.delete('/cart');
    const data = getData(res) || EMPTY_CART;
    setCart(data);
    return data;
  }, []);

  const value = useMemo(() => ({
    cart,
    items: cart.items || [],
    itemCount: cart.itemCount || 0,
    subtotal: cart.subtotal || 0,
    loading,
    refreshCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  }), [cart, loading, refreshCart, addToCart, updateQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
