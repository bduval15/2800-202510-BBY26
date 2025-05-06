/**
 * HackDetails.jsx
 * Loaf Life - Hack Details Page
 * 
 * This page displays the details of a specific hack.
 * It includes the hack title, description, hack details, author, and timestamp.
 * It also includes a button to save the hack.
 * 
 * @author: Nathan O
 * 
 * Modified with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */

// Placeholder data currently being used, need to update implementation to use database later - Nate

'use client';

import React, { useState } from 'react';
import FeedLayout from '@/components/FeedLayout';
import Footer from '@/components/Footer';
import Link from 'next/link';

// Placeholder data directly here
const placeholderHack = {
  id: 'placeholder',
  title: 'Free BCIT Gym Access',
  descriptionTitle: 'BCIT Recreation (Burnaby Campus)',
  description: `All full-time and part-time BCIT students get a complimentary Recreation membership from the first day of classes until the last. With just your BCIT student ID, you'll have free access to
  a full weight room, gymnasium, change rooms, showers, and more.`,
  hackTitle: 'A few perks (paid upgrade)',
  hackDetails: `If you want squash/racquetball or intramurals, those are available at nominal additional rates—still well below commercial alternatives. Lockers, towels, and laundry service can also be added for a small fee (e.g. court bookings run under $10/hr)`,
  author: 'Student',
  timestamp: 'Two days ago',
};

export default function HackDetailPage({ params }) {
  const hackId = params.hackId;
  // Initialize state directly with placeholder data
  const [hack, setHack] = useState(placeholderHack);

  // Render the component with placeholder data
  return (
    <div>
      <FeedLayout>
        {/* Back Button */}
        <Link href="/hacks-page" className="mb-4 inline-block">
          <button className="bg-[#D1905A] text-white hover:bg-[#B8733E] px-4 py-2 rounded">
            ← Back to Hacks
          </button>
        </Link>

        {/* Hack Title */}
        <h1 className="text-3xl font-bold mb-4 text-center text-[#8B4C24]">{hack.title}</h1>

        {/* Description Section */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-[#8B4C24]">{hack.descriptionTitle}</h2>
          <p className="text-[#8B4C24]">{hack.description}</p>
        </div>

        {/* Hack Details Section */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-[#8B4C24]">{hack.hackTitle}</h2>
          <p className="text-[#8B4C24]">{hack.hackDetails}</p>
        </div>

        {/* Author/Timestamp */}
        <p className="text-sm text-[#8B4C24]/80 mb-6">By {hack.author} - {hack.timestamp}</p>

        {/* Save Hack Button */}
        {/* Assuming Button component takes className and children */}
        <button
          className="w-full bg-[#D1905A] text-white hover:bg-[#B8733E] text-lg py-3"
          onClick={() => console.log('Save hack clicked for ID:', hack.id)} // Placeholder action
        >
          Save Hack
        </button>
      </FeedLayout>
      <Footer /> {/* Includes Footer Navigation */}
    </div>
  );
}
