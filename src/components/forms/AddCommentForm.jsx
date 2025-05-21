/**
 * File: AddCommentForm.jsx
 *
 * Loaf Life
 *   Allows users to add comments to posts. This component provides a form for
 *   users to submit comments on entities such as hacks, deals, or events.
 *   It handles user input, submission state, and communicates with Supabase
 *   to store the comment.
 *   Integrates with Supabase for data fetching and storage.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author https://gemini.google.com/app
 */
'use client';

import React, { useState, useEffect } from 'react';
import { clientDB } from '@/supabaseClient';

/**
 * @function AddCommentForm
 * @description Provides a form for users to submit comments on various entities
 *   (hack, deal, event). It handles user input, submission state, and
 *   communicates with the Supabase backend to store the comment. It also
 *   fetches the current user's ID to associate with the comment.
 * @param {object} props - The component's props.
 * @param {string} props.entityId - The ID of the entity being commented on.
 * @param {string} props.entityType - The type of entity (e.g., 'hack', 'deal').
 * @param {function} props.onCommentAdded - Callback after a comment is added.
 * @returns {JSX.Element} A form for adding comments.
 */
export default function AddCommentForm({ entityId, entityType, onCommentAdded }) {
  // State for the comment text entered by the user.
  const [commentText, setCommentText] = useState('');
  // State for tracking if the comment is currently being submitted.
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State for storing any error messages during submission.
  const [error, setError] = useState(null);
  // State for storing the current authenticated user's ID.
  const [currentUserId, setCurrentUserId] = useState(null);

  /**
   * useEffect: Fetch Current User's ID
   * @description Fetches the authenticated user's ID from Supabase when the
   *   component mounts. This ID is used to associate the comment with the user.
   *   It runs only once after the initial render.
   */
  useEffect(() => {
    /**
     * @function fetchUser
     * @description Fetches the current authenticated user's data from Supabase.
     *   Updates the currentUserId state with the fetched user ID.
     * @async
     */
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

  /**
   * @function handleSubmit
   * @description Handles the form submission for adding a new comment.
   *   It prevents the default form submission, validates the comment text and
   *   user authentication, and checks for entityId and entityType.
   *   Constructs the comment data and inserts it into the 'comment' table
   *   in Supabase. Manages loading states and error handling.
   * @async
   * @param {Event} e - The form submission event.
   */
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
      // Dynamically set the foreign key column name (e.g., hack_id, deal_id)
      [`${entityType.toLowerCase()}_id`]: entityId,
    };

    // Ensure other entity_id fields are NULL for data integrity.
    if (entityType.toLowerCase() !== 'hack') commentData.hack_id = null;
    if (entityType.toLowerCase() !== 'deal') commentData.deal_id = null;
    if (entityType.toLowerCase() !== 'event') commentData.event_id = null;

    try {
      // Use Supabase client to insert data into the 'comment' table.
      const { error: insertError } = await clientDB
        .from('comment')
        .insert([commentData]);

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        throw new Error(insertError.message || 'Failed to post comment.');
      }

      setCommentText(''); // Clear textarea after successful submission.
      if (onCommentAdded) {
        onCommentAdded(); // Execute callback to refresh the comment list.
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
      {/* Textarea for users to enter their comment text */}
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add a comment..."
        className="w-full p-2 border border-[#8B4C24]/30 rounded-lg focus:ring-[#A0522D] focus:border-[#A0522D] text-[#8B4C24] bg-[#F5EFE6]"
        rows="2"
        // Disable textarea if form is submitting or if the user is not logged in
        disabled={isSubmitting || !currentUserId}
      ></textarea>
      {/* Prompt for users to log in if they are not currently authenticated */}
      {!currentUserId && <p className="text-sm text-amber-700 mt-1">Please log in to comment.</p>}
      {/* Display any error messages that occur during comment submission */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <div className="mt-2 flex justify-end">
        {/* Submit button for posting the comment */}
        <button
          type="submit"
          className="px-3 py-1.5 bg-[#639751] text-white rounded-lg hover:bg-[#538741] focus:outline-none focus:ring-2 focus:ring-[#639751] focus:ring-opacity-50 disabled:opacity-50"
          // Disable button if form is submitting, comment is empty, or user not logged in
          disabled={isSubmitting || !commentText.trim() || !currentUserId}
        >
          {/* Button text changes based on the submission state */}
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
} 