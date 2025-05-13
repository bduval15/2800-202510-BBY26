import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { clientDB } from '@/supabaseClient';

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

const VoteButtons = ({ hackId, upvotes: initialUpvotes, downvotes: initialDownvotes }) => {
  const [localUpvotes, setLocalUpvotes] = useState(Number(initialUpvotes) || 0);
  const [localDownvotes, setLocalDownvotes] = useState(Number(initialDownvotes) || 0);
  const [userVote, setUserVote] = useState(null); // null, 'upvoted', 'downvoted'
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLocalUpvotes(Number(initialUpvotes) || 0);
    setLocalDownvotes(Number(initialDownvotes) || 0);
    setUserVote(null);
  }, [initialUpvotes, initialDownvotes]);

  const updateVoteInDB = async (newUpvotes, newDownvotes) => {
    if (!hackId) {
      console.error("Hack ID is missing, cannot update vote in DB.");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await clientDB
        .from('hacks')
        .update({ upvotes: newUpvotes, downvotes: newDownvotes })
        .eq('id', hackId);

      if (error) {
        throw error;
      }
      // Optionally, you might want to re-fetch the post or rely on the optimistic update.
      // For now, we assume the optimistic update is sufficient.
    } catch (error) {
      console.error('Error updating vote:', error);
      // Revert optimistic updates if DB update fails
      // This part can be enhanced based on how you want to handle errors
      setLocalUpvotes(Number(initialUpvotes) || 0);
      setLocalDownvotes(Number(initialDownvotes) || 0);
      // Potentially reset userVote based on the actual state before the failed attempt
      // For simplicity, we'll reset it to null or its initial state if available
      setUserVote(null); 
      alert('Failed to update vote. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = () => {
    if (isLoading) return;
    let newUpvotes = localUpvotes;
    let newDownvotes = localDownvotes;
    let nextUserVote = userVote;

    if (userVote === 'upvoted') {
      newUpvotes = localUpvotes - 1;
      nextUserVote = null;
    } else if (userVote === 'downvoted') {
      newDownvotes = localDownvotes - 1;
      newUpvotes = localUpvotes + 1;
      nextUserVote = 'upvoted';
    } else {
      newUpvotes = localUpvotes + 1;
      nextUserVote = 'upvoted';
    }

    setLocalUpvotes(newUpvotes);
    setLocalDownvotes(newDownvotes);
    setUserVote(nextUserVote);
    updateVoteInDB(newUpvotes, newDownvotes);
  };

  const handleDownvote = () => {
    if (isLoading) return;
    let newUpvotes = localUpvotes;
    let newDownvotes = localDownvotes;
    let nextUserVote = userVote;

    if (userVote === 'downvoted') {
      newDownvotes = localDownvotes - 1;
      nextUserVote = null;
    } else if (userVote === 'upvoted') {
      newUpvotes = localUpvotes - 1;
      newDownvotes = localDownvotes + 1;
      nextUserVote = 'downvoted';
    } else {
      newDownvotes = localDownvotes + 1;
      nextUserVote = 'downvoted';
    }

    setLocalUpvotes(newUpvotes);
    setLocalDownvotes(newDownvotes);
    setUserVote(nextUserVote);
    updateVoteInDB(newUpvotes, newDownvotes);
  };

  return (
    <div className="flex items-center space-x-1.5 bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] px-3 py-0.5 rounded-lg shadow-md">
      <button
        onClick={handleUpvote}
        aria-label="Upvote"
        className="p-0.5 rounded hover:bg-[#EADDCA]"
        disabled={isLoading}
      >
        <ArrowUpIcon 
          className={`h-5 w-5 ${userVote === 'upvoted' ? 'text-[#639751]' : ''}`}
          strokeWidth={userVote === 'upvoted' ? 2.5 : 1.5} 
        />
      </button>
      <span className="font-medium min-w-[1ch] text-center text-base">{localUpvotes - localDownvotes}</span>
      <button
        onClick={handleDownvote}
        aria-label="Downvote"
        className="p-0.5 rounded hover:bg-[#EADDCA]"
        disabled={isLoading}
      >
        <ArrowDownIcon 
          className={`h-5 w-5 ${userVote === 'downvoted' ? 'text-red-500' : ''}`}
          strokeWidth={userVote === 'downvoted' ? 2.5 : 1.5} 
        />
      </button>
    </div>
  );
};

VoteButtons.propTypes = {
  upvotes: PropTypes.number.isRequired,
  downvotes: PropTypes.number.isRequired,
  hackId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default VoteButtons; 