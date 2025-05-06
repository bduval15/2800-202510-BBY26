import React from 'react';
import PropTypes from 'prop-types';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';

/**
 * CommentDisplay.jsx
 * Loaf Life - Comment Display
 * 
 * This component displays the comment icon and count.
 * 
 * @author: Nathan O
 * 
 * Written with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */

// Placeholder for view comments action - Nathan O
const CommentDisplay = ({ count }) => {
  // Placeholder for view comments action
  const handleViewComments = () => {
    console.log('View comments clicked');
  };

  return (
    <div className="flex items-center space-x-1 bg-[#d1905a] text-[#FFE2B6] px-2 py-1 rounded-full">
      <button
        onClick={handleViewComments} 
        aria-label="View Comments"
        className="p-0.5 rounded bg-[#d1905a]"
      >
        <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
      </button>
      <span className="font-medium text-base">{count}</span>
    </div>
  );
};

CommentDisplay.propTypes = {
  count: PropTypes.number.isRequired,
};

export default CommentDisplay; 