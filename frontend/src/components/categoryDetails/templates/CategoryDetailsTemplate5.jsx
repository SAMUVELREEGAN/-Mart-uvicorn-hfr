import { useState } from 'react';
import { Icon } from '../../../utils/iconResolver';
import { resolveMediaUrl, isUploadedMedia } from '../../../utils/mediaUrl';
import ProductCard from '../../cards/ProductCard';
import ServiceCard from '../../cards/ServiceCard';
import CategoryItem from '../../cards/CategoryItem';
import CardCarousel from '../../common/CardCarousel';
import EmptyState from '../../common/EmptyState';
import '../../../pages/user/Category.css';
import '../CategoryTemplates.css';

export default function CategoryDetailsTemplate5(props) {
  const {
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
    productCount,
    serviceCount,
    itemCount,
  } = props;

  const [activeTab, setActiveTab] = useState('products');

  const renderPremiumGrid = (list, type) => (
    <div className={`cat-tpl5-grid cat-tpl5-grid--${type}`}>
      {list.map((item) => (
        type === 'service'
          ? <ServiceCard key={item.id} service={item} />
          : <ProductCard key={item.id} product={item} />
      ))}
    </div>
  );

  return (
    <div className="category-page category-page--template5">
      <header className="cat-tpl5-header">
        <div className="cat-tpl5-header__visual" style={{ backgroundImage: `url(${bannerImage})` }} />
        <div className="cat-tpl5-header__panel">
          <div className="cat-tpl5-header__top">
            {category?.icon && (
              <span className="cat-tpl5-header__icon">
                {isUploadedMedia(category.icon) ? (
                  <img src={resolveMediaUrl(category.icon)} alt="" />
                ) : (
                  <Icon name={category.icon} />
                )}
              </span>
            )}
            <div className="cat-tpl5-header__stats">
              <span><strong>{itemCount}</strong> Total</span>
              {isBoth && (
                <>
                  <span><strong>{productCount}</strong> Products</span>
                  <span><strong>{serviceCount}</strong> Services</span>
                </>
              )}
            </div>
          </div>
          <h1>{categoryName}</h1>
          <p>{description}</p>
        </div>
      </header>

      <div className="cat-tpl5-toolbar">
        {showChildCategories && (
          <div className="cat-tpl5-toolbar__group">
            <span className="cat-tpl5-toolbar__label">{categoryPage.childCategoriesTitle}</span>
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
          </div>
        )}

        {subcategories.length > 0 && (
          <div className="cat-tpl5-toolbar__group">
            <span className="cat-tpl5-toolbar__label">{categoryPage.subcategoriesTitle}</span>
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
          </div>
        )}
      </div>

      <div className="cat-tpl5-content">
        {isBoth ? (
          <>
            <div className="cat-tpl5-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'products'}
                className={`cat-tpl5-tab ${activeTab === 'products' ? 'cat-tpl5-tab--active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                {categoryPage.productsTitle}
                <span>{productCount}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'services'}
                className={`cat-tpl5-tab ${activeTab === 'services' ? 'cat-tpl5-tab--active' : ''}`}
                onClick={() => setActiveTab('services')}
              >
                {categoryPage.servicesTitle}
                <span>{serviceCount}</span>
              </button>
            </div>
            {activeTab === 'products' ? (
              productItems.length === 0 ? (
                <EmptyState config={cardConfig.emptyState?.products} />
              ) : (
                renderPremiumGrid(productItems, 'product')
              )
            ) : (
              serviceItems.length === 0 ? (
                <EmptyState config={cardConfig.emptyState?.services} />
              ) : (
                renderPremiumGrid(serviceItems, 'service')
              )
            )}
          </>
        ) : (
          <>
            <h2 className="cat-tpl5-section-title">
              {isService ? categoryPage.servicesTitle : categoryPage.productsTitle}
            </h2>
            {items.length === 0 ? (
              <EmptyState config={isService ? cardConfig.emptyState?.services : cardConfig.emptyState?.products} />
            ) : (
              renderPremiumGrid(items, isService ? 'service' : 'product')
            )}
          </>
        )}
      </div>
    </div>
  );
}
