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

import { useState } from 'react';
import FeedLayout from '@/components/FeedLayout'
import HackCard from '@/components/cards/HackCard'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'

export default function HacksPage() {
  const [selectedTag, setSelectedTag] = useState("All Tags");

  const hackTags = ['Campus Life', 'Health & Wellness', 'Study Tips', 'Food', 'Career', 'Finance', 'Technology', 'Social'];

  // Placeholder data simulating a Supabase fetch
  const allHacks = [
    {
      id: 1,
      title: "Free BCIT Gym Access",
      upvotes: 20,
      downvotes: 4,
      comments: 7,
      tags: ['Campus Life', 'Health & Wellness']
    },
    {
      id: 2,
      title: "Budget Stir Fry Noodles Recipe",
      upvotes: 20,
      downvotes: 4,
      comments: 7,
      tags: ['Food']
    },
    {
      id: 3,
      title: "Peanut Butter Mug Cake Recipe",
      upvotes: 20,
      downvotes: 4,
      comments: 7,
      tags: ['Food']
    },
    {
      id: 4,
      title: "Student Budget Template",
      upvotes: 20,
      downvotes: 4,
      comments: 7,
      tags: ['Finance', 'Study Tips']
    },
    {
      id: 5,
      title: "Streaming Service Alternatives",
      upvotes: 20,
      downvotes: 4,
      comments: 7,
      tags: ['Technology', 'Finance']
    },
    {
      id: 6,
      title: "Budget Night Out",
      upvotes: 20,
      downvotes: 4,
      comments: 7,
      tags: ['Social', 'Finance']
    },
    {
      id: 7,
      title: "Effective Note-Taking Strategies",
      upvotes: 35,
      downvotes: 2,
      comments: 12,
      tags: ['Study Tips']
    },
    {
      id: 8,
      title: "Finding Part-Time Jobs on Campus",
      upvotes: 28,
      downvotes: 3,
      comments: 9,
      tags: ['Career', 'Campus Life']
    }
  ];

  const filteredHacks = selectedTag === "All Tags" 
    ? allHacks 
    : allHacks.filter(hack => hack.tags && hack.tags.includes(selectedTag));

  return (
    <div className="bg-[#F5E3C6] pb-6">
      <FeedLayout
        tagOptions={hackTags}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
      >
        <div className="text-left text-2xl font-bold text-[#8B4C24] pl-4">
          Hacks
        </div>
        {filteredHacks.map(hack => (
          <HackCard
            key={hack.id}
            title={hack.title}
            upvotes={hack.upvotes}
            downvotes={hack.downvotes}
            comments={hack.comments}
            tags={hack.tags}
          />
        ))}
        <Footer />
      </FeedLayout>
      <BottomNav />
    </div>
  )
}

