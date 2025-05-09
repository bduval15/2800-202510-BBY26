'use client'

import { useState } from 'react';
import FeedLayout from '@/components/FeedLayout'
import DealCard from '@/components/cards/DealCard' 
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'

/**
 * DealsPage.jsx
 * Loaf Life - Deals Page
 *
 * This page lists the deals that have been posted.
 *
 * Modified with assistance from Google Gemini 2.5 Flash
 * @author Nate O
 * @author https://gemini.google.com/app
 * 
 */

export default function DealsPage() {
  const [selectedTag, setSelectedTag] = useState("All Tags");

  // Tags relevant to deals
  const dealTags = ['Food', 'Entertainment', 'Shopping', 'Services', 'Accommodation', 'Travel'];

  // Placeholder data simulating a Supabase fetch for deals
  const [allDeals, setAllDeals] = useState([
    {
      id: "d7a8f70e-0b1f-4f7b-8b1e-7b0a1b3b0e9d", // uuid
      created_at: "2024-07-28T10:00:00Z", // timestamptz
      title: "Half-Price Pizza Wednesdays",
      location: "Pizza Place Downtown",
      price: 10.99, // float4
      distance: 2.5, // float4
      user_id: "a1b2c3d4-e5f6-7890-1234-567890abcdef", // uuid
      tags: ['Food'],
      expirationDate: "December 31, 2024"
    },
    {
      id: "e0c9b2a1-6d8c-4b8a-9a2d-0c8f7a8b1c2d",
      created_at: "2024-07-27T14:30:00Z",
      title: "Student Discount: Movie Tickets",
      location: "Cineplex Metropolis",
      price: 8.00,
      distance: 5.1,
      user_id: "b2c3d4e5-f6a7-8901-2345-678901bcdef0",
      tags: ['Entertainment'],
      expirationDate: "January 15, 2025"
    },
    {
      id: "f3b4a5c6-1e2d-3f4a-5b6c-7d8e9f0a1b2c",
      created_at: "2024-07-29T09:15:00Z",
      title: "20% Off Bookstore Purchase",
      location: "Campus Bookstore",
      price: null, // Assuming price can be null if it's a discount
      distance: 0.5,
      user_id: "c3d4e5f6-a7b8-9012-3456-789012cdef01",
      tags: ['Shopping', 'Services'],
      expirationDate: "Valid until end of semester"
    },
    {
      id: "a4b5c6d7-2f3e-4a5b-6c7d-8e9f0a1b2c3d",
      created_at: "2024-07-26T18:00:00Z",
      title: "Weekend Getaway Deal",
      location: "Mountain Resort",
      price: 199.00,
      distance: 75.0,
      user_id: "d4e5f6a7-b8c9-0123-4567-890123def012",
      tags: ['Travel', 'Accommodation'],
      expirationDate: "Book by November 30th"
    },
    {
      id: "b5c6d7e8-3a4b-5c6d-7e8f-9a0b1c2d3e4f",
      created_at: "2024-07-30T11:00:00Z",
      title: "Free Coffee with Breakfast Purchase",
      location: "Local Cafe",
      price: 5.00, 
      distance: 1.2,
      user_id: "e5f6a7b8-c9d0-1234-5678-901234ef0123",
      tags: ['Food'],
      expirationDate: "October 31, 2024"
    }
  ]);

  const filteredDeals = selectedTag === "All Tags"
    ? allDeals
    : allDeals.filter(deal => deal.tags && deal.tags.includes(selectedTag));

  return (
    <div className="bg-[#F5E3C6] pb-6">
      <FeedLayout
        tagOptions={dealTags}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
      >
        <div className="text-left text-2xl font-bold text-[#8B4C24] pl-4 mb-4 mt-4">
          Deals
        </div>
        {filteredDeals.length > 0 ? (
          filteredDeals.map(deal => (
            <DealCard
              key={deal.id}
              id={deal.id} 
              title={deal.title}
              location={deal.location}
              price={deal.price}
              distance={deal.distance}
              tags={deal.tags}
              expirationDate={deal.expirationDate}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 px-4">No deals found for the selected tag. Try adding one!</p>
        )}
        <Footer />
      </FeedLayout>
      <BottomNav />
    </div>
  )
} 