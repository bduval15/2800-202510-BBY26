/**
 * FilterBar.jsx
 * Loaf Life – Handles the filtering of map
 * pins based on distance, thread, and price.
 * 
 * Modified with assistance from ChatGPT o4-mini-high.
 * 
 * @author Brady Duval
 * @author https://chatgpt.com/
 */

'use client';

import React, { useState } from 'react';

export default function FilterBar() {
  const [open, setOpen] = useState(true);

  return (
    <div className="px-4 py-2 bg-white shadow rounded-b-lg">
      <button 
        onClick={() => setOpen(o => !o)} 
        className="w-full text-left font-semibold"
      >
        {open ? 'Hide Filters ▲' : 'Show Filters ▼'}
      </button>

      {open && (
        <div className="mt-3 space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Max Price: $500</label>
            <input type="range" className="w-full" min="0" max="500" defaultValue="500" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Max Distance: 50 km</label>
            <input type="range" className="w-full" min="0" max="100" defaultValue="50" />
          </div>
          <button 
            className="w-full bg-[#D1905A] hover:bg-[#c17f4f] text-white py-2 rounded"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}

