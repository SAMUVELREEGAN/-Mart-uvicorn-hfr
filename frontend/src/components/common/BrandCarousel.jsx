import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import heroConfig from '../../json/hero.json';
import brandsData from '../../json/brands.json';
import { useCarouselMode } from '../../hooks/useCarousel';
import './BrandCarousel.css';

export default function BrandCarousel({ brands, onBrandClick, sectionConfig = {} }) {
  const { config } = useCarouselMode('brands');
  const scrollRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const isTouchingRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const navigate = useNavigate();

  const logoSize = sectionConfig.logoSize || brandsData.carousel?.logoSize || config.logoSize || 88;
  const showName = sectionConfig.showName ?? brandsData.carousel?.showName ?? false;
  const loopBrands = config.infinite ? [...brands, ...brands] : brands;
  const pixelsPerSecond = config.speed || 28;
  const useAutoScroll = config.carousel && config.autoScroll && !prefersReducedMotion;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const normalizeScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !config.infinite) return;
    const half = el.scrollWidth / 2;
    if (half <= 0) return;
    if (el.scrollLeft >= half) el.scrollLeft -= half;
    if (el.scrollLeft < 0) el.scrollLeft += half;
  }, [config.infinite]);

  const tick = useCallback((now) => {
    const el = scrollRef.current;
    if (el && useAutoScroll && !paused && !isTouchingRef.current) {
      const delta = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;
      el.scrollLeft += pixelsPerSecond * delta;
      normalizeScroll();
    } else {
      lastTimeRef.current = now;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [useAutoScroll, paused, pixelsPerSecond, normalizeScroll]);

  useEffect(() => {
    if (!useAutoScroll) return undefined;
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [useAutoScroll, tick]);

  const handleTouchStart = () => {
    isTouchingRef.current = true;
  };

  const handleTouchEnd = () => {
    isTouchingRef.current = false;
    normalizeScroll();
  };

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

  if (useAutoScroll) {
    return (
      <div
        className="brand-carousel brand-carousel--marquee"
        onMouseEnter={() => config.pauseOnHover && setPaused(true)}
        onMouseLeave={() => config.pauseOnHover && setPaused(false)}
      >
        <div
          ref={scrollRef}
          className="brand-carousel__scroll brand-carousel__scroll--marquee"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {loopBrands.map((brand, i) => renderCard(brand, `${brand.id}-${i}`))}
        </div>
      </div>
    );
  }

  const scrollDuration = Math.max(20, (brands.length * 8) / (pixelsPerSecond / 10));

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
  const bg = sectionConfig?.background || heroConfig.homeContent.brands.section?.background;

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
