import React, { useState, useEffect } from 'react';
import './SearchBar.css';

// PUBLIC_INTERFACE
const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  const [localValue, setLocalValue] = useState(value || '');

  // Sync with parent value
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  // PUBLIC_INTERFACE
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  // PUBLIC_INTERFACE
  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  // PUBLIC_INTERFACE
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="search-input"
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="search-clear"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
