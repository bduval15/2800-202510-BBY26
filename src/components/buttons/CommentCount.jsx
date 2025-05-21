import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { clientDB } from '@/supabaseClient'; // Import Supabase client

/**
 * CommentCount.jsx
 * Loaf Life - Comment Count Display
 * 
 * This component is responsible for fetching and displaying the number of comments 
 * associated with a specific entity (e.g., a hack, deal, or event). 
 * It queries the Supabase 'comment' table using the provided `entityId` and `entityType` 
 * to determine the count. The component visually presents this count alongside a 
 * chat bubble icon. It also includes functionality to re-fetch the comment count 
 * when a 'commentUpdated' event is dispatched globally, ensuring the displayed 
 * count remains current. An optional `onClick` prop allows for custom actions 
 * when the component is clicked.
 * 
 * Written with assistance from Google Gemini 2.5 Flash
 * 
 * @author: Nathan O 
 * @author: https://gemini.google.com/app
 */

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
      const { count: commentCount, error: fetchError } = await clientDB
        .from('comment')
        .select('id', { count: 'exact', head: true })
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


  useEffect(() => {
    const handleCommentUpdate = () => fetchCommentCount();
    window.addEventListener('commentUpdated', handleCommentUpdate);
    return () => window.removeEventListener('commentUpdated', handleCommentUpdate);
  }, [fetchCommentCount]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
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