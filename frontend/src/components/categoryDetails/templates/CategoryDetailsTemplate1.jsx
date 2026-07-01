import { Icon } from '../../../utils/iconResolver';
import { resolveMediaUrl, isUploadedMedia } from '../../../utils/mediaUrl';
import ProductCard from '../../cards/ProductCard';
import ServiceCard from '../../cards/ServiceCard';
import CategoryItem from '../../cards/CategoryItem';
import CardCarousel from '../../common/CardCarousel';
import EmptyState from '../../common/EmptyState';
import HomeSection from '../../layout/HomeSection';
import '../../../pages/user/Category.css';

export default function CategoryDetailsTemplate1(props) {
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
  } = props;

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
    <div className="category-page category-page--template1">
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
