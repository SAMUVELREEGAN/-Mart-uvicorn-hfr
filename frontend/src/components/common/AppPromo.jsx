import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Icon } from '../../utils/iconResolver';
import Button from './Button';
import './AppPromo.css';

export default function AppPromo({ content }) {
  const { ref, visible } = useScrollReveal(0.15);
  const layout = content.layout || {};

  return (
    <section
      ref={ref}
      className={`app-promo ${visible ? 'app-promo--visible' : ''}`}
      style={{
        background: content.background,
        '--promo-accent': content.accentColor || '#60a5fa',
        '--promo-phone-width': layout.phoneWidth || '240px',
        '--promo-qr-size': layout.qrSize || '136px',
        '--promo-content-max': layout.contentMaxWidth || '520px',
      }}
    >
      <div className="app-promo__backdrop" aria-hidden="true">
        <div className="app-promo__mesh" />
        <div className="app-promo__glow" />
        <div className="app-promo__shine" />
      </div>

      <div className="app-promo__inner">
        <div className="app-promo__content">
          {content.badge && <span className="app-promo__badge">{content.badge}</span>}
          <h2 className="app-promo__title">{content.heading}</h2>
          <p className="app-promo__desc">{content.description}</p>
          {content.features?.length > 0 && (
            <ul className="app-promo__features">
              {content.features.map((feat) => (
                <li key={feat}>
                  <Icon name="FaCheckCircle" />
                  {feat}
                </li>
              ))}
            </ul>
          )}
          <Link to={content.button.path} className="app-promo__cta">
            <Button label={content.button.label} icon={content.button.icon} variant="primary" size="lg" />
          </Link>
        </div>

        <div className="app-promo__visual">
          <div className="app-promo__device-stack">
            {content.illustration && (
              <img src={content.illustration} alt="" className="app-promo__phone" />
            )}
            <div className="app-promo__qr-card">
              <img src={content.qrImage} alt="Download app QR code" className="app-promo__qr" />
              <span className="app-promo__qr-label">{content.qrLabel || 'Scan to download'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
