import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCategories } from '../../contexts/CategoryContext';
import { useProducts } from '../../contexts/ProductContext';
import { useServices } from '../../contexts/ServiceContext';
import { useSimulatedLoading } from '../../hooks/useHelpers';
import { Icon } from '../../utils/iconResolver';
import ProductCard from '../../components/cards/ProductCard';
import ServiceCard from '../../components/cards/ServiceCard';
import SubCategoryCard from '../../components/cards/SubCategoryCard';
import CardCarousel from '../../components/common/CardCarousel';
import EmptyState from '../../components/common/EmptyState';
import { SkeletonCard, SkeletonCategoryList } from '../../components/skeleton/Skeleton';
import cardConfig from '../../json/icons.json';
import './Category.css';

export default function Category() {
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
  } = useCategories();
  const { products } = useProducts();
  const { services } = useServices();

  const category = getCategoryById(id);
  const view = resolveCategoryView(id, typeParam);
  const isService = view.itemType === 'service';

  const childCategories = getCategoriesByIds(view.categoryIds, view.itemType);
  const showChildCategories = view.isAggregate && childCategories.length > 0;

  const effectiveCategoryId = activeChildCategory
    || (view.categoryIds.length === 1 ? view.categoryIds[0] : null);

  const subcategories = effectiveCategoryId ? getSubcategories(effectiveCategoryId) : [];

  const categoryName = category?.name || category?.title || id;
  const description = category?.description
    || (isService ? categoryPage.defaultServiceDescription : categoryPage.defaultProductDescription);
  const bannerImage = category?.bannerImage || category?.image || categoryPage.defaultBanner;

  const allItems = useMemo(() => {
    const pool = isService ? services : products;
    const filterIds = activeChildCategory
      ? [activeChildCategory]
      : view.categoryIds;
    return pool.filter((item) => filterIds.includes(item.category));
  }, [isService, activeChildCategory, view.categoryIds, products, services]);

  const items = useMemo(() => {
    if (!activeSubcategory) return allItems;
    return allItems.filter((item) => item.subcategory === activeSubcategory);
  }, [allItems, activeSubcategory]);

  const handleChildCategory = (childId) => {
    setActiveChildCategory(childId);
    setActiveSubcategory(null);
  };

  const handleShowAllChildren = () => {
    setActiveChildCategory(null);
    setActiveSubcategory(null);
  };

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
              <Icon name={category.icon} />
            </div>
          )}
          <h1 className="category-page__title">{categoryName}</h1>
          <p className="category-page__description">{description}</p>
        </div>
      </section>

      {showChildCategories && (
        <section className="category-page__subcategories">
          <h2 className="category-page__section-title">{categoryPage.childCategoriesTitle}</h2>
          <CardCarousel configKey="subcategories" variant="subcategories" className="category-page__sub-list">
            <SubCategoryCard
              subcategory={{ id: 'all', name: categoryPage.allLabel, icon: categoryPage.allIcon, color: category?.color || '#2563eb' }}
              categoryType={view.itemType}
              active={!activeChildCategory}
              onClick={handleShowAllChildren}
            />
            {childCategories.map((child) => (
              <SubCategoryCard
                key={child.id}
                subcategory={child}
                categoryType={view.itemType}
                active={activeChildCategory === child.id}
                onClick={() => handleChildCategory(child.id)}
              />
            ))}
          </CardCarousel>
        </section>
      )}

      {subcategories.length > 0 && (
        <section className="category-page__subcategories">
          <h2 className="category-page__section-title">{categoryPage.subcategoriesTitle}</h2>
          <CardCarousel configKey="subcategories" variant="subcategories" className="category-page__sub-list">
            <SubCategoryCard
              subcategory={{ id: 'all', name: categoryPage.allLabel, icon: categoryPage.allIcon, color: category?.color || '#2563eb' }}
              categoryType={view.itemType}
              active={!activeSubcategory}
              onClick={() => setActiveSubcategory(null)}
            />
            {subcategories.map((sub) => (
              <SubCategoryCard
                key={sub.id}
                subcategory={sub}
                categoryType={view.itemType}
                active={activeSubcategory === sub.id}
                onClick={() => setActiveSubcategory(sub.id)}
              />
            ))}
          </CardCarousel>
        </section>
      )}

      <section className="category-page__items">
        <h2 className="category-page__section-title">
          {isService ? categoryPage.servicesTitle : categoryPage.productsTitle}
          <span className="category-page__count">({items.length})</span>
        </h2>
        {items.length === 0 ? (
          <EmptyState config={isService ? cardConfig.emptyState.services : cardConfig.emptyState.products} />
        ) : (
          <CardCarousel configKey={isService ? 'services' : 'products'} variant={isService ? 'services' : 'products'}>
            {items.map((item) =>
              isService
                ? <ServiceCard key={item.id} service={item} />
                : <ProductCard key={item.id} product={item} />
            )}
          </CardCarousel>
        )}
      </section>
    </div>
  );
}
