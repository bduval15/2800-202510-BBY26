import React, { useState, useEffect } from 'react';
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

const VoteButtons = ({ upvotes: initialUpvotes, downvotes: initialDownvotes }) => {
  const [localUpvotes, setLocalUpvotes] = useState(Number(initialUpvotes) || 0);
  const [localDownvotes, setLocalDownvotes] = useState(Number(initialDownvotes) || 0);
  const [userVote, setUserVote] = useState(null); // null, 'upvoted', 'downvoted'

  
  useEffect(() => {
    setLocalUpvotes(Number(initialUpvotes) || 0);
    setLocalDownvotes(Number(initialDownvotes) || 0);
    setUserVote(null); // Reset user vote if props change significantly, or handle as per desired UX
  }, [initialUpvotes, initialDownvotes]);

  const handleUpvote = () => {
    if (userVote === 'upvoted') {
      // Already upvoted, remove upvote
      setLocalUpvotes(localUpvotes - 1);
      setUserVote(null);
    } else if (userVote === 'downvoted') {
      // Was downvoted, change to upvote
      setLocalDownvotes(localDownvotes - 1);
      setLocalUpvotes(localUpvotes + 1);
      setUserVote('upvoted');
    } else {
      // No vote or other, add upvote
      setLocalUpvotes(localUpvotes + 1);
      setUserVote('upvoted');
    }
  };

  const handleDownvote = () => {
    if (userVote === 'downvoted') {
      // Already downvoted, remove downvote
      setLocalDownvotes(localDownvotes - 1);
      setUserVote(null);
    } else if (userVote === 'upvoted') {
      // Was upvoted, change to downvote
      setLocalUpvotes(localUpvotes - 1);
      setLocalDownvotes(localDownvotes + 1);
      setUserVote('downvoted');
    } else {
      // No vote or other, add downvote
      setLocalDownvotes(localDownvotes + 1);
      setUserVote('downvoted');
    }
  };

  const getBackgroundColor = () => {
    if (userVote === 'upvoted') {
      return 'bg-[#639751]'; // Green for upvote
    }
    if (userVote === 'downvoted') {
      return 'bg-[#8B4C24]'; // Darker brown for downvote
    }
    return 'bg-[#d1905a]'; // Default color
  };

  return (
    <div className={`flex items-center space-x-1.5 text-[#FFE2B6] px-2 py-1 rounded-full ${getBackgroundColor()}`}>
      <button
        onClick={handleUpvote}
        aria-label="Upvote"
        className={`p-0.5 rounded ${getBackgroundColor()}`}
      >
        <ArrowUpIcon className="h-5 w-5" />
      </button>
      <span className="font-medium min-w-[1ch] text-center text-base">{localUpvotes - localDownvotes}</span>
      <button
        onClick={handleDownvote}
        aria-label="Downvote"
        className={`p-0.5 rounded ${getBackgroundColor()}`} 
      >
        <ArrowDownIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

VoteButtons.propTypes = {
  upvotes: PropTypes.number.isRequired,
  downvotes: PropTypes.number.isRequired,
};

export default VoteButtons; 