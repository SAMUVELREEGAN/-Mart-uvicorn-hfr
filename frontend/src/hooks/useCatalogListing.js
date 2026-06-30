import { useMemo } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useServices } from '../contexts/ServiceContext';

function matchesPriceRange(price, range) {
  if (!range) return true;
  if (range === 'under50') return price < 50;
  if (range === '50to100') return price >= 50 && price <= 100;
  if (range === 'over100') return price > 100;
  return true;
}

function sortItems(items, sortKey, itemType) {
  const sorted = [...items];
  switch (sortKey) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'price-asc':
      return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    case 'price-desc':
      return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    case 'rating-desc':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    default:
      return sorted;
  }
}

export function useCatalogListing({
  itemType = 'product',
  query = '',
  categoryId = null,
  subcategoryId = null,
  sortKey = 'relevance',
  filters = {},
  locationId = null,
}) {
  const { searchProducts } = useProducts();
  const { searchServices } = useServices();

  const items = useMemo(() => {
    const searchFn = itemType === 'service' ? searchServices : searchProducts;
    let results = searchFn(query, categoryId, locationId);

    if (subcategoryId) {
      results = results.filter((item) => item.subcategory === subcategoryId);
    }

    if (filters.minRating) {
      const min = Number(filters.minRating);
      results = results.filter((item) => (item.rating || 0) >= min);
    }

    if (itemType === 'product' && filters.priceRange) {
      results = results.filter((item) => matchesPriceRange(item.price, filters.priceRange));
    }

    return sortItems(results, sortKey, itemType);
  }, [
    itemType,
    query,
    categoryId,
    subcategoryId,
    sortKey,
    filters,
    locationId,
    searchProducts,
    searchServices,
  ]);

  return { items };
}
