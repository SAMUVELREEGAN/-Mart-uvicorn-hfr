import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import catalogData from '../../json/catalog.json';
import cardConfig from '../../json/icons.json';
import { useCategories } from '../../contexts/CategoryContext';
import { useLocation } from '../../contexts/LocationContext';
import { useCatalogListing } from '../../hooks/useCatalogListing';
import { useSimulatedLoading } from '../../hooks/useHelpers';
import CategoryItem from '../cards/CategoryItem';
import SubCategoryCard from '../cards/SubCategoryCard';
import ProductCard from '../cards/ProductCard';
import ServiceCard from '../cards/ServiceCard';
import CardCarousel from '../common/CardCarousel';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import Sidebar from '../common/Sidebar';
import { SkeletonCard } from '../skeleton/Skeleton';
import CatalogToolbar from './CatalogToolbar';
import CatalogFilterPanel from './CatalogFilterPanel';
import CatalogSortPanel from './CatalogSortPanel';
import './CatalogPage.css';

export default function CatalogPage({ itemType = 'product' }) {
  const configKey = itemType === 'service' ? 'services' : 'products';
  const config = catalogData[configKey];
  const pageSize = catalogData.pageSize || 12;

  const [searchParams, setSearchParams] = useSearchParams();
  const { productCategories, serviceCategories, getSubcategories, categoryPage } = useCategories();
  const { selectedLocation } = useLocation();
  const loading = useSimulatedLoading(350);

  const categories = itemType === 'service' ? serviceCategories : productCategories;

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || null);
  const [subcategoryId, setSubcategoryId] = useState(searchParams.get('subcategory') || null);
  const [sortKey, setSortKey] = useState(searchParams.get('sort') || 'relevance');
  const [filters, setFilters] = useState({
    minRating: searchParams.get('rating') || '',
    priceRange: searchParams.get('price') || '',
  });
  const [draftFilters, setDraftFilters] = useState(filters);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const subcategories = categoryId ? getSubcategories(categoryId) : [];

  const { items } = useCatalogListing({
    itemType,
    query,
    categoryId,
    subcategoryId,
    sortKey,
    filters,
    locationId: selectedLocation?.id,
  });

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const paginated = items.slice((page - 1) * pageSize, page * pageSize);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.minRating) count += 1;
    if (itemType === 'product' && filters.priceRange) count += 1;
    return count;
  }, [filters, itemType]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (categoryId) params.set('category', categoryId);
    if (subcategoryId) params.set('subcategory', subcategoryId);
    if (sortKey && sortKey !== 'relevance') params.set('sort', sortKey);
    if (filters.minRating) params.set('rating', filters.minRating);
    if (filters.priceRange) params.set('price', filters.priceRange);
    setSearchParams(params, { replace: true });
    setPage(1);
  }, [query, categoryId, subcategoryId, sortKey, filters, setSearchParams]);

  const handleCategorySelect = (id) => {
    setCategoryId(id);
    setSubcategoryId(null);
  };

  const handleShowAllCategories = () => {
    setCategoryId(null);
    setSubcategoryId(null);
  };

  const handleSubcategorySelect = (id) => {
    setSubcategoryId(id);
  };

  const handleClearFilters = () => {
    const cleared = { minRating: '', priceRange: '' };
    setDraftFilters(cleared);
    setFilters(cleared);
    setFilterOpen(false);
  };

  const handleApplyFilters = () => {
    setFilters(draftFilters);
    setFilterOpen(false);
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const allItem = {
    id: 'all',
    name: config.allLabel || categoryPage.allLabel,
    icon: config.allIcon || categoryPage.allIcon,
    color: selectedCategory?.color || '#2563eb',
  };

  if (loading) {
    return (
      <div className="catalog-page">
        <div className="catalog-page__skeleton-toolbar" />
        <div className={`catalog-page__grid catalog-page__grid--${itemType}`}>
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonCard key={i} layout={itemType === 'service' ? 'vertical' : 'horizontal'} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <h1 className="catalog-page__title">{config.title}</h1>

      <CatalogToolbar
        config={config}
        query={query}
        onQueryChange={setQuery}
        onFilterOpen={() => {
          setDraftFilters(filters);
          setFilterOpen(true);
        }}
        onSortOpen={() => setSortOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      <section className="catalog-page__section">
        <h2 className="catalog-page__section-title">{config.categoriesTitle}</h2>
        <CardCarousel configKey="categories" variant="categories" className="catalog-page__categories">
          <CategoryItem
            category={allItem}
            type={itemType}
            active={!categoryId}
            onClick={handleShowAllCategories}
          />
          {categories.map((cat) => (
            <CategoryItem
              key={cat.id}
              category={cat}
              type={itemType}
              active={categoryId === cat.id}
              onClick={() => handleCategorySelect(cat.id)}
            />
          ))}
        </CardCarousel>
      </section>

      {subcategories.length > 0 && (
        <section className="catalog-page__section">
          <h2 className="catalog-page__section-title">{config.subcategoriesTitle}</h2>
          <CardCarousel configKey="subcategories" variant="subcategories" className="catalog-page__subcategories">
            <SubCategoryCard
              subcategory={allItem}
              categoryType={itemType}
              active={!subcategoryId}
              onClick={() => setSubcategoryId(null)}
            />
            {subcategories.map((sub) => (
              <SubCategoryCard
                key={sub.id}
                subcategory={sub}
                categoryType={itemType}
                active={subcategoryId === sub.id}
                onClick={() => handleSubcategorySelect(sub.id)}
              />
            ))}
          </CardCarousel>
        </section>
      )}

      <section className="catalog-page__section catalog-page__results">
        <h2 className="catalog-page__section-title">
          {config.resultsTitle}
          <span className="catalog-page__count">({items.length})</span>
        </h2>

        {items.length === 0 ? (
          <EmptyState config={itemType === 'service' ? cardConfig.emptyState.services : cardConfig.emptyState.products} />
        ) : (
          <>
            <div className={`catalog-page__grid catalog-page__grid--${itemType}`}>
              {paginated.map((item) =>
                itemType === 'service'
                  ? <ServiceCard key={item.id} service={item} />
                  : <ProductCard key={item.id} product={item} />
              )}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </section>

      <Sidebar
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        title={config.filterPanel.title}
        position="right"
      >
        <CatalogFilterPanel
          config={config}
          itemType={itemType}
          filters={draftFilters}
          onChange={setDraftFilters}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />
      </Sidebar>

      <Sidebar
        isOpen={sortOpen}
        onClose={() => setSortOpen(false)}
        title={config.sortPanel.title}
        position="right"
      >
        <CatalogSortPanel
          options={config.sortOptions}
          value={sortKey}
          onChange={setSortKey}
          onSelect={() => setSortOpen(false)}
        />
      </Sidebar>
    </div>
  );
}
