
'use client'

import { useRouter } from 'next/navigation'
import { MapPinIcon } from '@heroicons/react/24/solid'

export default function ShowOnMapButton({ id }) {
  const router = useRouter()
  const handleClick = () => {
    router.push(`/map-page?focus=${id}`)
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Show on map"
      className="p-1 rounded-lg bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] hover:bg-[#EADDCA] shadow-md ml-2 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <MapPinIcon className="h-5 w-5 mr-1" /> {/* Icon */}
      <span className="text-sm">Show on Map</span>
    </button>
  )
}
