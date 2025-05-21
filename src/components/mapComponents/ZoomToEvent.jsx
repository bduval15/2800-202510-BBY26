import L from 'leaflet';

export function ZoomToEvent(map, { lat, lng }, onOpenPopup) {
  map.flyTo([lat, lng], 16, { animate: true });

  map.once('moveend', () => {
    const size = map.getSize();
    const targetY = size.y * (2 / 3);
    const targetX = size.x / 2;

    const markerPt = map.latLngToContainerPoint([lat, lng]);
    const centerPt = map.latLngToContainerPoint(map.getCenter());

    const dy = markerPt.y - targetY;
    const dx = markerPt.x - targetX;
    const fudgeX = 8;
    const finalDx = dx + fudgeX;

    const newCenterPt = L.point(
      centerPt.x + finalDx,
      centerPt.y + dy
    );
    const newCenterLatLng = map.containerPointToLatLng(newCenterPt);

    map.flyTo(newCenterLatLng, map.getZoom(), { animate: true });
    map.once('moveend', () => {
      if (onOpenPopup) onOpenPopup();
    });
  });
}
