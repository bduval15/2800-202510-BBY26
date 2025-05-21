/**
 * ShowOnMapButton.jsx
 *
 * Loaf Life – Renders a button that, when clicked, navigates
 *              the user to the map page focusing on a specific event.
 *
 * @author Brady Duval
 *
 * @function ShowOnMapButton
 * @description Displays a map-pin button that redirects to `/map-page?focus={id}`
 *              to highlight the corresponding event marker.
 *
 * @function handleClick
 * @description Callback invoked on button click to perform navigation
 *              to the focused event map view.
 */

'use client'

import { useRouter } from 'next/navigation'
import { MapPinIcon } from '@heroicons/react/24/solid'

export default function ShowOnMapButton({ id }) {
  const router = useRouter(); // Next.js router instance for navigation
  
  /**
   * handleClick
   *
   * @function handleClick
   * @description Navigate to the map page with the focus query parameter
   *              set to the provided event ID.
   */
  const handleClick = () => {
    // Push a new route to the map page, passing the focused event ID
    router.push(`/map-page?focus=${id}`)
  }

  return (
    // Button to trigger map focus
    <button
      onClick={handleClick}  // Attach click handler
      aria-label="Show on map" // Accessibility label
      className="p-1 rounded-lg bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] hover:bg-[#EADDCA] shadow-md ml-2 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <MapPinIcon className="h-5 w-5 mr-1" />  {/* Pin icon indicating map focus action */}
      <span className="text-sm">Show on Map</span> {/* Button text label */}
    </button>
  )
}
