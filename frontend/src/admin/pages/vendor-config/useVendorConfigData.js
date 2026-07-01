import { useCallback, useEffect, useState } from 'react';
import adminApi from '../../../services/adminApi';
import { parseUiFromApi } from './constants';

export function useVendorConfigData() {
  const [steps, setSteps] = useState([]);
  const [sections, setSections] = useState([]);
  const [fields, setFields] = useState([]);
  const [terms, setTerms] = useState([]);
  const [plans, setPlans] = useState([]);
  const [uiMessages, setUiMessages] = useState(parseUiFromApi({}));
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [stepsRes, sectionsRes, fieldsRes, termsRes, plansRes, uiRes] = await Promise.all([
        adminApi.get('/admin/vendor-reg-steps', { params: { limit: 100, sort: 'sortOrder' } }),
        adminApi.get('/admin/vendor-form-sections', { params: { limit: 100, sort: 'sortOrder' } }),
        adminApi.get('/admin/vendor-form-fields', { params: { limit: 300, sort: 'sortOrder' } }),
        adminApi.get('/admin/vendor-terms', { params: { limit: 20, sort: 'sortOrder' } }),
        adminApi.get('/admin/vendor-pricing-plans', { params: { limit: 20, sort: 'sortOrder' } }),
        adminApi.get('/admin/vendor-config/ui'),
      ]);
      setSteps((stepsRes.data.data || []).sort((a, b) => a.sortOrder - b.sortOrder));
      setSections((sectionsRes.data.data || []).sort((a, b) => a.sortOrder - b.sortOrder));
      setFields((fieldsRes.data.data || []).sort((a, b) => a.sortOrder - b.sortOrder));
      setTerms((termsRes.data.data || []).sort((a, b) => a.sortOrder - b.sortOrder));
      setPlans((plansRes.data.data || []).sort((a, b) => a.sortOrder - b.sortOrder));
      const uiValue = uiRes.data.data?.value;
      setUiMessages(parseUiFromApi(uiValue || {}));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return {
    steps,
    sections,
    fields,
    terms,
    plans,
    uiMessages,
    setUiMessages,
    loading,
    refresh,
  };
}
