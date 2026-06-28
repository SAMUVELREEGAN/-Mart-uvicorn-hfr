import { Link } from 'react-router-dom';
import heroConfig from '../../json/hero.json';
import { Icon } from '../../utils/iconResolver';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import Button from '../../components/common/Button';
import FAQAccordion from '../../components/common/FAQAccordion';
import './VendorLanding.css';

function Reveal({ sectionKey, children, className = '' }) {
  const enabled = heroConfig.vendorLanding.animations?.enabledSections?.includes(sectionKey);
  const { ref, visible } = useScrollReveal(0.08);
  return (
    <div ref={enabled ? ref : undefined} className={`${className} ${enabled ? 'vlp-reveal' : ''} ${visible ? 'vlp-reveal--in' : ''}`}>
      {children}
    </div>
  );
}

function SectionHead({ eyebrow, title, subtitle, light = false }) {
  return (
    <header className={`vlp-head ${light ? 'vlp-head--light' : ''}`}>
      {eyebrow && <span className="vlp-head__eyebrow">{eyebrow}</span>}
      <h2 className="vlp-head__title">{title}</h2>
      {subtitle && <p className="vlp-head__sub">{subtitle}</p>}
    </header>
  );
}

export default function VendorLanding() {
  const c = heroConfig.vendorLanding;
  const whyJoinItems = [...c.whySellWithUs.items, ...c.whyOfferServices.items];

  return (
    <div className="vlp">
      {/* Hero Banner */}
      <Reveal sectionKey="hero">
        <section className="vlp-hero">
          <div className="vlp-hero__wrap">
            <div className="vlp-hero__copy">
              <span className="vlp-hero__tag">MartPlace for Vendors</span>
              <h1 className="vlp-hero__title">{c.hero.title}</h1>
              <p className="vlp-hero__sub">{c.hero.subtitle}</p>
              <Link to={c.hero.cta.path} className="vlp-hero__btn">
                <Button label={c.hero.cta.label} icon={c.hero.cta.icon} variant="primary" size="lg" />
              </Link>
            </div>
            <div className="vlp-hero__media">
              <img src={c.hero.backgroundImage} alt="" className="vlp-hero__img" />
              <div className="vlp-hero__float" style={{ color: c.hero.floatBadge?.color }}>
                <Icon name={c.hero.floatBadge?.icon || 'FaChartLine'} />
                <span>{c.hero.floatBadge?.text}</span>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Business Growth Benefits */}
      <section className="vlp-band vlp-band--muted">
        <div className="vlp-container">
          <SectionHead title={c.businessGrowth.title} subtitle={c.businessGrowth.subtitle} eyebrow="Growth" />
          <div className="vlp-benefits">
            {c.businessGrowth.items.map((item) => (
              <article key={item.id} className="vlp-benefit" style={{ '--c': item.color }}>
                <div className="vlp-benefit__icon"><Icon name={item.icon} /></div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="vlp-band">
        <div className="vlp-container vlp-split">
          <div className="vlp-split__text">
            <SectionHead eyebrow="Why Join Us" title={c.whySellWithUs.title} subtitle={c.whySellWithUs.subtitle} />
            <ul className="vlp-checklist">
              {whyJoinItems.map((item) => (
                <li key={item.id}>
                  <span className="vlp-checklist__icon" style={{ color: item.color }}><Icon name={item.icon} /></span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="vlp-split__img">
            <img src={c.successStories.items[1]?.image} alt={c.successStories.items[1]?.name} />
          </div>
        </div>
      </section>

      {/* How It Works + Vendor Journey */}
      <section className="vlp-band vlp-band--dark">
        <div className="vlp-container">
          <SectionHead light title={c.howItWorks.title} subtitle={c.howItWorks.subtitle} eyebrow="Vendor Journey" />
          <Reveal sectionKey="journey">
            <div className="vlp-timeline">
              {c.howItWorks.steps.map((step, i) => (
                <div key={step.id} className="vlp-timeline__step">
                  <div className="vlp-timeline__dot">
                    <Icon name={step.icon} />
                    <span>{step.step}</span>
                  </div>
                  {i < c.howItWorks.steps.length - 1 && <div className="vlp-timeline__line" aria-hidden="true" />}
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section className="vlp-band">
        <div className="vlp-container">
          <SectionHead title={c.platformFeatures.title} subtitle={c.platformFeatures.subtitle} eyebrow="Features" />
          <Reveal sectionKey="features">
            <div className="vlp-features">
              {c.platformFeatures.items.map((item) => (
                <div key={item.id} className="vlp-feature" style={{ '--c': item.color }}>
                  <Icon name={item.icon} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Statistics */}
      <section className="vlp-band vlp-band--gradient">
        <div className="vlp-container">
          <SectionHead light title={c.statistics.title} subtitle={c.statistics.subtitle} />
          <Reveal sectionKey="statistics">
            <div className="vlp-stats">
              {c.statistics.items.map((item) => (
                <div key={item.id} className="vlp-stat">
                  <Icon name={item.icon} style={{ color: item.color }} />
                  <span className="vlp-stat__val">{item.value}</span>
                  <span className="vlp-stat__lbl">{item.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Success Stories */}
      <section className="vlp-band vlp-band--muted">
        <div className="vlp-container">
          <SectionHead title={c.successStories.title} subtitle={c.successStories.subtitle} eyebrow="Success Stories" />
          <div className="vlp-stories">
            {c.successStories.items.map((item) => (
              <article key={item.id} className="vlp-story">
                <img src={item.image} alt={item.name} />
                <span className="vlp-story__metric" style={{ color: item.color }}>{item.metric}</span>
                <blockquote>&ldquo;{item.story}&rdquo;</blockquote>
                <footer><strong>{item.name}</strong> · {item.role}</footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="vlp-band">
        <div className="vlp-container vlp-container--narrow">
          <SectionHead title={c.faq.title} subtitle={c.faq.subtitle} eyebrow="FAQ" />
          <Reveal sectionKey="faq">
            <FAQAccordion
              items={c.faq.items}
              config={c.faq}
            />
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <Reveal sectionKey="cta">
        <section className="vlp-cta">
          <div className="vlp-cta__inner">
            <h2>{c.cta.title}</h2>
            <p>{c.cta.subtitle}</p>
            <Link to={c.cta.button.path}>
              <Button label={c.cta.button.label} icon={c.cta.button.icon} variant="primary" size="lg" />
            </Link>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
