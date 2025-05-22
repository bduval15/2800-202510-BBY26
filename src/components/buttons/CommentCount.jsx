/**
 * CommentCount.jsx
 *
 * Loaf Life
 *   Displays the number of comments for an entity (hack, deal, or event).
 *   Fetches and shows the comment count from Supabase, updating dynamically.
 *   Integrates with Supabase for data fetching.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author https://gemini.google.com/app (Portions of styling and logic)
 *
 * Main Component:
 *   @function CommentCount
 *   @description Renders a component that displays the comment count for a given entity.
 *                It fetches the count from Supabase, shows it next to a chat icon,
 *                and can update if new comments are posted. An optional onClick handler
 *                can be provided for custom interactions.
 *   @returns {JSX.Element|null} The comment count display or null if error and count is 0.
 */

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { clientDB } from '@/supabaseClient'; 

/**
 * @function CommentCount
 * @description Component to display the number of comments for a specific entity.
 *   It fetches the count from the 'comment' table in Supabase based on entityId and entityType.
 *   The count is displayed alongside a chat icon and can be made interactive with an onClick prop.
 * @param {object} props - The component's props.
 * @param {string} props.entityId - The ID of the entity (e.g., hack ID, deal ID).
 * @param {string} props.entityType - The type of the entity ('hack', 'deal', 'event').
 * @param {function} [props.onClick] - Optional click handler for the component.
 * @returns {JSX.Element|null} The comment count UI, or null if loading or error prevents display.
 */
const CommentCount = ({ entityId, entityType, onClick }) => {
  // State for the fetched comment count.
  const [count, setCount] = useState(0);
  // State to indicate if the comment count is currently being fetched.
  const [isLoading, setIsLoading] = useState(true);
  // State to store any error messages during fetching.
  const [error, setError] = useState(null);

  /**
   * @function fetchCommentCount
   * @description Fetches the comment count for the specified entity from Supabase.
   *              It queries the 'comment' table using the entityId and entityType.
   *              Updates state with the count, loading status, and any errors.
   * @async
   */
  const fetchCommentCount = useCallback(async () => {
    if (!entityId || !entityType) {
      setCount(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Construct the column name based on entityType (e.g., 'hack_id', 'deal_id').
      const entityColumn = `${entityType.toLowerCase()}_id`;
      // Fetch only the count of comments for the given entity using `head: true`.
      const { count: commentCount, error: fetchError } = await clientDB
        .from('comment')
        .select('id', { count: 'exact', head: true }) // `head: true` returns only count
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

  /**
   * useEffect: Initial Fetch of Comment Count.
   * @description Calls `fetchCommentCount` when the component mounts or when
   *              `fetchCommentCount` (which depends on entityId or entityType) changes.
   */
  useEffect(() => {
    fetchCommentCount();
  }, [fetchCommentCount]);

  /**
   * useEffect: Event Listener for Comment Updates.
   * @description Sets up a global event listener for 'commentUpdated'. When this event is
   *              triggered (e.g., a new comment is posted elsewhere), it refetches the
   *              comment count. Cleans up the listener on component unmount.
   */
  useEffect(() => {
    const handleCommentUpdate = () => fetchCommentCount();
    window.addEventListener('commentUpdated', handleCommentUpdate);
    // Cleanup listener on component unmount to prevent memory leaks.
    return () => window.removeEventListener('commentUpdated', handleCommentUpdate);
  }, [fetchCommentCount]);

  /**
   * @function handleClick
   * @description Handles the click event on the comment count component.
   *              If an `onClick` prop is provided, it calls that function.
   *              Otherwise, it logs a message indicating no handler was provided.
   */
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
      // Loading state: Shows a pulsing placeholder.
      <div className="flex items-center space-x-1 bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] px-3 py-0.5 rounded-lg shadow-md animate-pulse">
        <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 text-gray-400" />
        <span className="font-medium text-base text-gray-400">-</span>
      </div>
    );
  }

  // If there's an error and the count is 0 (e.g., item not found or actual error),
  // don't render the component to avoid showing misleading info.
  if (error && count === 0) {
    return null;
  }

  return (
    // Main container for the comment count display.
    <div className="flex items-center space-x-1 bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] px-3 py-0.5 rounded-lg shadow-md">
      {/* Clickable button wrapper for the icon */}
      <button
        onClick={handleClick}
        aria-label="View Comments"
        className="p-0.5 rounded hover:bg-[#EADDCA]"
      >
        {/* Chat bubble icon */}
        <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
      </button>
      {/* Displayed comment count or an error indicator */}
      <span className="font-medium text-base">{error ? '!' : count}</span>
    </div>
  );
};

CommentCount.propTypes = {
  /** The unique ID of the entity for which to count comments. */
  entityId: PropTypes.string.isRequired,
  /** The type of the entity (e.g., 'hack', 'deal', 'event'). */
  entityType: PropTypes.oneOf(['hack', 'deal', 'event']).isRequired,
  /** Optional click handler for the component. */
  onClick: PropTypes.func,
};

export default CommentCount;