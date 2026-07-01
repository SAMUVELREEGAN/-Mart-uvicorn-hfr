export default function AdminMultiSelect({ id, options, value = [], onChange, placeholder = 'Select...' }) {
  const selected = Array.isArray(value) ? value : [];

  const toggle = (slug) => {
    if (selected.includes(slug)) {
      onChange(selected.filter((s) => s !== slug));
    } else {
      onChange([...selected, slug]);
    }
  };

  return (
    <div className="adm-multiselect" id={id}>
      <div className="adm-multiselect__chips">
        {selected.length === 0 ? (
          <span className="adm-multiselect__placeholder">{placeholder}</span>
        ) : selected.map((slug) => {
          const opt = options.find((o) => o.value === slug);
          return (
            <button key={slug} type="button" className="adm-multiselect__chip" onClick={() => toggle(slug)}>
              {opt?.label || slug} ×
            </button>
          );
        })}
      </div>
      <div className="adm-multiselect__options">
        {options.length === 0 ? (
          <span className="adm-multiselect__empty">No options available</span>
        ) : options.map((opt) => (
          <label key={opt.value} className="adm-multiselect__option">
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={() => toggle(opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
