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
  initialValue = '',
  onChange
}) {
  const [query, setQuery] = useState(initialValue);
  const [picked, setPicked] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const cacheRef = useRef({});

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
      q: debouncedQuery,
      format: 'json',
      addressdetails: '1',
      limit: '5',
      viewbox: '-123.5,49.5,-122.4,49.0',
      bounded: '1'
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

function formatLabel(place) {
  const parts = place.display_name.split(',').map(s => s.trim());
  const name  = parts[0] || '';
  const addr       = place.address || {};
  const { house_number, road } = addr;
  let street = '';
  if (house_number && road) {
    street = `${house_number} ${road}`;
  } else if (parts[1] && /^\d+$/.test(parts[1]) && parts[2]) {
    street = `${parts[1]} ${parts[2]}`;
  } else {
    street = parts[1] || '';
  }
  const city = addr.city || addr.town || addr.village || '';
  const pc   = addr.postcode || '';
  return [name, street, city, pc].filter(Boolean).join(', ');
}
  // user selected a place
  const pick = place => {
    const label = formatLabel(place);
    setQuery(label);
    setOpen(false);
    setPicked(true);
    onChange?.(label);
    onSelect({
      address: label,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon)
    });
  };

  const handleBlur = () => {

    if (picked) {
      setPicked(false);
      return;
    }

    if (results.length > 0) {
      pick(results[0])
      return
    }

    const params = new URLSearchParams({
      q: query,
      format: 'json',
      limit: '1',
      viewbox: '-123.5,49.5,-122.4,49.0',
      bounded: '1'
    });
    fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: { 'Accept-Language': 'en' }
    })
      .then(r => r.json())
      .then(data => {
        if (data[0]) {
          const label = formatLabel(data[0]);
          setQuery(label);
          onSelect({
            address: label,
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          });
        }
      })
      .catch(() => {
      });
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        id="loc-geo"
        type="text"
        className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24]
                   sm:text-sm bg-white placeholder-gray-400 text-gray-900"
        placeholder={placeholder}
        value={query}
        onChange={e => {
          const v = e.target.value;
          setQuery(v);
          setPicked(false);
          onChange?.(v);
        }}
        onBlur={handleBlur}
        onFocus={() => debouncedQuery.length >= 5 && results.length > 0 && setOpen(true)}
        autoComplete="off"
      />

      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg
                       shadow-lg max-h-56 overflow-auto text-sm text-gray-800">
          {results.map(place => (
            <li
              key={place.place_id}
              onMouseDown={e => e.preventDefault()}
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
