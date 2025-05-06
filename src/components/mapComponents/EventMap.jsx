/**
 * EventMap.jsx
 * Loaf Life – Handles the map loading 
 * and locating the user to be displayed on the map.
 *  
 * Brady used the Leaflet API reference documentation
 * for develping the functionality. 
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

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
});

export default function EventMap({
    center = [49.25, -123.00],
    zoom = 12,
    events = []
}) {

    const vancouverBounds = [
        [49.0, -123.5],
        [49.5, -122.4],
    ];

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            className="h-full w-full"
            maxBounds={vancouverBounds}
            maxBoundsViscosity={0.8}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />

            {events.map(evt => (
                <Marker key={evt.id} position={[evt.lat, evt.lng]}>
                    <Popup>
                        <strong>{evt.title}</strong><br />
                        {evt.description}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}