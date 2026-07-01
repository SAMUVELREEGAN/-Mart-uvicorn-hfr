import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import api, { getData } from '../services/api';
import vendorRegistrationFallback from '../json/vendorRegistration.json';

const VendorConfigContext = createContext(null);

export function VendorConfigProvider({ children }) {
  const [config, setConfig] = useState({
    ui: vendorRegistrationFallback.ui,
    steps: vendorRegistrationFallback.steps,
    sections: vendorRegistrationFallback.sections,
    fields: vendorRegistrationFallback.fields,
    terms: vendorRegistrationFallback.terms,
    plans: vendorRegistrationFallback.plans,
  });
  const [loading, setLoading] = useState(true);

  const refreshConfig = useCallback(async () => {
    try {
      const res = await api.get('/vendor-config');
      const data = getData(res);
      if (data) {
        setConfig({
          ui: data.ui || vendorRegistrationFallback.ui,
          steps: data.steps?.length ? data.steps : vendorRegistrationFallback.steps,
          sections: data.sections?.length ? data.sections : vendorRegistrationFallback.sections,
          fields: data.fields?.length ? data.fields : vendorRegistrationFallback.fields,
          terms: data.terms?.length ? data.terms : vendorRegistrationFallback.terms,
          plans: data.plans?.length ? data.plans : vendorRegistrationFallback.plans,
        });
      }
    } catch {
      /* use fallback */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshConfig();
  }, [refreshConfig]);

  return (
    <VendorConfigContext.Provider value={{ config, loading, refreshConfig }}>
      {children}
    </VendorConfigContext.Provider>
  );
}

export function useVendorConfig() {
  const ctx = useContext(VendorConfigContext);
  if (!ctx) throw new Error('useVendorConfig must be used within VendorConfigProvider');
  return ctx;
}
