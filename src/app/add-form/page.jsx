'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddHackForm from '@/components/forms/AddHackForm';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import StickyNavbar from '@/components/StickyNavbar';

/**
 * AddFormPage.jsx
 * Loaf Life - Add Form Page
 * 
 * This page allows users to add a new hack or deal to the database.
 * 
 * @author: Nathan O
 * 
 * Written with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */

export default function AddFormPage() {
  const router = useRouter();
  const hackTags = ['Campus Life', 'Health & Wellness', 'Study Tips', 'Food', 'Career', 'Finance', 'Technology', 'Social'];

  const handleSubmitHack = (hackData) => {
    console.log("New Hack Submitted:", hackData);
    router.push('/hacks-page'); // Redirect to hacks page after adding
  };

  const handleCancel = () => {
    router.back(); // Go back to the previous page or a specific page like router.push('/hacks-page');
  };

  return (
    <div className="bg-[#F5E3C6] min-h-screen flex flex-col">
          <StickyNavbar />
      <div className="flex-grow container mx-auto pt-20 px-4 py-8">       
        <AddHackForm 
          hackTags={hackTags} 
          onSubmit={handleSubmitHack} 
          onClose={handleCancel} 
        />
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
} 