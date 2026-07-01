import { useCmsContent } from '../../contexts';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useBrands } from '../../contexts/BrandContext';
import { useProducts } from '../../contexts/ProductContext';
import { useServices } from '../../contexts/ServiceContext';
import { useSimulatedLoading } from '../../hooks/useHelpers';
import { Icon } from '../../utils/iconResolver';
import ProductCard from '../../components/cards/ProductCard';
import ServiceCard from '../../components/cards/ServiceCard';
import CardCarousel from '../../components/common/CardCarousel';
import BrandGallery from '../../components/common/BrandGallery';
import HomeSection from '../../components/layout/HomeSection';
import EmptyState from '../../components/common/EmptyState';
import { SkeletonCard } from '../../components/skeleton/Skeleton';
import './Brand.css';

export default function Brand() {
  const cardConfig = useCmsContent('icons');
  const { id } = useParams();
  const loading = useSimulatedLoading();
  const { getBrand, pageConfig } = useBrands();
  const { products } = useProducts();
  const { services } = useServices();
  const brand = getBrand(id);
  const labels = pageConfig.labels;
  const sectionTitles = pageConfig.sections;

  const brandProducts = useMemo(
    () => products.filter((p) => p.brandId === id),
    [products, id]
  );
  const brandServices = useMemo(
    () => services.filter((s) => s.brandId === id),
    [services, id]
  );

  if (loading) {
    return (
      <div className="brand-page">
        <CardCarousel configKey="products" variant="products">
          {Array.from({ length: 3 }, (_, i) => <SkeletonCard key={i} />)}
        </CardCarousel>
      </div>
    );
  }

  if (!brand) {
    return <EmptyState config={cardConfig.errorState.notFound} />;
  }

  const socialEntries = Object.entries(brand.socialMedia || {}).filter(([, url]) => url);

  return (
    <div className="brand-page">
      <section className="brand-page__cover" style={{ backgroundImage: `url(${brand.coverBanner})` }}>
        <div className="brand-page__cover-overlay" />
        <div className="brand-page__cover-content">
          <img src={brand.logo} alt={brand.name} className="brand-page__logo" />
          <div>
            <h1 className="brand-page__title">{brand.name}</h1>
            <p className="brand-page__desc">{brand.description}</p>
          </div>
        </div>
      </section>

      <div className="brand-page__body">
        <HomeSection title={sectionTitles.gallery.title} subtitle={sectionTitles.gallery.subtitle}>
          <BrandGallery brand={brand} labels={labels} />
        </HomeSection>

        <HomeSection title={sectionTitles.products.title} subtitle={sectionTitles.products.subtitle}>
          {brandProducts.length === 0 ? (
            <EmptyState config={cardConfig.emptyState.products} />
          ) : (
            <CardCarousel configKey="products" variant="products">
              {brandProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </CardCarousel>
          )}
        </HomeSection>

        <HomeSection title={sectionTitles.services.title} subtitle={sectionTitles.services.subtitle} band="subtle">
          {brandServices.length === 0 ? (
            <EmptyState config={cardConfig.emptyState.services} />
          ) : (
            <CardCarousel configKey="services" variant="services">
              {brandServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </CardCarousel>
          )}
        </HomeSection>

        <HomeSection title={sectionTitles.about.title} subtitle={sectionTitles.about.subtitle}>
          <div className="brand-page__about">
            {brand.overview && (
              <div className="brand-page__about-block">
                <h3>{labels.overview}</h3>
                <p>{brand.overview}</p>
              </div>
            )}
            <div className="brand-page__contact-grid">
              {brand.website && (
                <a href={brand.website} target="_blank" rel="noopener noreferrer" className="brand-page__contact-item">
                  <Icon name="FaGlobe" />
                  <span>{labels.website}</span>
                  <strong>{brand.website.replace(/^https?:\/\//, '')}</strong>
                </a>
              )}
              {brand.contact?.phone && (
                <div className="brand-page__contact-item">
                  <Icon name="FaPhone" />
                  <span>{labels.phone}</span>
                  <strong>{brand.contact.phone}</strong>
                </div>
              )}
              {brand.contact?.email && (
                <a href={`mailto:${brand.contact.email}`} className="brand-page__contact-item">
                  <Icon name="FaEnvelope" />
                  <span>{labels.email}</span>
                  <strong>{brand.contact.email}</strong>
                </a>
              )}
              {brand.contact?.address && (
                <div className="brand-page__contact-item">
                  <Icon name="FaMapMarkerAlt" />
                  <span>{labels.address}</span>
                  <strong>{brand.contact.address}</strong>
                </div>
              )}
            </div>
            {socialEntries.length > 0 && (
              <div className="brand-page__social">
                <h4>{labels.socialMedia}</h4>
                <div className="brand-page__social-links">
                  {socialEntries.map(([key, url]) => (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer">
                      <Icon name={`Fa${key.charAt(0).toUpperCase()}${key.slice(1)}`} />
                      {key}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {brand.additionalDetails && (
              <div className="brand-page__about-block">
                <h3>{labels.additionalDetails}</h3>
                <p>{brand.additionalDetails}</p>
              </div>
            )}
          </div>
        </HomeSection>

        {brand.termsAndConditions && (
          <HomeSection title={sectionTitles.terms.title} subtitle={sectionTitles.terms.subtitle} band="tinted">
            <div className="brand-page__terms">
              <p>{brand.termsAndConditions}</p>
            </div>
          </HomeSection>
        )}
      </div>
    </div>
  );
}
