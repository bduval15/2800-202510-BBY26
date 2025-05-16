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

// simple debounce hook
function useDebounce(value, delay = 100) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function LocationAutocomplete({
  placeholder = 'Enter a location…',
  onSelect,   
  initialValue = '' 
}) {
  const [query, setQuery]       = useState(initialValue); // Initialize with prop
  const debouncedQuery          = useDebounce(query, 300);
  const [results, setResults]   = useState([]);
  const [open, setOpen]         = useState(false);
  const wrapperRef              = useRef(null);
  const cacheRef                = useRef({});

  // Update query if initialValue prop changes after initial mount
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // fetch suggestions (debounced) and cache
  useEffect(() => {
    setResults([]);
    setOpen(false);
    if (debouncedQuery.length < 5) return;

    // return cached results if available
    if (cacheRef.current[debouncedQuery]) {
      setResults(cacheRef.current[debouncedQuery]);
      setOpen(!!cacheRef.current[debouncedQuery].length);
      return;
    }

    const ctrl = new AbortController();
    const params = new URLSearchParams({
      q:             debouncedQuery,
      format:        'json',
      addressdetails:'1',
      limit:         '5',
      viewbox:       '-123.5,49.5,-122.4,49.0',
      bounded:       '1'
    });

    fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      signal: ctrl.signal,
      headers: { 'Accept-Language': 'en' }
    })
      .then(r => r.json())
      .then(data => {
        cacheRef.current[debouncedQuery] = data;
        setResults(data);
        if (data.length) setOpen(true);
      })
      .catch(err => {
        if (err.name !== 'AbortError') console.error(err);
      });

    return () => ctrl.abort();
  }, [debouncedQuery]);

  // helper: build label (business + street + city + postal)
  function formatLabel(place) {
    const addr = place.address || {};
    const parts = place.display_name.split(',').map(s => s.trim());
    const first = parts[0] || '';
    const isAddress = /^\d/.test(first);

    const city = addr.city || addr.town || addr.village || '';
    const pc   = addr.postcode || '';

    if (isAddress) {
      return [first, city, pc].filter(Boolean).join(', ');
    } else {
      const street = addr.house_number && addr.road
        ? `${addr.house_number} ${addr.road}`
        : addr.road || parts[1] || '';
      return [first, street, city, pc].filter(Boolean).join(', ');
    }
  }

  // user selected a place
  const pick = place => {
    const label = formatLabel(place);
    setQuery(label);
    setOpen(false);
    onSelect({
      address: label,
      lat:      parseFloat(place.lat),
      lng:      parseFloat(place.lon)
    });
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <label htmlFor="loc-geo" className="block text-sm font-medium text-[#6A401F] mb-1">
        Location (Optional)
      </label>
      <input
        id="loc-geo"
        type="text"
        className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24]
                   sm:text-sm bg-white placeholder-gray-400 text-gray-900"
        placeholder={placeholder}
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => debouncedQuery.length >= 5 && results.length > 0 && setOpen(true)}
        autoComplete="off"
      />

      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg
                       shadow-lg max-h-56 overflow-auto text-sm text-gray-800">
          {results.map(place => (
            <li
              key={place.place_id}
              className="px-4 py-2 hover:bg-[#FFE2B6] cursor-pointer"
              onClick={() => pick(place)}
            >
              {formatLabel(place)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
