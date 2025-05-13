/**
 * LocationAutoComplete.jsx
 * Loaf Life – Gives the user suggestions for 
 * addresses based on input. 
 *  
 * Brady used the Leaflet API reference documentation
 * for developing the functionality. 
 * 
 * @author Leaflet
 * @see https://leafletjs.com/reference.html
 * 
 * Modified with assistance from ChatGPT o4-mini-high.
 * 
 * @author Brady Duval
 * @author https://chatgpt.com/
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function LocationAutocomplete({
  placeholder = 'Enter a location…',
  onSelect    // (place: { address, lat, lng }) => void  
}) {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen]       = useState(false);
  const wrapperRef            = useRef(null);

  // Fetch suggestions as user types
  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const viewbox    = '-123.5,49.5,-122.4,49.0';

    fetch(
      `https://nominatim.openstreetmap.org/search?` +
      new URLSearchParams({
        format:         'json',
        addressdetails: '1',
        limit:          '3',
        q:              query,
        viewbox,
        bounded:        '1'
      }),
      { signal: controller.signal }
    )
      .then(r => r.json())
      .then(data => {
        setResults(data);
        setOpen(true);
      })
      .catch(() => { /* ignore */ });

    return () => controller.abort();
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function onClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Build a nice “street number + road” label, fallback to first two parts of display_name
  function formatLabel(place) {
    const adr = place.address || {};
    let label = '';

    if (adr.house_number && adr.road) {
      label = `${adr.house_number} ${adr.road}`;
    } else if (adr.road) {
      label = adr.road;
    } else {
      label = place.display_name
        .split(',')
        .map(s => s.trim())
        .slice(0, 2)
        .join(', ');
    }

    // optionally append city/town for context
    const city = adr.city || adr.town || adr.village || adr.county;
    if (city) {
      label += `, ${city}`;
    }
    return label;
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <label
        htmlFor="location-autocomplete"
        className="block text-sm font-medium text-[#6A401F] mb-1"
      >
        Location
      </label>
      <input
        type="text"
        id="location-autocomplete"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => query.length >= 3 && setOpen(true)}
        placeholder={placeholder}
        className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24]
                   sm:text-sm bg-white placeholder-gray-400 text-gray-900"
      />

      {open && results.length > 0 && (
        <ul
          className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg 
                     shadow-lg max-h-60 overflow-y-auto text-sm text-gray-800"
        >
          {results.map(place => {
            const label = formatLabel(place);
            return (
              <li
                key={place.place_id}
                className="px-4 py-2 hover:bg-[#FFE2B6] cursor-pointer"
                onClick={() => {
                  const lat = parseFloat(place.lat);
                  const lng = parseFloat(place.lon);
                  setQuery(label);
                  setOpen(false);
                  onSelect({ address: label, lat, lng });
                }}
              >
                {label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
