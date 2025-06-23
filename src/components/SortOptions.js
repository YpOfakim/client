// 📁 components/SortOptions.jsx
import React from 'react';

function SortOptions({ sortBy, setSortBy }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '1em' }}>
      <label style={{ marginRight: '1em' }}>מיין לפי:</label>

      <label style={{ marginRight: '1em' }}>
        <input
          type="radio"
          value="time"
          checked={sortBy === 'time'}
          onChange={() => setSortBy('time')}
        />
        &nbsp;זמן
      </label>

      <label>
        <input
          type="radio"
          value="distance"
          checked={sortBy === 'distance'}
          onChange={() => setSortBy('distance')}
        />
        &nbsp;מרחק
      </label>
    </div>
  );
}

export default SortOptions;
