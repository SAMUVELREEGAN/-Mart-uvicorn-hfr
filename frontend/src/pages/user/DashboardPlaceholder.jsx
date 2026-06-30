import { Link } from 'react-router-dom';
import dashboardsConfig from '../../json/dashboards.json';
import Button from '../../components/common/Button';
import './UserDashboard.css';

export default function DashboardPlaceholder({ sectionId }) {
  const section = dashboardsConfig.user.sections.find((s) => s.id === sectionId);
  const config = dashboardsConfig.user;

  return (
    <div className="user-dashboard">
      <header className="user-dashboard__header">
        <h1 className="user-dashboard__title">{section?.title || 'Dashboard'}</h1>
        <p className="user-dashboard__subtitle">{section?.description || config.subtitle}</p>
      </header>
      <div className="page-placeholder">
        <p>This section will display your {section?.title?.toLowerCase() || 'content'} soon.</p>
        <Link to={config.routes.home}>
          <Button label="Back to Dashboard" icon="FaArrowLeft" variant="outline" />
        </Link>
      </div>
    </div>
  );
}
