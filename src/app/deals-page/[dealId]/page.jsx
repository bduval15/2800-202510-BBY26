'use client'

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import StickyNavbar from '@/components/StickyNavbar';
import BookmarkButton from '@/components/buttons/Bookmark';
import VoteButtons from '@/components/buttons/VoteButtons';
import Tag from '@/components/Tag';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import CommentSection from '@/components/sections/CommentSection';

/**
 * DealDetailPage.jsx
 * Loaf Life - Deal Detail Page
 *
 * Displays the details of a specific deal.
 * Structure and styling adapted from HackDetailPage.
 * 
 * Modified with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 * @author Nate O
 */

// Placeholder data for a single deal
const placeholderDeal = {
  id: 'placeholder-deal',
  title: "Half-Price Pizza Wednesdays",
  location: "Pizza Place Downtown",
  price: 10.99,
  distance: 2.5,
  descriptionTitle: "Amazing Mid-Week Treat!",
  description: "Enjoy delicious pizzas at half the price every Wednesday. A perfect way to break up the week without breaking the bank. Valid at participating locations. Show your student ID for an extra 5% off!",
  author: "DealHunter23",
  timestamp: "1 day ago",
  upvotes: 120,
  downvotes: 8,
  tags: ['Food', 'Discount', 'Student Deal']
};

export default function DealDetailPage() {
  const params = useParams();
  const dealId = params.dealId; 

  // Initialize state with placeholder deal data
  const [deal, setDeal] = useState(placeholderDeal);

  return (
    <div className="bg-[#F5E3C6] min-h-screen pb-6"> 
      <StickyNavbar />
      <div className="max-w-md mx-auto px-4 py-6 space-y-6 pt-20"> 
        
        <div className="bg-[#FDFAF5] p-4 rounded-lg border border-[#8B4C24]/30"> {/* Main content card */}
          {/* Back Button */}
          <Link href="/deals-page" className="mb-4 inline-block">
            <button className="bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] hover:bg-[#EADDCA] px-3 py-1.5 rounded-lg shadow-md flex items-center">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          </Link>

          {/* Deal Title */}
          <h1 className="text-3xl font-bold mb-6 text-[#8B4C24]">{deal.title}</h1>

          {/* Tags Display */}
          {deal.tags && deal.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {deal.tags.map((tag, index) => (
                <Tag key={index} label={tag} />
              ))}
            </div>
          )}

          {/* Deal Specific Info */}
          {deal.location && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1 text-[#6A4C3C]">Location</h2>
              <p className="text-[#8B4C24]">{deal.location}</p>
            </div>
          )}
          {deal.price !== null && deal.price !== undefined && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1 text-[#6A4C3C]">Price</h2>
              <p className="text-[#8B4C24]">${typeof deal.price === 'number' ? deal.price.toFixed(2) : deal.price}</p>
            </div>
          )}
          {deal.distance !== null && deal.distance !== undefined && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1 text-[#6A4C3C]">Distance</h2>
              <p className="text-[#8B4C24]">{deal.distance} km</p>
            </div>
          )}

          {/* Description Section */}
          {deal.description && (
            <div className="mb-6">
              {deal.descriptionTitle && <h2 className="text-xl font-semibold mb-2 text-[#8B4C24]">{deal.descriptionTitle}</h2>}
              <p className="text-[#8B4C24] whitespace-pre-line">{deal.description}</p>
            </div>
          )}
          
          {/* Author/Timestamp */}
          <p className="text-sm text-[#8B4C24]/80 mb-8">Posted by {deal.author} - {deal.timestamp}</p>

          {/* Interactive Buttons Row */}
          <div className="flex justify-between items-center mb-6">
            <div className="mr-2">
              <VoteButtons upvotes={deal.upvotes} downvotes={deal.downvotes} />
            </div>
            <BookmarkButton />
          </div>
        </div>

        <CommentSection /> {/* Comments section like in hacks detail page */}
        <Footer />
      </div>
      <BottomNav />
    </div>
  );
} 