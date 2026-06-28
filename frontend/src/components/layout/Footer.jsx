import { Link } from 'react-router-dom';
import footerConfig from '../../json/footer.json';
import { Icon } from '../../utils/iconResolver';
import { useCategories } from '../../contexts/CategoryContext';
import './Footer.css';

export default function Footer() {
  const config = footerConfig;
  const { productCategories, serviceCategories } = useCategories();

  const dynamicMap = {
    productCategories,
    serviceCategories,
  };

  const renderColumn = (column) => {
    if (column.dynamic) {
      const items = dynamicMap[column.dynamic] || [];
      const links = items.slice(0, column.limit || items.length).map((cat) => ({
        label: cat.name || cat.title,
        path: `/category/${cat.id}?type=${column.dynamic === 'serviceCategories' ? 'service' : 'product'}`,
      }));
      return (
        <div key={column.id} className="footer__column">
          <h4 className="footer__column-title">{column.title}</h4>
          <ul className="footer__links">
            {links.map((link) => (
              <li key={link.path}>
                <Link to={link.path}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div key={column.id} className="footer__column">
        <h4 className="footer__column-title">{column.title}</h4>
        <ul className="footer__links">
          {column.links.map((link) => (
            <li key={link.path}>
              <Link to={link.path}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <div className="footer__logo">
            <Icon name={config.brand.icon} />
            <span>{config.brand.name}</span>
          </div>
          <p className="footer__tagline">{config.brand.tagline}</p>
          <p className="footer__description">{config.brand.description}</p>
          <div className="footer__social">
            <span className="footer__social-title">{config.social.title}</span>
            <div className="footer__social-links">
              {config.social.links.map((item) => (
                <a
                  key={item.icon}
                  href={item.url}
                  className="footer__social-link"
                  aria-label={item.label}
                >
                  <Icon name={item.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer__columns">
          {config.columns.map(renderColumn)}
        </div>
      </div>

      <div className="footer__bottom">
        <p>{config.copyright}</p>
      </div>
    </footer>
  );
}
