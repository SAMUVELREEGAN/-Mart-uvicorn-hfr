import './Tabs.css';

export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="tabs">
      <div className="tabs__list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`tabs__tab ${activeTab === tab.key ? 'tabs__tab--active' : ''}`}
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs__panel">
        {tabs.find((t) => t.key === activeTab)?.content}
      </div>
    </div>
  );
}
