'use client';

import React, { useState } from 'react';
// import FeedLayout from '@/components/FeedLayout';
import Footer from '@/components/Footer';
import Link from 'next/link';
import BookmarkButton from '@/components/buttons/Bookmark';
import VoteButtons from '@/components/buttons/VoteButtons';
import CommentDisplay from '@/components/buttons/CommentCount';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Tag from '@/components/Tag';
import BottomNav from '@/components/BottomNav';
import CommentSection from '@/components/sections/CommentSection';
import StickyNavbar from '@/components/StickyNavbar';

/**
 * HackDetails.jsx
 * Loaf Life - Hack Details Page
 *
 * This page displays the details of a specific hack.
 * It includes the hack title, description, hack details, author, and timestamp.
 * It also includes a button to save the hack.
 *
 * @author: Nathan O
 *
 * Modified with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */

// Placeholder data currently being used, need to update implementation to use database later - Nate

// Placeholder data directly here
const placeholderHack = {
  id: 'placeholder',
  title: 'Free BCIT Gym Access',
  descriptionTitle: 'BCIT Recreation (Burnaby Campus)',
  description: `All full-time and part-time BCIT students get a complimentary Recreation membership from the first day of classes until the last. With just your BCIT student ID, you'll have free access to
  a full weight room, gymnasium, change rooms, showers, and more.`,
  hackTitle: 'A few perks (paid upgrade)',
  hackDetails: `If you want squash/racquetball or intramurals, those are available at nominal additional rates—still well below commercial alternatives. Lockers, towels, and laundry service can also be added for a small fee (e.g. court bookings run under $10/hr)`,
  author: 'Student',
  timestamp: 'Two days ago',
  upvotes: 150,
  downvotes: 10,
  comments: 25,
  tags: ['Campus Life', 'Health & Wellness'],
};

export default function HackDetailPage({ params }) {
  const hackId = params.hackId;
  // Initialize state directly with placeholder data
  const [hack, setHack] = useState(placeholderHack);

  // Render the component with placeholder data
  return (
    <div className="pb-6">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <StickyNavbar />
        <div className="bg-[#FDFAF5] p-4 rounded-lg border border-[#8B4C24]/30 pt-16">
          {/* Back Button */}
          <Link href="/hacks-page" className="mb-4 inline-block">
            <button className="bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] hover:bg-[#EADDCA] px-3 py-1.5 rounded-lg shadow-md">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          </Link>

          {/* Hack Title */}
          <h1 className="text-3xl font-bold mb-6 text-[#8B4C24]">{hack.title}</h1>

          {/* Tags Display */}
          {hack.tags && hack.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap">
              {hack.tags.slice(0, 3).map((tag, index) => (
                <Tag key={index} label={tag} />
              ))}
            </div>
          )}

          {/* Description Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-[#8B4C24]">{hack.descriptionTitle}</h2>
            <p className="text-[#8B4C24]">{hack.description}</p>
          </div>

          {/* Hack Details Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-[#8B4C24]">{hack.hackTitle}</h2>
            <p className="text-[#8B4C24]">{hack.hackDetails}</p>
          </div>

          {/* Author/Timestamp */}
          <p className="text-sm text-[#8B4C24]/80 mb-8">By {hack.author} - {hack.timestamp}</p>

          {/* Interactive Buttons Row */}
          <div className="flex justify-between items-center mb-6">
            <div className="mr-2">
              <VoteButtons upvotes={hack.upvotes} downvotes={hack.downvotes} />
            </div>
            <BookmarkButton />
          </div>
        </div>

        <CommentSection />
        <Footer />
      
      </div>
      <BottomNav />
    </div>
  );
}
