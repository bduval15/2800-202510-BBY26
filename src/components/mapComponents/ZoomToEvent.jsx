/**
 * ZoomToEvent.js
 *
 * Loaf Life – Utility to smoothly fly the map to a specified event coordinate,
 *              reposition the marker to the bottom third of the view, and optionally
 *              open its popup.
 *
 * Modified with assistance from ChatGPT 
 * 
 * @author Brady Duval
 * @author https://chatgpt.com/
 *
 * @function ZoomToEvent
 * @param {Object} map - Leaflet map instance.
 * @param {{lat: number, lng: number}} coords - Latitude and longitude to focus on.
 * @param {Function} [onOpenPopup] - Optional callback to open the popup after movement.
 * @description Animates the map to the given coordinates, adjusts center so the marker
 *              sits in the bottom third of the viewport, then triggers the popup.
 */

import L from 'leaflet';

export function ZoomToEvent(map, { lat, lng }, onOpenPopup) {

  // Initial fly animation to target at zoom level 16
  map.flyTo([lat, lng], 16, { animate: true });

  // Once the first movement finishes, reposition center to place marker lower
  map.once('moveend', () => {
    // Get current map container dimensions
    const size = map.getSize();
    const targetY = size.y * (2 / 3); // Vertical position at bottom third
    const targetX = size.x / 2;       // Horizontal center

    // Convert target latlng and current center to container pixel points
    const markerPt = map.latLngToContainerPoint([lat, lng]);
    const centerPt = map.latLngToContainerPoint(map.getCenter());

    // Compute differences between marker point and desired screen point
    const dy = markerPt.y - targetY;
    const dx = markerPt.x - targetX;
    const fudgeX = 8;                // Minor horizontal adjustment offset
    const finalDx = dx + fudgeX;     // Apply fudge to dx

    // Calculate new center point in pixel space
    const newCenterPt = L.point(
      centerPt.x + finalDx,
      centerPt.y + dy
    );

    // Convert pixel center back to latlng
    const newCenterLatLng = map.containerPointToLatLng(newCenterPt);

    // Fly to the recalculated center at the current zoom level
    map.flyTo(newCenterLatLng, map.getZoom(), { animate: true });

    // After reposition animation ends, open popup if callback provided
    map.once('moveend', () => {
      if (onOpenPopup) onOpenPopup();
    });
  });
}
