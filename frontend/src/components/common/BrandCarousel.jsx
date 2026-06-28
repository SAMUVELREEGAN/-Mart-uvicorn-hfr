import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import heroConfig from '../../json/hero.json';
import { useCarouselMode } from '../../hooks/useCarousel';
import './BrandCarousel.css';

export default function BrandCarousel({ brands, onBrandClick, sectionConfig = {} }) {
  const { config } = useCarouselMode('brands');
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const logoSize = sectionConfig.logoSize || config.logoSize || 88;
  const loopBrands = config.infinite ? [...brands, ...brands] : brands;
  const scrollDuration = Math.max(20, (brands.length * 8) / ((config.speed || 28) / 10));

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleClick = (brand) => {
    if (onBrandClick) onBrandClick(brand);
    else navigate(`/brand/${brand.id}`);
  };

  const useTouchScroll = isMobile && config.touchScroll;

  const renderCard = (brand, key) => (
    <button key={key} type="button" className="brand-carousel__card" onClick={() => handleClick(brand)}>
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
      <span className="brand-carousel__name">{brand.name}</span>
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
      {useTouchScroll ? (
        <div className="brand-carousel__scroll">
          {loopBrands.map((brand, i) => renderCard(brand, `${brand.id}-m-${i}`))}
        </div>
      ) : (
        <div className="brand-carousel__track-wrap">
          <div
            className={`brand-carousel__track ${paused ? 'brand-carousel__track--paused' : ''}`}
            style={{ '--scroll-duration': `${scrollDuration}s` }}
          >
            {loopBrands.map((brand, i) => renderCard(brand, `${brand.id}-${i}`))}
          </div>
        </div>
      )}
    </div>
  );
}

export function BrandsSection({ title, subtitle, brands, sectionConfig }) {
  const bg = sectionConfig?.background || heroConfig.homeContent.brands.section?.background;

  return (
    <section className="brands-section" style={{ background: bg }}>
      <div className="brands-section__inner">
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
