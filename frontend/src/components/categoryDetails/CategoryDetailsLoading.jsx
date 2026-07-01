import { SkeletonCard, SkeletonCategoryList } from '../skeleton/Skeleton';

export default function CategoryDetailsLoading({ isService = false }) {
  return (
    <div className="category-page">
      <div className="category-page__banner-skeleton" />
      <SkeletonCategoryList />
      <div className="category-page__grid">
        {Array.from({ length: 4 }, (_, i) => (
          <SkeletonCard key={i} layout={isService ? 'vertical' : 'horizontal'} />
        ))}
      </div>
    </div>
  );
}
