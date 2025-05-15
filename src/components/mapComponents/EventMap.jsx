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
import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import greenMarker2x from 'leaflet-color-markers/img/marker-icon-2x-green.png';
import greenMarker from 'leaflet-color-markers/img/marker-icon-green.png';
import markerShadow from 'leaflet-color-markers/img/marker-shadow.png';

import LocateControl from '@/components/mapComponents/LocateControl';
import styles from '@/components/mapComponents/EventMap.module.css';
import EventPopup from '@/components/mapComponents/EventPopup';
import { clientDB } from '@/supabaseClient';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: greenMarker2x,
    iconUrl: greenMarker,
    shadowUrl: markerShadow,
    popupAnchor: [1, -40]
});

function FitBounds({ bounds }) {
    const map = useMap();
    useEffect(() => {
        map.fitBounds(bounds, { padding: [20, 20] });
    }, []);
    return null;
}

function ResizeMap() {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 0);
    }, [map]);
    return null;
}

function ClosePopupsOnClick() {
    const map = useMapEvents({
        click() {
            map.closePopup();
        },
        keydown(e) {
            if (e.originalEvent.key === 'Escape') {
                map.closePopup();
            }
        }
    });
    return null;
}

function ZoomMarker({ evt, userPos }) {
    const map = useMap();

    const handleClick = (e) => {

        e.target.closePopup();

        map.flyTo([evt.lat, evt.lng], 16, { animate: true });

        map.once('moveend', () => {
            e.target.openPopup();
        });
    };
    return (
        <Marker
            position={[evt.lat, evt.lng]}
            eventHandlers={{ click: handleClick }}
        >
            <EventPopup evt={evt} userPosition={userPos} />
        </Marker>
    );
}

export default function EventMap({
    events = [],
}) {

    const [userPos, setUserPos] = useState(null);
    const [trackedPos, setTrackedPos] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('/images/logo.png');

    const vancouverBounds = [
        [49.0, -123.5],
        [49.5, -122.4],
    ];

    useEffect(() => {
    if (!navigator.geolocation) {
      console.warn('Browser does not support geolocation');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos =>
        setTrackedPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }),
      err => console.warn('getCurrentPosition error', err),
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    const watcherId = navigator.geolocation.watchPosition(
      pos =>
        setTrackedPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }),
      err => console.warn('watchPosition error', err),
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watcherId);
  }, []);

    useEffect(() => {
        async function fetchAvatar() {
            const { data: { session } } = await clientDB.auth.getSession();
            if (!session?.user?.id) return;
            const { data, error } = await clientDB
                .from('user_profiles')
                .select('avatar_url')
                .eq('id', session.user.id)
                .single();


            if (error) console.error(error);
            else if (data?.avatar_url) setAvatarUrl(data.avatar_url);
        }
        fetchAvatar();
    }, []);

    const logoIcon = useMemo(() => {
        return L.icon({
            iconUrl: avatarUrl,
            iconSize: [64, 64],
            iconAnchor: [20, 40],
            popupAnchor: [12, -35]
        });
    }, [avatarUrl]);

    return (
        <div className={`${styles.container} h-full w-full`}>
            <MapContainer
                bounds={vancouverBounds}
                scrollWheelZoom={true}
                className="h-full w-full"
                maxBounds={vancouverBounds}
                maxBoundsViscosity={1.0}
                minZoom={10}
                maxZoom={16}
            >
                <ResizeMap />
                <FitBounds bounds={vancouverBounds} />

                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors © CARTO"
                    subdomains={['a', 'b', 'c', 'd']}
                />

                <ClosePopupsOnClick />

                {events.map(evt => (
                    <ZoomMarker key={evt.id} 
                                evt={evt}
                                userPos={trackedPos} />
                ))}

                <LocateControl
                    position="topright"
                    drawCircle={false}
                    follow={true}
                    zoomTo={14}
                    onLocated={([lat, lng]) => {
                        setUserPos({ lat, lng });
                    }}
                    locateOptions={{
                        enableHighAccuracy: true,
                        maximumAge: 0
                    }}
                />
                {userPos && (
                    <Marker position={[userPos.lat, userPos.lng]} icon={logoIcon}>
                        <Popup
                            className="you-are-here"
                            closeButton={false}
                            closeOnClick={false}
                            minWidth={80}
                            maxWidth={100}
                        >
                            You are here!
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}