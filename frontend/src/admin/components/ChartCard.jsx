import AdminCard from './AdminCard';

export default function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <AdminCard className={`adm-chart-card ${className}`.trim()}>
      <div className="adm-chart-card__header">
        <h3 className="adm-chart-card__title">{title}</h3>
        {subtitle && <p className="adm-chart-card__subtitle">{subtitle}</p>}
      </div>
      <div className="adm-chart-card__body">{children}</div>
    </AdminCard>
  );
}
