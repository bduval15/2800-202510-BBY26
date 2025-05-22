/**
 * EventPopup.jsx
 *
 * Loaf Life – Holds all the functionality for event popup modal when clicking on a pin.
 *
 * Modified with assistance from ChatGPT o4-mini-high.
 *
 * @author Brady Duval
 * @author https://chatgpt.com/
 *
 * @function EventPopup
 * @description Renders a popup for an event marker showing avatar, title, distance,
 *              thread label, and a button to navigate to the detailed post page.
 *
 * @function goToPost
 * @description Navigates the user to the detailed post page corresponding to the event.
 */

'use client';

import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { Popup } from 'react-leaflet';
import { useRouter } from 'next/navigation';
import {
  MapPinIcon,
} from '@heroicons/react/24/outline';

export default function EventPopup({ evt, userPosition }) {
  const router = useRouter();

  // Map of thread IDs to their display labels
  const labelMap = { hacks: 'Hacks', deals: 'Deals', events: 'Free Events' };

  // Determine the label for this event's thread
  const threadLabel = labelMap[evt.table_id] || 'General';

  // Source URL for the user's avatar, fallback to logo
  const avatarSrc = evt.userAvatar || '/images/logo.png';

  // State for holding the computed distance between user and event
  const [distanceKm, setDistanceKm] = useState(null);

  useEffect(() => {
    // Calculate and set distance when both userPosition and event coords exist
    if (
      userPosition &&
      typeof evt.lat === 'number' &&
      typeof evt.lng === 'number'
    ) {
      const from = L.latLng(userPosition.lat, userPosition.lng);
      const to = L.latLng(evt.lat, evt.lng);
      const meters = from.distanceTo(to); // Leaflet returns meters
      setDistanceKm(meters / 1000); // Convert to kilometers
    }
  }, [userPosition, evt.lat, evt.lng]);

  /**
   * goToPost
   *
   * @function goToPost
   * @description Navigate to the event's detailed post page when button is clicked.
   */
  const goToPost = () => {
    router.push(`/${evt.table_id}-page/${evt.id}`)
  }

  return (
    <Popup
      className="custom-popup"
      closeButton
      closeOnClick={false}
      minWidth={180}
      maxWidth={200}
    >
      <div className="p-1 w-50">
        {/* — Header: Avatar + Title on one line — */}
        <div className="flex items-center space-x-2 mb-1">
          <img
            src={avatarSrc}
            alt="avatar"
            className="w-12 h-12 rounded-full"
            onError={e => {
              // Fallback to default logo if avatar fails to load
              e.currentTarget.src = '/images/logo.png';
            }}
          />
          <h4 className="flex-1 text-sm font-semibold text-[#8B4C24] leading-snug">
            {evt.title}
          </h4>
        </div>
        {/* Distance indicator and thread label pill */}
        <div className="flex justify-between items-center text-gray-600 text-xs mb-3">
          <div className="flex items-center space-x-1">
            <MapPinIcon className="h-4 w-4" />
            <span>
              {distanceKm != null
                ? `${distanceKm.toFixed(1)} km away`
                : '…'}
            </span>
          </div>
          <span className="bg-[#D1905A] text-white text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
            {threadLabel}
          </span>
        </div>
        {/* — Call to action — */}
        <button
          onClick={goToPost}
          className="block w-full bg-[#639751] hover:bg-[#4f7a43] text-white text-sm font-medium py-2 rounded-lg"
        >
          Go to Post
        </button>
      </div>
    </Popup>
  );
}