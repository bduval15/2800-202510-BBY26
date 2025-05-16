/**
 * CommentSection.jsx
 * Loaf Life - Comment Section
 *
 * This component displays the comment section for a hack,
 * allowing users to view and add comments.
 *
 * @author: Nathan O (Initially in HackDetailPage)
 *
 * Modified with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import CommentDisplay from '@/components/buttons/CommentDisplay';
import Comment from '@/components/cards/Comment';
import AddCommentForm from '@/components/forms/AddCommentForm';
import { clientDB } from '@/supabaseClient';
import PropTypes from 'prop-types';

export default function CommentSection({ postType, postId }) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const foreignKey =
    postType === 'hack' ? 'hack_id' :
      postType === 'event' ? 'event_id' :
        postType === 'deal' ? 'deal_id' :
          null;

  useEffect(() => {
    if (!open || !foreignKey) return;

    const fetchComments = async () => {
      setLoading(true);
      setFetchError('');
      try {
        const { data, error } = await clientDB
          .from('comment')
          .select(`
            id, 
            user_id,
            message, 
            created_at,
            user:user_id (id, username)
          `)
          .eq(foreignKey, postId)
          .order('created_at', { ascending: false });

        console.log('Fetching comments for:', { foreignKey, postId, count: data?.length });

        if (error) throw error;
        setComments(data);
      } catch (error) {
        console.error('Fetch error:', error);
        setFetchError('Failed to load comments');
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [open, foreignKey, postId]);

  return (
    <div className="bg-[#FDFAF5] p-4 rounded-lg border border-[#8B4C24]/30 mt-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center text-xl font-semibold text-[#8B4C24]"
      >
        <span>Comments</span>
        {open ? (
          <ChevronUpIcon className="h-6 w-6 text-[#A0522D]" />
        ) : (
          <ChevronDownIcon className="h-6 w-6 text-[#A0522D]" />
        )}
      </button>

      <div className="mt-2">
        <CommentDisplay count={comments.length} />
      </div>

      {open && (
        <div className="mt-4" id="comments-section">
          {loading && <p className="text-sm text-gray-500">Loading comments...</p>}

          {fetchError && (
            <p className="text-red-500 text-sm">{fetchError}</p>
          )}

          {!loading && !fetchError && comments.length === 0 && (
            <p className="text-sm text-gray-500">No comments yet. Be the first to share your thoughts!</p>
          )}

          {comments.map(c => (
            <Comment
              key={c.id}
              avatarSrc={null}
              username={c.user?.username || 'Anonymous'}
              timestamp={new Date(c.created_at).toLocaleString()}
              commentText={c.message}
            />
          ))}

          <AddCommentForm
            postType={postType}
            postId={postId}
            onCommentPosted={(newComment) => {
              // Force refetch comments to ensure data consistency
              setOpen(true);
              setComments(prev => [newComment, ...prev]);

              // Alternative: Refetch from server
              fetchComments(); // You'll need to expose fetchComments
            }}
          />
        </div>
      )}
    </div>
  );
}

CommentSection.propTypes = {
  postType: PropTypes.oneOf(['hack', 'event', 'deal']).isRequired,
  postId: PropTypes.string.isRequired,
};