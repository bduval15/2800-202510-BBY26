'use client';

import { useState, useEffect } from 'react';
import FeedLayout from '@/components/FeedLayout'
import HackCard from '@/components/cards/HackCard'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'
import { clientDB } from '@/supabaseClient';
import AIbutton from '@/components/buttons/AIbutton';
import { tags } from '@/lib/tags';

/**
 * HacksPage.jsx
 * Loaf Life - Hacks Page
 * 
 * This page lists hacks fetched from the Supabase 'hacks' table.
 * Users can filter hacks by tags and view them in a card layout.
 * It also includes an AI button for discovering hacks based on user interests.
 * 
 * Modified with assistance from Google Gemini 2.5 Flash
 *
 * @author: Nathan O
 * @author: https://gemini.google.com/app
 */

export default function HacksPage() {
  // -- State --
  const [selectedTags, setSelectedTags] = useState([]);
  const [allHacks, setAllHacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interests, setInterests] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  // -- Effects --
  useEffect(() => {
    const fetchUserAndInterests = async () => {
      const { data: { user } } = await clientDB.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);

        const { data: interestsData, error: interestsError } = await clientDB
          .from('user_profiles')
          .select('interests')
          .eq('id', user.id)
          .single();

        if (interestsError) {
          console.error('Failed to fetch interests:', interestsError.message);
        } else if (interestsData?.interests) {
          setInterests(Array.isArray(interestsData.interests)
            ? interestsData.interests
            : interestsData.interests.split(','));
        }
      } else {
        setCurrentUserId(null);
      }
    };

    fetchUserAndInterests();
  }, []);

  useEffect(() => {
    const fetchHacks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await clientDB
          .from('hacks')
          .select('id, title, description, created_at, user_id, tags, upvotes, downvotes, location')
          .order('created_at', { ascending: false });

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

  // -- Handlers --
  const handleTagToggle = (tag) => {
    if (tag === "ALL") {
      setSelectedTags([]);
    } else {
      setSelectedTags(prevSelectedTags =>
        prevSelectedTags.includes(tag)
          ? prevSelectedTags.filter(t => t !== tag)
          : [...prevSelectedTags, tag]
      );
    }
  };

  // -- Data Filtering --
  const filteredHacks = selectedTags.length === 0
    ? allHacks
    : allHacks.filter(hack => 
        hack.tags && selectedTags.some(selTag => hack.tags.includes(selTag.toLowerCase()))
      );
  console.log("[HacksPage] Current filteredHacks:", filteredHacks);

  return (
    <div className="bg-[#F5E3C6] pb-6">
      <FeedLayout
        title="Hacks"
        tagOptions={tags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
      >
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
              location={hack.location}
              createdAt={hack.created_at}
              userId={currentUserId}
            />
          ))
        ) : (
          !isLoading && !error && <p className="text-center text-gray-500 px-4">No hacks found, try adding one!</p>
        )}

        <div className="px-4 py-2 max-w-md mx-auto w-full">
          <AIbutton interests={interests} />
        </div>
        <Footer />
      </FeedLayout>
      <BottomNav />
    </div>
  )
}
