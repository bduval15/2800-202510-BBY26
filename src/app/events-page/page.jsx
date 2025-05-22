/**
 * page.jsx (EventsPage)
 *
 * Loaf Life
 *   Displays a list of events and allows filtering. Fetches events from Supabase and presents
 *   them to the user. Users can view event details, filter events using tags, and utilize
 *   an AI button for event suggestions. Utilizes Next.js for routing and React for UI.
 *   Integrates with Supabase for data fetching.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author Conner Ponton
 *   @author https://gemini.google.com/app (Assisted with code)
 *
 * Main Component:
 *   @function EventsPage
 *   @description Renders a page displaying a list of events fetched from Supabase. Allows
 *                users to filter events by tags and provides an AI button for event
 *                recommendations. Event information (title, location, dates) is shown on
 *                individual cards.
 *   @returns {JSX.Element} The rendered events page.
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
  // State for currently selected filter tags.
  const [selectedTags, setSelectedTags] = useState([]);
  // State for all events fetched from the database.
  const [allEvents, setAllEvents] = useState([]);
  // State to manage loading indicator for events fetching.
  const [isLoading, setIsLoading] = useState(true);
  // State for displaying errors during event fetching.
  const [error, setError] = useState(null);
  // State for user interests, fetched for AI button suggestions.
  const [interests, setInterests] = useState([]);
  // State to manage loading indicator for interests fetching.
  const [loading, setLoading] = useState(true); // Note: `loading` seems specific to interests
  // State for the current authenticated user's ID.
  const [currentUserId, setCurrentUserId] = useState(null);

  /**
   * useEffect: Fetch Current User ID
   * @description Fetches the current user's session from Supabase to get their ID.
   *              Sets `currentUserId` state. Runs once on component mount.
   */
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

  /**
   * useEffect: Fetch User Interests
   * @description Fetches the current user's interests from the 'user_profiles' table in
   *              Supabase. Sets the `interests` state and updates `loading` state for interests.
   *              Runs once on component mount.
   * @async
   */
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

  /**
   * useEffect: Fetch Events
   * @description Fetches all events from the 'events' table in Supabase. Populates the
   *              `allEvents` state. Manages `isLoading` and `error` states for event fetching.
   *              Runs once on component mount.
   * @async
   */
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
  /**
   * @function handleTagToggle
   * @description Toggles the selection of a filter tag. If "ALL" is selected, clears all
   *              filters. Otherwise, adds or removes the tag from `selectedTags`.
   * @param {string} tag - The tag to toggle.
   */
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

  /**
   * memoizedComputation: filteredEvents
   * @description Filters the `allEvents` array based on `selectedTags`. If no tags are
   *              selected, all events are returned. Otherwise, events that include any of
   *              the selected tags are returned.
   * @returns {Array} The array of events filtered by selected tags.
   */
  const filteredEvents = selectedTags.length === 0
    ? allEvents
    : allEvents.filter(evt =>
      evt.tags && selectedTags.some(selTag => evt.tags.includes(selTag.toLowerCase())));

  return (
    // Main Page Container
    <div className="bg-[#F5E3C6] pb-6">
      {/* Feed Layout Section: organizes main content, title, and tag filters */}
      <FeedLayout
        title="Events"
        tagOptions={tags} // Available tags for filtering
        selectedTags={selectedTags} // Currently selected filter tags
        onTagToggle={handleTagToggle} // Handler for tag selection changes
      >  
        {/* Loading and Error States for event fetching */}
        {isLoading && <p className="text-center text-gray-500 px-4">Loading events...</p>}
        {error && <p className="text-center text-red-500 px-4">Error: {error}</p>}

        {/* Event Cards Display: Renders if not loading, no errors, and events exist */}
        {!isLoading && !error && filteredEvents.length > 0 ? (
          // Map through filtered events to render EventCard for each
          filteredEvents.map(event => (
            <EventCard
              key={event.id}
              id={event.id}
              href={`/events-page/${event.id}`} // Link to individual event page
              title={event.title}
              location={event.location}
              upvotes={event.upvotes}
              downvotes={event.downvotes}
              tags={event.tags}
              description={event.description}
              userId={currentUserId} // Pass current user ID for interactions
              createdAt={event.created_at}
              startDate={event.start_date}
              endDate={event.end_date}
            />
          ))
        ) : (
          // No Events Found Message: Renders if not loading, no errors, but no events
          !isLoading && !error && (
            <p className="text-center text-gray-500 px-4">
              No events found, try adding one!
            </p>
          )
        )}

        {/* AI Button Section: Provides AI-based event suggestions */}
        <div className="px-4 py-2 max-w-md mx-auto w-full">
          <AIbutton interests={interests} />
        </div>

        {/* Footer Section */}
        <Footer />
      </FeedLayout>

      {/* Bottom Navigation Bar for mobile */}
      <BottomNav />
    </div>
  );
}