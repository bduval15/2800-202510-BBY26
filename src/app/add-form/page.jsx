/**
 * page.jsx (AddFormPage)
 * Loaf Life – Provides a form for users to add new content.
 *
 * This page allows authenticated users to contribute new posts such as
 * "hacks," "deals," or "events" to the Loaf Life platform. Submitted
 * information is then stored in the Supabase database.
 *
 * Features:
 * - Allows submission of hacks, deals, and events.
 * - Saves submitted data to Supabase.
 * - Requires user authentication before submission.
 *
 * Portions of styling and logic assisted by Google Gemini 2.5 Flash.
 *
 * Modified with assistance from Google Gemini 2.5 Flash.
 *
 * @author Nathan Oloresisimo
 * @author Conner Ponton
 * @author https://gemini.google.com/app
 */

'use client';

import { useRouter } from 'next/navigation';
import AddPostForm from '@/components/forms/AddPostForm';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import StickyNavbar from '@/components/StickyNavbar';
import { clientDB } from '@/supabaseClient';
import { tags } from '@/lib/tags.js'


export default function AddFormPage() {
  const router = useRouter();
  
  // ---- Form Submission Handlers ----
  const handleSubmitHack = async (formData) => {
    // Retrieve the current user session
    const { data: { session }, error: sessionError } = await clientDB.auth.getSession();

    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return;
    }

    // Ensure a user is logged in
    if (!session || !session.user) {
      console.error('No active session or user found.');
      router.push('/login-page'); // Redirect to login if no user
      return;
    }

    const userId = session.user.id;
    let tableName = '';
    let dataToInsert = {};

    // Prepare data for insertion based on the type of post
    if (formData.postType === 'hack') {
      tableName = 'hacks';
      const lowerTags = formData.tags.map(t => t.toLowerCase()); // Normalize tags to lowercase
      dataToInsert = {
        title: formData.title,
        description: formData.description,
        user_id: userId,
        tags: lowerTags,
        upvotes: 0,
        downvotes: 0,
        location: formData.location,
        table_id: 'hacks' // Identifier for the table
      };
    } else if (formData.postType === 'deal') {
      tableName = 'deals';
      const lowerTags = formData.tags.map(t => t.toLowerCase());
      dataToInsert = {
        title: formData.title,
        location: formData.location,
        price: formData.price,
        description: formData.description,
        user_id: userId,
        tags: lowerTags,
        table_id: 'deals'
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
        location: formData.location,
        start_date: formData.start_date,
        end_date: formData.end_date
      };
    } else {
      console.error('Unknown post type:', formData.postType);
      return;
    }

    // Insert the prepared data into the determined Supabase table
    const { data, error } = await clientDB
      .from(tableName)
      .insert([dataToInsert]);

    if (error) {
      console.error(`Error inserting ${formData.postType}:`, error);
      return;
    }

    // Redirect the user to the appropriate page after successful submission
    if (formData.postType === 'hack') {
      router.push('/hacks-page');
    } else if (formData.postType === 'deal') {
      router.push('/deals-page'); 
    } else if (formData.postType === 'event') {
      router.push('/events-page');
    } else {
      // Fallback redirection if postType is somehow unknown at this point
      console.warn('Unknown post type for redirection:', formData.postType);
      router.push('/main-feed-page'); 
    }
  };

  // ---- Navigation Handlers ----
  const handleCancel = () => {
    router.back(); // Navigate to the previous page
  };
  
  return (
    <div className="bg-[#F5E3C6] min-h-screen flex flex-col">
      <StickyNavbar />
      <div className="flex-grow container mx-auto pt-20 px-4 py-8">
        <AddPostForm
          tags={tags}
          onSubmit={handleSubmitHack}
          onClose={handleCancel}
        />
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
} 
