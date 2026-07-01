import { Icon } from '../../../utils/iconResolver';
import { resolveMediaUrl, isUploadedMedia } from '../../../utils/mediaUrl';
import ProductCard from '../../cards/ProductCard';
import ServiceCard from '../../cards/ServiceCard';
import CategoryItem from '../../cards/CategoryItem';
import EmptyState from '../../common/EmptyState';
import '../../../pages/user/Category.css';
import '../CategoryTemplates.css';

export default function CategoryDetailsTemplate4(props) {
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
  } = props;

  const renderImageTiles = (list, type) => (
    <div className="cat-tpl4-tiles">
      {list.map((item) => (
        <div key={item.id} className="cat-tpl4-tile">
          {type === 'service'
            ? <ServiceCard service={item} />
            : <ProductCard product={item} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="category-page category-page--template4">
      <section className="cat-tpl4-hero" style={{ backgroundImage: `url(${bannerImage})` }}>
        <div className="cat-tpl4-hero__shade" />
        <div className="cat-tpl4-hero__content">
          {category?.icon && (
            <div className="cat-tpl4-hero__badge" style={{ borderColor: category.color, color: category.color }}>
              {isUploadedMedia(category.icon) ? (
                <img src={resolveMediaUrl(category.icon)} alt="" />
              ) : (
                <Icon name={category.icon} />
              )}
            </div>
          )}
          <h1>{categoryName}</h1>
          <p>{description}</p>
        </div>
      </section>

      <div className="cat-tpl4-body">
        {showChildCategories && (
          <section className="cat-tpl4-filter-block">
            <h2>{categoryPage.childCategoriesTitle}</h2>
            <div className="cat-tpl4-filter-scroll" style={categoryGapStyle}>
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
            </div>
          </section>
        )}

        {subcategories.length > 0 && (
          <section className="cat-tpl4-subgrid">
            <h2>{categoryPage.subcategoriesTitle}</h2>
            <div className="cat-tpl4-subcards">
              <button
                type="button"
                className={`cat-tpl4-subcard ${!activeSubcategory ? 'cat-tpl4-subcard--active' : ''}`}
                onClick={() => setActiveSubcategory(null)}
              >
                <span className="cat-tpl4-subcard__icon" style={{ background: `${category?.color || '#2563eb'}18` }}>
                  <Icon name={categoryPage.allIcon} />
                </span>
                <span>{categoryPage.allLabel}</span>
              </button>
              {subcategories.map((sub) => {
                const shape = toCategoryShape(sub);
                const subId = sub.slug || sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    className={`cat-tpl4-subcard ${activeSubcategory === subId ? 'cat-tpl4-subcard--active' : ''}`}
                    onClick={() => setActiveSubcategory(subId)}
                  >
                    <span className="cat-tpl4-subcard__icon" style={{ background: `${shape.color || '#2563eb'}18`, color: shape.color }}>
                      {shape.icon && (isUploadedMedia(shape.icon) ? (
                        <img src={resolveMediaUrl(shape.icon)} alt="" />
                      ) : (
                        <Icon name={shape.icon} />
                      ))}
                    </span>
                    <span>{shape.name}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {isBoth ? (
          <>
            <section className="cat-tpl4-items">
              <h2>{categoryPage.productsTitle}</h2>
              {productItems.length === 0 ? (
                <EmptyState config={cardConfig.emptyState?.products} />
              ) : (
                renderImageTiles(productItems, 'product')
              )}
            </section>
            <section className="cat-tpl4-items cat-tpl4-items--alt">
              <h2>{categoryPage.servicesTitle}</h2>
              {serviceItems.length === 0 ? (
                <EmptyState config={cardConfig.emptyState?.services} />
              ) : (
                renderImageTiles(serviceItems, 'service')
              )}
            </section>
          </>
        ) : (
          <section className="cat-tpl4-items">
            <h2>{isService ? categoryPage.servicesTitle : categoryPage.productsTitle}</h2>
            {items.length === 0 ? (
              <EmptyState config={isService ? cardConfig.emptyState?.services : cardConfig.emptyState?.products} />
            ) : (
              renderImageTiles(items, isService ? 'service' : 'product')
            )}
          </section>
        )}
      </div>
    </div>
  );
}
