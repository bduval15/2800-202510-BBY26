/**
 * HacksPage.jsx
 * Loaf Life - Hacks Page
 * 
 * This page lists the hacks that have been posted.
 * 
 * @author: Nathan O
 * 
 * Modified with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */
'use client'

import FeedLayout from '@/components/FeedLayout'
import HackCard from '@/components/cards/HackCard'
import Footer from '@/components/Footer'

export default function HacksPage() {
  return (
    <div className="bg-[#F5E3C6]">
    <FeedLayout>
      {/* Placeholder content so you can see it’s working */}
      <div className="text-center text-[#8B4C24] bg-[#F5E3C6] ">
        Welcome to Student Hacks! Your posts will appear here.
      </div>
      <HackCard 
        title="BCIT Recreation (Burnaby Campus)"
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
    <Footer />
    </div>
  )
}

