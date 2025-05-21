/**
 * AddCommentForm.jsx
 * Loaf Life – Allows users to add comments to posts.
 *
 * This component provides a form for users to submit comments on various
 * entities within the application, such as hacks, deals, or events. It
 * handles user input, submission state, and communicates with the Supabase
 * backend to store the comment. It also fetches the current user's ID to
 * associate with the comment.
 *
 * Features:
 * - Text input for comment message.
 * - Submission handling with loading and error states.
 * - User authentication check before allowing comments.
 * - Dynamic association with different entity types (hack, deal, event).
 * - Callback function execution upon successful comment addition.
 *
 * Modified with assistance from Google Gemini 2.5 Pro.
 *
 * @author Nathan Oloresisimo
 * @author https://gemini.google.com/app
 */
'use client';

import React, { useState, useEffect } from 'react';
import { clientDB } from '@/supabaseClient'; // Import Supabase client


export default function AddCommentForm({ entityId, entityType, onCommentAdded }) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch the current user's ID when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error: userError } = await clientDB.auth.getUser();
      if (userError) {
        console.error('Error fetching user:', userError);        
      } else if (user) {
        setCurrentUserId(user.id);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!currentUserId) {
      setError('You must be logged in to comment.');
      return;
    }
    if (!entityId || !entityType) {
      setError('Cannot determine what you are commenting on.');
      return;
    }


    setIsSubmitting(true);
    setError(null);

    const commentData = {
      message: commentText,
      user_id: currentUserId, 
      // Dynamically set the foreign key column name (e.g., hack_id, deal_id) based on entityType
      [`${entityType.toLowerCase()}_id`]: entityId,
    };

    // Remove other entity_id fields to ensure they are NULL
    if (entityType.toLowerCase() !== 'hack') commentData.hack_id = null;
    if (entityType.toLowerCase() !== 'deal') commentData.deal_id = null;
    if (entityType.toLowerCase() !== 'event') commentData.event_id = null;


    try {
      // Use Supabase client to insert data
      const { error: insertError } = await clientDB
        .from('comment') 
        .insert([commentData]);

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        throw new Error(insertError.message || 'Failed to post comment.');
      }

      setCommentText(''); // Clear textarea after submission
      if (onCommentAdded) {
        onCommentAdded(); // Callback to refresh the comment list
      }
    } catch (err) {
      setError(err.message);
      console.error('Error posting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Form for submitting a comment
    <form onSubmit={handleSubmit} className="mt-4">
      {/* Textarea for entering comment text */}
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add a comment..."
        className="w-full p-2 border border-[#8B4C24]/30 rounded-lg focus:ring-[#A0522D] focus:border-[#A0522D] text-[#8B4C24] bg-[#F5EFE6]"
        rows="2"
        // Disable textarea if submitting or user not logged in
        disabled={isSubmitting || !currentUserId} 
      ></textarea>
      {/* Show login prompt if user is not logged in */}
      {!currentUserId && <p className="text-sm text-amber-700 mt-1">Please log in to comment.</p>}
      {/* Display error message if any */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <div className="mt-2 flex justify-end">
        {/* Submit button for posting the comment */}
        <button
          type="submit"
          className="px-3 py-1.5 bg-[#639751] text-white rounded-lg hover:bg-[#538741] focus:outline-none focus:ring-2 focus:ring-[#639751] focus:ring-opacity-50 disabled:opacity-50"
          // Disable button if submitting, comment is empty, or user not logged in
          disabled={isSubmitting || !commentText.trim() || !currentUserId} 
        >
          {/* Set button text based on submission state */}
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
} 