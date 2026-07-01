import { useCmsContent } from '../../contexts';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarouselMode } from '../../hooks/useCarousel';
import './BrandCarousel.css';

export default function BrandCarousel({ brands, onBrandClick, sectionConfig = {} }) {
  const brandsData = useCmsContent('brands');
  const { config } = useCarouselMode('brands');
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();

  const logoSize = sectionConfig.logoSize || brandsData.carousel?.logoSize || config.logoSize || 88;
  const showName = sectionConfig.showName ?? brandsData.carousel?.showName ?? false;
  const loopBrands = config.infinite ? [...brands, ...brands] : brands;
  const scrollDuration = config.duration
    || Math.max(28, (brands.length * 10) / ((config.speed || 24) / 12));

  const handleClick = (brand) => {
    if (onBrandClick) onBrandClick(brand);
    else navigate(`/brand/${brand.id}`);
  };

  const renderCard = (brand, key) => (
    <button
      key={key}
      type="button"
      className="brand-carousel__card brand-carousel__card--logo-only"
      onClick={() => handleClick(brand)}
      aria-label={brand.name}
    >
      <div className="brand-carousel__logo-wrap">
        <img
          src={brand.logo}
          alt={brand.name}
          className="brand-carousel__logo"
          style={{ width: logoSize, height: logoSize }}
          loading="lazy"
          draggable={false}
        />
      </div>
      {showName && <span className="brand-carousel__name">{brand.name}</span>}
    </button>
  );

  if (!config.carousel) {
    return (
      <div className="brand-carousel__grid">
        {brands.map((brand) => renderCard(brand, brand.id))}
      </div>
    );
  }

  return (
    <div
      className="brand-carousel"
      onMouseEnter={() => config.pauseOnHover && setPaused(true)}
      onMouseLeave={() => config.pauseOnHover && setPaused(false)}
    >
      <div className="brand-carousel__track-wrap">
        <div
          className={`brand-carousel__track ${paused ? 'brand-carousel__track--paused' : ''}`}
          style={{ '--scroll-duration': `${scrollDuration}s` }}
        >
          {loopBrands.map((brand, i) => renderCard(brand, `${brand.id}-${i}`))}
        </div>
      </div>
    </div>
  );
}

export function BrandsSection({ title, subtitle, brands, sectionConfig }) {
  const heroConfig = useCmsContent('hero');
  const bg = sectionConfig?.background || heroConfig.homeContent?.brands?.section?.background;

  return (
    <section className="brands-section">
      <div className="brands-section__inner" style={{ background: bg }}>
        <div className="brands-section__glow" aria-hidden="true" />
        {sectionConfig?.badge && (
          <span className="brands-section__badge">{sectionConfig.badge}</span>
        )}
        {title && <h2 className="brands-section__title">{title}</h2>}
        {subtitle && <p className="brands-section__subtitle">{subtitle}</p>}
        <BrandCarousel brands={brands} sectionConfig={sectionConfig} />
      </div>
    </section>
  );
}
