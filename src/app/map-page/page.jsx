'use client';

import React from 'react';
import dynamic from 'next/dynamic'
import StickyNavbar from '@/components/StickyNavbar';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import FilterBar from '@/components/mapComponents/FilterBar';

const EventMap = dynamic(
  () => import('@/components/mapComponents/EventMap'),
  {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center">Loading map…</div>
  }
)

export default function MapPage() {

  const dummyEvents = [];

  const threads = [
    { id: 'hacks', name: 'Free Food' },
    { id: 'deals', name: 'Study Group' },
    { id: 'savings', name: 'Saving Tips' },
    { id: 'free-events', name: 'Free Events'}
  ];

  const handleApply = filters => {
    console.log('would apply filters:', filters);
  };

  return (
    <>
      <StickyNavbar />
      <div className="flex flex-col min-h-screen bg-[#F5E3C6] pt-16">
        <div className="flex-1 overflow-auto pb-20">
          <div className="p-4 bg-white border-b-3 border-[#D1905A]">
            <FilterBar
              threads={threads}
              initialFilters={{}}
              onApplyFilters={handleApply}
            />
          </div>
          <div className="p-4">
            <div className="h-[65vh]
            w-full 
            rounded bg-gray-100 
            border-3 border-[#D1905A] 
            overflow-hidden
            relative
            ">
              <EventMap
                events={dummyEvents}
                className="h-full w-full"
              />
            </div>
          </div>
          <Footer />
        </div>
      </div>
      <BottomNav />
    </>
  );
}