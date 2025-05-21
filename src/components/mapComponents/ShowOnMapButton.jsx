// components/mapComponents/ShowOnMapButton.jsx
'use client'
import { useRouter } from 'next/navigation'

export default function ShowOnMapButton({ id, children = 'Show on Map' }) {
  const router = useRouter()
  const handleClick = () => {
    // instead of lat/lng, push the event's ID
    router.push(`/map-page?focus=${id}`)
  }

  return (
    <button
      onClick={handleClick}
      className="inline-block px-4 py-2 mt-2 text-sm font-medium text-white bg-[#639751] hover:bg-[#4f7f4f] rounded transition"
    >
      {children}
    </button>
  )
}
