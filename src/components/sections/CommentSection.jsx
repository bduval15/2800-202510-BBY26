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

  const [showComments, setShowComments] = useState(false);
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
      <button
        onClick={() => setShowComments(!showComments)}
        className="w-full flex justify-between items-center text-xl font-semibold text-[#8B4C24] focus:outline-none"
      >
        <span>
          Comments
          {!isLoading && !error && (
            <span className="text-sm font-normal ml-1">({comments.length})</span>
          )}
        </span>
        {showComments ? (
          <ChevronUpIcon className="h-6 w-6 text-[#A0522D]" />
        ) : (
          <ChevronDownIcon className="h-6 w-6 text-[#A0522D]" />
        )}
      </button>

      {showComments && (
        <div className="mt-4" id="comments-section">
          {isLoading ? (
            <>
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
          {(!isLoading && !error) || (error && comments.length > 0) ? (
            <AddCommentForm
              entityId={entityId}
              entityType={entityType}
              onCommentAdded={handleCommentAddedOrUpdated}
            />
          ) : null}
        </div>
      )}
    </div>
  );
} 