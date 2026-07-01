import { createContext, useContext, useCallback, useState, useEffect, useMemo } from 'react';
import api, { getData } from '../services/api';
import { useAuth } from './AuthContext';

const ServiceContext = createContext(null);

export function ServiceProvider({ children }) {
  const [services, setServices] = useState([]);
  const { vendor } = useAuth();

  const loadServices = useCallback(async () => {
    try {
      const res = await api.get('/services');
      setServices(getData(res) || []);
    } catch {
      setServices([]);
    }
  }, []);

  useEffect(() => { loadServices(); }, [loadServices]);

  const addService = useCallback(async (data) => {
    const res = await api.post('/admin/services', { ...data, vendorId: vendor?.id, vendorName: vendor?.businessName });
    const service = getData(res);
    setServices((prev) => [...prev, service]);
    return service;
  }, [vendor]);

  const updateService = useCallback(async (id, data) => {
    await api.put(`/admin/services/${id}`, data);
    await loadServices();
  }, [loadServices]);

  const deleteService = useCallback(async (id) => {
    await api.delete(`/admin/services/${id}`);
    setServices((prev) => prev.filter((s) => s.id !== Number(id)));
  }, []);

  const getService = useCallback((id) => services.find((s) => s.id === Number(id) || s.id === id), [services]);

  const getVendorServices = useCallback(() => {
    if (!vendor) return [];
    return services.filter((s) => s.vendorId === vendor.id);
  }, [services, vendor]);

  const searchServices = useCallback((query, category, locationId) => {
    return services.filter((s) => {
      const matchesQuery = !query || s.name.toLowerCase().includes(query.toLowerCase()) || (s.description || '').toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !category || s.category === category;
      const matchesLocation = !locationId || s.locationId === locationId;
      return matchesQuery && matchesCategory && matchesLocation;
    });
  }, [services]);

  const value = useMemo(() => ({
    services, addService, updateService, deleteService, getService, getVendorServices, searchServices, loadServices,
  }), [services, addService, updateService, deleteService, getService, getVendorServices, searchServices, loadServices]);

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
}

export function useServices() {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error('useServices must be used within ServiceProvider');
  return ctx;
}
