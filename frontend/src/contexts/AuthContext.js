import { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useHelpers';
import { generateId } from '../utils/helpers';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('mart_user', null);
  const [vendor, setVendor] = useLocalStorage('mart_vendor', null);
  const [pendingBusinessType, setPendingBusinessType] = useLocalStorage('mart_business_type', null);

  const businessType = vendor?.businessType || pendingBusinessType || 'both';

  const setBusinessType = useCallback((type) => {
    setPendingBusinessType(type);
    if (vendor) {
      setVendor({ ...vendor, businessType: type });
    }
  }, [vendor, setVendor, setPendingBusinessType]);

  const loginUser = useCallback((email, password) => {
    const newUser = { id: generateId('user'), email, role: 'user', name: email.split('@')[0] };
    setUser(newUser);
    return newUser;
  }, [setUser]);

  const signupUser = useCallback((data) => {
    const newUser = { id: generateId('user'), ...data, role: 'user' };
    setUser(newUser);
    return newUser;
  }, [setUser]);

  const loginVendor = useCallback((email, password) => {
    const existing = vendor?.email === email ? vendor : null;
    const newVendor = existing || {
      id: generateId('vendor'),
      email,
      role: 'vendor',
      businessName: email.split('@')[0],
      businessType: pendingBusinessType || 'both',
    };
    setVendor(newVendor);
    return newVendor;
  }, [vendor, setVendor, pendingBusinessType]);

  const registerVendor = useCallback((data) => {
    const newVendor = {
      id: generateId('vendor'),
      ...data,
      role: 'vendor',
      businessType: pendingBusinessType || 'both',
    };
    setVendor(newVendor);
    return newVendor;
  }, [setVendor, pendingBusinessType]);

  const logout = useCallback(() => {
    setUser(null);
    setVendor(null);
  }, [setUser, setVendor]);

  const isAuthenticated = !!(user || vendor);
  const currentUser = user || vendor;
  const isVendor = !!vendor;

  return (
    <AuthContext.Provider value={{
      user, vendor, currentUser, isAuthenticated, isVendor,
      businessType, setBusinessType, pendingBusinessType,
      loginUser, signupUser, loginVendor, registerVendor, logout,
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
