import { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductContext';
import { useServices } from './ServiceContext';

const VendorContext = createContext(null);

export function VendorProvider({ children }) {
  const { vendor, isVendor } = useAuth();
  const { getVendorProducts } = useProducts();
  const { getVendorServices } = useServices();

  const vendorProducts = useMemo(() => (isVendor ? getVendorProducts() : []), [isVendor, getVendorProducts]);
  const vendorServices = useMemo(() => (isVendor ? getVendorServices() : []), [isVendor, getVendorServices]);

  const stats = useMemo(() => ({
    totalProducts: vendorProducts.length,
    totalServices: vendorServices.length,
    avgProductRating: vendorProducts.length
      ? Math.round((vendorProducts.reduce((a, p) => a + (p.rating || 0), 0) / vendorProducts.length) * 10) / 10
      : 0,
    avgServiceRating: vendorServices.length
      ? Math.round((vendorServices.reduce((a, s) => a + (s.rating || 0), 0) / vendorServices.length) * 10) / 10
      : 0,
  }), [vendorProducts, vendorServices]);

  return (
    <VendorContext.Provider value={{ vendor, isVendor, vendorProducts, vendorServices, stats }}>
      {children}
    </VendorContext.Provider>
  );
}

export function useVendor() {
  const ctx = useContext(VendorContext);
  if (!ctx) throw new Error('useVendor must be used within VendorProvider');
  return ctx;
}
