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

import React, { useState } from 'react';

const THREADS = [
  { id: 'hacks', name: 'Hacks' },
  { id: 'deals', name: 'Deals' },
  { id: 'savings', name: 'Saving Tips' },
  { id: 'free-events', name: 'Free Events' }
];

export default function FilterBar() {
  const [open, setOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(500);
  const [maxDist, setMaxDist] = useState(50);
  const [checked, setChecked] = useState(
    new Set(THREADS.map(t => t.id))
  );

  function toggleThread(id) {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleApply() {
    console.log({
      maxPrice,
      maxDist,
      threads: Array.from(checked)
    });
  }

  return (
    <div className="px-4 py-2 bg-[#F5E3C6]">
      {/* expand / collapse button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left font-semibold text-[#8B4C24] hover:text-[#D1905A]"
      >
        {open ? 'Hide Filters ▲' : 'Show Filters ▼'}
      </button>

      {open && (
        <div className="mt-3 space-y-4">

          {/* ───── Threads (checkbox‑pills) ───── */}
          <div>
            <p className="text-sm text-gray-700 mb-2">Threads</p>
            <div className="flex flex-wrap gap-2">
              {THREADS.map(t => {
                const active = checked.has(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleThread(t.id)}
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
          </div>
          {/* ───── Price & Distance sliders side‑by‑side ───── */}
          <div className="grid grid-cols-2 gap-4">
            {/* Max Price */}
            <div>
              <label className="block text-sm text-gray-700">
                Max Price: ${maxPrice}
              </label>
              <input
                type="range"
                min="0"
                max="500"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                className="w-full accent-[#D1905A]"
              />
            </div>

            {/* Max Distance */}
            <div>
              <label className="block text-sm text-gray-700">
                Max Distance: {maxDist} km
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={maxDist}
                onChange={e => setMaxDist(e.target.value)}
                className="w-full accent-[#D1905A]"
              />
            </div>
          </div>

          {/* ───── Apply button ───── */}
          <button
            onClick={handleApply}
            className="w-full bg-[#639751] hover:bg-[#c17f4f]
                       text-white py-2 rounded font-medium"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}