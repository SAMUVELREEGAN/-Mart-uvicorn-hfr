import { createContext, useContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useHelpers';
import { generateId, getAverageRating } from '../utils/helpers';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductContext';
import { useServices } from './ServiceContext';

const ReviewContext = createContext(null);

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useLocalStorage('mart_reviews', []);
  const { user } = useAuth();
  const { products, updateProduct } = useProducts();
  const { services, updateService } = useServices();

  const getReviewsForTarget = useCallback((targetId, targetType) => {
    return reviews.filter((r) => r.targetId === targetId && r.targetType === targetType);
  }, [reviews]);

  const addReview = useCallback((targetId, targetType, data) => {
    const review = {
      id: generateId('rev'),
      targetId,
      targetType,
      userId: user?.id || 'anonymous',
      userName: user?.name || 'Anonymous',
      rating: Number(data.rating),
      comment: data.comment,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => {
      const updated = [...prev, review];
      const targetReviews = updated.filter((r) => r.targetId === targetId && r.targetType === targetType);
      const avg = getAverageRating(targetReviews);
      if (targetType === 'product') {
        updateProduct(targetId, { rating: avg, reviewCount: targetReviews.length });
      } else {
        updateService(targetId, { rating: avg, reviewCount: targetReviews.length });
      }
      return updated;
    });
    return review;
  }, [user, setReviews, updateProduct, updateService]);

  const getVendorReviews = useCallback((vendorId) => {
    const vendorProductIds = products.filter((p) => p.vendorId === vendorId).map((p) => p.id);
    const vendorServiceIds = services.filter((s) => s.vendorId === vendorId).map((s) => s.id);
    return reviews.filter(
      (r) => (r.targetType === 'product' && vendorProductIds.includes(r.targetId))
        || (r.targetType === 'service' && vendorServiceIds.includes(r.targetId))
    );
  }, [reviews, products, services]);

  const value = useMemo(() => ({
    reviews, getReviewsForTarget, addReview, getVendorReviews,
  }), [reviews, getReviewsForTarget, addReview, getVendorReviews]);

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>;
}

export function useReviews() {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error('useReviews must be used within ReviewProvider');
  return ctx;
}
