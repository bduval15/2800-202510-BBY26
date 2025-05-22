/**
 * EventMap.jsx
 * Loaf Life – Handles the map loading and locating the user to be displayed on the map.
 *
 * Brady used the Leaflet API reference documentation for developing the functionality.
 *
 * @author Leaflet
 * @see https://leafletjs.com/reference.html
 * 
 * Modified with assistance from ChatGPT o4-mini-high.
 * 
 * @author Brady Duval
 * @author https://chatgpt.com/
 *
 * @function FitBounds
 * @description Adjusts the map view to fit the given bounds with padding.
 *
 * @function ResizeMap
 * @description Forces a map size invalidation on mount to ensure correct display.
 *
 * @function ClosePopupsOnClick
 * @description Closes any open popups when the map is clicked or Escape is pressed.
 *
 * @function FocusHandler
 * @description When a focusId is provided, zooms to the targeted event and opens its popup.
 *
 * @function ZoomMarker
 * @description Renders a Marker that zooms to its location when clicked, opening its popup.
 *
 * @function EventMap
 * @description Main component that renders the Leaflet map, markers, controls, and user location.
 */

'use client';

import React from 'react';
import { useEffect, useState, useMemo, useRef } from 'react';
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
import { ZoomToEvent } from '@/components/mapComponents/ZoomToEvent';

// Override default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: greenMarker2x,
    iconUrl: greenMarker,
    shadowUrl: markerShadow,
    popupAnchor: [1, -40]
});

// Custom icons for each thread type
const dealsIcon = L.icon({
    iconUrl: '/images/map/mapPinBlue.png',
    iconSize: [48, 48],
    iconAnchor: [16, 32],
    popupAnchor: [8, -32],
});

const hacksIcon = L.icon({
    iconUrl: '/images/map/mapPinPurple.png',
    iconSize: [48, 48],
    iconAnchor: [16, 32],
    popupAnchor: [8, -32],
});

const eventsIcon = L.icon({
    iconUrl: '/images/map/mapPinRed.png',
    iconSize: [48, 48],
    iconAnchor: [16, 32],
    popupAnchor: [8, -32],
});

// Mapping from thread IDs to icon instances
const threadIconMap = {
    deals: dealsIcon,
    hacks: hacksIcon,
    events: eventsIcon,
};

/**
 * FitBounds
 *
 * @function FitBounds
 * @param {{ bounds: import('leaflet').LatLngBoundsExpression }} props
 * @description Adjusts the map view to fit the provided bounds with padding.
 */
function FitBounds({ bounds }) {
    const map = useMap();
    useEffect(() => {
        // Fit the map view to the given bounds when component mounts
        map.fitBounds(bounds, { padding: [20, 20] });
    }, []);
    return null;
}

/**
 * ResizeMap
 *
 * @function ResizeMap
 * @description Forces the map to recalculate its size on mount for proper rendering.
 */
function ResizeMap() {
    const map = useMap();
    useEffect(() => {
        // Invalidate map size after initial render to avoid display issues
        setTimeout(() => {
            map.invalidateSize();
        }, 0);
    }, [map]);
    return null;
}

/**
 * ClosePopupsOnClick
 *
 * @function ClosePopupsOnClick
 * @description Closes any open popups when the user clicks on the map or presses Escape.
 */
function ClosePopupsOnClick() {
    const map = useMapEvents({
        click() {
            // Close popup on map click
            map.closePopup();
        },
        keydown(e) {
            // Close popup on Escape key press
            if (e.originalEvent.key === 'Escape') {
                map.closePopup();
            }
        }
    });
    return null;
}

/**
 * FocusHandler
 *
 * @function FocusHandler
 * @param {{ events: Array, focusId: string|null, markersRef: React.MutableRefObject }} props
 * @description When focusId is set, zooms to the event with that ID and opens its popup.
 */
function FocusHandler({ events, focusId, markersRef }) {
    const map = useMap()
    const hasZoomedFor = useRef({});

    useEffect(() => {
        if (!focusId) return // Do nothing if no focusId provided

        // Find the target event by ID
        const target = events.find(e => String(e.id) === focusId)
        if (!target) {
            console.warn('[FocusHandler] no event with id', focusId)
            return
        }

        if (hasZoomedFor.current[focusId]) return; // Already zoomed once

        // Zoom to the event's location, then open its popup
        ZoomToEvent(
            map,
            { lat: target.lat, lng: target.lng },
            () => {
                const marker = markersRef.current[focusId];
                if (marker) {
                    marker.openPopup();
                } else {
                    console.warn('no marker ref for', focusId);
                }
            }
        )
        // Mark Focus as zoomed 
        hasZoomedFor.current[focusId] = true;
    }, [focusId, events, map])

    return null
}

/**
 * ZoomMarker
 *
 * @function ZoomMarker
 * @param {{ evt: Object, userPos: Object, ref: React.Ref }} props
 * @description Renders a map marker that zooms into its event when clicked, then opens its popup.
 */
function ZoomMarker({ evt, userPos, ref }) {
    const map = useMap();

    const handleClick = (e) => {
        // Close existing popup then zoom into marker location, reopening popup
        e.target.closePopup();
        ZoomToEvent(map, evt, () => e.target.openPopup());
    };

    // Choose appropriate icon based on event's thread type
    const iconForThread =
        threadIconMap[evt.table_id] ??
        new L.Icon.Default();

    return (
        <Marker
            ref={ref}
            position={[evt.lat, evt.lng]}
            icon={iconForThread}
            eventHandlers={{ click: handleClick }}
        >
            <EventPopup evt={evt} userPosition={userPos} />
        </Marker>
    );
}

/**
 * EventMap
 *
 * @function EventMap
 * @param {{ events: Array, focusId: string|null }} props
 * @description Main component rendering the Leaflet map with event markers, user location,
 *              filter controls, and map behaviors.
 */
export default function EventMap({ events = [], focusId = null }) {

    // User position as set by LocateControl
    const [userPos, setUserPos] = useState(null);

    // Live geolocation tracked position
    const [trackedPos, setTrackedPos] = useState(null);

    // User avatar URL for "you are here" marker
    const [avatarUrl, setAvatarUrl] = useState('/images/logo.png');

    // Refs to each marker instance for popup control
    const markersRef = useRef({});

    // Bounds for Vancouver region
    const vancouverBounds = [
        [49.0, -123.5],
        [49.5, -122.4],
    ];

    // Request and watch browser geolocation on mount
    useEffect(() => {
        if (!navigator.geolocation) {
            console.warn('Browser does not support geolocation');
            return;
        }

        // Get initial position
        navigator.geolocation.getCurrentPosition(
            pos =>
                setTrackedPos({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                }),
            err => console.warn('getCurrentPosition error', err),
            { enableHighAccuracy: true, maximumAge: 0 }
        );

        // Watch position updates
        const watcherId = navigator.geolocation.watchPosition(
            pos =>
                setTrackedPos({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                }),
            err => console.warn('watchPosition error', err),
            { enableHighAccuracy: true, maximumAge: 0 }
        );

        // Cleanup watcher on unmount
        return () => navigator.geolocation.clearWatch(watcherId);
    }, []);

    // Fetch current user avatar URL
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

    // Create a Leaflet icon for the user's avatar marker
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
                key={focusId || 'all'}
                bounds={vancouverBounds}
                scrollWheelZoom={true}
                className="h-full w-full"
                maxBounds={vancouverBounds}
                maxBoundsViscosity={1.0}
                minZoom={10}
                maxZoom={16}
            >
                {/* Ensure map resizes correctly and fits initial bounds */}
                <ResizeMap />
                <FitBounds bounds={vancouverBounds} />

                {/* Base tile layer for map visuals */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors © CARTO"
                    subdomains={['a', 'b', 'c', 'd']}
                />

                {/* Close popups on click or Escape */}
                <ClosePopupsOnClick />

                {/* Render markers for each event */}
                {events.map(evt => (
                    <ZoomMarker
                        key={evt.id}
                        evt={evt}
                        userPos={trackedPos}
                        ref={el => { if (el) markersRef.current[evt.id] = el }} />
                ))}

                {/* Handle external focus requests */}
                <FocusHandler
                    events={events}
                    focusId={focusId}
                    markersRef={markersRef}
                />

                {/* Locate control to allow user to find their position */}
                <LocateControl
                    position="topright"
                    drawCircle={false}
                    follow={true}
                    zoomTo={14}
                    trackedPos={trackedPos}
                    onLocated={([lat, lng]) => {
                        setUserPos({ lat, lng });
                    }}
                    locateOptions={{
                        enableHighAccuracy: true,
                        maximumAge: 0
                    }}
                />

                {/* User "You are here" marker if location available */}
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