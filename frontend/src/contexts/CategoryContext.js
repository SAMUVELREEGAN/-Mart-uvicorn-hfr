import { createContext, useContext, useMemo } from 'react';
import categoriesData from '../json/categories.json';

const CategoryContext = createContext(null);

export function CategoryProvider({ children }) {
  const highlightCategories = categoriesData.highlightCategories;
  const productCategories = categoriesData.productCategories;
  const serviceCategories = categoriesData.serviceCategories;
  const categoryPage = categoriesData.categoryPage;
  const subcategoriesMap = categoriesData.subcategories;
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

  const value = useMemo(() => ({
    highlightCategories,
    productCategories,
    serviceCategories,
    categoryPage,
    subcategoriesMap,
    moreLabel,
    moreIcon,
    moreColor,
    getCategoryById,
    getRelatedCategories,
    getSubcategories,
    allProductCategories: productCategories,
    allServiceCategories: serviceCategories,
  }), [highlightCategories, productCategories, serviceCategories, categoryPage, subcategoriesMap, moreLabel, moreIcon, moreColor]);

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
}

export function useCategories() {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error('useCategories must be used within CategoryProvider');
  return ctx;
}
