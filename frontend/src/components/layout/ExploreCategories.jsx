import { useCmsContent } from '../../contexts';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useCarouselMode } from '../../hooks/useCarousel';
import { Icon } from '../../utils/iconResolver';
import HighlightCard from '../cards/HighlightCard';
import './ExploreCategories.css';

export default function ExploreCategories({ categories, title, subtitle }) {
  const categoriesData = useCmsContent('categories');
  const { isCarousel, config } = useCarouselMode('highlights');
  const exploreLayout = categoriesData.exploreCategories || {};
  const navConfig = exploreLayout.navigation || {};
  const maxHighlights = exploreLayout.maxHighlights;
  const displayCategories = maxHighlights
    ? categories.slice(0, maxHighlights)
    : categories;

  const [activeId, setActiveId] = useState(
    exploreLayout.defaultExpandedFirst !== false ? displayCategories[0]?.id : null
  );
  const [pageIndex, setPageIndex] = useState(0);
  const [viewport, setViewport] = useState('desktop');

  const transitionMs = exploreLayout.transitionMs || 450;
  const expandedFlex = exploreLayout.expandedFlex || 2.2;
  const collapsedFlex = exploreLayout.collapsedFlex || 0.85;
  const isDesktopExpand = !isCarousel && viewport !== 'mobile';

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      if (width <= 768) setViewport('mobile');
      else if (width <= 992) setViewport('tablet');
      else setViewport('desktop');
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const visibleCount = useMemo(() => {
    const counts = exploreLayout.visibleCount || {};
    if (viewport === 'mobile') return displayCategories.length;
    if (viewport === 'tablet') return counts.tablet ?? 2;
    return counts.desktop ?? 4;
  }, [viewport, displayCategories.length, exploreLayout.visibleCount]);

  const maxPage = Math.max(0, Math.ceil(displayCategories.length / visibleCount) - 1);
  const showNav = viewport !== 'mobile' && displayCategories.length > visibleCount;

  const visibleCategories = useMemo(() => {
    if (viewport === 'mobile') return displayCategories;
    const start = pageIndex * visibleCount;
    return displayCategories.slice(start, start + visibleCount);
  }, [viewport, pageIndex, visibleCount, displayCategories]);

  useEffect(() => {
    if (pageIndex > maxPage) setPageIndex(maxPage);
  }, [pageIndex, maxPage]);

  useEffect(() => {
    if (!visibleCategories.some((cat) => cat.id === activeId)) {
      setActiveId(visibleCategories[0]?.id ?? null);
    }
  }, [visibleCategories, activeId]);

  const goToPage = useCallback((nextPage) => {
    const clamped = Math.max(0, Math.min(nextPage, maxPage));
    setPageIndex(clamped);
    const start = clamped * visibleCount;
    setActiveId(displayCategories[start]?.id ?? null);
  }, [maxPage, visibleCount, displayCategories]);

  const goPrev = () => goToPage(pageIndex - 1);
  const goNext = () => goToPage(pageIndex + 1);

  return (
    <section
      className="explore-categories-section"
      style={{
        '--explore-desktop-height': `${exploreLayout.desktopHeight || 360}px`,
        '--explore-mobile-height': `${exploreLayout.mobileHeight || 200}px`,
        '--explore-transition': `${transitionMs}ms`,
        '--explore-expanded-flex': expandedFlex,
        '--explore-collapsed-flex': collapsedFlex,
        '--explore-visible-count': visibleCount,
        '--explore-mobile-gap': exploreLayout.mobileCardGap || '2rem',
        '--explore-mobile-card-width': exploreLayout.mobileCardWidth || '172px',
        '--explore-mobile-gutter': exploreLayout.mobileScrollGutter || '1.5rem',
      }}
    >
      {title && <h2 className="explore-categories-section__title">{title}</h2>}
      {subtitle && <p className="explore-categories-section__subtitle">{subtitle}</p>}

      <div className="explore-categories-section__carousel">
        <div className="explore-categories-section__track">
          <div
            key={viewport === 'mobile' ? 'mobile' : `page-${pageIndex}`}
            className={[
              'explore-categories',
              viewport === 'mobile' ? 'explore-categories--scroll' : 'explore-categories--expand',
              viewport !== 'mobile' ? 'explore-categories--paginated' : '',
              config.mobileReducedSize ? 'explore-categories--compact' : '',
            ].filter(Boolean).join(' ')}
          >
            {visibleCategories.map((cat) => (
              <div
                key={cat.id}
                className={`explore-categories__item ${isDesktopExpand && activeId === cat.id ? 'explore-categories__item--active' : ''}`}
                onMouseEnter={() => isDesktopExpand && setActiveId(cat.id)}
              >
                <HighlightCard
                  category={cat}
                  isActive={isDesktopExpand && activeId === cat.id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {showNav && (
        <div className="explore-categories-section__nav-row">
          <button
            type="button"
            className="explore-categories__nav explore-categories__nav--prev"
            onClick={goPrev}
            disabled={pageIndex === 0}
            aria-label={navConfig.prevLabel || 'Previous categories'}
          >
            <Icon name={navConfig.prevIcon || 'FaChevronLeft'} />
          </button>

          <div className="explore-categories-section__dots" role="tablist" aria-label="Category pages">
            {Array.from({ length: maxPage + 1 }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === pageIndex}
                className={`explore-categories-section__dot ${i === pageIndex ? 'explore-categories-section__dot--active' : ''}`}
                onClick={() => goToPage(i)}
                aria-label={`${navConfig.dotLabel || 'Category group'} ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            className="explore-categories__nav explore-categories__nav--next"
            onClick={goNext}
            disabled={pageIndex >= maxPage}
            aria-label={navConfig.nextLabel || 'Next categories'}
          >
            <Icon name={navConfig.nextIcon || 'FaChevronRight'} />
          </button>
        </div>
      )}
    </section>
  );
}
