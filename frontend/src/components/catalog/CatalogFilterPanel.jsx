import Select from '../common/Select';
import Button from '../common/Button';
import './CatalogFilterPanel.css';

export default function CatalogFilterPanel({
  config,
  itemType,
  filters,
  onChange,
  onApply,
  onClear,
}) {
  const panel = config.filterPanel;

  return (
    <div className="catalog-filter-panel">
      <Select
        label={panel.ratingLabel}
        name="minRating"
        value={filters.minRating || ''}
        onChange={(e) => onChange({ ...filters, minRating: e.target.value })}
        options={panel.ratingOptions}
      />

      {itemType === 'product' && panel.priceOptions && (
        <Select
          label={panel.priceLabel}
          name="priceRange"
          value={filters.priceRange || ''}
          onChange={(e) => onChange({ ...filters, priceRange: e.target.value })}
          options={panel.priceOptions}
        />
      )}

      <div className="catalog-filter-panel__actions">
        <Button
          label={panel.clearLabel}
          variant="outline"
          onClick={onClear}
        />
        <Button
          label={panel.applyLabel}
          variant="primary"
          onClick={onApply}
        />
      </div>
    </div>
  );
}
