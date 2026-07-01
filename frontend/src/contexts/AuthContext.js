import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import api, { getData } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [pendingBusinessType, setPendingBusinessType] = useState(
    () => localStorage.getItem('mart_business_type') || null
  );
  const [loading, setLoading] = useState(true);

  const businessType = vendor?.businessType || pendingBusinessType || 'both';

  const setBusinessType = useCallback((type) => {
    setPendingBusinessType(type);
    localStorage.setItem('mart_business_type', type);
    if (vendor) setVendor({ ...vendor, businessType: type });
  }, [vendor]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/auth/me')
      .then((res) => {
        const data = getData(res);
        if (data?.role === 'vendor') {
          setVendor(data);
        } else {
          setUser(data);
          if (data?.linkedVendor) setVendor(data.linkedVendor);
        }
      })
      .catch(() => localStorage.removeItem('access_token'))
      .finally(() => setLoading(false));
  }, []);

  const loginUser = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const data = getData(res);
    localStorage.setItem('access_token', data.accessToken);
    setUser(data.user);
    setVendor(null);
    return data.user;
  }, []);

  const signupUser = useCallback(async (formData) => {
    const res = await api.post('/auth/register', formData);
    const data = getData(res);
    localStorage.setItem('access_token', data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const loginVendor = useCallback(async (email, password) => {
    const res = await api.post('/auth/vendor/login', { email, password });
    const data = getData(res);
    localStorage.setItem('access_token', data.accessToken);
    setVendor(data.user);
    setUser(null);
    return data.user;
  }, []);

  const registerVendor = useCallback(async (formData) => {
    const res = await api.post('/auth/vendor/register', {
      ...formData,
      businessType: pendingBusinessType || 'both',
    });
    const data = getData(res);
    localStorage.setItem('access_token', data.accessToken);
    setVendor(data.user);
    return data.user;
  }, [pendingBusinessType]);

  const enableVendorFromUser = useCallback(async () => {
    const res = await api.post('/auth/vendor/enable', {
      businessType: pendingBusinessType || 'both',
    });
    const data = getData(res);
    setVendor(data);
    return data;
  }, [pendingBusinessType]);

  const refreshVendor = useCallback(async () => {
    const res = await api.get('/vendor/registration');
    const data = getData(res);
    if (data) setVendor(data);
    return data;
  }, []);

  const setVendorState = useCallback((next) => {
    setVendor(next);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('access_token');
      setUser(null);
      setVendor(null);
    }
  }, []);

  const isAuthenticated = !!(user || vendor);
  const currentUser = user || vendor;
  const isVendor = !!vendor;

  return (
    <AuthContext.Provider value={{
      user, vendor, currentUser, isAuthenticated, isVendor, loading,
      businessType, setBusinessType, pendingBusinessType,
      loginUser, signupUser, loginVendor, registerVendor, enableVendorFromUser,
      refreshVendor, setVendor: setVendorState, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
