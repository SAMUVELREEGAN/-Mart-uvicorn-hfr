import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import heroConfig from '../../json/hero.json';
import { useBrands } from '../../contexts/BrandContext';
import { useCategories } from '../../contexts/CategoryContext';
import { useProducts } from '../../contexts/ProductContext';
import { useServices } from '../../contexts/ServiceContext';
import { useLocation } from '../../contexts/LocationContext';
import { useSimulatedLoading } from '../../hooks/useHelpers';
import { Icon } from '../../utils/iconResolver';
import ExploreCategories from '../../components/layout/ExploreCategories';
import CategoryList from '../../components/layout/CategoryList';
import HomeSection from '../../components/layout/HomeSection';
import ProductCard from '../../components/cards/ProductCard';
import ServiceCard from '../../components/cards/ServiceCard';
import { BrandsSection } from '../../components/common/BrandCarousel';
import CardCarousel from '../../components/common/CardCarousel';
import AppPromo from '../../components/common/AppPromo';
import FAQAccordion from '../../components/common/FAQAccordion';
import Button from '../../components/common/Button';
import { SkeletonHero, SkeletonHighlightGrid, SkeletonCategoryList, SkeletonCard } from '../../components/skeleton/Skeleton';
import './Home.css';

function WhyChooseItem({ item }) {
  return (
    <div className="home-why-item">
      <div className="home-why-item__icon" style={{ color: item.color, background: `${item.color}12` }}>
        <Icon name={item.icon} />
      </div>
      <div>
        <h3 className="home-why-item__title">{item.title}</h3>
        <p className="home-why-item__desc">{item.description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const loading = useSimulatedLoading();
  const { highlightCategories, productCategories, serviceCategories } = useCategories();
  const { products } = useProducts();
  const { services } = useServices();
  const { selectedLocation } = useLocation();
  const sections = heroConfig.sections;
  const { getCarouselBrands } = useBrands();
  const carouselBrands = getCarouselBrands();

  const content = heroConfig.homeContent;

  const locationId = selectedLocation?.id;

  const featuredProducts = useMemo(
    () => (locationId ? products.filter((p) => p.locationId === locationId) : products).slice(0, 4),
    [products, locationId]
  );
  const trendingProducts = useMemo(
    () => [...(locationId ? products.filter((p) => p.locationId === locationId) : products)]
      .sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4),
    [products, locationId]
  );
  const recentProducts = useMemo(
    () => [...(locationId ? products.filter((p) => p.locationId === locationId) : products)].reverse().slice(0, 4),
    [products, locationId]
  );
  const popularServices = useMemo(
    () => (locationId ? services.filter((s) => s.locationId === locationId) : services).slice(0, 4),
    [services, locationId]
  );
  const recommendedServices = useMemo(
    () => [...(locationId ? services.filter((s) => s.locationId === locationId) : services)]
      .sort((a, b) => b.rating - a.rating).slice(0, 4),
    [services, locationId]
  );

  if (loading) {
    return (
      <div className="home">
        <SkeletonHighlightGrid />
        <SkeletonCategoryList />
        <div className="home__grid home__grid--products">
          {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
        </div>
        <SkeletonHero />
        <SkeletonCategoryList />
        <div className="home__grid home__grid--services">
          {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} layout="vertical" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <HomeSection band="default" fullWidth>
        <ExploreCategories
          categories={highlightCategories}
          title={sections.exploreCategories.title}
          subtitle={sections.exploreCategories.subtitle}
        />
      </HomeSection>

      <HomeSection
        title={sections.productCategories.title}
        subtitle={sections.productCategories.subtitle}
        viewAllPath="/search?type=products"
        band="subtle"
      >
        <CategoryList categories={productCategories} type="product" />
      </HomeSection>

      <HomeSection
        title={sections.trendingProducts.title}
        subtitle={sections.trendingProducts.subtitle}
        viewAllPath="/search?type=products"
      >
        <CardCarousel configKey="products" variant="products">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </CardCarousel>
      </HomeSection>

      <HomeSection
        title={sections.featuredProducts.title}
        subtitle={sections.featuredProducts.subtitle}
        viewAllPath="/search?type=products"
        band="tinted"
      >
        <CardCarousel configKey="products" variant="products">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </CardCarousel>
      </HomeSection>

      <section className="home__hero" style={{ backgroundImage: `url(${heroConfig.backgroundImage})` }}>
        <div className="home__hero-content">
          <h1 className="home__hero-title">{heroConfig.title}</h1>
          <p className="home__hero-subtitle">{heroConfig.subtitle}</p>
          <div className="home__hero-actions">
            <Link to={heroConfig.cta.primary.path}>
              <Button label={heroConfig.cta.primary.label} icon={heroConfig.cta.primary.icon} variant="primary" size="lg" />
            </Link>
            <Link to={heroConfig.cta.secondary.path}>
              <Button label={heroConfig.cta.secondary.label} icon={heroConfig.cta.secondary.icon} variant="outline" size="lg" />
            </Link>
          </div>
        </div>
      </section>

      <BrandsSection
        title={sections.brands.title}
        subtitle={sections.brands.subtitle}
        brands={carouselBrands}
        sectionConfig={content.brands.section}
      />

      <HomeSection
        title={sections.serviceCategories.title}
        subtitle={sections.serviceCategories.subtitle}
        viewAllPath="/search?type=services"
        band="subtle"
      >
        <CategoryList categories={serviceCategories} type="service" />
      </HomeSection>

      <HomeSection
        title={sections.popularServices.title}
        subtitle={sections.popularServices.subtitle}
        viewAllPath="/search?type=services"
      >
        <CardCarousel configKey="services" variant="services">
          {popularServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </CardCarousel>
      </HomeSection>

      <HomeSection title={sections.whyChooseUs.title} subtitle={sections.whyChooseUs.subtitle} band="tinted" fullWidth>
        <div className="home-why-grid">
          {content.whyChooseUs.items.map((item) => (
            <WhyChooseItem key={item.id} item={item} />
          ))}
        </div>
      </HomeSection>

      <HomeSection
        title={sections.recentProducts.title}
        subtitle={sections.recentProducts.subtitle}
        viewAllPath="/search?type=products"
      >
        <CardCarousel configKey="products" variant="products">
          {recentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </CardCarousel>
      </HomeSection>

      <HomeSection
        title={sections.recommendedServices.title}
        subtitle={sections.recommendedServices.subtitle}
        viewAllPath="/search?type=services"
        band="subtle"
      >
        <CardCarousel configKey="services" variant="services">
          {recommendedServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </CardCarousel>
      </HomeSection>

      <AppPromo content={content.appDeals} />

      <HomeSection title={sections.faq.title} subtitle={sections.faq.subtitle} band="tinted">
        <FAQAccordion items={content.faq.items} config={content.faq} />
      </HomeSection>

      <section className="home-newsletter">
        <div className="home-newsletter__inner">
          <h2 className="home-newsletter__title">{sections.newsletter.title}</h2>
          <p className="home-newsletter__subtitle">{sections.newsletter.subtitle}</p>
          <form className="home-newsletter__form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              className="home-newsletter__input"
              placeholder={content.newsletter.placeholder}
              aria-label="Email address"
            />
            <Button
              label={content.newsletter.button.label}
              icon={content.newsletter.button.icon}
              variant="primary"
              type="submit"
            />
          </form>
          <p className="home-newsletter__privacy">{content.newsletter.privacyNote}</p>
        </div>
      </section>
    </div>
  );
}
