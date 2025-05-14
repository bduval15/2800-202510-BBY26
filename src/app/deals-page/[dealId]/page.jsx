'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import StickyNavbar from '@/components/StickyNavbar';
import BookmarkButton from '@/components/buttons/Bookmark';

import { ArrowLeftIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { clientDB } from '@/supabaseClient.js';

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


export default function DealDetailPage() {
  const params = useParams();
  const dealId = params.dealId;
  const supabase = clientDB;

  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayLocation, setDisplayLocation] = useState('');

  // Helper function to format time ago
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'N/A';
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds === 1 ? '' : 's'} ago`;
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
  };

  useEffect(() => {
    if (dealId && supabase) {
      const fetchDealDetails = async () => {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await supabase
          .from('deals')
          .select('*, user_profiles(name)') 
          .eq('id', dealId)
          .single();

        if (fetchError) {
          console.error('Error fetching deal details:', fetchError);
          if (fetchError.code === 'PGRST116') { // Not found error code
            setError('Deal not found.');
          } else {
            setError('Failed to load deal. Please try again.');
          }
          setDeal(null);
        } else if (data) {
          setDeal(data);
          let loc = data.location;
          if (data.location && typeof data.location === 'string') {
            try {
              const parsedLocation = JSON.parse(data.location);
              if (parsedLocation && parsedLocation.address) {
                loc = parsedLocation.address;
              }
            } catch (e) {
              console.warn("Failed to parse location JSON for deal detail:", data.location, e);
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
              <BookmarkButton dealId={deal.id} />
            </div>
          </div>

          {displayLocation && (
            <div className="mb-4">
              <div className="flex items-center mb-1">
                <h2 className="text-lg font-semibold text-[#6A4C3C] mr-2">Location</h2>
                <Link href="/map-page" passHref className="text-sm text-[#B87333] hover:text-[#8B4C24] flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" /> View on Map
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
            Posted by {deal.user_profiles && deal.user_profiles.name ? deal.user_profiles.name : (deal.user_id ? `User ${deal.user_id.substring(0,8)}...` : 'Unknown')} - {formatTimeAgo(deal.created_at)}
          </p>        
        </div>

        <Footer />
      </div>
      <BottomNav />
    </div>
  );
} 