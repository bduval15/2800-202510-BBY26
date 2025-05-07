/**
 * EventMap.jsx
 * Loaf Life – Handles the map loading 
 * and locating the user to be displayed on the map.
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

import React from 'react';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LocateControl from '@/components/mapComponents/LocateControl';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
});

function FitBounds({ bounds }) {
    const map = useMap();
    useEffect(() => {
        map.fitBounds(bounds, { padding: [20, 20] });
    }, []);
    return null;
}

export default function EventMap({
    events = [],
}) {

    const [userPos, setUserPos] = useState(null);

    const vancouverBounds = [
        [49.0, -123.5],
        [49.5, -122.4],
    ];

    const logoIcon = L.icon({
        iconUrl: '/images/logo.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

    return (
        <MapContainer
            bounds={vancouverBounds}
            scrollWheelZoom={true}
            className="h-full w-full"
            maxBounds={vancouverBounds}
            maxBoundsViscosity={1.0}
            minZoom={10}
            maxZoom={16}
        >
            <FitBounds bounds={vancouverBounds} />

            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />

            {/* Temp for loading event markers */}
            {events.map(evt => (
                <Marker key={evt.id} position={[evt.lat, evt.lng]}>
                    <Popup>
                        <strong>{evt.title}</strong><br />
                        {evt.description}
                    </Popup>
                </Marker>
            ))}

            <LocateControl
                position="topright"
                drawCircle={false}
                follow={true}
                zoomTo={14}
                onLocated={(coords) => {
                    setUserPos(coords);
                }}
                locateOptions={{
                    enableHighAccuracy: true,
                    maximumAge: 0
                }}
            />
            {userPos && (
                    <Marker position={userPos} icon={logoIcon}>
                        <Popup>You are here!</Popup>
                    </Marker>
                )}
        </MapContainer>
    );
}