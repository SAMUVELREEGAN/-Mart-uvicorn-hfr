import { useState } from 'react';
import { Icon } from '../../utils/iconResolver';
import './Search.css';

export default function Search({ placeholder, icon = 'FaSearch', buttonIcon, onSearch, defaultValue = '' }) {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form className="search" onSubmit={handleSubmit}>
      <Icon name={icon} className="search__icon" />
      <input
        type="text"
        className="search__input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="search__btn" aria-label="Search">
        <Icon name={buttonIcon || icon} />
      </button>
    </form>
  );
}
