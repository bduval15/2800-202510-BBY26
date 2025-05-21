/**
 * LocateControl.jsx
 * Loaf Life – Allows the user to press the pin button to zoom into their location on the map.
 *
 * Brady used the Leaflet API reference documentation for developing the functionality.
 * @see https://leafletjs.com/reference.html
 * 
 * Modified with ChatGPT o4-mini-high.
 *
 * @author Brady Duval
 * @author Leaflet
 * @author https://chatgpt.com/
 *
 * @function LocateControl
 * @description Adds a custom Leaflet control button to trigger geolocation or fly to a tracked position,
 *              and notifies the parent component via callback when location is found.
 */

'use client';

import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { createRoot } from 'react-dom/client';
import { MapPinIcon } from '@heroicons/react/24/solid';
import L from 'leaflet';

export default function LocateControl({
  position = 'topright',              // Where to place the control on the map
  tooltip = 'Find my location',       // Tooltip text for the control button
  locateOptions = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }, // Options for map.locate
  onLocated = () => { },              // Callback invoked with [lat, lng] when location found
  trackedPos,                         // If provided, fly to this position instead of using locate
  zoomTo = 15                         // Zoom level to fly or setView
}) {
  const map = useMap();

  useEffect(() => {
    // Define a new Leaflet control class
    const Control = L.Control.extend({
      /**
     * onAdd
     *
     * @function onAdd
     * @returns {HTMLElement} The DOM container element for the locate control button.
     * @description Creates and configures the locate control button in the Leaflet map.
     */
      onAdd() {
        // Create button container
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control locate-btn');
        container.title = tooltip;
        L.DomEvent.disableClickPropagation(container);

        // Render the pin icon inside the container
        const root = createRoot(container);
        root.render(
          <MapPinIcon className="h-6 w-6 text-white" />
        );

        // Handle click: close popups and either fly or locate
        container.onclick = () => {
          map.closePopup();

          if (trackedPos) {
            // Fly to provided tracked position
            map.flyTo([trackedPos.lat, trackedPos.lng], zoomTo);
            onLocated([trackedPos.lat, trackedPos.lng]);
          } else {
            // Trigger browser geolocation and set view on result
            map.locate({ setView: true, maxZoom: zoomTo });
          }
        };
        return container;
      }
    });

    // Instantiate and add control to the map
    const ctl = new Control({ position });
    map.addControl(ctl);

    /**
     * handleFound
     *
     * @function handleFound
     * @param {Object} e - The Leaflet locationfound event object containing coordinates.
     * @description Normalizes event coordinates and invokes the onLocated callback with [lat, lng].
     */
    function handleFound(e) {
      // Normalize latlng from post
      const latlng = e.latlng || (e.latitude != null && e.longitude != null
        ? L.latLng(e.latitude, e.longitude)
        : null);

      if (!latlng) {
        console.warn('LocateControl: could not find coordinates in event', e);
        return;
      }

      // Notify parent of located position
      onLocated([latlng.lat, latlng.lng]);
    }

    // Listen for location posts
    map.on('locationfound', handleFound);
    map.on('locationerror', () => console.warn('LocateControl: location denied'));

    // Clean up on unmount: remove event handlers and control
    return () => {
      map.off('locationfound', handleFound);
      map.removeControl(ctl);
    };
  }, [map, position, tooltip, locateOptions, onLocated, zoomTo]);

  return null; // Control is added via Leaflet, nothing to render in React tree
}
