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
    setUserVote(null);
  }, [initialUpvotes, initialDownvotes]);

  const handleUpvote = () => {
    if (userVote === 'upvoted') {
      setLocalUpvotes(localUpvotes - 1);
      setUserVote(null);
    } else if (userVote === 'downvoted') {
      setLocalDownvotes(localDownvotes - 1);
      setLocalUpvotes(localUpvotes + 1);
      setUserVote('upvoted');
    } else {
      setLocalUpvotes(localUpvotes + 1);
      setUserVote('upvoted');
    }
  };

  const handleDownvote = () => {
    if (userVote === 'downvoted') {
      setLocalDownvotes(localDownvotes - 1);
      setUserVote(null);
    } else if (userVote === 'upvoted') {
      setLocalUpvotes(localUpvotes - 1);
      setLocalDownvotes(localDownvotes + 1);
      setUserVote('downvoted');
    } else {
      setLocalDownvotes(localDownvotes + 1);
      setUserVote('downvoted');
    }
  };

  return (
    <div className="flex items-center space-x-1.5 bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] px-3 py-1.5 rounded-lg shadow-md">
      <button
        onClick={handleUpvote}
        aria-label="Upvote"
        className="p-0.5 rounded hover:bg-[#EADDCA]"
      >
        <ArrowUpIcon className="h-5 w-5" />
      </button>
      <span className="font-medium min-w-[1ch] text-center text-base">{localUpvotes - localDownvotes}</span>
      <button
        onClick={handleDownvote}
        aria-label="Downvote"
        className="p-0.5 rounded hover:bg-[#EADDCA]"
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