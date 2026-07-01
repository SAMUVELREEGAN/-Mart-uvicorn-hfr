import { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import api, { getData } from '../services/api';
import { resolveMediaUrl } from '../utils/mediaUrl';
import { useCmsContent } from './CmsContext';
import { useAuth } from './AuthContext';

const BrandContext = createContext(null);

export function BrandProvider({ children }) {
  const [brands, setBrands] = useState([]);
  const { vendor } = useAuth();
  const brandsData = useCmsContent('brands');
  const pageConfig = brandsData.page || {};

  useEffect(() => {
    api.get('/brands').then((res) => {
      const list = (getData(res) || []).map((b) => ({
        ...b,
        logo: resolveMediaUrl(b.logo),
        coverBanner: resolveMediaUrl(b.coverBanner),
      }));
      setBrands(list);
    }).catch(() => setBrands([]));
  }, []);

  const getBrand = useCallback((id) => brands.find((b) => b.id === Number(id) || b.id === id), [brands]);

  const getCarouselBrands = useCallback(() => brands.map((b) => ({
    id: b.id,
    name: b.name,
    logo: b.logo,
  })), [brands]);

  const getVendorBrands = useCallback(() => {
    if (!vendor) return [];
    return brands.filter((b) => b.vendorId === vendor.id);
  }, [brands, vendor]);

  const addBrand = useCallback(async (data) => {
    const res = await api.post('/admin/brands', { ...data, vendorId: vendor?.id });
    const brand = getData(res);
    setBrands((prev) => [...prev, brand]);
    return brand;
  }, [vendor]);

  const updateBrand = useCallback(async (id, data) => {
    await api.put(`/admin/brands/${id}`, data);
    setBrands((prev) => prev.map((b) => (b.id === Number(id) ? { ...b, ...data } : b)));
  }, []);

  const deleteBrand = useCallback(async (id) => {
    await api.delete(`/admin/brands/${id}`);
    setBrands((prev) => prev.filter((b) => b.id !== Number(id)));
  }, []);

  const value = useMemo(() => ({
    brands, pageConfig, getBrand, getCarouselBrands, getVendorBrands, addBrand, updateBrand, deleteBrand,
  }), [brands, pageConfig, getBrand, getCarouselBrands, getVendorBrands, addBrand, updateBrand, deleteBrand]);

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export function useBrands() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error('useBrands must be used within BrandProvider');
  return ctx;
}
