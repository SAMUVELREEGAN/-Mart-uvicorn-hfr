import { useCmsContent } from '../../contexts';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { useServices } from '../../contexts/ServiceContext';
import { useLocation } from '../../contexts/LocationContext';
import { useSimulatedLoading } from '../../hooks/useHelpers';
import ProductCard from '../../components/cards/ProductCard';
import ServiceCard from '../../components/cards/ServiceCard';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { SkeletonCard } from '../../components/skeleton/Skeleton';
import { Icon } from '../../utils/iconResolver';
import './Search.css';

const PAGE_SIZE = 6;

export default function Search() {
  const cardConfig = useCmsContent('icons');
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'products';
  const [page, setPage] = useState(1);
  const [servicesPanelOpen, setServicesPanelOpen] = useState(true);
  const loading = useSimulatedLoading(400);
  const { searchProducts } = useProducts();
  const { searchServices } = useServices();
  const { selectedLocation } = useLocation();
  const searchPageConfig = cardConfig.searchPage || {};

  const results = useMemo(() => {
    const locationId = selectedLocation?.id;
    if (type === 'services') return searchServices(query, null, locationId);
    return searchProducts(query, null, locationId);
  }, [type, query, searchProducts, searchServices, selectedLocation]);

  const relatedServices = useMemo(() => {
    if (type !== 'products' || !query.trim()) return [];
    const locationId = selectedLocation?.id;
    return searchServices(query, null, locationId);
  }, [type, query, searchServices, selectedLocation]);

  const totalPages = Math.ceil(results.length / PAGE_SIZE);
  const paginated = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const showServicesPanel = type === 'products'
    && query.trim()
    && servicesPanelOpen
    && relatedServices.length > 0;

  const panelServices = relatedServices.slice(0, searchPageConfig.servicesPanelMaxItems || 4);

  useEffect(() => {
    setPage(1);
    setServicesPanelOpen(true);
  }, [query, type]);

  if (loading) {
    return (
      <div className="search-page">
        <div className={`search-page__layout ${type === 'products' ? '' : 'search-page__layout--full'}`}>
          <div className="search-page__main">
            <div className="search-page__grid">
              {Array.from({ length: 6 }, (_, i) => (
                <SkeletonCard key={i} layout={type === 'services' ? 'vertical' : 'horizontal'} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">
      <h1 className="search-page__title">
        {query ? `Results for "${query}"` : type === 'services' ? 'All Services' : 'All Products'}
        <span className="search-page__count">({results.length})</span>
      </h1>

      {results.length === 0 ? (
        <EmptyState config={type === 'services' ? cardConfig.emptyState.services : cardConfig.emptyState.products} />
      ) : (
        <div className={`search-page__layout ${showServicesPanel ? '' : 'search-page__layout--full'}`}>
          <div className="search-page__main">
            <div className={`search-page__grid search-page__grid--${type}`}>
              {paginated.map((item) =>
                type === 'services'
                  ? <ServiceCard key={item.id} service={item} />
                  : <ProductCard key={item.id} product={item} />
              )}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>

          {showServicesPanel && (
            <aside className="search-page__services-panel">
              <div className="search-page__panel-header">
                <h2 className="search-page__panel-title">
                  {searchPageConfig.relatedServicesTitle}
                </h2>
                <button
                  type="button"
                  className="search-page__panel-close"
                  onClick={() => setServicesPanelOpen(false)}
                  aria-label={searchPageConfig.closePanelAriaLabel}
                >
                  <Icon name={searchPageConfig.closePanelIcon || 'FaTimes'} />
                </button>
              </div>
              <div className="search-page__panel-list">
                {panelServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
