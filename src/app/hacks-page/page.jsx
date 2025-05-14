'use client';

import { useState, useEffect } from 'react';
import FeedLayout from '@/components/FeedLayout'
import HackCard from '@/components/cards/HackCard'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'
import { clientDB } from '@/supabaseClient';

/**
 * HacksPage.jsx
 * Loaf Life - Hacks Page
 * 
 * This page lists the hacks that have been posted.
 * Fetches data from Supabase.
 * 
 * @author: Nathan O
 * 
 * Written with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */

export default function HacksPage() {
  const [selectedTag, setSelectedTag] = useState("All Tags");
  const [allHacks, setAllHacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const hackTags = ['Campus Life', 'Health & Wellness', 'Study Tips', 'Food', 'Career', 'Finance', 'Technology', 'Social'];

  useEffect(() => {
    const fetchHacks = async () => {
      setIsLoading(true);
      setError(null);
      try {        
        const { data, error: fetchError } = await clientDB
          .from('hacks')
          .select('id, title, description, created_at, user_id, tags, upvotes, downvotes');

        console.log("[HacksPage] Fetched data:", data);
        console.log("[HacksPage] Fetch error:", fetchError);

        if (fetchError) {
          throw fetchError;
        }
        setAllHacks(data || []);
        console.log("[HacksPage] allHacks state set with:", data || []);
      } catch (err) {
        setError(err.message);
        console.error("[HacksPage] Error fetching hacks catch block:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHacks();
  }, []);

  console.log("[HacksPage] Current allHacks state:", allHacks);
  const filteredHacks = selectedTag === "All Tags" 
    ? allHacks 
    : allHacks.filter(hack => hack.tags && hack.tags.includes(selectedTag));
  console.log("[HacksPage] Current filteredHacks:", filteredHacks);

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
        {isLoading && <p className="text-center text-gray-500 px-4">Loading hacks...</p>}
        {error && <p className="text-center text-red-500 px-4">Error: {error}</p>}
        {!isLoading && !error && filteredHacks.length > 0 ? (
          filteredHacks.map(hack => (
            <HackCard
              key={hack.id}
              id={hack.id}
              href={`/hacks-page/${hack.id}`}
              title={hack.title}
              upvotes={hack.upvotes}
              downvotes={hack.downvotes}
              tags={hack.tags}
              description={hack.description}
            />
          ))
        ) : (
          !isLoading && !error && <p className="text-center text-gray-500 px-4">No hacks found for the selected tag. Try adding one!</p>
        )}
        <Footer />
      </FeedLayout>
      <BottomNav />
    </div>
  )
}

