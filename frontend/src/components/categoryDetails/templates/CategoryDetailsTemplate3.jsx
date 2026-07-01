import { useEffect, useMemo } from 'react';
import { Icon } from '../../../utils/iconResolver';
import { resolveMediaUrl, isUploadedMedia } from '../../../utils/mediaUrl';
import { useCategories } from '../../../contexts/CategoryContext';
import ProductCard from '../../cards/ProductCard';
import Template3CategoryChip from '../Template3CategoryChip';
import Template3ServiceListing from '../Template3ServiceListing';
import EmptyState from '../../common/EmptyState';
import '../../../pages/user/Category.css';
import '../CategoryTemplates.css';
import '../Template3CategoryChip.css';
import '../Template3ServiceListing.css';

export default function CategoryDetailsTemplate3(props) {
  const {
    cardConfig,
    categoryPage,
    category,
    categoryName,
    description,
    bannerImage,
    isBoth,
    isService,
    showChildCategories,
    childCategories,
    subcategories,
    activeChildCategory,
    activeSubcategory,
    setActiveSubcategory,
    handleChildCategory,
    productItems,
    serviceItems,
    items,
    itemCount,
    productCount,
    serviceCount,
    view,
  } = props;

  const { getCategoriesByIds } = useCategories();
  const accentColor = category?.color || '#2563eb';

  const mainCategories = useMemo(() => {
    const type = isBoth ? 'both' : (isService ? 'service' : 'product');
    if (showChildCategories) return childCategories;
    return getCategoriesByIds(view.categoryIds, type);
  }, [showChildCategories, childCategories, view.categoryIds, isBoth, isService, getCategoriesByIds]);

  const effectiveCategoryId = activeChildCategory
    || (view.categoryIds.length === 1 ? view.categoryIds[0] : null);

  const activeMainId = activeChildCategory || (view.categoryIds.length === 1 ? view.categoryIds[0] : null);
  const showSubcategorySection = Boolean(effectiveCategoryId && subcategories.length > 0);
  const resultsKey = `${activeMainId || 'none'}-${activeSubcategory || 'all'}`;

  useEffect(() => {
    if (activeChildCategory) return;
    if (showChildCategories && mainCategories.length > 0) {
      handleChildCategory(mainCategories[0].id);
    } else if (!showChildCategories && view.categoryIds.length > 1) {
      handleChildCategory(view.categoryIds[0]);
    }
  }, [activeChildCategory, showChildCategories, mainCategories, view.categoryIds, handleChildCategory]);

  useEffect(() => {
    if (subcategories.length > 0 && !activeSubcategory) {
      setActiveSubcategory(subcategories[0].slug || subcategories[0].id);
    }
  }, [subcategories, activeSubcategory, setActiveSubcategory]);

  const handleMainCategoryClick = (catId) => {
    if (showChildCategories || view.categoryIds.length > 1) {
      handleChildCategory(catId);
    }
  };

  const renderEmptyState = () => {
    const config = isService || (isBoth && !productItems.length && serviceItems.length === 0)
      ? cardConfig.emptyState?.services
      : cardConfig.emptyState?.products;
    return (
      <div className="cat-tpl3-empty">
        <EmptyState config={config} />
      </div>
    );
  };

  const renderResults = () => {
    if (isBoth) {
      const hasProducts = productItems.length > 0;
      const hasServices = serviceItems.length > 0;
      if (!hasProducts && !hasServices) return renderEmptyState();

      return (
        <>
          {hasProducts && (
            <section className="cat-tpl3-results-block">
              <header className="cat-tpl3-block__header">
                <h2 className="cat-tpl3-block__title">{categoryPage.productsTitle}</h2>
                <span className="cat-tpl3-block__count">{productCount}</span>
              </header>
              <div className="cat-tpl3-product-grid">
                {productItems.map((product) => (
                  <div key={product.id} className="cat-tpl3-product-cell">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          )}
          {hasServices && (
            <section className="cat-tpl3-results-block">
              <header className="cat-tpl3-block__header">
                <h2 className="cat-tpl3-block__title">{categoryPage.servicesTitle}</h2>
                <span className="cat-tpl3-block__count">{serviceCount}</span>
              </header>
              <div className="cat-tpl3-service-list">
                {serviceItems.map((service) => (
                  <Template3ServiceListing key={service.id} service={service} />
                ))}
              </div>
            </section>
          )}
        </>
      );
    }

    if (isService) {
      return (
        <section className="cat-tpl3-results-block">
          <header className="cat-tpl3-block__header">
            <h2 className="cat-tpl3-block__title">{categoryPage.servicesTitle}</h2>
            <span className="cat-tpl3-block__count">{itemCount}</span>
          </header>
          {items.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="cat-tpl3-service-list">
              {items.map((service) => (
                <Template3ServiceListing key={service.id} service={service} />
              ))}
            </div>
          )}
        </section>
      );
    }

    return (
      <section className="cat-tpl3-results-block">
        <header className="cat-tpl3-block__header">
          <h2 className="cat-tpl3-block__title">{categoryPage.productsTitle}</h2>
          <span className="cat-tpl3-block__count">{itemCount}</span>
        </header>
        {items.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="cat-tpl3-product-grid">
            {items.map((product) => (
              <div key={product.id} className="cat-tpl3-product-cell">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="category-page category-page--template3">
      <section className="cat-tpl3-hero cat-tpl3-hero--compact">
        <img src={bannerImage} alt="" className="cat-tpl3-hero__bg" />
        <div className="cat-tpl3-hero__overlay" />
        <div className="cat-tpl3-hero__content">
          {category?.icon && (
            <span className="cat-tpl3-hero__icon" style={{ background: `${accentColor}22`, color: accentColor }}>
              {isUploadedMedia(category.icon) ? (
                <img src={resolveMediaUrl(category.icon)} alt="" />
              ) : (
                <Icon name={category.icon} />
              )}
            </span>
          )}
          <h1>{categoryName}</h1>
          <p>{description}</p>
          {itemCount > 0 && (
            <span className="cat-tpl3-hero__badge">{itemCount} items</span>
          )}
        </div>
      </section>

      <div className="cat-tpl3-page">
        {mainCategories.length > 0 && (
          <section className="cat-tpl3-block cat-tpl3-block--categories">
            <header className="cat-tpl3-block__header">
              <h2 className="cat-tpl3-block__title">{categoryPage.childCategoriesTitle}</h2>
            </header>
            <div className="cat-tpl3-chip-scroll">
              <div className="cat-tpl3-chip-grid cat-tpl3-chip-grid--categories">
                {mainCategories.map((cat) => (
                  <Template3CategoryChip
                    key={cat.id}
                    category={cat}
                    active={activeMainId === cat.id}
                    onClick={() => handleMainCategoryClick(cat.id)}
                    accentColor={cat.color || accentColor}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {showSubcategorySection && (
          <section className="cat-tpl3-block cat-tpl3-block--subcategories">
            <header className="cat-tpl3-block__header">
              <h2 className="cat-tpl3-block__title">{categoryPage.subcategoriesTitle}</h2>
            </header>
            <div className="cat-tpl3-chip-scroll">
              <div className="cat-tpl3-chip-grid cat-tpl3-chip-grid--subcategories">
                {subcategories.map((sub) => {
                  const subId = sub.slug || sub.id;
                  return (
                    <Template3CategoryChip
                      key={subId}
                      category={{
                        id: subId,
                        name: sub.name,
                        icon: sub.icon,
                        color: sub.color || accentColor,
                      }}
                      active={activeSubcategory === subId}
                      onClick={() => setActiveSubcategory(subId)}
                      accentColor={sub.color || accentColor}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <section className="cat-tpl3-block cat-tpl3-block--results">
          {!isBoth && (
            <header className="cat-tpl3-block__header">
              <h2 className="cat-tpl3-block__title">
                {isService ? categoryPage.servicesTitle : categoryPage.productsTitle}
              </h2>
              {itemCount > 0 && <span className="cat-tpl3-block__count">{itemCount}</span>}
            </header>
          )}
          <div key={resultsKey} className="cat-tpl3-results-animate">
            {renderResults()}
          </div>
        </section>
      </div>
    </div>
  );
}
