import { createContext, useContext, useCallback, useMemo } from 'react';
import productsData from '../json/products.json';
import { useLocalStorage } from '../hooks/useHelpers';
import { generateId, parseList, parseSpecifications } from '../utils/helpers';
import { useAuth } from './AuthContext';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useLocalStorage('mart_products', productsData.items);
  const { vendor } = useAuth();

  const addProduct = useCallback((data) => {
    const product = {
      id: generateId('prod'),
      ...data,
      price: Number(data.price),
      gallery: parseList(data.gallery),
      youtubeLinks: parseList(data.youtubeLinks),
      specifications: typeof data.specifications === 'string' ? parseSpecifications(data.specifications) : data.specifications,
      vendorId: vendor?.id,
      vendorName: vendor?.businessName || vendor?.ownerName,
      location: vendor?.address || data.location,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [...prev, product]);
    return product;
  }, [vendor, setProducts]);

  const updateProduct = useCallback((id, data) => {
    setProducts((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        ...data,
        price: data.price !== undefined ? Number(data.price) : p.price,
        gallery: data.gallery ? parseList(data.gallery) : p.gallery,
        youtubeLinks: data.youtubeLinks ? parseList(data.youtubeLinks) : p.youtubeLinks,
        specifications: data.specifications ? (typeof data.specifications === 'string' ? parseSpecifications(data.specifications) : data.specifications) : p.specifications,
      };
    }));
  }, [setProducts]);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, [setProducts]);

  const getProduct = useCallback((id) => products.find((p) => p.id === id), [products]);

  const getVendorProducts = useCallback(() => {
    if (!vendor) return [];
    return products.filter((p) => p.vendorId === vendor.id);
  }, [products, vendor]);

  const searchProducts = useCallback((query, category, locationId) => {
    return products.filter((p) => {
      const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !category || p.category === category;
      const matchesLocation = !locationId || p.locationId === locationId;
      return matchesQuery && matchesCategory && matchesLocation;
    });
  }, [products]);

  const value = useMemo(() => ({
    products, addProduct, updateProduct, deleteProduct, getProduct, getVendorProducts, searchProducts,
  }), [products, addProduct, updateProduct, deleteProduct, getProduct, getVendorProducts, searchProducts]);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}
