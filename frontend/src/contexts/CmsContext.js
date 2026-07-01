import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, { getData } from '../services/api';
import { setCmsValidations } from '../utils/cmsRegistry';
import { cmsFallbacks, getCmsFallback } from '../cms/fallbacks';

const CmsContext = createContext(null);

const hasContent = (data) => data && typeof data === 'object' && Object.keys(data).length > 0;

export function CmsProvider({ children }) {
  const [content, setContent] = useState(cmsFallbacks);
  const [settings, setSettings] = useState({});
  const [homeSections, setHomeSections] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [banners, setBanners] = useState([]);
  const [ready, setReady] = useState(false);

  const refreshCms = useCallback(() => {
    return api.get('/cms/site')
      .then((res) => {
        const data = getData(res) || {};
        const apiContent = data.content || {};
        const merged = { ...cmsFallbacks };
        Object.keys(apiContent).forEach((key) => {
          if (hasContent(apiContent[key])) merged[key] = apiContent[key];
        });
        setContent(merged);
        setSettings(data.settings || {});
        setHomeSections(data.homeSections || []);
        setFaqs(data.faqs || []);
        setBanners(data.banners || []);
        setCmsValidations(merged.validations || cmsFallbacks.validations);
        setReady(true);
      })
      .catch(() => {
        setContent(cmsFallbacks);
        setSettings({});
        setHomeSections([]);
        setFaqs([]);
        setBanners([]);
        setCmsValidations(cmsFallbacks.validations);
        setReady(true);
      });
  }, []);

  useEffect(() => {
    refreshCms();
    setCmsValidations(cmsFallbacks.validations);
  }, [refreshCms]);

  const getContent = useCallback((key) => {
    const data = content[key];
    return hasContent(data) ? data : getCmsFallback(key);
  }, [content]);

  const value = useMemo(() => ({
    content,
    settings,
    homeSections,
    faqs,
    banners,
    ready,
    getContent,
    refreshCms,
  }), [content, settings, homeSections, faqs, banners, ready, getContent, refreshCms]);

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error('useCms must be used within CmsProvider');
  return ctx;
}

export function useCmsContent(key) {
  const { getContent } = useCms();
  return getContent(key);
}
