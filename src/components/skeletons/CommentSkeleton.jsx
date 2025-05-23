/**
 * CommentSkeleton.jsx
 * Loaf Life – Placeholder UI for a comment card during loading.
 *
 * This component renders a skeleton (placeholder) view that mimics the
 * structure of a `CommentCard`. It is used to indicate that comment data is
 * being loaded, providing a better user experience by showing a visual
 * representation of where content will appear.
 *
 * Features:
 * - Animated pulse effect to indicate loading.
 * - Mimics the layout of a `CommentCard` (avatar, username, timestamp, message lines).
 *
 * Modified with assistance from Google Gemini 2.5 Pro.
 * 
 * @author Nathan Oloresisimo
 * @author https://gemini.google.com/app
 */
import React from 'react';

const CommentSkeleton = () => {
  return (
    <div className="bg-[#FDFAF5] p-2 rounded-lg border border-[#8B4C24]/30 shadow-md mb-2 animate-pulse">
      <div className="flex items-start space-x-1">
        {/* Avatar Skeleton */}
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>

        {/* Content Skeleton */}
        <div className="flex-1 space-y-2 py-1">
          <div className="flex items-center space-x-2 mb-1">
            <div className="h-3 bg-gray-300 rounded w-1/4"></div> {/* Username */}
            <div className="h-3 bg-gray-300 rounded w-1/6"></div> {/* Timestamp */}
          </div>
          <div className="h-3 bg-gray-300 rounded w-full"></div>      {/* Comment line 1 */}
          <div className="h-3 bg-gray-300 rounded w-3/4"></div>      {/* Comment line 2 (optional) */}
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton; 