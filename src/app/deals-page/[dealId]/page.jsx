'use client'

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import StickyNavbar from '@/components/StickyNavbar';
import BookmarkButton from '@/components/buttons/Bookmark';
import Tag from '@/components/Tag';
import { ArrowLeftIcon, MapPinIcon } from '@heroicons/react/24/outline';

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
  author: "DealHunter23",
  timestamp: "1 day ago",
  tags: ['Food', 'Discount', 'Student Deal'],
  expirationDate: "December 31, 2024"
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
        
        {/* Main content card */}
        <div className="bg-[#FDFAF5] p-4 rounded-lg border border-[#8B4C24]/30"> 
          {/* Back Button */}
          <Link href="/deals-page" className="mb-4 inline-block">
            <button className="bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] hover:bg-[#EADDCA] px-3 py-1.5 rounded-lg shadow-md flex items-center">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          </Link>

          {/* Combined Deal Title and Bookmark Button */}
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-[#8B4C24] mr-4">{deal.title}</h1> 
            <div className="shrink-0"> 
              <BookmarkButton />
            </div>
          </div>

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
              <div className="flex items-center mb-1">
                <h2 className="text-lg font-semibold text-[#6A4C3C] mr-2">Location</h2>
                <Link href="/map-page" passHref legacyBehavior>
                  <a className="text-sm text-[#B87333] hover:text-[#8B4C24] flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" /> View on Map
                  </a>
                </Link>
              </div>
              <p className="text-[#8B4C24]">{deal.location}</p>
            </div>
          )}
          {deal.price !== null && deal.price !== undefined && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1 text-[#6A4C3C]">Price</h2>
              <p className="text-[#8B4C24]">${typeof deal.price === 'number' ? deal.price.toFixed(2) : deal.price}</p>
            </div>
          )}
          {deal.expirationDate && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1 text-[#6A4C3C]">Expires On</h2>
              <p className="text-[#8B4C24]">{deal.expirationDate}</p>
            </div>
          )}

          {/* Author/Timestamp */}
          <p className="text-sm text-[#8B4C24]/80 mb-8">Posted by {deal.author} - {deal.timestamp}</p>        
        </div>

        <Footer />
      </div>
      <BottomNav />
    </div>
  );
} 