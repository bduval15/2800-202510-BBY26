'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddHackForm from '@/components/forms/AddHackForm';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import StickyNavbar from '@/components/StickyNavbar';
import { clientDB } from '@/services/supabaseClient';

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

  const handleSubmitHack = async (hackData) => {
    const { data: { session }, error: sessionError } = await clientDB.auth.getSession();

    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return;
    }

    if (!session || !session.user) {
      console.error('No active session or user found.');
      router.push('/login-page');
      return;
    }

    const userId = session.user.id;

    const { data, error } = await clientDB
      .from('hacks')
      .insert([{ 
        title: hackData.title, 
        description: hackData.description, 
        user_id: userId, 
        tags: hackData.tags, 
        upvotes: 0,
        downvotes: 0 
      }]);

    if(error) {
      console.error('Error inserting hack:', error);
      return;
    }

    router.push('/hacks-page');
  };

  const handleCancel = () => {
    router.back();
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