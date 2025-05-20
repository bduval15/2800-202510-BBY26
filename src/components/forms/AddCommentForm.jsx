'use client';

import React, { useState, useEffect } from 'react';
import { clientDB } from '@/supabaseClient'; // Import Supabase client

/**
 * AddCommentForm.jsx
 * Loaf Life - Add Comment Form
 *
 * This component allows users to add a comment to an entity (hack, deal, or event).
 *
 * @author: Nathan O
 *
 * Modified with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */

export default function AddCommentForm({ entityId, entityType, onCommentAdded }) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error: userError } = await clientDB.auth.getUser();
      if (userError) {
        console.error('Error fetching user:', userError);
        // setError('Could not authenticate user. Please log in to comment.'); // Optional: inform user
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
      [`${entityType.toLowerCase()}_id`]: entityId,
    };

    // Remove other entity_id fields to ensure they are NULL
    if (entityType.toLowerCase() !== 'hack') commentData.hack_id = null;
    if (entityType.toLowerCase() !== 'deal') commentData.deal_id = null;
    if (entityType.toLowerCase() !== 'event') commentData.event_id = null;


    try {
      // Use Supabase client to insert data
      const { error: insertError } = await clientDB
        .from('comment') // Your table name in Supabase
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
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add a comment..."
        className="w-full p-2 border border-[#8B4C24]/30 rounded-lg focus:ring-[#A0522D] focus:border-[#A0522D] text-[#8B4C24] bg-[#F5EFE6]"
        rows="2"
        disabled={isSubmitting || !currentUserId}
      ></textarea>
      {!currentUserId && <p className="text-sm text-amber-700 mt-1">Please log in to comment.</p>}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          className="px-3 py-1.5 bg-[#639751] text-white rounded-lg hover:bg-[#538741] focus:outline-none focus:ring-2 focus:ring-[#639751] focus:ring-opacity-50 disabled:opacity-50"
          disabled={isSubmitting || !commentText.trim() || !currentUserId}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
} 