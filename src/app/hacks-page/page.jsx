/**
 * HacksPage.jsx
 * Loaf Life - Hacks Page
 * 
 * This page lists the hacks that have been posted.
 * 
 * @author: Nathan O
 * 
 * Written with assistance from Google Gemini 2.5 Flash
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
      <div className="text-left text-2xl font-bold text-[#8B4C24] pl-4">
        Saving Tips
      </div>
      <HackCard 
        title="Free BCIT Gym Access"
        upvotes={20}
        downvotes={4} 
        comments={7} 
        tags={['BCIT', 'Gym', 'Free']} 
      />
      <HackCard
        title="Budget Stir Fry Noodles Recipe"
        upvotes={20}
        downvotes={4}
        comments={7}
      />
      <HackCard
        title="Peanut Butter Mug Cake Recipe"
        upvotes={20}
        downvotes={4}
        comments={7}
      />
      <HackCard
        title="Budget Template"
        upvotes={20}
        downvotes={4}
        comments={7}
      />
      <HackCard
        title="Streaming Service Alternatives"
        upvotes={20}
        downvotes={4}
        comments={7}
      />
      <HackCard
        title="Budget Night Out"
        upvotes={20}
        downvotes={4}
        comments={7}
      />
    </FeedLayout>
    <Footer />
    </div>
  )
}

