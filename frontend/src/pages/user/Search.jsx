import { useState, useMemo } from 'react';
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
import cardConfig from '../../json/icons.json';
import './Search.css';

const PAGE_SIZE = 6;

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'products';
  const [page, setPage] = useState(1);
  const loading = useSimulatedLoading(400);
  const { searchProducts } = useProducts();
  const { searchServices } = useServices();
  const { selectedLocation } = useLocation();

  const results = useMemo(() => {
    const locationId = selectedLocation?.id;
    if (type === 'services') return searchServices(query, null, locationId);
    return searchProducts(query, null, locationId);
  }, [type, query, searchProducts, searchServices, selectedLocation]);

  const totalPages = Math.ceil(results.length / PAGE_SIZE);
  const paginated = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <div className="search-page">
        <div className="search-page__grid">
          {Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} layout={type === 'services' ? 'vertical' : 'horizontal'} />)}
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
        <>
          <div className={`search-page__grid search-page__grid--${type}`}>
            {paginated.map((item) =>
              type === 'services'
                ? <ServiceCard key={item.id} service={item} />
                : <ProductCard key={item.id} product={item} />
            )}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
