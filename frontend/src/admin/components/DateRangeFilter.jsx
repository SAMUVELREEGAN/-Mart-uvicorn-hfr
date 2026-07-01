const PRESETS = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: 'Last 7 Days' },
  { key: '30d', label: 'Last 30 Days' },
  { key: '90d', label: 'Last 90 Days' },
  { key: 'year', label: 'This Year' },
  { key: 'custom', label: 'Custom Range' },
];

export default function DateRangeFilter({ range, customFrom, customTo, onChange }) {
  return (
    <div className="adm-date-filter">
      <div className="adm-date-filter__presets">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            className={`adm-date-filter__btn ${range === p.key ? 'adm-date-filter__btn--active' : ''}`}
            onClick={() => onChange({ range: p.key })}
          >
            {p.label}
          </button>
        ))}
      </div>
      {range === 'custom' && (
        <div className="adm-date-filter__custom">
          <label>
            From
            <input
              type="date"
              className="adm-input"
              value={customFrom}
              onChange={(e) => onChange({ range: 'custom', from: e.target.value, to: customTo })}
            />
          </label>
          <label>
            To
            <input
              type="date"
              className="adm-input"
              value={customTo}
              onChange={(e) => onChange({ range: 'custom', from: customFrom, to: e.target.value })}
            />
          </label>
        </div>
      )}
    </div>
  );
}
