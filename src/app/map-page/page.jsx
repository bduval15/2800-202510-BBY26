'use client';

import React from 'react';
import dynamic from 'next/dynamic'
import StickyNavbar from '@/components/StickyNavbar';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import FilterBar from '@/components/mapComponents/FilterBar';
import EventList from '@/components/mapComponents/EventList';
import styles from '@/components/mapComponents/EventMap.module.css';

const EventMap = dynamic(
  () => import('@/components/mapComponents/EventMap'),
  {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center">Loading map…</div>
  }
)

export default function MapPage() {

  const dummyEvents = [
    {
      id: '1',
      title: 'Free Pizza Party',
      description: 'Join us for free pizza in the quad! All are welcome.',
      date: 'May 15, 2025',
      time: '12:00 PM – 2:00 PM',
      price: '$0',
      distance: '1.2 km',
      lat: 49.25,
      lng: -123.101,
      threadId: 'hacks',
      threadName: 'Free Food'
    },
  ];

  const threads = [
    { id: 'hacks', name: 'Free Food' },
    { id: 'deals', name: 'Study Group' },
    { id: 'savings', name: 'Saving Tips' },
    { id: 'free-events', name: 'Free Events' }
  ];

  const handleApply = filters => {
    console.log('would apply filters:', filters);
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
              <EventMap
                events={dummyEvents}
                className="h-full w-full"
              />
            </div>
            <div className="mt-4">
              <EventList events={dummyEvents} />
            </div>
          </div>
          <Footer />
        </div>
      </div>
      <BottomNav />
    </>
  );
}