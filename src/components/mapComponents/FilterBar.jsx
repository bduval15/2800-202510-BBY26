/**
 * FilterBar.jsx
 *
 * Loaf Life – Handles the filtering of map pins based on selected threads.
 *
 * Modified with assistance from ChatGPT o4-mini-high.
 *
 * @author Brady Duval
 * @author https://chatgpt.com/
 *
 * @function FilterBar
 * @description Renders a set of toggleable pills for filtering map events by thread type,
 *              and notifies the parent when selections change.
 *
 * @function toggle
 * @description Adds or removes a thread ID from the selected set when a pill is clicked.
 */

'use client';

import React, { useState, useEffect } from 'react';

export default function FilterBar({
  threads = [],               // Array of thread objects { id, name }  
  initialSelected = [],       // Array of thread IDs initially selected
  onFilterChange              // Callback to notify parent of updated filters   
}) {
  // Use a Set for efficient add/remove checks
  const [selected, setSelected] = useState(
    () => new Set(initialSelected)
  );

  useEffect(() => {
    // Whenever selected changes, inform parent with an array of selected IDs
    onFilterChange(Array.from(selected));
  }, [selected, onFilterChange]);

  function toggle(id) {
    // Toggle a thread ID in the selected set
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id); // Deselect if already selected or Select if not present
      return next;
    });
  }

  return (
    <div className="px-4 py-1 bg-[#F5E3C6]">
      <div className="flex items-center justify-between">
        {/* Left loaf icon for decoration */}
        <img
          src="/images/map/mapLoaf3.png"
          alt="Loaf left"
          className="h-13 w-13 object-contain"
        />

        {/* Render a pill button for each thread type */}
        <div className="flex space-x-2">
          {threads.map(t => {
            const active = selected.has(t.id); // Check if this thread is active
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

        {/* Right loaf icon for decoration */}
        <img
          src="/images/map/mapLoaf2.png"
          alt="Loaf right"
          className="h-12 w-12 object-contain"
        />
      </div>
    </div>
  );
}