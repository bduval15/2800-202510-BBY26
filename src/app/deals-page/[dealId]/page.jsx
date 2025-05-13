'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import StickyNavbar from '@/components/StickyNavbar';
import BookmarkButton from '@/components/buttons/Bookmark';
// import Tag from '@/components/Tag'; // Tag component might not be needed if tags are removed
import { ArrowLeftIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { clientDB } from '@/supabaseClient.js'; // Import Supabase client

/**
 * DealDetailPage.jsx
 * Loaf Life - Deal Detail Page
 *
 * Displays the details of a specific deal fetched from Supabase.
 * Structure and styling adapted from HackDetailPage.
 * 
 * Modified with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 * @author Nate O
 */

// Placeholder data removed, will fetch from Supabase
// const placeholderDeal = { ... };

export default function DealDetailPage() {
  const params = useParams();
  const dealId = params.dealId;
  const supabase = clientDB;

  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayLocation, setDisplayLocation] = useState('');

  useEffect(() => {
    if (dealId && supabase) {
      const fetchDealDetails = async () => {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await supabase
          .from('deals')
          .select('*')
          .eq('id', dealId)
          .single(); 

        if (fetchError) {
          console.error('Error fetching deal details:', fetchError);
          setError('Failed to load deal. Please try again.');
          setDeal(null);
        } else if (data) {
          setDeal(data);
          // Parse location
          let loc = data.location;
          if (data.location && typeof data.location === 'string') {
            try {
              const parsedLocation = JSON.parse(data.location);
              if (parsedLocation && parsedLocation.address) {
                loc = parsedLocation.address;
              }
            } catch (e) {
              console.warn("Failed to parse location JSON for deal detail:", data.location, e);
              // loc remains data.location
            }
          } else if (data.location && typeof data.location === 'object' && data.location.address) {
            loc = data.location.address;
          }
          setDisplayLocation(loc);
        } else {
          setError('Deal not found.');
          setDeal(null);
        }
        setLoading(false);
      };
      fetchDealDetails();
    }
  }, [dealId, supabase]);

  if (loading) {
    return (
      <div className="bg-[#F5E3C6] min-h-screen flex items-center justify-center">
        <StickyNavbar />
        <p className="text-[#8B4C24]">Loading deal details...</p>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F5E3C6] min-h-screen flex flex-col items-center justify-center">
        <StickyNavbar />
        <div className="max-w-md mx-auto px-4 py-6 text-center">
            <p className="text-red-500 text-xl mb-4">{error}</p>
            <Link href="/deals-page" className="text-[#B87333] hover:text-[#8B4C24]">
                Go back to Deals
            </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!deal) {    
    return (
        <div className="bg-[#F5E3C6] min-h-screen flex items-center justify-center">
            <StickyNavbar />
            <p className="text-[#8B4C24]">Deal information is not available.</p>
            <BottomNav />
        </div>
    ); 
  }

  // Format timestamp (created_at)
  const formattedTimestamp = deal.created_at 
    ? new Date(deal.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      })
    : 'Not available';

  return (
    <div className="bg-[#F5E3C6] min-h-screen pb-6"> 
      <StickyNavbar />
      <div className="max-w-md mx-auto px-4 py-6 space-y-6 pt-20"> 
        
        <div className="bg-[#FDFAF5] p-4 rounded-lg border border-[#8B4C24]/30"> 
          <Link href="/deals-page" className="mb-4 inline-block">
            <button className="bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] hover:bg-[#EADDCA] px-3 py-1.5 rounded-lg shadow-md flex items-center">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          </Link>

          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-[#8B4C24] mr-4">{deal.title}</h1> 
            <div className="shrink-0"> 
              <BookmarkButton />
            </div>
          </div>

          {displayLocation && (
            <div className="mb-4">
              <div className="flex items-center mb-1">
                <h2 className="text-lg font-semibold text-[#6A4C3C] mr-2">Location</h2>
                <Link href="/map-page" passHref legacyBehavior>
                  <a className="text-sm text-[#B87333] hover:text-[#8B4C24] flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" /> View on Map
                  </a>
                </Link>
              </div>
              <p className="text-[#8B4C24]">{displayLocation}</p>
            </div>
          )}
          {deal.price !== null && deal.price !== undefined && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1 text-[#6A4C3C]">Price</h2>
              <p className="text-[#8B4C24]">${typeof deal.price === 'number' ? deal.price.toFixed(2) : deal.price}</p>
            </div>
          )}

          <p className="text-sm text-[#8B4C24]/80 mb-8">
            Posted by User {deal.user_id} - {formattedTimestamp}
          </p>        
        </div>

        <Footer />
      </div>
      <BottomNav />
    </div>
  );
} 