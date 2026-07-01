import { useCmsContent } from '../contexts';
import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCategories } from '../contexts/CategoryContext';
import { useProducts } from '../contexts/ProductContext';
import { useServices } from '../contexts/ServiceContext';
import { useSimulatedLoading } from './useHelpers';

export function useCategoryPageData() {
  const cardConfig = useCmsContent('icons');
  const categoriesData = useCmsContent('categories');
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type') || 'product';
  const [activeChildCategory, setActiveChildCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const loading = useSimulatedLoading();
  const {
    getCategoryById,
    getSubcategories,
    resolveCategoryView,
    getCategoriesByIds,
    getHighlightDetailsTemplate,
    categoryPage,
    productCategories,
  } = useCategories();
  const { products } = useProducts();
  const { services } = useServices();

  const iconsConfig = categoriesData.categoryIcons || {};
  const categoryGapStyle = {
    '--category-grid-gap': iconsConfig.gridGap || '1.5rem',
    '--category-grid-gap-mobile': iconsConfig.mobileGridGap || '1.25rem',
  };

  const category = getCategoryById(id);
  const view = resolveCategoryView(id, typeParam);
  const isBoth = view.itemType === 'both';
  const isService = !isBoth && view.itemType === 'service';
  const detailsTemplate = getHighlightDetailsTemplate(id);

  const getCategoryType = (catId) => (
    productCategories.some((c) => c.id === catId) ? 'product' : 'service'
  );

  const listCategoryType = isBoth ? 'product' : view.itemType;

  const childCategories = getCategoriesByIds(view.categoryIds, isBoth ? 'both' : view.itemType);
  const showChildCategories = view.isAggregate && childCategories.length > 0;

  const effectiveCategoryId = activeChildCategory
    || (view.categoryIds.length === 1 ? view.categoryIds[0] : null);

  let subcategories = effectiveCategoryId ? getSubcategories(effectiveCategoryId) : [];
  if (view.subcategoryIds?.length) {
    subcategories = subcategories.filter((s) => view.subcategoryIds.includes(s.slug || s.id));
  }

  const subcategoryType = effectiveCategoryId
    ? getCategoryType(effectiveCategoryId)
    : listCategoryType;

  const categoryName = category?.name || category?.title || id;
  const description = category?.description
    || (isService ? categoryPage.defaultServiceDescription : categoryPage.defaultProductDescription);
  const bannerImage = category?.bannerImage || category?.image || categoryPage.defaultBanner;

  const allItems = useMemo(() => {
    const filterIds = activeChildCategory ? [activeChildCategory] : view.categoryIds;
    const matchItem = (item) => filterIds.includes(item.category)
      && (!view.subcategoryIds?.length || !item.subcategory || view.subcategoryIds.includes(item.subcategory));

    if (isBoth) {
      return [
        ...products.filter(matchItem),
        ...services.filter(matchItem),
      ];
    }
    const pool = isService ? services : products;
    return pool.filter(matchItem);
  }, [isBoth, isService, activeChildCategory, view.categoryIds, view.subcategoryIds, products, services]);

  const items = useMemo(() => {
    if (!activeSubcategory) return allItems;
    return allItems.filter((item) => item.subcategory === activeSubcategory);
  }, [allItems, activeSubcategory]);

  const productItems = useMemo(
    () => items.filter((item) => products.some((p) => p.id === item.id)),
    [items, products],
  );

  const serviceItems = useMemo(
    () => items.filter((item) => services.some((s) => s.id === item.id)),
    [items, services],
  );

  const handleChildCategory = (childId) => {
    setActiveChildCategory(childId);
    setActiveSubcategory(null);
  };

  const handleShowAllChildren = () => {
    setActiveChildCategory(null);
    setActiveSubcategory(null);
  };

  const allCategoryItem = {
    id: 'all',
    name: categoryPage.allLabel,
    icon: categoryPage.allIcon,
    color: category?.color || '#2563eb',
  };

  const toCategoryShape = (sub) => ({
    id: sub.slug || sub.id,
    name: sub.name,
    icon: sub.icon,
    color: sub.color || category?.color,
  });

  return {
    id,
    loading,
    cardConfig,
    categoryPage,
    categoryGapStyle,
    category,
    categoryName,
    description,
    bannerImage,
    isBoth,
    isService,
    showChildCategories,
    childCategories,
    listCategoryType,
    subcategories,
    subcategoryType,
    allCategoryItem,
    toCategoryShape,
    activeChildCategory,
    activeSubcategory,
    setActiveSubcategory,
    handleChildCategory,
    handleShowAllChildren,
    productItems,
    serviceItems,
    items,
    view,
    getCategoryType,
    detailsTemplate,
    itemCount: items.length,
    productCount: productItems.length,
    serviceCount: serviceItems.length,
  };
}
