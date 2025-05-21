/**
 * CommentSection.jsx
 * Loaf Life – Displays comments for a specific post.
 *
 * This component is responsible for fetching and displaying a list of comments
 * associated with a particular entity (hack, deal, or event). It also
 * integrates the AddCommentForm to allow users to submit new comments. The
 * section shows a loading state while comments are being fetched and an error
 * message if the fetch fails. It also displays the count of comments.
 *
 * Features:
 * - Fetches comments from Supabase based on entity ID and type.
 * - Displays a list of `CommentCard` components.
 * - Integrates `AddCommentForm` for adding new comments.
 * - Shows loading skeletons while comments are loading.
 * - Handles and displays error states for comment fetching.
 * - Updates comment list when a new comment is added or an existing one is updated.
 * - Displays the total number of comments.
 *
 * Modified with assistance from Google Gemini 2.5 Flash.
 *
 * @author Nathan Oloresisimo
 * @author https://gemini.google.com/app
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

  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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
      <div className="w-full flex justify-between items-center text-xl font-semibold text-[#8B4C24] mb-4">
        <span>
          Comments
          {!isLoading && !error && (
            <span className="text-sm font-normal ml-1">({comments.length})</span>
          )}
        </span>
      </div>

      {/* Comments List - always visible, scrollable */}
      <div className="space-y-3 max-h-[23rem] overflow-y-auto pr-2 mb-4" id="comments-list-container"> {/* Adjusted from 9rem to 6.5rem per card */}
        {isLoading ? (
          <>
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
          </>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : comments.length === 0 ? (
          <p className="text-[#8B4C24]/70">No comments yet. Be the first to comment!</p>
        ) : (
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

      {/* Add Comment Form - always visible if entityId and entityType are present */}
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
