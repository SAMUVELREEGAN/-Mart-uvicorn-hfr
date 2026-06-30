import { useNavigate } from 'react-router-dom';
import { Icon } from '../../utils/iconResolver';
import Card from './Card';
import './DashboardSectionGrid.css';

export default function DashboardSectionGrid({ sections, onAction, infoResolver }) {
  const navigate = useNavigate();

  const handleClick = (section) => {
    if (section.action && onAction) {
      onAction(section);
      return;
    }
    if (section.path) navigate(section.path);
  };

  return (
    <div className="dashboard-grid">
      {sections.map((section) => (
        <Card
          key={section.id}
          hoverable
          className={`dashboard-grid__card ${section.action === 'logout' ? 'dashboard-grid__card--danger' : ''}`}
          onClick={() => handleClick(section)}
        >
          <div
            className="dashboard-grid__icon"
            style={{ '--section-color': section.color || 'var(--color-primary)' }}
          >
            <Icon name={section.icon} />
          </div>
          <div className="dashboard-grid__body">
            <h3 className="dashboard-grid__title">{section.title}</h3>
            <p className="dashboard-grid__desc">{section.description}</p>
            {section.infoKey && infoResolver && (
              <span className="dashboard-grid__meta">{infoResolver(section.infoKey)}</span>
            )}
          </div>
          <Icon name="FaChevronRight" className="dashboard-grid__arrow" />
        </Card>
      ))}
    </div>
  );
}
