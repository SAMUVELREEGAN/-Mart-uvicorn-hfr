import { useState, useEffect } from 'react';
import { Icon } from '../../utils/iconResolver';
import './Search.css';

export default function Search({
  placeholder,
  icon = 'FaSearch',
  buttonIcon,
  onSearch,
  onChange,
  defaultValue = '',
  value,
}) {
  const [internalQuery, setInternalQuery] = useState(defaultValue);
  const isControlled = value !== undefined;
  const query = isControlled ? value : internalQuery;

  useEffect(() => {
    if (!isControlled) setInternalQuery(defaultValue);
  }, [defaultValue, isControlled]);

  const updateQuery = (next) => {
    if (!isControlled) setInternalQuery(next);
    onChange?.(next);
  };

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
        onChange={(e) => updateQuery(e.target.value)}
      />
      <button type="submit" className="search__btn" aria-label="Search">
        <Icon name={buttonIcon || icon} />
      </button>
    </form>
  );
}
