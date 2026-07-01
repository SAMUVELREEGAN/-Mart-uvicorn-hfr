import { createContext, useContext, useCallback, useState, useEffect, useMemo } from 'react';
import api, { getData } from '../services/api';
import { useAuth } from './AuthContext';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const { vendor } = useAuth();

  const loadProducts = useCallback(async () => {
    try {
      const res = await api.get('/products');
      setProducts(getData(res) || []);
    } catch {
      setProducts([]);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const addProduct = useCallback(async (data) => {
    const res = await api.post('/admin/products', { ...data, vendorId: vendor?.id, vendorName: vendor?.businessName });
    const product = getData(res);
    setProducts((prev) => [...prev, product]);
    return product;
  }, [vendor]);

  const updateProduct = useCallback(async (id, data) => {
    await api.put(`/admin/products/${id}`, data);
    setProducts((prev) => prev.map((p) => (p.id === Number(id) ? { ...p, ...data, id: p.id } : p)));
    await loadProducts();
  }, [loadProducts]);

  const deleteProduct = useCallback(async (id) => {
    await api.delete(`/admin/products/${id}`);
    setProducts((prev) => prev.filter((p) => p.id !== Number(id)));
  }, []);

  const getProduct = useCallback((id) => products.find((p) => p.id === Number(id) || p.id === id), [products]);

  const getVendorProducts = useCallback(() => {
    if (!vendor) return [];
    return products.filter((p) => p.vendorId === vendor.id);
  }, [products, vendor]);

  const searchProducts = useCallback((query, category, locationId) => {
    return products.filter((p) => {
      const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || (p.description || '').toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !category || p.category === category;
      const matchesLocation = !locationId || p.locationId === locationId;
      return matchesQuery && matchesCategory && matchesLocation;
    });
  }, [products]);

  const value = useMemo(() => ({
    products, addProduct, updateProduct, deleteProduct, getProduct, getVendorProducts, searchProducts, loadProducts,
  }), [products, addProduct, updateProduct, deleteProduct, getProduct, getVendorProducts, searchProducts, loadProducts]);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}
