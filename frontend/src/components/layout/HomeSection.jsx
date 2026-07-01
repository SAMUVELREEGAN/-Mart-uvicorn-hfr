import { useCmsContent } from '../../contexts';
import { Link } from 'react-router-dom';
import { Icon } from '../../utils/iconResolver';
import './HomeSection.css';

export default function HomeSection({
  title,
  subtitle,
  viewAllPath,
  children,
  className = '',
  band = 'default',
  fullWidth = false,
  id,
}) {
  const heroConfig = useCmsContent('hero');
  const buttonsConfig = useCmsContent('buttons');
  const bandConfig = heroConfig.homeLayout?.bands?.[band] || {};

  return (
    <section
      id={id}
      className={`home-section home-section--${band} ${fullWidth ? 'home-section--full' : ''} ${className}`.trim()}
      style={bandConfig.background && band !== 'default' ? { '--band-bg': bandConfig.background } : undefined}
    >
      <div className="home-section__inner">
        {(title || subtitle || viewAllPath) && (
          <div className="home-section__header">
            <div className="home-section__titles">
              {title && <h2 className="home-section__title">{title}</h2>}
              {subtitle && <p className="home-section__subtitle">{subtitle}</p>}
            </div>
            {viewAllPath && (
              <Link to={viewAllPath} className="home-section__view-all">
                <span className="home-section__view-all-text">{buttonsConfig.viewAll.label}</span>
                <Icon name={buttonsConfig.viewAll.icon} />
              </Link>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
