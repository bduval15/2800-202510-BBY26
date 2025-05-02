/**
 * Page.jsx
 * Loaf Life – hacks-page for hosting all of the hacks cards.
 * 
 * Quick template for testing purposes.
 * 
 * @author Braeden Duval
 */
'use client'

import FeedLayout from '@/components/FeedLayout'
import Footer     from '@/components/Footer'

export default function HacksPage() {
  return (
    <div className="bg-[#F5E3C6] min-h-screen flex flex-col">
      <FeedLayout>
        <p className="text-[#8B4C24]">
          Welcome to Student Hacks! Your posts will appear here.
        </p>
      </FeedLayout>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}
