import React from 'react';
import PropTypes from 'prop-types';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

/**
 * VoteButtons.jsx
 * Loaf Life - Vote Buttons
 * 
 * This component displays upvote and downvote buttons and the current vote count.
 * 
 * @author: Nathan O
 * 
 * Written with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */

// Placeholder logic, need to implement actual vote handling later - Nathan O
const VoteButtons = ({ upvotes, downvotes }) => {
  // Placeholder for vote handling logic
  const handleUpvote = () => {
    console.log('Upvoted');
  };

  const handleDownvote = () => {
    console.log('Downvoted');
  };

  return (
    <div className="flex items-center space-x-1.5 bg-[#d1905a] text-[#FFE2B6] px-2 py-1 rounded-full">
      <button
        onClick={handleUpvote}
        aria-label="Upvote"
        className="p-0.5 rounded bg-[#d1905a]"
      >
        <ArrowUpIcon className="h-5 w-5" />
      </button>
      <span className="font-medium min-w-[1ch] text-center text-base">{upvotes - downvotes}</span>
      <button
        onClick={handleDownvote}
        aria-label="Downvote"
        className="p-0.5 rounded bg-[#d1905a]"
      >
        <ArrowDownIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

VoteButtons.propTypes = {
  upvotes: PropTypes.number.isRequired,
  downvotes: PropTypes.number.isRequired,
  // id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Optional: if needed for API calls
};

export default VoteButtons; 