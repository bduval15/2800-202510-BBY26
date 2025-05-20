'use client';

import { useState, useEffect } from 'react';
import FeedLayout from '@/components/FeedLayout';
import EventCard from '@/components/cards/EventCard';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { clientDB } from '@/supabaseClient';
import AIbutton from '@/components/buttons/AIbutton';

/**
 * EventPage.jsx
 * Loaf Life - Events Page
 * 
 * This page lists the hacks that have been posted.
 * Fetches data from Supabase.
 * 
 * @author: Nathan O
 * @author: Conner P
 * 
 * Written with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */

export default function EventsPage() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  const tags = [
    'Animal Care',
    'Art',
    'Board Games',
    'Comedy',
    'Coding',
    'Cooking',
    'Cycling',
    'Esports',
    'Entrepreneurship',
    'Fitness',
    'Football',
    'Gaming',
    'Hiking',
    'Investing',
    'Mental Health',
    'Movies',
    'Music',
    'Photography',
    'Public Speaking',
    'Reading',
    'Study Groups',
    'Sustainability',
    'Yoga'
  ];

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { session }, error: sessionError } = await clientDB.auth.getSession();
      if (sessionError) {
        console.error('Error fetching session for EventsPage:', sessionError);
        return;
      }
      if (session?.user) {
        setCurrentUserId(session.user.id);
      } else {
        setCurrentUserId(null);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchInterests = async () => {
      const { data: { user } } = await clientDB.auth.getUser();
      if (!user) return;
  
      const { data, error } = await clientDB
        .from('user_profiles')
        .select('interests')
        .eq('id', user.id)
        .single();
  
      if (error) {
        console.error('Failed to fetch interests:', error.message);
      } else if (data?.interests) {
        setInterests(Array.isArray(data.interests)
          ? data.interests
          : data.interests.split(','));
      }
  
      setLoading(false);
    };
  
    fetchInterests();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await clientDB
          .from('events')   // ← table name changed
          .select('id, title, description, location, created_at, user_id, tags, upvotes, downvotes');

        if (fetchError) throw fetchError;

        setAllEvents(data || []);
      } catch (err) {
        setError(err.message);
        console.error("[EventsPage] Error fetching events:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

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

  // Filter by tag
  const filteredEvents = selectedTags.length === 0
    ? allEvents
    : allEvents.filter(evt => 
      evt.tags && selectedTags.some(selTag => evt.tags.includes((selTag))));

  return (
    <div className="bg-[#F5E3C6] pb-6">
      <FeedLayout
        title="Events"
        tagOptions={tags}
        selectedTags={selectedTags}
        onTagChange={handleTagToggle}
      >
        <div className="text-left text-2xl font-bold text-[#8B4C24] pl-4 mb-4 mt-4">
          Events
        </div>

        {isLoading && <p className="text-center text-gray-500 px-4">Loading events...</p>}
        {error && <p className="text-center text-red-500 px-4">Error: {error}</p>}

        {!isLoading && !error && filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard
              key={event.id}
              id={event.id}
              href={`/events-page/${event.id}`} // ← route adjusted
              title={event.title}
              location={event.location}
              upvotes={event.upvotes}
              downvotes={event.downvotes}
              tags={event.tags}
              description={event.description}
              userId={currentUserId}
            />
          ))
        ) : (
          !isLoading && !error && (
            <p className="text-center text-gray-500 px-4">
              No events found for the selected tag. Try adding one!
            </p>
          )
        )}

        <div className="px-4 py-2 max-w-md mx-auto w-full">
          <AIbutton interests={interests} />
        </div>

        <Footer />
      </FeedLayout>

      <BottomNav />
    </div>
  );
}