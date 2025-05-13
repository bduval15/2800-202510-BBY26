'use client';

import React, { useState, useEffect, use } from 'react';
import Footer from '@/components/Footer';
import Link from 'next/link';
import BookmarkButton from '@/components/buttons/Bookmark';
import VoteButtons from '@/components/buttons/VoteButtons';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Tag from '@/components/Tag';
import BottomNav from '@/components/BottomNav';
import CommentSection from '@/components/sections/CommentSection';
import StickyNavbar from '@/components/StickyNavbar';
import { clientDB } from '@/supabaseClient';

/**
 * HackDetails.jsx
 * Loaf Life - Hack Details Page
 *
 * This page displays the details of a specific hack.
 * Fetches data from Supabase based on hack ID.
 * It includes the hack title, description, hack details, author, and timestamp.
 * It also includes a button to save the hack.
 *
 * @author: Nathan O
 *
 * Modified with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */

export default function HackDetailPage({ params }) {
  const resolvedParams = use(params);
  const hackId = resolvedParams.id;
  const [hack, setHack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hackId) {
      setIsLoading(false);
      setError("Hack ID is missing.");
      return;
    }

    const fetchHackDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data: hackData, error: fetchError } = await clientDB
          .from('hacks')
          .select('id, title, description, created_at, user_id, tags, upvotes, downvotes, user_profiles(name)')
          .eq('id', hackId)
          .single(); 

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError("Hack not found."); 
            setHack(null);
          } else {
            throw fetchError;
          }
        } else if (!hackData) {
          setError("Hack not found.");
        } else {
          setHack(hackData);
        }
      } catch (err) {
        setError(err.message);
        console.error(`Error fetching hack ${hackId}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHackDetails();
  }, [hackId]);

  if (isLoading) {
    return <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center">Loading hack details...</div>;
  }

  if (error) {
    return <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center text-red-500">Error: {error}</div>;
  }

  if (!hack) {
    return <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center">Hack not found.</div>;
  }

  // Helper function to format time ago
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'N/A';
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    }
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} weeks ago`;
  };

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
            <p className="text-[#8B4C24]">{hack.description}</p>
          </div>         

          {/* Author/Timestamp */}
          <p className="text-sm text-[#8B4C24]/80 mb-8">
             By {hack.user_profiles && hack.user_profiles.name ? hack.user_profiles.name : 'Unknown'} - {formatTimeAgo(hack.created_at)}
          </p>

          {/* Interactive Buttons Row */}
          <div className="flex justify-between items-center mb-6">
            <div className="mr-2">
              <VoteButtons upvotes={hack.upvotes || 0} downvotes={hack.downvotes || 0} />
            </div>
            <BookmarkButton />
          </div>
        </div>

        <CommentSection hackId={hack.id} /> 
        <Footer />
      
      </div>
      <BottomNav />
    </div>
  );
}
