import { createContext, useContext, useMemo } from 'react';
import categoriesData from '../json/categories.json';

const CategoryContext = createContext(null);

export function CategoryProvider({ children }) {
  const highlightCategories = categoriesData.highlightCategories;
  const productCategories = categoriesData.productCategories;
  const serviceCategories = categoriesData.serviceCategories;
  const categoryPage = categoriesData.categoryPage;
  const subcategoriesMap = categoriesData.subcategories;
  const highlightCategoryMap = categoriesData.highlightCategoryMap || {};
  const moreLabel = categoriesData.moreLabel;
  const moreIcon = categoriesData.moreIcon;
  const moreColor = categoriesData.moreColor;

  const getCategoryById = (id) => {
    return [...highlightCategories, ...productCategories, ...serviceCategories].find((c) => c.id === id);
  };

  const getRelatedCategories = (catId, type = 'product') => {
    const list = type === 'service' ? serviceCategories : productCategories;
    return list.filter((c) => c.id !== catId);
  };

  const getSubcategories = (catId) => subcategoriesMap[catId] || [];

  const getHighlightMapping = (id) => highlightCategoryMap[id] || null;

  const resolveCategoryView = (id, typeParam = 'product') => {
    const mapping = getHighlightMapping(id);
    const inProduct = productCategories.some((c) => c.id === id);
    const inService = serviceCategories.some((c) => c.id === id);

    if (mapping) {
      const itemType = mapping.itemType || typeParam;
      let categoryIds = mapping.categoryIds || [];

      if (mapping.useAllProductCategories) {
        categoryIds = productCategories.map((c) => c.id);
      } else if (mapping.useAllServiceCategories) {
        categoryIds = serviceCategories.map((c) => c.id);
      }

      return {
        itemType,
        categoryIds,
        isAggregate: categoryIds.length > 1,
        isHighlight: true,
      };
    }

    if (inProduct) {
      return { itemType: 'product', categoryIds: [id], isAggregate: false, isHighlight: false };
    }

    if (inService) {
      return { itemType: 'service', categoryIds: [id], isAggregate: false, isHighlight: false };
    }

    return { itemType: typeParam, categoryIds: [id], isAggregate: false, isHighlight: true };
  };

  const getCategoriesByIds = (ids, itemType = 'product') => {
    const list = itemType === 'service' ? serviceCategories : productCategories;
    return ids.map((cid) => list.find((c) => c.id === cid)).filter(Boolean);
  };

  const value = useMemo(() => ({
    highlightCategories,
    productCategories,
    serviceCategories,
    categoryPage,
    subcategoriesMap,
    highlightCategoryMap,
    moreLabel,
    moreIcon,
    moreColor,
    getCategoryById,
    getRelatedCategories,
    getSubcategories,
    getHighlightMapping,
    resolveCategoryView,
    getCategoriesByIds,
    allProductCategories: productCategories,
    allServiceCategories: serviceCategories,
  }), [highlightCategories, productCategories, serviceCategories, categoryPage, subcategoriesMap, highlightCategoryMap, moreLabel, moreIcon, moreColor]);

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
}

export function useCategories() {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error('useCategories must be used within CategoryProvider');
  return ctx;
}
