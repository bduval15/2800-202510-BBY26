'use client'

import { useRouter } from 'next/navigation';
import AddPostForm from '@/components/forms/AddPostForm';
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
 * Modified with assistance from Google Gemini 2.5 Flash
 * 
 * @author: Nathan O
 * @author https://gemini.google.com/app
 */

export default function AddFormPage() {
  const router = useRouter();
  const hackTags = ['Campus Life', 'Health & Wellness', 'Study Tips', 'Food', 'Career', 'Finance', 'Technology', 'Social'];

  const handleSubmitHack = async (formData) => {
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
    let tableName = '';
    let dataToInsert = {};

    if (formData.postType === 'hack') {
      tableName = 'hacks';
      dataToInsert = {
        title: formData.title,
        description: formData.description,
        user_id: userId,
        tags: formData.tags,
        upvotes: 0,
        downvotes: 0
      };
    } else if (formData.postType === 'deal') {
      tableName = 'deals';
      dataToInsert = {
        title: formData.title,
        location: formData.location,
        price: formData.price,
        user_id: userId
      };
    } else {
      console.error('Unknown post type:', formData.postType);
      return;
    }

    const { data, error } = await clientDB
      .from(tableName)
      .insert([dataToInsert]);

    if (error) {
      console.error(`Error inserting ${formData.postType}:`, error);
      return;
    }

    // For now, always redirect to hacks-page. This can be changed later.
    router.push('/hacks-page');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="bg-[#F5E3C6] min-h-screen flex flex-col">
      <StickyNavbar />
      <div className="flex-grow container mx-auto pt-20 px-4 py-8">
        <AddPostForm
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
