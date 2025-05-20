'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import CommentCard from '@/components/cards/Comment';
import AddCommentForm from '@/components/forms/AddCommentForm';
import { clientDB } from '@/supabaseClient';
import { formatTimeAgo } from '@/utils/formatTimeAgo';
import CommentSkeleton from '@/components/skeletons/CommentSkeleton';

/**
 * CommentSection.jsx
 * Loaf Life - Comment Section
 *
 * This component displays the comment section for an entity (hack, deal, or event),
 * allowing users to view and add comments.
 *
 * @author: Nathan O (Initially in HackDetailPage)
 *
 * Modified with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */
export default function CommentSection({ entityId, entityType }) {
  useEffect(() => {
    console.log('[CommentSection] Received props:', { entityId, entityType });
  }, [entityId, entityType]);

  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

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
  }, []);

  const fetchComments = useCallback(async () => {
    if (!entityId || !entityType) {
      setComments([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const entityColumn = `${entityType.toLowerCase()}_id`;

      const { data, error: fetchError } = await clientDB
        .from('comment')
        .select(`
          id,
          message,
          created_at,
          user_id,
          user_profiles!user_id ( username:name, avatar_url )
        `)
        .eq(entityColumn, entityId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase fetch error:', fetchError);
        throw new Error(fetchError.message || 'Failed to fetch comments.');
      }

      setComments(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching comments:", err);
    } finally {
      setIsLoading(false);
    }
  }, [entityId, entityType]);

  useEffect(() => {
    if (entityId && entityType) {
      fetchComments();
    }
    else {
      setComments([]);
    }
  }, [entityId, entityType, fetchComments]);

  const handleCommentAddedOrUpdated = () => {
    fetchComments();
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
