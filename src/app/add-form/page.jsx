'use client'

import { useRouter } from 'next/navigation';
import AddPostForm from '@/components/forms/AddPostForm';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import StickyNavbar from '@/components/StickyNavbar';
import { clientDB } from '@/supabaseClient';

/**
 * AddFormPage.jsx
 * Loaf Life - Add Form Page
 * 
 * This page allows users to add a new hack or deal to the database.
 * 
 * Modified with assistance from Google Gemini 2.5 Flash
 * 
 * @author: Nathan O
 * @author: Conner P
 * @author https://gemini.google.com/app
 */

export default function AddFormPage() {
  const router = useRouter();
  const hackTags = [
    "Gaming",
    "Cooking",
    "Coding",
    "Photography",
    "Reading",
    "Movies",
    "Art",
    "Music",
    "Investing",
    "Yoga",
    "Hacks",
    "Cycling",
    "Football",
    "Fitness",
    "Public Speaking",
    "Study Groups",
    "Sustainability",
    "Entrepreneurship",
    "Hiking",
    "Mental Health",
    "Animal Care",
    "Board Games",
    "Comedy",
    "Esports",
  ];

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
      const lowerTags = formData.tags.map(t => t.toLowerCase());
      dataToInsert = {
        title: formData.title,
        description: formData.description,
        user_id: userId,
        tags: lowerTags,
        upvotes: 0,
        downvotes: 0,
        location: formData.location
      };
    } else if (formData.postType === 'deal') {
      tableName = 'deals';
      const lowerTags = formData.tags.map(t => t.toLowerCase());
      dataToInsert = {
        title: formData.title,
        location: formData.location,
        tags: lowerTags,
        price: formData.price,
        user_id: userId
      };
    }
      else if (formData.postType === 'event') {
      tableName = 'events';
      const lowerTags = formData.tags.map(t => t.toLowerCase());
      dataToInsert = {
        title: formData.title,
        description: formData.description,
        user_id: userId,
        tags: lowerTags,
        upvotes: 0,
        downvotes: 0,
        location: formData.location
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

    // Redirect based on post type
    if (formData.postType === 'hack') {
      router.push('/hacks-page');
    } else if (formData.postType === 'deal') {
      router.push('/deals-page'); // Assuming this is the correct route for deals
      } else if (formData.postType === 'event') {
      router.push('/events-page');
    } else {
      // Fallback redirection if postType is somehow unknown at this point
      console.warn('Unknown post type for redirection:', formData.postType);
      router.push('/'); // Or a more appropriate default page
    }
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
