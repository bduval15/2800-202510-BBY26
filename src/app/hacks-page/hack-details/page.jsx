'use client';

import React, { useState } from 'react';
import FeedLayout from '@/components/FeedLayout';
import Footer from '@/components/Footer';

// Placeholder data directly here
const placeholderHack = {
  id: 'placeholder',
  title: 'Free McDonalds Coffee',
  descriptionTitle: 'Free Coffee?',
  description: 'McDonalds is giving away free coffee on May 5th!',
  hackTitle: 'Hack',
  hackDetails: 'Just go to the McDonalds on 5th Ave and ask for a free coffee!',
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
      <div className="bg-[#F5E3C6]">
            {/* Hack Title */}
            <h1 className="text-3xl font-bold mb-4 text-center text-[#8B4C24]">{hack.title}</h1>
            
            {/* Description Section */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2 text-[#8B4C24]">{hack.descriptionTitle}</h2>
              <p className="text-base">{hack.description}</p>
            </div>

            {/* Hack Details Section */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2 text-[#8B4C24]">{hack.hackTitle}</h2>
              <p className="text-base">{hack.hackDetails}</p>
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
      </div>
    </FeedLayout>
      <Footer /> {/* Includes Footer Navigation */}
    </div>
  );
}
