/**
 * Hacks Testing Page
 * 
 * A development environment for testing and debugging components.
 * Access this page by navigating to /hacks in your browser.
 * 
 */

'use client'; 

import React from 'react';
import BaseCard from '@/components/cards/BaseCard';
import HackCard from '@/components/cards/HackCard';

export default function HacksPage() {
    

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Hacks Test Page</h1>

      {/* --- Component Testing Area --- */}
      <div className="space-y-4">
        <p>Import and render components below to test them:</p>
       <BaseCard />
       <HackCard 
            title="Free McDonald's Coffee"
            upvotes={20}
            downvotes={4}
            comments={7}
       />
      </div>
      {/* --- End Component Testing Area --- */}

    </div>
  );
}
