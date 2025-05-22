/**
 * File: CommentSection.jsx
 *
 * Loaf Life
 *   Displays comments for a specific post and allows users to add new comments.
 *   It fetches comments from Supabase, shows loading/error states, and updates dynamically.
 *   Integrates with Supabase for data fetching and user authentication.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author https://gemini.google.com/app
 *
 * Main Component:
 *   @function CommentSection
 *   @description Renders a section for displaying and adding comments related to an entity.
 *                It handles fetching, displaying, and updating comments.
 *   @param {object} props - The component's props.
 *   @param {string} props.entityId - The ID of the entity (e.g., post, deal) to fetch comments for.
 *   @param {string} props.entityType - The type of the entity (e.g., 'hack', 'deal').
 *   @returns {JSX.Element} The comment section UI.
 *
 * Helper Functions / Hooks / Logic Blocks:
 *
 *   @function fetchUser
 *   @description Fetches the current authenticated user's ID from Supabase.
 *                Sets the `currentUserId` state.
 *   @async
 *
 *   @function fetchComments
 *   @description Fetches comments for the specified `entityId` and `entityType` from Supabase.
 *                It handles loading states and errors, and updates the `comments` state.
 *   @async
 *
 *   @function handleCommentAddedOrUpdated
 *   @description Callback function to refresh the comments list, typically after a new comment
 *                is added or an existing one is updated. It calls `fetchComments`.
 */


'use client';

import React, { useState, useEffect, useCallback } from 'react';
import CommentCard from '@/components/cards/Comment';
import AddCommentForm from '@/components/forms/AddCommentForm';
import { clientDB } from '@/supabaseClient';
import { formatTimeAgo } from '@/utils/formatTimeAgo';
import CommentSkeleton from '@/components/skeletons/CommentSkeleton';

export default function CommentSection({ entityId, entityType }) {
  // Log props on component mount or when they change (for debugging)
  useEffect(() => {
    console.log('[CommentSection] Received props:', { entityId, entityType });
  }, [entityId, entityType]);

  // State for storing the array of comments fetched from the database.
  const [comments, setComments] = useState([]);
  // State for indicating whether comments are currently being loaded.
  const [isLoading, setIsLoading] = useState(false);
  // State for storing any error message that occurs during comment fetching.
  const [error, setError] = useState(null);
  // State for storing the ID of the currently authenticated user.
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch the current authenticated user's ID on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error: userError } = await clientDB.auth.getUser();
      if (userError) {
        console.error('Error fetching user in CommentSection:', userError);
      } else if (user) {
        setCurrentUserId(user.id);
      }
    };
    fetchUser();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Callback function to fetch comments for the given entity
  const fetchComments = useCallback(async () => {
    // Do not fetch if entityId or entityType is missing
    if (!entityId || !entityType) {
      setComments([]); // Clear comments if props are invalid
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Determine the correct foreign key column based on entityType (e.g., 'hack_id', 'deal_id')
      const entityColumn = `${entityType.toLowerCase()}_id`;

      // Fetch comments and related user profile information from Supabase
      const { data, error: fetchError } = await clientDB
        .from('comment')
        .select(`
          id,
          message,
          created_at,
          user_id,
          user_profiles!user_id ( username:name, avatar_url )
        `)
        .eq(entityColumn, entityId) // Filter by the specific entity
        .order('created_at', { ascending: false }); // Order by newest first

      if (fetchError) {
        console.error('Supabase fetch error:', fetchError);
        throw new Error(fetchError.message || 'Failed to fetch comments.');
      }

      setComments(data || []); // Update state with fetched comments, or empty array if null
    } catch (err) {
      setError(err.message);
      console.error("Error fetching comments:", err);
    } finally {
      setIsLoading(false);
    }
  }, [entityId, entityType]); // Dependencies for useCallback

  // Effect to fetch comments when entityId or entityType changes
  useEffect(() => {
    if (entityId && entityType) {
      fetchComments();
    }
    else {
      // Clear comments if entityId or entityType becomes undefined/null
      setComments([]);
    }
  }, [entityId, entityType, fetchComments]); // Re-run if these dependencies change

  // Handler to refresh comments list, typically after a new comment is added or an existing one is updated
  const handleCommentAddedOrUpdated = () => {
    fetchComments(); // Re-fetch all comments
  };

  return (
    <div className="bg-[#FDFAF5] p-4 rounded-lg border border-[#8B4C24]/30 mt-4">
      {/* Section: Header displaying "Comments" and count */}
      <div className="w-full flex justify-between items-center text-xl font-semibold text-[#8B4C24] mb-4">
        <span>
          Comments
          {/* Display comment count if not loading and no error */}
          {!isLoading && !error && (
            <span className="text-sm font-normal ml-1">({comments.length})</span>
          )}
        </span>
      </div>

      {/* Section: Comments List - always visible, scrollable */}
      <div className="space-y-3 max-h-[23rem] overflow-y-auto pr-2 mb-4" id="comments-list-container">
        {/* Conditional Rendering: Loading Skeletons */}
        {isLoading ? (
          <>
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
          </>
        ) : error ? (
          // Conditional Rendering: Error Message
          <p className="text-red-500">Error: {error}</p>
        ) : comments.length === 0 ? (
          // Conditional Rendering: No Comments Message
          <p className="text-[#8B4C24]/70">No comments yet. Be the first to comment!</p>
        ) : (
          // Render each comment using CommentCard
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onCommentUpdated={handleCommentAddedOrUpdated}
              timestampFormated={formatTimeAgo(comment.created_at)}
            />
          ))
        )}
      </div>

      {/* Section: Add Comment Form - visible if entityId and entityType are present */}
      {entityId && entityType && (
        <AddCommentForm
          entityId={entityId}
          entityType={entityType}
          onCommentAdded={handleCommentAddedOrUpdated}
        />
      )}
    </div>
  );
} 
