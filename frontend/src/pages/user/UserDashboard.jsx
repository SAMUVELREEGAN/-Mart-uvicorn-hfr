import { useNavigate } from 'react-router-dom';
import dashboardsConfig from '../../json/dashboards.json';
import { useAuth } from '../../contexts/AuthContext';
import DashboardSectionGrid from '../../components/common/DashboardSectionGrid';
import './UserDashboard.css';

export default function UserDashboard({ pageConfig }) {
  const config = pageConfig || dashboardsConfig.user;
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAction = (section) => {
    if (section.action === 'logout') {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="user-dashboard">
      <header className="user-dashboard__header">
        <h1 className="user-dashboard__title">{config.title}</h1>
        <p className="user-dashboard__subtitle">
          {config.subtitle}
          {user?.name ? ` — ${user.name}` : ''}
        </p>
      </header>
      <DashboardSectionGrid
        sections={config.sections}
        onAction={handleAction}
      />
    </div>
  );
}
