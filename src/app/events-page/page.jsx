/**
 * page.jsx (EventsPage)
 * Loaf Life – Displays a list of events and allows filtering.
 *
 * This page fetches events from Supabase and presents them to the user.
 * Users can view event details, filter events using tags, and utilize an
 * AI button for event suggestions. Event information, including title,
 * location, and dates, is displayed on individual cards.
 *
 * Features:
 * - Fetches and displays a list of events from Supabase.
 * - Allows users to filter events based on selected tags.
 * - Integrates an AI button for event recommendations.
 * - Displays event details (title, location, dates) on cards.
 *
 * Written with assistance from Google Gemini 2.5 Flash.
 *
 * @author Nathan Oloresisimo
 * @author Conner Ponton
 * @author https://gemini.google.com/app
 */

'use client';

import { useState, useEffect } from 'react';
import FeedLayout from '@/components/FeedLayout';
import EventCard from '@/components/cards/EventCard';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { clientDB } from '@/supabaseClient';
import AIbutton from '@/components/buttons/AIbutton';
import { tags } from '@/lib/tags';

export default function EventsPage() {
  // -- State & Hooks--
  const [selectedTags, setSelectedTags] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch current user ID
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

  // Fetch user interests
  useEffect(() => {
    const fetchInterests = async () => {
      const { data: { user } } = await clientDB.auth.getUser();
      if (!user) {
        setLoading(false); // Ensure loading is set to false even if no user
        return;
      }

      try {
        const { data, error } = await clientDB
          .from('user_profiles')
          .select('interests')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Failed to fetch interests:', error.message);
        } else if (data?.interests) {
          // Interests might be stored as an array or a comma-separated string; ensure it's an array.
          setInterests(Array.isArray(data.interests)
            ? data.interests
            : data.interests.split(',').map(interest => interest.trim()).filter(interest => interest));
        }
      } catch (e) {
        console.error('Exception while fetching interests:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, []);

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await clientDB
          .from('events')
          .select('id, title, description, location, created_at, user_id, tags, upvotes, downvotes, start_date, end_date');

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

  // -- Handlers --
  const handleTagToggle = (tag) => {
    if (tag === "ALL") {
      setSelectedTags([]);
    } else {
      setSelectedTags(prevSelectedTags =>
        // If the tag is already selected, remove it; otherwise, add it.
        prevSelectedTags.includes(tag)
          ? prevSelectedTags.filter(t => t !== tag)
          : [...prevSelectedTags, tag]
      );
    }
  };

  // Filter events based on selected tags.
  // If no tags are selected, all events are shown.
  const filteredEvents = selectedTags.length === 0
    ? allEvents
    : allEvents.filter(evt =>
      evt.tags && selectedTags.some(selTag => evt.tags.includes(selTag.toLowerCase())));

  return (
    // Main Page Container
    <div className="bg-[#F5E3C6] pb-6">
      {/* Feed Layout Section */}
      <FeedLayout
        title="Events"
        tagOptions={tags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
      >  
        {/* Loading and Error States */}
        {isLoading && <p className="text-center text-gray-500 px-4">Loading events...</p>}
        {error && <p className="text-center text-red-500 px-4">Error: {error}</p>}

        {/* Event Cards Display */}
        {!isLoading && !error && filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard
              key={event.id}
              id={event.id}
              href={`/events-page/${event.id}`}
              title={event.title}
              location={event.location}
              upvotes={event.upvotes}
              downvotes={event.downvotes}
              tags={event.tags}
              description={event.description}
              userId={currentUserId}
              createdAt={event.created_at}
              startDate={event.start_date}
              endDate={event.end_date}
            />
          ))
        ) : (
          // No Events Found Message
          !isLoading && !error && (
            <p className="text-center text-gray-500 px-4">
              No events found, try adding one!
            </p>
          )
        )}

        {/* AI Button Section */}
        <div className="px-4 py-2 max-w-md mx-auto w-full">
          <AIbutton interests={interests} />
        </div>

        {/* Footer Section */}
        <Footer />
      </FeedLayout>

      {/* Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}