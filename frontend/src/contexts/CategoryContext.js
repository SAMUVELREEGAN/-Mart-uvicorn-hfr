import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import api, { getData } from '../services/api';
import { resolveMediaUrl } from '../utils/mediaUrl';
import { useCmsContent } from './CmsContext';

const CategoryContext = createContext(null);

const mapCategory = (c) => ({
  ...c,
  id: c.slug || c.id,
  name: c.name || c.title,
  image: resolveMediaUrl(c.image),
  icon: c.icon ? (c.icon.startsWith('/') || c.icon.startsWith('http') ? resolveMediaUrl(c.icon) : c.icon) : '',
  bannerImage: resolveMediaUrl(c.bannerImage),
});

export function CategoryProvider({ children }) {
  const [tree, setTree] = useState(null);
  const categoriesData = useCmsContent('categories');

  const refreshCategories = useCallback(() => {
    return api.get('/categories/tree')
      .then((res) => setTree(getData(res)))
      .catch(() => setTree(null));
  }, []);

  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  const productCategories = useMemo(
    () => (tree?.productCategories || categoriesData.productCategories || []).map(mapCategory),
    [tree, categoriesData]
  );
  const serviceCategories = useMemo(
    () => (tree?.serviceCategories || categoriesData.serviceCategories || []).map(mapCategory),
    [tree, categoriesData]
  );
  const highlightCategories = useMemo(
    () => (tree?.highlightCategories || categoriesData.highlightCategories || []).map(mapCategory),
    [tree, categoriesData]
  );
  const subcategoriesMap = tree?.subcategoriesMap || categoriesData.subcategories || {};
  const categoryPage = categoriesData.categoryPage || {};
  const highlightCategoryMap = tree?.highlightCategoryMap || categoriesData.highlightCategoryMap || {};
  const moreLabel = categoriesData.moreLabel || '';
  const moreIcon = categoriesData.moreIcon || '';
  const moreColor = categoriesData.moreColor || '#2563eb';

  const getCategoryById = (id) => {
    return [...highlightCategories, ...productCategories, ...serviceCategories].find((c) => c.id === id || c.slug === id);
  };

  const getRelatedCategories = (catId, type = 'product') => {
    const list = type === 'service' ? serviceCategories : productCategories;
    return list.filter((c) => c.id !== catId);
  };

  const getSubcategories = (catId) => {
    const subs = subcategoriesMap[catId] || [];
    return subs.map((s) => ({
      ...s,
      icon: s.icon ? (s.icon.startsWith('/') || s.icon.startsWith('http') ? resolveMediaUrl(s.icon) : s.icon) : '',
      id: s.slug || s.id,
    }));
  };

  const getHighlightMapping = (id) => highlightCategoryMap[id] || null;

  const resolveCategoryView = (id, typeParam = 'product') => {
    const mapping = getHighlightMapping(id);
    const inProduct = productCategories.some((c) => c.id === id);
    const inService = serviceCategories.some((c) => c.id === id);

    if (mapping) {
      const itemType = mapping.itemType || typeParam;
      let categoryIds = mapping.categoryIds || [];
      const subcategoryIds = mapping.subcategoryIds || [];
      if (mapping.useAllProductCategories) categoryIds = productCategories.map((c) => c.id);
      else if (mapping.useAllServiceCategories) categoryIds = serviceCategories.map((c) => c.id);
      return {
        itemType,
        categoryIds,
        subcategoryIds,
        isAggregate: categoryIds.length > 1,
        isHighlight: true,
      };
    }
    if (inProduct) return { itemType: 'product', categoryIds: [id], subcategoryIds: [], isAggregate: false, isHighlight: false };
    if (inService) return { itemType: 'service', categoryIds: [id], subcategoryIds: [], isAggregate: false, isHighlight: false };
    return { itemType: typeParam, categoryIds: [id], subcategoryIds: [], isAggregate: false, isHighlight: true };
  };

  const getCategoriesByIds = (ids, itemType = 'product') => {
    if (itemType === 'both') {
      return ids.map((cid) => productCategories.find((c) => c.id === cid) || serviceCategories.find((c) => c.id === cid)).filter(Boolean);
    }
    const list = itemType === 'service' ? serviceCategories : productCategories;
    return ids.map((cid) => list.find((c) => c.id === cid)).filter(Boolean);
  };

  const value = useMemo(() => ({
    highlightCategories, productCategories, serviceCategories, categoryPage,
    subcategoriesMap, highlightCategoryMap, moreLabel, moreIcon, moreColor,
    getCategoryById, getRelatedCategories, getSubcategories, getHighlightMapping,
    resolveCategoryView, getCategoriesByIds, refreshCategories,
    allProductCategories: productCategories,
    allServiceCategories: serviceCategories,
  }), [highlightCategories, productCategories, serviceCategories, categoryPage, subcategoriesMap, highlightCategoryMap, moreLabel, moreIcon, moreColor, refreshCategories]);

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
}

export function useCategories() {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error('useCategories must be used within CategoryProvider');
  return ctx;
}
