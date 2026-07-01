import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import adminApi from '../services/adminApi';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAdmin = useCallback(async () => {
    const token = localStorage.getItem('admin_access_token');
    if (!token) {
      setAdmin(null);
      setLoading(false);
      return null;
    }
    try {
      const { data } = await adminApi.get('/auth/me');
      if (data.data?.role !== 'admin') throw new Error('Not admin');
      setAdmin(data.data);
      return data.data;
    } catch {
      localStorage.removeItem('admin_access_token');
      setAdmin(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmin();
  }, [loadAdmin]);

  const login = useCallback(async (email, password) => {
    const { data } = await adminApi.post('/auth/admin/login', { email, password });
    localStorage.setItem('admin_access_token', data.data.accessToken);
    setAdmin(data.data.user);
    return data.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminApi.post('/auth/logout');
    } finally {
      localStorage.removeItem('admin_access_token');
      setAdmin(null);
    }
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const { data } = await adminApi.put('/auth/admin/profile', payload);
    setAdmin(data.data);
    return data.data;
  }, []);

  const value = useMemo(() => ({
    admin,
    loading,
    isAuthenticated: Boolean(admin),
    login,
    logout,
    loadAdmin,
    updateProfile,
  }), [admin, loading, login, logout, loadAdmin, updateProfile]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
