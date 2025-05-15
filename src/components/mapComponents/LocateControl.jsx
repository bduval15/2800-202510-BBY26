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

'use client';

import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { createRoot } from 'react-dom/client';
import { MapPinIcon } from '@heroicons/react/24/solid';
import L from 'leaflet';

export default function LocateControl({
  position = 'topright',
  tooltip = 'Find my location',
  locateOptions = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
  onLocated = () => { },
  trackedPos,
  zoomTo = 15
}) {
  const map = useMap();

  useEffect(() => {
    // 1) Define a custom Control
    const Control = L.Control.extend({
      onAdd() {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control locate-btn');
        container.title = tooltip;
        L.DomEvent.disableClickPropagation(container);

        // 3) Render your Heroicon into that container
        const root = createRoot(container);
        root.render(
          <MapPinIcon className="h-6 w-6 text-white" />
        );

        // 4) Wire up the locate click
        container.onclick = () => {
          map.closePopup();

          if (trackedPos) {
            map.flyTo([trackedPos.lat, trackedPos.lng], zoomTo);
            onLocated([trackedPos.lat, trackedPos.lng]);
          } else {
            map.locate({ setView: true, maxZoom: zoomTo });
          }
        };
        return container;
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
  }, [map, position, tooltip, locateOptions, onLocated, zoomTo]);

  return null;
}
