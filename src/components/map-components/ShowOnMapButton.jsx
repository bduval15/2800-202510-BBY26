'use client';

import React from 'react';
import PropTypes from 'prop-types';
import { MapPinIcon } from '@heroicons/react/24/outline';

/**
 * ShowOnMapButton.jsx
 * Loaf Life - Show on Map Button
 * 
 * This component displays a button that, when clicked, will redirect
 * the user to a map page focused on the provided latitude and longitude.
 * 
 * @param {object} props - Component props
 * @param {number} props.lat - The latitude for the map.
 * @param {number} props.lng - The longitude for the map.
 */
const ShowOnMapButton = ({ lat, lng }) => {
  const handleClick = () => {
    // Placeholder for navigation logic
    console.log(`Redirecting to map with lat: ${lat}, lng: ${lng}`);
    // Example: router.push(`/map-page?lat=${lat}&lng=${lng}`);
  };

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Show on map"
      className="p-1 rounded-lg bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] hover:bg-[#EADDCA] shadow-md ml-2 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"

    >
      <MapPinIcon className="h-5 w-5 mr-1" /> {/* Icon */}
      <span className="text-sm">Show on Map</span> {/* Placeholder text */}
    </button>
  );
};

ShowOnMapButton.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
};

export default ShowOnMapButton; 