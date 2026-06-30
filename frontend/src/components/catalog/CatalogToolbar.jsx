import { Icon } from '../../utils/iconResolver';
import Search from '../common/Search';
import './CatalogToolbar.css';

export default function CatalogToolbar({
  config,
  query,
  onQueryChange,
  onFilterOpen,
  onSortOpen,
  activeFilterCount = 0,
}) {
  return (
    <div className="catalog-toolbar">
      <div className="catalog-toolbar__search">
        <Search
          placeholder={config.searchPlaceholder}
          icon={config.searchIcon}
          buttonIcon={config.searchButtonIcon}
          value={query}
          onChange={onQueryChange}
        />
      </div>
      <div className="catalog-toolbar__actions">
        <button
          type="button"
          className="catalog-toolbar__btn"
          onClick={onFilterOpen}
          aria-label={config.filterButton.label}
        >
          <Icon name={config.filterButton.icon} />
          <span className="catalog-toolbar__btn-label">{config.filterButton.label}</span>
          {activeFilterCount > 0 && (
            <span className="catalog-toolbar__badge">{activeFilterCount}</span>
          )}
        </button>
        <button
          type="button"
          className="catalog-toolbar__btn"
          onClick={onSortOpen}
          aria-label={config.sortButton.label}
        >
          <Icon name={config.sortButton.icon} />
          <span className="catalog-toolbar__btn-label">{config.sortButton.label}</span>
        </button>
      </div>
    </div>
  );
}
