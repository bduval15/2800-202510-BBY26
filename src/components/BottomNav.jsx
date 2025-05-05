// components/BottomNav.jsx
'use client'

import Link from 'next/link'
import {
  HomeIcon,
  PlusCircleIcon,
  MapIcon,
  UserIcon,
} from '@heroicons/react/24/outline'

export default function BottomNav() {
  const items = [
    { href: '/', icon: <HomeIcon className="h-8 w-8" />, },
    { href: '/hacks-page', icon: <PlusCircleIcon className="h-8 w-8" />, },
    { href: '/map', icon: <MapIcon className="h-8 w-8" />, },
    { href: '/profile', icon: <UserIcon className="h-8 w-8" />, },
  ]

  return (
    <nav className=" fixed bottom-0 left-0 w-full bg-white border-t">
      <div className="bg-[#F5E3C6] max-w-md mx-auto flex justify-around">
        {items.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center py-2 [#8B4C24] hover:text-gray-900"
          >
            {icon}
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
