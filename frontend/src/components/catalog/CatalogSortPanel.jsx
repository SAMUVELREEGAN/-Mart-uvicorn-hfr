import './CatalogFilterPanel.css';

export default function CatalogSortPanel({ options, value, onChange, onSelect }) {
  return (
    <div className="catalog-sort-panel" role="listbox">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="option"
          aria-selected={value === opt.value}
          className={`catalog-sort-panel__option ${value === opt.value ? 'catalog-sort-panel__option--active' : ''}`}
          onClick={() => {
            onChange(opt.value);
            onSelect?.();
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
