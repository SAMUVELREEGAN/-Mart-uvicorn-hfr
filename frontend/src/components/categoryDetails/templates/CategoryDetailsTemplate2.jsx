import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../../../utils/iconResolver';
import { resolveMediaUrl, isUploadedMedia } from '../../../utils/mediaUrl';
import { useCategories } from '../../../contexts/CategoryContext';
import ProductCard from '../../cards/ProductCard';
import CategoryImageCard from '../CategoryImageCard';
import Template2ServiceRow from '../Template2ServiceRow';
import EmptyState from '../../common/EmptyState';
import '../../../pages/user/Category.css';
import '../CategoryTemplates.css';

const MOBILE_BREAKPOINT = 992;
const SCROLL_OFFSET = 80;

function scrollToElement(el) {
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

function useIsMobileLayout() {
  const [isMobile, setIsMobile] = useState(
    () => (typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false),
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return isMobile;
}

function dedupeByKey(items, getKey) {
  const seen = new Set();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function CategoryDetailsTemplate2(props) {
  const {
    cardConfig,
    categoryPage,
    category,
    categoryName,
    description,
    bannerImage,
    isBoth,
    isService,
    allCategoryItem,
    toCategoryShape,
    activeChildCategory,
    activeSubcategory,
    setActiveSubcategory,
    handleChildCategory,
    handleShowAllChildren,
    getCategoryType,
    productItems,
    serviceItems,
    items,
    itemCount,
    view,
  } = props;

  const { getSubcategories, getCategoriesByIds } = useCategories();
  const isMobileLayout = useIsMobileLayout();
  const [mobilePanel, setMobilePanel] = useState('services');
  const touchStartX = useRef(null);
  const itemsAnchorRef = useRef(null);
  const firstResultRef = useRef(null);
  const pendingScrollRef = useRef(false);
  const prevLayoutRef = useRef(null);
  const [layoutAnimating, setLayoutAnimating] = useState(false);

  const accentColor = category?.color || '#2563eb';

  const requestResultsScroll = () => {
    pendingScrollRef.current = true;
  };

  const selectAllChildren = () => {
    handleShowAllChildren();
    requestResultsScroll();
  };

  const selectChildCategory = (childId) => {
    handleChildCategory(childId);
    requestResultsScroll();
  };

  const selectAllSubcategories = () => {
    setActiveSubcategory(null);
    requestResultsScroll();
  };

  const selectSubcategory = (subId) => {
    setActiveSubcategory(subId);
    requestResultsScroll();
  };

  const primaryLayout = useMemo(() => {
    if (!isBoth) return isService ? 'services' : 'products';

    if (activeSubcategory) {
      const parentId = activeChildCategory || view.categoryIds.find((catId) => {
        const subs = getSubcategories(catId);
        return subs.some((sub) => (sub.slug || sub.id) === activeSubcategory);
      });
      if (parentId) {
        return getCategoryType(parentId) === 'product' ? 'products' : 'services';
      }
    }

    if (activeChildCategory) {
      return getCategoryType(activeChildCategory) === 'product' ? 'products' : 'services';
    }

    return 'services';
  }, [
    isBoth,
    isService,
    activeChildCategory,
    activeSubcategory,
    view.categoryIds,
    getCategoryType,
    getSubcategories,
  ]);

  useEffect(() => {
    if (!isBoth || isMobileLayout) return undefined;
    if (prevLayoutRef.current && prevLayoutRef.current !== primaryLayout) {
      setLayoutAnimating(true);
      const timer = window.setTimeout(() => setLayoutAnimating(false), 400);
      prevLayoutRef.current = primaryLayout;
      return () => window.clearTimeout(timer);
    }
    prevLayoutRef.current = primaryLayout;
    return undefined;
  }, [primaryLayout, isBoth, isMobileLayout]);

  useEffect(() => {
    if (!pendingScrollRef.current) return undefined;

    if (isBoth && isMobileLayout) {
      const nextPanel = primaryLayout === 'products' && productItems.length > 0
        ? 'products'
        : (serviceItems.length > 0 ? 'services' : mobilePanel);
      if (nextPanel !== mobilePanel) {
        setMobilePanel(nextPanel);
        return undefined;
      }
    }

    pendingScrollRef.current = false;
    const timer = window.setTimeout(() => {
      scrollToElement(firstResultRef.current || itemsAnchorRef.current);
    }, 50);

    return () => window.clearTimeout(timer);
  }, [
    activeChildCategory,
    activeSubcategory,
    productItems,
    serviceItems,
    items,
    mobilePanel,
    isBoth,
    isMobileLayout,
    primaryLayout,
  ]);

  const displayCategories = useMemo(() => {
    const type = isBoth ? 'both' : (isService ? 'service' : 'product');
    return getCategoriesByIds(view.categoryIds, type);
  }, [view.categoryIds, isBoth, isService, getCategoriesByIds]);

  const displaySubcategories = useMemo(() => {
    const merged = view.categoryIds.flatMap((catId) => getSubcategories(catId));
    return dedupeByKey(merged, (sub) => sub.slug || sub.id);
  }, [view.categoryIds, getSubcategories]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) {
      setMobilePanel(diff > 0 ? 'products' : 'services');
    }
    touchStartX.current = null;
  };

  const renderCategoryRow = (title, cards) => (
    <section className="cat-tpl2-section cat-tpl2-section--categories">
      <h2 className="cat-tpl2-section__title">{title}</h2>
      <div className="cat-tpl2-img-scroll">
        <div className="cat-tpl2-img-grid">{cards}</div>
      </div>
    </section>
  );

  const categoryCards = (
    <>
      <CategoryImageCard
        category={allCategoryItem}
        active={!activeChildCategory}
        onClick={selectAllChildren}
        accentColor={accentColor}
      />
      {displayCategories.map((child) => (
        <CategoryImageCard
          key={child.id}
          category={child}
          active={activeChildCategory === child.id}
          onClick={() => selectChildCategory(child.id)}
          accentColor={child.color || accentColor}
        />
      ))}
    </>
  );

  const subcategoryCards = (
    <>
      <CategoryImageCard
        category={allCategoryItem}
        active={!activeSubcategory}
        onClick={selectAllSubcategories}
        accentColor={accentColor}
      />
      {displaySubcategories.map((sub) => {
        const shape = toCategoryShape(sub);
        const subId = sub.slug || sub.id;
        return (
          <CategoryImageCard
            key={subId}
            category={shape}
            active={activeSubcategory === subId}
            onClick={() => selectSubcategory(subId)}
            accentColor={shape.color || accentColor}
          />
        );
      })}
    </>
  );

  const attachFirstRef = (isFirst) => (isFirst ? firstResultRef : undefined);

  const renderProductList = (list, { fullWidth = false, markFirst = false } = {}) => (
    <div className={`cat-tpl2-item-list ${fullWidth ? 'cat-tpl2-item-list--full' : ''}`}>
      {list.map((product, index) => (
        <div
          key={product.id}
          className="cat-tpl2-result-anchor"
          ref={attachFirstRef(markFirst && index === 0)}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );

  const renderServiceList = (list, { stacked = false, fullWidth = false, markFirst = false } = {}) => (
    <div className={`cat-tpl2-service-list ${stacked ? 'cat-tpl2-service-list--stacked' : ''} ${fullWidth ? 'cat-tpl2-service-list--full' : ''}`}>
      {list.map((service, index) => (
        <div
          key={service.id}
          className="cat-tpl2-result-anchor"
          ref={attachFirstRef(markFirst && index === 0)}
        >
          <Template2ServiceRow
            service={service}
            layout={stacked ? 'stacked' : 'horizontal'}
          />
        </div>
      ))}
    </div>
  );

  const renderSplitContent = () => {
    if (!isBoth) {
      const title = isService ? categoryPage.servicesTitle : categoryPage.productsTitle;
      const empty = isService ? cardConfig.emptyState?.services : cardConfig.emptyState?.products;
      const markFirst = items.length > 0;
      return (
        <section className="cat-tpl2-section cat-tpl2-section--items">
          <div ref={itemsAnchorRef} className="cat-tpl2-results-sentinel" aria-hidden="true" />
          <h2 className="cat-tpl2-section__title">{title}</h2>
          {items.length === 0 ? (
            <EmptyState config={empty} />
          ) : (
            isService
              ? renderServiceList(items, { fullWidth: true, markFirst })
              : renderProductList(items, { fullWidth: true, markFirst })
          )}
        </section>
      );
    }

    if (isMobileLayout) {
      const productsMarkFirst = mobilePanel === 'products' && productItems.length > 0;
      const servicesMarkFirst = mobilePanel === 'services' && serviceItems.length > 0;

      return (
        <section className="cat-tpl2-section cat-tpl2-section--dual">
          <div ref={itemsAnchorRef} className="cat-tpl2-results-sentinel" aria-hidden="true" />
          <div className="cat-tpl2-mobile-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mobilePanel === 'services'}
              className={`cat-tpl2-mobile-tab ${mobilePanel === 'services' ? 'cat-tpl2-mobile-tab--active' : ''}`}
              onClick={() => setMobilePanel('services')}
            >
              {categoryPage.servicesTitle}
              <span>{serviceItems.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mobilePanel === 'products'}
              className={`cat-tpl2-mobile-tab ${mobilePanel === 'products' ? 'cat-tpl2-mobile-tab--active' : ''}`}
              onClick={() => setMobilePanel('products')}
            >
              {categoryPage.productsTitle}
              <span>{productItems.length}</span>
            </button>
          </div>

          <div
            className="cat-tpl2-swipe"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="cat-tpl2-swipe__track"
              style={{ transform: `translateX(${mobilePanel === 'services' ? '0%' : '-50%'})` }}
            >
              <div className="cat-tpl2-swipe__panel" role="tabpanel">
                {serviceItems.length === 0 ? (
                  <EmptyState config={cardConfig.emptyState?.services} />
                ) : (
                  renderServiceList(serviceItems, { fullWidth: true, markFirst: servicesMarkFirst })
                )}
              </div>
              <div className="cat-tpl2-swipe__panel" role="tabpanel">
                {productItems.length === 0 ? (
                  <EmptyState config={cardConfig.emptyState?.products} />
                ) : (
                  renderProductList(productItems, { fullWidth: true, markFirst: productsMarkFirst })
                )}
              </div>
            </div>
          </div>
          <p className="cat-tpl2-swipe-hint">Swipe left or right to switch</p>
        </section>
      );
    }

    const productsPrimary = primaryLayout === 'products';
    const productsMarkFirst = productsPrimary && productItems.length > 0;
    const servicesMarkFirst = !productsPrimary && serviceItems.length > 0;
    const servicesStacked = productsPrimary;

    const productsColumn = (
      <div className={`cat-tpl2-split__col cat-tpl2-split__products ${productsPrimary ? 'cat-tpl2-split__col--primary' : 'cat-tpl2-split__col--secondary'}`}>
        <h2 className="cat-tpl2-section__title">{categoryPage.productsTitle}</h2>
        {productItems.length === 0 ? (
          <EmptyState config={cardConfig.emptyState?.products} />
        ) : (
          renderProductList(productItems, { markFirst: productsMarkFirst })
        )}
      </div>
    );

    const servicesColumn = (
      <div className={`cat-tpl2-split__col cat-tpl2-split__services ${productsPrimary ? 'cat-tpl2-split__col--secondary' : 'cat-tpl2-split__col--primary'}`}>
        <h2 className="cat-tpl2-section__title">{categoryPage.servicesTitle}</h2>
        {serviceItems.length === 0 ? (
          <EmptyState config={cardConfig.emptyState?.services} />
        ) : (
          renderServiceList(serviceItems, { stacked: servicesStacked, markFirst: servicesMarkFirst })
        )}
      </div>
    );

    return (
      <section className="cat-tpl2-section cat-tpl2-section--dual">
        <div ref={itemsAnchorRef} className="cat-tpl2-results-sentinel" aria-hidden="true" />
        <div className={`cat-tpl2-split cat-tpl2-split--${primaryLayout}-primary ${layoutAnimating ? 'cat-tpl2-split--animating' : ''}`}>
          {productsPrimary ? (
            <>
              {productsColumn}
              {servicesColumn}
            </>
          ) : (
            <>
              {servicesColumn}
              {productsColumn}
            </>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="category-page category-page--template2">
      <header className="cat-tpl2-header" style={{ backgroundImage: `url(${bannerImage})` }}>
        <div className="cat-tpl2-header__overlay" />
        <div className="cat-tpl2-header__inner">
          {category?.icon && (
            <span className="cat-tpl2-header__icon" style={{ color: category.color }}>
              {isUploadedMedia(category.icon) ? (
                <img src={resolveMediaUrl(category.icon)} alt="" />
              ) : (
                <Icon name={category.icon} />
              )}
            </span>
          )}
          <div>
            <h1 className="cat-tpl2-header__title">{categoryName}</h1>
            <p className="cat-tpl2-header__desc">{description}</p>
          </div>
          <span className="cat-tpl2-header__count">{itemCount} items</span>
        </div>
      </header>

      <div className="cat-tpl2-body">
        {displayCategories.length > 0 && renderCategoryRow(categoryPage.childCategoriesTitle, categoryCards)}
        {displaySubcategories.length > 0 && renderCategoryRow(categoryPage.subcategoriesTitle, subcategoryCards)}
        {renderSplitContent()}
      </div>
    </div>
  );
}
