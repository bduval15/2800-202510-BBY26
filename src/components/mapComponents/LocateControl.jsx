/**
 * LocateControl.jsx
 * Loaf Life – Allows the user to press the pin button
 * to zoom into there location on the map
 *  
 * Brady used the Leaflet API reference documentation
 * for developing the functionality. 
 * 
 * @author Leaflet
 * @see https://leafletjs.com/reference.html
 * 
 * Generated with ChatGPT o4-mini-high.
 * 
 * @author Brady Duval
 * @author https://chatgpt.com/
 */
// File: components/LocateControl.jsx
'use client';

import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export default function LocateControl({
  position      = 'topright',
  iconHtml      = '📍',
  tooltip       = 'Find my location',
  locateOptions = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
  onLocated     = () => {},
  zoomTo        = 15
}) {
  const map = useMap();

  useEffect(() => {
    // 1) Define a custom Control
    const Control = L.Control.extend({
      onAdd() {
        // Create a simple DIV button
        const button = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        button.innerHTML = iconHtml;
        button.title     = tooltip;
        // Inline styles instead of classList
        Object.assign(button.style, {
          cursor: 'pointer',
          padding: '6px',
          background: 'white',
          border: '1px solid rgba(0,0,0,0.2)',
          borderRadius: '4px',
          fontSize: '1.2rem',
        });
        L.DomEvent.disableClickPropagation(button);

        // 2) When clicked, call locate with both recenter + zoom options
        button.onclick = () => {
          map.locate({
            ...locateOptions,  // enableHighAccuracy, timeout, etc.
            setView: true,     // recenter the map
            maxZoom: zoomTo    // zoom in to this level
          });
        };

        return button;
      }
    });

    // 3) Add control to map
    const ctl = new Control({ position });
    map.addControl(ctl);

    // 4) Listen for locationfound
    function handleFound(e) {
      // Normalize coords
      const latlng = e.latlng || (e.latitude != null && e.longitude != null
        ? L.latLng(e.latitude, e.longitude)
        : null);

      if (!latlng) {
        console.warn('LocateControl: could not find coordinates in event', e);
        return;
      }

      // Notify parent (e.g. EventMap) so it can drop your ping/avatar
      onLocated([latlng.lat, latlng.lng]);
    }

    map.on('locationfound', handleFound);
    map.on('locationerror', () => console.warn('LocateControl: location denied'));

    // 5) Clean up on unmount
    return () => {
      map.off('locationfound', handleFound);
      map.removeControl(ctl);
    };
  }, [map, position, iconHtml, tooltip, locateOptions, onLocated, zoomTo]);

  return null;
}
