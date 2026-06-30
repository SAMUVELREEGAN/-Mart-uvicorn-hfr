import { createContext, useContext, useCallback, useMemo } from 'react';
import brandsData from '../json/brands.json';
import { useLocalStorage } from '../hooks/useHelpers';
import { generateId, parseList } from '../utils/helpers';
import { useAuth } from './AuthContext';

const BrandContext = createContext(null);

function normalizeBrand(data) {
  return {
    ...data,
    photos: Array.isArray(data.photos) ? data.photos : parseList(data.photos),
    youtubeLinks: Array.isArray(data.youtubeLinks) ? data.youtubeLinks : parseList(data.youtubeLinks),
    socialMedia: typeof data.socialMedia === 'string' ? {} : (data.socialMedia || {}),
    contact: data.contact || {},
  };
}

export function BrandProvider({ children }) {
  const [brands, setBrands] = useLocalStorage('mart_brands', brandsData.items);
  const { vendor } = useAuth();
  const pageConfig = brandsData.page;

  const getBrand = useCallback((id) => brands.find((b) => b.id === id), [brands]);

  const getCarouselBrands = useCallback(() => brands.map((b) => ({
    id: b.id,
    name: b.name,
    logo: b.logoPng || `https://placehold.co/120x120/ffffff/2563eb/png?text=${encodeURIComponent((b.name || 'B').split(' ')[0])}`,
  })), [brands]);

  const getVendorBrands = useCallback(() => {
    if (!vendor) return [];
    return brands.filter((b) => b.vendorId === vendor.id);
  }, [brands, vendor]);

  const addBrand = useCallback((data) => {
    const brand = normalizeBrand({
      id: generateId('brand'),
      ...data,
      vendorId: vendor?.id,
    });
    setBrands((prev) => [...prev, brand]);
    return brand;
  }, [vendor, setBrands]);

  const updateBrand = useCallback((id, data) => {
    setBrands((prev) => prev.map((b) => {
      if (b.id !== id) return b;
      return normalizeBrand({ ...b, ...data });
    }));
  }, [setBrands]);

  const deleteBrand = useCallback((id) => {
    setBrands((prev) => prev.filter((b) => b.id !== id));
  }, [setBrands]);

  const value = useMemo(() => ({
    brands,
    pageConfig,
    getBrand,
    getCarouselBrands,
    getVendorBrands,
    addBrand,
    updateBrand,
    deleteBrand,
  }), [brands, pageConfig, getBrand, getCarouselBrands, getVendorBrands, addBrand, updateBrand, deleteBrand]);

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export function useBrands() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error('useBrands must be used within BrandProvider');
  return ctx;
}
