/**
 * Map Page.jsx
 * 
 * Loaf Life – Map page holding all the components 
 * for full functionality. 
 * 
 * Modified with assistance from ChatGPT o4-mini-high.
 * 
 * @author Brady Duval
 * @author https://chatgpt.com/
 *
 * @function MapPage
 * @description Renders the interactive map interface with filter controls,
 *              loads and formats event data, fetches user interests for
 *              AI recommendations, and displays navigation components.
 *
 * @function fetchInterests
 * @description Retrieves the current user’s interests from Supabase
 *              and stores them in state for AI recommendations.
 *
 * @function loadAndFormatEvents
 * @description Loads all events from multiple tables, batch-fetches user
 *              avatar URLs, parses location JSON when needed, formats
 *              date/time strings, and filters out events without valid coordinates.
 *
 * @function handleFilterChange
 * @description Updates which thread IDs are selected for filtering events on the map.
 *
 * @const threads
 * @description Static list of thread types available for filtering (Hacks, Deals, Events).
 *
 * @const filteredEvents
 * @description Memoized array of events filtered by the currently selected thread IDs.
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import StickyNavbar from '@/components/StickyNavbar';
import BottomNav from '@/components/BottomNav';
import FilterBar from '@/components/mapComponents/FilterBar';
import styles from '@/components/mapComponents/EventMap.module.css';
import { clientDB } from '@/supabaseClient';
import { loadAllEvents } from '@/utils/loadAllEvents';
import AIbutton from '@/components/buttons/AIbutton';
import { useSearchParams } from 'next/navigation';

const EventMap = dynamic(
  () => import('@/components/mapComponents/EventMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center">
        Loading map…
      </div>
    ),
  }
);

/**
 * MapPage
 *
 * @function MapPage
 * @returns {JSX.Element} The map page with filters, map view, AI button, and navigation.
 */
export default function MapPage() {
  const [events, setEvents] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get 'focus' query param to highlight a particular event
  const searchParams = useSearchParams();
  const focusId = searchParams.get('focus');

  // All thread types available for filtering
  const threads = useMemo(() => ([
    { id: 'hacks', name: 'Hacks' },
    { id: 'deals', name: 'Deals' },
    { id: 'events', name: 'Events' }
  ]), []);

  // SelectedThreads - IDs of threads currently selected
  const [selectedThreads, setSelectedThreads] = useState(
    () => threads.map(t => t.id)
  );

  /**
   * filteredEvents
   *
   * @function filteredEvents
   * @description Memoizes the list of events whose `table_id` matches one
   *              of the currently selected thread IDs.
   * @returns {Object[]} Array of event objects to display on the map.
   */
  const filteredEvents = useMemo(() => {
    return events.filter(evt => selectedThreads.includes(evt.table_id));
  }, [events, selectedThreads]);

  /**
   * handleFilterChange
   *
   * @function handleFilterChange
   * @param {string[]} ids - New array of selected thread IDs.
   * @description Callback invoked by the FilterBar to update which
   *              thread IDs should be shown on the map.
   */
  const handleFilterChange = useCallback(ids => {
    setSelectedThreads(ids);
  }, []);

  /**
 * fetchInterests
 *
 * @async
 * @function fetchInterests
 * @description Retrieves the authenticated user’s interests from the
 *              `user_profiles` table in Supabase and sets them in state.
 */
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

  /**
   * loadAndFormatEvents
   *
   * @async
   * @function loadAndFormatEvents
   * @description Loads raw event rows, batch-fetches user avatars,
   *              parses location JSON, formats date/time strings,
   *              and filters out events missing valid coordinates.
   */
  useEffect(() => {
    (async () => {
      // 1) Load raw event rows from all tables
      const raw = await loadAllEvents();

      // 2) Collect unique poster user IDs to fetch avatars
      const userIds = Array.from(
        new Set(raw.map(e => e.user_id).filter(Boolean))
      );

      // 3) Batch-fetch avatar URLs
      const { data: profiles = [], error: profErr } = await clientDB
        .from('user_profiles')
        .select('id, avatar_url')
        .in('id', userIds);

      if (profErr) console.error('Error loading profiles:', profErr);

      const profileMap = Object.fromEntries(
        profiles.map(p => [p.id, p.avatar_url])
      );

      // 4) Format each event
      const formatted = raw
        .map(e => {
          // a) Extract or parse coordinates
          let lat = e.lat, lng = e.lng;
          if (typeof e.location === 'string') {
            try {
              const loc = JSON.parse(e.location);
              lat = loc.lat;
              lng = loc.lng;
            } catch {/* ignore parse errors */ }
          }

          // b) Format date and time
          const date = e.date
            ? new Date(e.date).toLocaleDateString(undefined, {
              month: 'short', day: 'numeric', year: 'numeric'
            })
            : '';
          const time = e.start_time && e.end_time
            ? `${e.start_time} – ${e.end_time}`
            : '';

          return {
            id: e.id,
            title: e.title,
            description: e.description || 'No description provided',
            date,
            time,
            price: e.price != null ? `$${e.price}` : '$0',
            lat,
            lng,
            table_id: e.table_id,
            userAvatar: profileMap[e.user_id] || '/images/logo.png'
          };
        })
        // Remove any events missing valid latitude or longitude
        .filter(e => e.lat != null && e.lng != null);

      setEvents(formatted);
    })();
  }, []);

  return (
    <>
      {/* Top navigation bar */}
      <StickyNavbar />
      <div className="flex flex-col overflow-hidden h-screen bg-[#F5E3C6] pt-16">
        <div className="flex-1 overflow-auto pb-0">
          {/* Thread filter controls */}
          <FilterBar
            threads={threads}
            initialSelected={selectedThreads}
            onFilterChange={handleFilterChange}
          />
          <div className="px-4">
            {/* Map container */}
            <div className={styles.mapWrapper}>
              <EventMap
                key={focusId ?? 'all'}
                events={filteredEvents}
                focusId={focusId}
              />
            </div>
            {/* AI recommendation button */}
            <div className="px-4 py-2 max-w-md mx-auto w-full">
              <AIbutton interests={interests} />
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
