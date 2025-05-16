/**
 * FilterBar.jsx
 * 
 * Loaf Life – Handles the filtering of map
 * pins based on distance, thread, and price.
 * 
 * Modified with assistance from ChatGPT o4-mini-high.
 * 
 * @author Brady Duval
 * @author https://chatgpt.com/
 */

'use client';

import React, { useState, useEffect } from 'react';

export default function FilterBar({
  threads = [],               
  initialSelected = [],        
  onFilterChange             
}) {
  const [selected, setSelected] = useState(
    () => new Set(initialSelected)
  );

  useEffect(() => {
    onFilterChange(Array.from(selected));
  }, [selected, onFilterChange]);

  function toggle(id) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="px-4 py-1 bg-[#F5E3C6]">
      <div className="flex items-center justify-between">
        {/* Left Loaf icon */}
        <img
          src="/images/mapLoaf3.png"
          alt="Loaf left"
          className="h-13 w-13 object-contain"
        />

        {/* Pills in the middle */}
        <div className="flex space-x-2">
          {threads.map(t => {
            const active = selected.has(t.id);
            return (
              <button
                key={t.id}
                onClick={() => toggle(t.id)}
                className={`
                  px-3 py-1 rounded-full text-sm border
                  ${active
                    ? 'bg-[#D1905A] text-white border-[#c17f4f]'
                    : 'bg-[#FFF9F0] text-[#8B4C24] border-[#D1905A]'}
                `}
              >
                {t.name}
              </button>
            );
          })}
        </div>

        {/* Right Loaf icon */}
        <img
          src="/images/mapLoaf2.png"
          alt="Loaf right"
          className="h-12 w-12 object-contain"
        />
      </div>
    </div>
  );
}