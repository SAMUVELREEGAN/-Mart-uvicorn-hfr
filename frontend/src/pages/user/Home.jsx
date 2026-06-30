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
import ConsultantCard from '../../components/cards/ConsultantCard';
import { BrandsSection } from '../../components/common/BrandCarousel';
import CardCarousel from '../../components/common/CardCarousel';
import LocationMap from '../../components/common/LocationMap';
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

function filterByLocation(items, locationId) {
  return locationId ? items.filter((item) => item.locationId === locationId) : items;
}

export default function Home() {
  const loading = useSimulatedLoading();
  const { highlightCategories, productCategories, serviceCategories } = useCategories();
  const { products } = useProducts();
  const { services } = useServices();
  const { selectedLocation } = useLocation();
  const sections = heroConfig.sections;
  const layout = heroConfig.homeLayout;
  const { getCarouselBrands } = useBrands();
  const carouselBrands = getCarouselBrands();
  const content = heroConfig.homeContent;
  const locationId = selectedLocation?.id;

  const recentProducts = useMemo(
    () => filterByLocation(products, locationId).slice(0, 4),
    [products, locationId]
  );
  const latestProducts = useMemo(
    () => [...filterByLocation(products, locationId)]
      .sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4),
    [products, locationId]
  );
  const recentlyAddedProducts = useMemo(
    () => [...filterByLocation(products, locationId)].reverse().slice(0, 4),
    [products, locationId]
  );
  const nearServices = useMemo(
    () => filterByLocation(services, locationId).slice(0, 4),
    [services, locationId]
  );
  const recentServices = useMemo(
    () => [...filterByLocation(services, locationId)].reverse().slice(0, 4),
    [services, locationId]
  );
  const popularServices = useMemo(
    () => [...filterByLocation(services, locationId)]
      .sort((a, b) => b.rating - a.rating).slice(0, 4),
    [services, locationId]
  );
  const recommendedServices = useMemo(
    () => [...filterByLocation(services, locationId)]
      .sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4),
    [services, locationId]
  );
  const consultants = useMemo(() => {
    const items = content.realEstateConsultants?.items || [];
    return locationId ? items.filter((c) => c.locationId === locationId) : items;
  }, [content.realEstateConsultants, locationId]);

  const sectionConfig = (key) => layout.sectionConfig?.[key] || {};

  const renderSection = (key) => {
    const meta = sections[key];
    const cfg = sectionConfig(key);
    if (!meta) return null;

    switch (key) {
      case 'exploreCategories':
        return (
          <HomeSection key={key} band={cfg.band} fullWidth={cfg.fullWidth}>
            <ExploreCategories
              categories={highlightCategories}
              title={meta.title}
              subtitle={meta.subtitle}
            />
          </HomeSection>
        );
      case 'productCategories':
        return (
          <HomeSection key={key} title={meta.title} subtitle={meta.subtitle} viewAllPath={cfg.viewAll} band={cfg.band}>
            <CategoryList categories={productCategories} type="product" />
          </HomeSection>
        );
      case 'recentProducts':
        return (
          <HomeSection key={key} title={meta.title} subtitle={meta.subtitle} viewAllPath={cfg.viewAll} band={cfg.band}>
            <CardCarousel configKey="products" variant="products">
              {recentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </CardCarousel>
          </HomeSection>
        );
      case 'latestProducts':
        return (
          <HomeSection key={key} title={meta.title} subtitle={meta.subtitle} viewAllPath={cfg.viewAll} band={cfg.band}>
            <CardCarousel configKey="products" variant="products">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </CardCarousel>
          </HomeSection>
        );
      case 'hero':
        return (
          <HomeSection key={key} band={cfg.band} fullWidth={cfg.fullWidth}>
            <section className="home__hero-block">
              <div className="home__hero-copy">
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
              <LocationMap />
            </section>
          </HomeSection>
        );
      case 'brands':
        return (
          <div key={key} className="home__brands-wrap">
            <BrandsSection
              title={meta.title}
              subtitle={meta.subtitle}
              brands={carouselBrands}
              sectionConfig={{ ...content.brands.section, showName: false }}
            />
          </div>
        );
      case 'realEstateConsultants':
        return (
          <HomeSection key={key} title={meta.title} subtitle={meta.subtitle} viewAllPath={cfg.viewAll} band={cfg.band}>
            <CardCarousel configKey="consultants" variant="consultants">
              {consultants.map((consultant) => (
                <ConsultantCard key={consultant.id} consultant={consultant} />
              ))}
            </CardCarousel>
          </HomeSection>
        );
      case 'serviceCategories':
        return (
          <HomeSection key={key} title={meta.title} subtitle={meta.subtitle} viewAllPath={cfg.viewAll} band={cfg.band}>
            <CategoryList categories={serviceCategories} type="service" />
          </HomeSection>
        );
      case 'nearServices':
        return (
          <HomeSection key={key} title={meta.title} subtitle={meta.subtitle} viewAllPath={cfg.viewAll} band={cfg.band}>
            <CardCarousel configKey="services" variant="services">
              {nearServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </CardCarousel>
          </HomeSection>
        );
      case 'recentServices':
        return (
          <HomeSection key={key} title={meta.title} subtitle={meta.subtitle} viewAllPath={cfg.viewAll} band={cfg.band}>
            <CardCarousel configKey="services" variant="services">
              {recentServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </CardCarousel>
          </HomeSection>
        );
      case 'popularServices':
        return (
          <HomeSection key={key} title={meta.title} subtitle={meta.subtitle} viewAllPath={cfg.viewAll} band={cfg.band}>
            <CardCarousel configKey="services" variant="services">
              {popularServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </CardCarousel>
          </HomeSection>
        );
      case 'whyChooseUs':
        return (
          <HomeSection key={key} title={meta.title} subtitle={meta.subtitle} band={cfg.band} fullWidth={cfg.fullWidth}>
            <div className="home-why-grid">
              {content.whyChooseUs.items.map((item) => (
                <WhyChooseItem key={item.id} item={item} />
              ))}
            </div>
          </HomeSection>
        );
      case 'recentlyAddedProducts':
        return (
          <HomeSection key={key} title={meta.title} subtitle={meta.subtitle} viewAllPath={cfg.viewAll} band={cfg.band}>
            <CardCarousel configKey="products" variant="products">
              {recentlyAddedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </CardCarousel>
          </HomeSection>
        );
      case 'recommendedServices':
        return (
          <HomeSection key={key} title={meta.title} subtitle={meta.subtitle} viewAllPath={cfg.viewAll} band={cfg.band}>
            <CardCarousel configKey="services" variant="services">
              {recommendedServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </CardCarousel>
          </HomeSection>
        );
      case 'appDeals':
        return <AppPromo key={key} content={content.appDeals} />;
      case 'faq':
        return (
          <HomeSection key={key} title={meta.title} subtitle={meta.subtitle} band={cfg.band} fullWidth={cfg.fullWidth}>
            <FAQAccordion items={content.faq.items} config={content.faq} />
          </HomeSection>
        );
      default:
        return null;
    }
  };

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
      {layout.sectionOrder.map((key) => renderSection(key))}
    </div>
  );
}
