export default function AdminPageHeader({ title, subtitle, actions }) {
  return (
    <header className="adm-page-header">
      <div className="adm-page-header__text">
        <h1 className="adm-page-header__title">{title}</h1>
        {subtitle && <p className="adm-page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="adm-page-header__actions">{actions}</div>}
    </header>
  );
}
