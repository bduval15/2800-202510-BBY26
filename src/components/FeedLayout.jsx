/**
 * FeedLayout.jsx
 * Loaf Life – layout component for a scrollable feed with sticky navbar and sort bar.
 * 
 * Inspired by Reddit’s mobile UI patterns.
 * 
 * Generated with ChatGPT o4-mini-high.
 * 
 * @author https://chatgpt.com/
 */

'use client'

import StickyNavbar from './StickyNavbar'
import { ChevronDownIcon, ViewColumnsIcon } from '@heroicons/react/24/outline'

export default function FeedLayout({ children, title = 'Student Hacks' }) {
  return (
    <div className="dark:bg-gray-900 min-h-screen text-white flex flex-col">
      {/* 1. Sticky Loaf‐Life navbar */}
      <StickyNavbar />

      {/* 2. Sort / filter bar */}
      <div className="sticky top-16 z-10 bg-[#F5E3C6] border-b border-[#D1905A]">
        <div className="max-w-md mx-auto flex items-center px-4 py-2 text-[#8B4C24]">
          <button className="flex items-center space-x-1 text-sm font-medium hover:text-[#639751]">
            <span>Best</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>
          <span className="mx-3 h-4 border-l border-[#D1905A]" />
          <button className="flex items-center space-x-1 text-sm font-medium hover:text-[#639751]">
            <span>New</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>
          <div className="ml-auto">
            <ViewColumnsIcon className="h-5 w-5 text-[#8B4C24] hover:text-[#639751]" />
          </div>
        </div>
      </div>

      {/* 3. Feed area */}
      <main className="flex-1 overflow-auto max-w-md mx-auto px-4 py-6 space-y-6">
        {/* page title */}
        <h1 className="text-2xl font-bold text-[#8B4C24]">{title}</h1>
        {/* your PostCard/HackCard components go here */}
        {children}
      </main>
    </div>
  )
}
