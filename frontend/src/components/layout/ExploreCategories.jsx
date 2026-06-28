import { useState } from 'react';
import { useCarouselMode } from '../../hooks/useCarousel';
import categoriesData from '../../json/categories.json';
import HighlightCard from '../cards/HighlightCard';
import './ExploreCategories.css';

export default function ExploreCategories({ categories, title, subtitle }) {
  const { isCarousel, config } = useCarouselMode('highlights');
  const displayCategories = categories.slice(0, 6);
  const exploreLayout = categoriesData.exploreCategories || {};
  const [activeId, setActiveId] = useState(
    exploreLayout.defaultExpandedFirst !== false ? displayCategories[0]?.id : null
  );

  const transitionMs = exploreLayout.transitionMs || 450;
  const expandedFlex = exploreLayout.expandedFlex || 2.2;
  const collapsedFlex = exploreLayout.collapsedFlex || 0.85;
  const isDesktopExpand = !isCarousel;

  return (
    <section
      className="explore-categories-section"
      style={{
        '--explore-desktop-height': `${exploreLayout.desktopHeight || 360}px`,
        '--explore-mobile-height': `${exploreLayout.mobileHeight || 200}px`,
        '--explore-transition': `${transitionMs}ms`,
        '--explore-expanded-flex': expandedFlex,
        '--explore-collapsed-flex': collapsedFlex,
      }}
    >
      {title && <h2 className="explore-categories-section__title">{title}</h2>}
      {subtitle && <p className="explore-categories-section__subtitle">{subtitle}</p>}
      <div
        className={`explore-categories ${isCarousel ? 'explore-categories--scroll' : 'explore-categories--expand'} ${config.mobileReducedSize ? 'explore-categories--compact' : ''}`}
      >
        {displayCategories.map((cat) => (
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
    </section>
  );
}
