import { useCmsContent } from '../../contexts';
import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCategories } from '../../contexts/CategoryContext';
import { useProducts } from '../../contexts/ProductContext';
import { useServices } from '../../contexts/ServiceContext';
import { useSimulatedLoading } from '../../hooks/useHelpers';
import { Icon } from '../../utils/iconResolver';
import { resolveMediaUrl, isUploadedMedia } from '../../utils/mediaUrl';
import ProductCard from '../../components/cards/ProductCard';
import ServiceCard from '../../components/cards/ServiceCard';
import CategoryItem from '../../components/cards/CategoryItem';
import CardCarousel from '../../components/common/CardCarousel';
import EmptyState from '../../components/common/EmptyState';
import HomeSection from '../../components/layout/HomeSection';
import { SkeletonCard, SkeletonCategoryList } from '../../components/skeleton/Skeleton';
import './Category.css';

export default function Category() {
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

  if (loading) {
    return (
      <div className="category-page">
        <div className="category-page__banner-skeleton" />
        <SkeletonCategoryList />
        <div className="category-page__grid">
          {Array.from({ length: 4 }, (_, i) => (
            <SkeletonCard key={i} layout={isService ? 'vertical' : 'horizontal'} />
          ))}
        </div>
      </div>
    );
  }

  const renderProductCarousel = (list) => (
    <CardCarousel configKey="products" variant="products">
      {list.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </CardCarousel>
  );

  const renderServiceCarousel = (list) => (
    <CardCarousel configKey="services" variant="services">
      {list.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </CardCarousel>
  );

  return (
    <div className="category-page">
      <section className="category-page__banner" style={{ backgroundImage: `url(${bannerImage})` }}>
        <div className="category-page__banner-overlay" />
        <div className="category-page__banner-content">
          {category?.icon && (
            <div
              className="category-page__banner-icon"
              style={{ background: `${category.color || '#2563eb'}22`, color: category.color }}
            >
              {isUploadedMedia(category.icon) ? (
                <img src={resolveMediaUrl(category.icon)} alt="" className="category-page__banner-icon-img" />
              ) : (
                <Icon name={category.icon} />
              )}
            </div>
          )}
          <h1 className="category-page__title">{categoryName}</h1>
          <p className="category-page__description">{description}</p>
        </div>
      </section>

      {showChildCategories && (
        <HomeSection title={categoryPage.childCategoriesTitle} band="subtle">
          <CardCarousel configKey="categories" variant="categories" style={categoryGapStyle}>
            <CategoryItem
              category={allCategoryItem}
              type={listCategoryType}
              active={!activeChildCategory}
              onClick={handleShowAllChildren}
            />
            {childCategories.map((child) => (
              <CategoryItem
                key={child.id}
                category={child}
                type={isBoth ? getCategoryType(child.id) : view.itemType}
                active={activeChildCategory === child.id}
                onClick={() => handleChildCategory(child.id)}
              />
            ))}
          </CardCarousel>
        </HomeSection>
      )}

      {subcategories.length > 0 && (
        <HomeSection title={categoryPage.subcategoriesTitle} band="default">
          <CardCarousel configKey="categories" variant="categories" style={categoryGapStyle}>
            <CategoryItem
              category={allCategoryItem}
              type={subcategoryType}
              active={!activeSubcategory}
              onClick={() => setActiveSubcategory(null)}
            />
            {subcategories.map((sub) => (
              <CategoryItem
                key={sub.id}
                category={toCategoryShape(sub)}
                type={subcategoryType}
                active={activeSubcategory === (sub.slug || sub.id)}
                onClick={() => setActiveSubcategory(sub.slug || sub.id)}
              />
            ))}
          </CardCarousel>
        </HomeSection>
      )}

      {isBoth ? (
        <>
          <HomeSection title={categoryPage.productsTitle} band="default">
            {productItems.length === 0 ? (
              <EmptyState config={cardConfig.emptyState?.products} />
            ) : (
              renderProductCarousel(productItems)
            )}
          </HomeSection>
          <HomeSection title={categoryPage.servicesTitle} band="subtle">
            {serviceItems.length === 0 ? (
              <EmptyState config={cardConfig.emptyState?.services} />
            ) : (
              renderServiceCarousel(serviceItems)
            )}
          </HomeSection>
        </>
      ) : (
        <HomeSection
          title={isService ? categoryPage.servicesTitle : categoryPage.productsTitle}
          band="default"
        >
          {items.length === 0 ? (
            <EmptyState config={isService ? cardConfig.emptyState?.services : cardConfig.emptyState?.products} />
          ) : (
            isService ? renderServiceCarousel(items) : renderProductCarousel(items)
          )}
        </HomeSection>
      )}
    </div>
  );
}
