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
import { useMap }    from 'react-leaflet';
import L             from 'leaflet';

export default function LocateControl({
  position     = 'topright',
  iconHtml     = '📍',              
  tooltip      = 'Find my location',
  locateOptions= { enableHighAccuracy: true, timeout:10000, maximumAge:0 },
  onLocated    = () => {},
  zoomTo       = 15              
}) {
  const map = useMap();

  useEffect(() => {
    const Control = L.Control.extend({
      onAdd() {
        const c = L.DomUtil.create('div','leaflet-bar leaflet-control');
        c.innerHTML       = iconHtml;
        c.title           = tooltip;
        c.style.cursor    = 'pointer';
        c.style.fontSize  = '1.2rem';
        c.style.padding   = '6px';
        c.style.background= 'white';
        c.style.border    = '1px solid rgba(0,0,0,.2)';
        c.style.borderRadius = '4px';
        L.DomEvent.disableClickPropagation(c);
        c.onclick = () => map.locate(locateOptions);
        return c;
      }
    });

    const ctl = new Control({ position });
    map.addControl(ctl);

    function onLocationFound(e) {
        const { latitude: lat, longitude: lng } = e;
        map.setView([lat, lng], zoomTo);
        onLocated([lat, lng]);
      }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', () => console.warn('Location denied'));

    return () => {
      map.off('locationfound', onLocationFound);
      map.removeControl(ctl);
    };
  }, [map, position, iconHtml, tooltip, locateOptions, onLocated, zoomTo]);

  return null;
}
