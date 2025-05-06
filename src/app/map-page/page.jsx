'use client';

import React from 'react';
import StickyNavbar from '@/components/StickyNavbar';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';

export default function MapPage() {
    return (
      <>
        <StickyNavbar />
        <div className="flex flex-col h-screen bg-[#F5E3C6] pt-16">
          <div className="flex-1">
            <div className="p-4 bg-white border-b-3 border-[#D1905A]">
            <span className="text-[#8B4C24]-500">Filters</span>
            </div>
            <div className="p-4">
              <div className="h-[65vh] w-full rounded bg-gray-100 border-3 border-[#D1905A] flex items-center justify-center">
                <span className="text-gray-500">Map placeholder</span>
              </div>
            </div>
          </div>
          <Footer />
        </div>
        <BottomNav/>
      </>
    );
  }