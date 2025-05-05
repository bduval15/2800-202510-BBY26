// src/app/hacks-page/page.jsx
'use client'

import FeedLayout from '@/components/FeedLayout'
import HackCard from '@/components/cards/HackCard'
export default function HacksPage() {
  return (
    <div className="bg-[#F5E3C6]">
    <FeedLayout>
      {/* Placeholder content so you can see it’s working */}
      <div className="text-center text-[#8B4C24] bg-[#F5E3C6] ">
        Welcome to Student Hacks! Your posts will appear here.
      </div>
      <HackCard 
        title="Free McDonald's Coffee"
        upvotes={20}
        downvotes={4}
        comments={7}
      />
      <HackCard
        title="Free McDonald's Coffee"
        upvotes={20}
        downvotes={4}
        comments={7}
      />
      <HackCard
        title="Free McDonald's Coffee"
        upvotes={20}
        downvotes={4}
        comments={7}
      />
      <HackCard
        title="Free McDonald's Coffee"
        upvotes={20}
        downvotes={4}
        comments={7}
      />
      <HackCard
        title="Free McDonald's Coffee"
        upvotes={20}
        downvotes={4}
        comments={7}
      />
      <HackCard
        title="Free McDonald's Coffee"
        upvotes={20}
        downvotes={4}
        comments={7}
      />
    </FeedLayout>
    </div>
  )
}

