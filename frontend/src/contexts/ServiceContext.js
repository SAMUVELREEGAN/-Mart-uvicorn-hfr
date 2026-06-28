import { createContext, useContext, useCallback, useMemo } from 'react';
import servicesData from '../json/services.json';
import { useLocalStorage } from '../hooks/useHelpers';
import { generateId, parseList } from '../utils/helpers';
import { useAuth } from './AuthContext';

const ServiceContext = createContext(null);

export function ServiceProvider({ children }) {
  const [services, setServices] = useLocalStorage('mart_services', servicesData.items);
  const { vendor } = useAuth();

  const addService = useCallback((data) => {
    const service = {
      id: generateId('svc'),
      ...data,
      gallery: parseList(data.gallery),
      youtubeLinks: parseList(data.youtubeLinks),
      vendorId: vendor?.id,
      vendorName: vendor?.businessName || vendor?.ownerName,
      city: vendor?.address || data.city,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    setServices((prev) => [...prev, service]);
    return service;
  }, [vendor, setServices]);

  const updateService = useCallback((id, data) => {
    setServices((prev) => prev.map((s) => {
      if (s.id !== id) return s;
      return {
        ...s,
        ...data,
        gallery: data.gallery ? parseList(data.gallery) : s.gallery,
        youtubeLinks: data.youtubeLinks ? parseList(data.youtubeLinks) : s.youtubeLinks,
      };
    }));
  }, [setServices]);

  const deleteService = useCallback((id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }, [setServices]);

  const getService = useCallback((id) => services.find((s) => s.id === id), [services]);

  const getVendorServices = useCallback(() => {
    if (!vendor) return [];
    return services.filter((s) => s.vendorId === vendor.id);
  }, [services, vendor]);

  const searchServices = useCallback((query, category, locationId) => {
    return services.filter((s) => {
      const matchesQuery = !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !category || s.category === category;
      const matchesLocation = !locationId || s.locationId === locationId;
      return matchesQuery && matchesCategory && matchesLocation;
    });
  }, [services]);

  const value = useMemo(() => ({
    services, addService, updateService, deleteService, getService, getVendorServices, searchServices,
  }), [services, addService, updateService, deleteService, getService, getVendorServices, searchServices]);

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
}

export function useServices() {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error('useServices must be used within ServiceProvider');
  return ctx;
}
