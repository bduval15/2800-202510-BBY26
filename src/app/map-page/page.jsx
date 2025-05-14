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

import React, { useState, useEffect } from 'react';
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
      // 1) load the raw event rows
      const raw = await loadAllEvents();

      // 2) gather all unique poster IDs
      const userIds = [
        ...new Set(raw.map(e => e.user_id).filter(Boolean))
      ];

      // 3) batch‐fetch their avatars
      const { data: profiles, error: profErr } = await clientDB
        .from('user_profiles')
        .select('id, avatar_url')
        .in('id', userIds);

      if (profErr) {
        console.error('Error loading profiles:', profErr);
      }

      const profileMap = profiles
        ? Object.fromEntries(profiles.map(p => [p.id, p.avatar_url]))
        : {};

      // 4) format each event into the exact shape your popup needs
      const formatted = raw
        .map(e => {
          // parse your JSON‐string location or fallback to top‐level lat/lng
          let lat = e.lat, lng = e.lng;
          if (typeof e.location === 'string') {
            try {
              const loc = JSON.parse(e.location);
              lat = loc.lat;
              lng = loc.lng;
            } catch {
              lat = null; lng = null;
            }
          }

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
            description: e.description,
            date,
            time,
            price: e.price != null ? `$${e.price}` : '$0',
            lat,
            lng,
            avatarUrl: profileMap[e.user_id] || '/images/logo.png',
          };
        })
        .filter(e => e.lat != null && e.lng != null);

      setEvents(formatted);
    })();
  }, []);

  const threads = [
    { id: 'hacks', name: 'Hacks' },
    { id: 'deals', name: 'Deals' },
    { id: 'savings', name: 'Saving Tips' },
    { id: 'free-events', name: 'Free Events' }
  ];

  const handleApply = filters => {
    console.log('apply filters', filters);
  };

  return (
    <>
      <StickyNavbar />
      <div className="flex flex-col min-h-screen bg-[#F5E3C6] pt-16">
        <div className="flex-1 overflow-auto pb-20">
          <FilterBar
            threads={threads}
            initialFilters={{}}
            onApplyFilters={handleApply}
          />
          <div className="p-4">
            <div className={styles.mapWrapper}>
              <EventMap events={events} />
            </div>
          </div>
          <Footer />
        </div>
      </div>
      <BottomNav />
    </>
  );
}
