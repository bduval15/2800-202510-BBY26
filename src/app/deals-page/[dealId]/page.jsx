'use client'

import React from 'react';
import { useParams } from 'next/navigation'; // To get the dealId from URL
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';

/**
 * DealDetailPage.jsx
 * Loaf Life - Deal Detail Page
 *
 * Displays the details of a specific deal.
 *
 */
export default function DealDetailPage() {
  const params = useParams();
  const dealId = params.dealId;

  // In a real app, you would fetch the deal details using this dealId
  // For now, we'll just display the ID and a placeholder message.

  return (
    <div className="bg-[#F5E3C6] min-h-screen flex flex-col">
      <div className="flex-grow p-4 md:p-8">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-[#8B4C24] mb-4">Deal Details</h1>
          <p className="text-lg text-gray-700 mb-2">Deal ID: {dealId}</p>
          <p className="text-gray-600">
            This is where the full details of the deal will be displayed.
            Content for this page will be implemented later.
          </p>
          {/* Placeholder for deal content: title, description, location, price, images, comments, etc. */}
        </div>
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
} 