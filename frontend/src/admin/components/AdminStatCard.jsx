import { Link } from 'react-router-dom';

export default function AdminStatCard({ label, value, icon: Icon, path, accent, trend }) {
  const content = (
    <>
      <div className="adm-stat__top">
        {Icon && <span className="adm-stat__icon" style={{ background: `${accent}18`, color: accent }}><Icon /></span>}
        {trend != null && <span className={`adm-stat__trend ${trend >= 0 ? 'adm-stat__trend--up' : 'adm-stat__trend--down'}`}>{trend >= 0 ? '+' : ''}{trend}</span>}
      </div>
      <span className="adm-stat__label">{label}</span>
      <strong className="adm-stat__value">{value ?? '—'}</strong>
    </>
  );

  if (path) {
    return <Link to={path} className="adm-stat adm-stat--link" style={{ '--accent': accent }}>{content}</Link>;
  }
  return <div className="adm-stat" style={{ '--accent': accent }}>{content}</div>;
}
