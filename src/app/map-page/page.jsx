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
 */
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import StickyNavbar from '@/components/StickyNavbar';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import FilterBar from '@/components/mapComponents/FilterBar';
import styles from '@/components/mapComponents/EventMap.module.css';
import { clientDB } from '@/supabaseClient';
import { loadAllEvents } from '@/utils/loadAllEvents';

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

export default function MapPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      // 1) load raw rows (with table_id on each)
      const raw = await loadAllEvents();

      // 2) gather all poster IDs
      const userIds = Array.from(
        new Set(raw.map(e => e.user_id).filter(Boolean))
      );

      // 3) batch‐fetch their avatar_url
      const { data: profiles = [], error: profErr } = await clientDB
        .from('user_profiles')
        .select('id, avatar_url')
        .in('id', userIds);

      if (profErr) console.error('Error loading profiles:', profErr);

      const profileMap = Object.fromEntries(
        profiles.map(p => [p.id, p.avatar_url])
      );

      // 4) build the final shape
      const formatted = raw
        .map(e => {
          // 4a) coordinates can be top‐level or JSON in e.location
          let lat = e.lat, lng = e.lng;
          if (typeof e.location === 'string') {
            try {
              const loc = JSON.parse(e.location);
              lat = loc.lat;
              lng = loc.lng;
            } catch { }
          }

          // 4b) format date/time
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
        .filter(e => e.lat != null && e.lng != null);

      setEvents(formatted);
    })();
  }, []);
  
  const threads = useMemo(() => ([
    { id: 'hacks',  name: 'Hacks'       },
    { id: 'deals',  name: 'Deals'       },
    { id: 'events', name: 'Events' }
  ]), []);

  const [selectedThreads, setSelectedThreads] = useState(
    () => threads.map(t => t.id) 
      );

  const filteredEvents = useMemo(() => {
    return events.filter(evt => selectedThreads.includes(evt.table_id));
  }, [events, selectedThreads]);

  const handleFilterChange = useCallback(ids => {
    setSelectedThreads(ids);
  }, []);

  return (
    <>
      <StickyNavbar />
      <div className="flex flex-col min-h-screen bg-[#F5E3C6] pt-16">
        <div className="flex-1 overflow-auto pb-20">
          <FilterBar
            threads={threads}
           initialSelected={selectedThreads}
           onFilterChange={handleFilterChange}
          />
          <div className="px-4">
            <div className={styles.mapWrapper}>
              <EventMap events={filteredEvents}/>
            </div>
          </div>
          <Footer />
        </div>
      </div>
      <BottomNav />
    </>
  );
}
