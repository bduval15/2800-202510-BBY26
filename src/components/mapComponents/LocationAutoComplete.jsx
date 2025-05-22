/**
 * LocationAutocomplete.jsx
 * Loaf Life – Gives the user suggestions for addresses based on input.
 *
 * Brady used the Leaflet API reference documentation for developing the functionality.
 * @see https://leafletjs.com/reference.html
 * 
 * Modified with assistance from ChatGPT o4-mini-high.
 *
 * @author Brady Duval
 * @author Leaflet
 * @author https://chatgpt.com/
 * 
 * @function useDebounce
 * @description Custom hook that debounces a value by the specified delay.
 *
 * @function LocationAutocomplete
 * @description Renders an input field with address autocomplete suggestions,
 *              fetches from Nominatim, caches results, and triggers callbacks
 *              on selection or change.
 *
 * @function formatLabel
 * @description Formats a place result into a readable label using display_name
 *              and address components.
 *
 * @function pick
 * @description Handles selection of a place: formats label, updates state,
 *              and invokes onSelect callback with location details.
 *
 * @function handleBlur
 * @description Handles input blur: selects first suggestion or fetches best match.
 */
'use client';

import React, { useState, useEffect, useRef } from 'react';

/**
 * useDebounce
 *
 * @function useDebounce
 * @param {any} value - The value to debounce.
 * @param {number} delay - Delay in milliseconds.
 * @returns {any} The debounced value.
 * @description Returns a value that updates only after the specified delay
 *              since the last change, useful for rate-limiting expensive operations.
 */
function useDebounce(value, delay = 100) {
  // Set up a debounce timer on value change
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    // Clear timer if value or delay changes
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function LocationAutocomplete({
  placeholder = 'Enter a location…',    // Input placeholder text
  onSelect,                             // Callback with { address, lat, lng } on selection
  initialValue = '',                    // Initial input value
  onChange                              // Callback on raw input change
}) {
  // Current user query
  const [query, setQuery] = useState(initialValue);

  // Flag to indicate a selection was made
  const [picked, setPicked] = useState(false);

  // Debounced version of query to limit fetch calls
  const debouncedQuery = useDebounce(query, 300);

  // Address suggestion results
  const [results, setResults] = useState([]);

  // Dropdown open state
  const [open, setOpen] = useState(false);

  // Wrapper ref for click outside detection
  const wrapperRef = useRef(null);

  // Cache for query results
  const cacheRef = useRef({});

  // Update query if initialValue prop changes after initial mount
  useEffect(() => {
    // Sync query if initialValue prop updates
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions (debounced) and cache
  useEffect(() => {
    // Reset suggestions when query changes
    setResults([]);
    setOpen(false);
    if (debouncedQuery.length < 5) return;

    // Use cache if available
    if (cacheRef.current[debouncedQuery]) {
      setResults(cacheRef.current[debouncedQuery]);
      setOpen(!!cacheRef.current[debouncedQuery].length);
      return;
    }

    // Abort controller for fetch
    const ctrl = new AbortController();
    const params = new URLSearchParams({
      q: debouncedQuery,
      format: 'json',
      addressdetails: '1',
      limit: '5',
      viewbox: '-123.5,49.5,-122.4,49.0',
      bounded: '1'
    });

    // Fetch suggestions from Nominatim
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

  /**
  * formatLabel
  *
  * @function formatLabel
  * @param {Object} place - Nominatim place result.
  * @returns {string} The formatted address label.
  * @description Constructs a user-friendly address string from place data.
  */
  function formatLabel(place) {
    const parts = place.display_name.split(',').map(s => s.trim());
    const name = parts[0] || '';
    const addr = place.address || {};
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
    const pc = addr.postcode || '';
    return [name, street, city, pc].filter(Boolean).join(', ');
  }
  
  /**
   * pick
   *
   * @function pick
   * @param {Object} place - Selected Nominatim place.
   * @description Handles user selection: formats label, updates state,
   *              triggers onChange and onSelect callbacks.
   */
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

  /**
   * handleBlur
   *
   * @function handleBlur
   * @description On input blur, either re-pick first suggestion or
   *              fetch a single best match and select it.
   */
  const handleBlur = () => {

    // If a selection was just picked, reset flag and do nothing else
    if (picked) {
      setPicked(false);
      return;
    }

    // If there are suggestions, auto-select the first one
    if (results.length > 0) {
      pick(results[0])
      return
    }

    // No suggestions: perform a fallback fetch for the best single match
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
          // If a result is returned, format and select it
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
        // Ignore errors from fallback fetch
      });
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Text input for address query */}
      <input
        id="loc-geo"
        type="text"
        className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24]
                   sm:text-sm bg-white placeholder-gray-400 text-gray-900"
        placeholder={placeholder}
        value={query}
        onChange={e => {
          // Update query state and reset pick flag on user input
          const v = e.target.value;
          setQuery(v);
          setPicked(false);
          onChange?.(v);
        }}
        onBlur={handleBlur} // Handle blur to auto-select or fetch best match

        // Open dropdown if enough characters and results available
        onFocus={() => debouncedQuery.length >= 5 && results.length > 0 && setOpen(true)}
        autoComplete="off"
      />

      {/* Suggestions dropdown */}
      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg
                       shadow-lg max-h-56 overflow-auto text-sm text-gray-800">
          {results.map(place => (
            <li
              key={place.place_id}
              // Prevent blur event before click
              onMouseDown={e => e.preventDefault()}
              className="px-4 py-2 hover:bg-[#FFE2B6] cursor-pointer"
              onClick={() => pick(place)} // Handle list item selection
            >
              {formatLabel(place)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
