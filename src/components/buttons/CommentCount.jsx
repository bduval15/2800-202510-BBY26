/**
 * CommentCount.jsx
 * Loaf Life – Displays the number of comments for an entity.
 *
 * This component fetches and shows the comment count for items like
 * hacks, deals, or events. It queries the 'comment' table in Supabase
 * using an entity ID and type. The count appears next to a chat icon.
 * The component can refresh the count when new comments are made.
 * An optional click handler allows for custom interactions.
 *
 * Features:
 * - Fetches comment count from Supabase.
 * - Displays count with a chat bubble icon.
 * - Updates count dynamically on 'commentUpdated' event.
 * - Supports an optional onClick prop for custom actions.
 *
 * Portions of styling and logic assisted by Google Gemini 2.5 Flash.
 *
 * @author Nathan Oloresisimo
 * @author https://gemini.google.com/app
 */

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { clientDB } from '@/supabaseClient'; 

const CommentCount = ({ entityId, entityType, onClick }) => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommentCount = useCallback(async () => {
    if (!entityId || !entityType) {
      setCount(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const entityColumn = `${entityType.toLowerCase()}_id`;
      // Fetch only the count of comments for the given entity
      const { count: commentCount, error: fetchError } = await clientDB
        .from('comment')
        .select('id', { count: 'exact', head: true }) // `head: true` ensures only count is returned
        .eq(entityColumn, entityId);

      if (fetchError) {
        console.error('Supabase fetch count error:', fetchError);
        throw new Error(fetchError.message || 'Failed to fetch comment count.');
      }

      setCount(commentCount || 0);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching comment count:", err);
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [entityId, entityType]);

  useEffect(() => {
    fetchCommentCount();
  }, [fetchCommentCount]);


  // Listen for a global event indicating a comment was added/deleted, then refetch count
  useEffect(() => {
    const handleCommentUpdate = () => fetchCommentCount();
    window.addEventListener('commentUpdated', handleCommentUpdate);
    // Cleanup listener on component unmount
    return () => window.removeEventListener('commentUpdated', handleCommentUpdate);
  }, [fetchCommentCount]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior or logging if no onClick is provided
      console.log('Comment icon clicked, but no onClick handler provided.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-1 bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] px-3 py-0.5 rounded-lg shadow-md animate-pulse">
        <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 text-gray-400" />
        <span className="font-medium text-base text-gray-400">-</span>
      </div>
    );
  }

  // If there's an error and count is 0, don't render the component
  if (error && count === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-1 bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] px-3 py-0.5 rounded-lg shadow-md">
      <button
        onClick={handleClick}
        aria-label="View Comments"
        className="p-0.5 rounded hover:bg-[#EADDCA]"
      >
        <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
      </button>
      <span className="font-medium text-base">{error ? '!' : count}</span>
    </div>
  );
};

CommentCount.propTypes = {
  entityId: PropTypes.string.isRequired,
  entityType: PropTypes.oneOf(['hack', 'deal', 'event']).isRequired,
  onClick: PropTypes.func,
};

export default CommentCount;