'use client'

import { useState } from 'react';
import FeedLayout from '@/components/FeedLayout'
import HackCard from '@/components/cards/HackCard'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'

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

export default function HacksPage() {
  const [selectedTag, setSelectedTag] = useState("All Tags");

  const hackTags = ['Campus Life', 'Health & Wellness', 'Study Tips', 'Food', 'Career', 'Finance', 'Technology', 'Social'];

  // Placeholder data simulating a Supabase fetch
  const [allHacks, setAllHacks] = useState([
    {
      id: 1,
      title: "Free BCIT Gym Access",
      upvotes: 20,
      downvotes: 4,
      comments: 7,
      description: "Students have free access to the BCIT gym. Just show your student ID!",
      tags: ['Campus Life', 'Health & Wellness']
    },
    {
      id: 2,
      title: "Budget Stir Fry Noodles Recipe",
      upvotes: 20,
      downvotes: 4,
      comments: 7,
      description: "Quick and easy stir fry noodles that won't break the bank.",
      tags: ['Food']
    },
    {
      id: 3,
      title: "Peanut Butter Mug Cake Recipe",
      upvotes: 20,
      downvotes: 4,
      comments: 7,
      description: "A delicious and simple mug cake you can make in minutes.",
      tags: ['Food']
    },
    {
      id: 4,
      title: "Student Budget Template",
      upvotes: 20,
      downvotes: 4,
      comments: 7,
      description: "A helpful template to manage your finances as a student.",
      tags: ['Finance', 'Study Tips']
    },
    {
      id: 5,
      title: "Streaming Service Alternatives",
      upvotes: 20,
      downvotes: 4,
      comments: 7,
      description: "Save money with these alternatives to popular streaming services.",
      tags: ['Technology', 'Finance']
    },
    {
      id: 6,
      title: "Budget Night Out",
      upvotes: 20,
      downvotes: 4,
      comments: 7,
      description: "Fun and affordable ideas for a night out with friends.",
      tags: ['Social', 'Finance']
    },
    {
      id: 7,
      title: "Effective Note-Taking Strategies",
      upvotes: 35,
      downvotes: 2,
      comments: 12,
      description: "Learn how to take better notes and improve your study habits.",
      tags: ['Study Tips']
    },
    {
      id: 8,
      title: "Finding Part-Time Jobs on Campus",
      upvotes: 28,
      downvotes: 3,
      comments: 9,
      description: "Tips and resources for finding part-time employment at BCIT.",
      tags: ['Career', 'Campus Life']
    }
  ]);

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
        <div className="text-left text-2xl font-bold text-[#8B4C24] pl-4 mb-4 mt-4">
          Hacks
        </div>
        {filteredHacks.length > 0 ? (
          filteredHacks.map(hack => (
            <HackCard
              key={hack.id}
              title={hack.title}
              upvotes={hack.upvotes}
              downvotes={hack.downvotes}
              comments={hack.comments}
              tags={hack.tags}
              description={hack.description}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 px-4">No hacks found for the selected tag. Try adding one!</p>
        )}
        <Footer />
      </FeedLayout>
      <BottomNav />
    </div>
  )
}

