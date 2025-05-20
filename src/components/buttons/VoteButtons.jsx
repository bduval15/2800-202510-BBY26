'use client'

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { clientDB } from '@/supabaseClient';

/**
 * VoteButtons.jsx
 * Loaf Life - Vote Buttons
 * 
 * This component displays upvote and downvote buttons and the current vote count.
 * Users can vote once per item, and their vote is persistent.
 * 
 * @author: Nathan O
 * 
 * Written with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */

const VoteButtons = ({ itemId, itemType, userId, upvotes: initialUpvotes, downvotes: initialDownvotes }) => {
  const [localUpvotes, setLocalUpvotes] = useState(Number(initialUpvotes) || 0);
  const [localDownvotes, setLocalDownvotes] = useState(Number(initialDownvotes) || 0);
  const [currentUserVoteType, setCurrentUserVoteType] = useState(null); // null, 'upvoted', 'downvoted'
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);

  useEffect(() => {
    setLocalUpvotes(Number(initialUpvotes) || 0);
    setLocalDownvotes(Number(initialDownvotes) || 0);
    // currentUserVoteType is fetched in a separate effect and should not be reset here
    // when initial upvotes/downvotes props change.
  }, [initialUpvotes, initialDownvotes]);

  useEffect(() => {
    if (!userId) {
      console.warn("VoteButtons: userId prop is missing. Cannot fetch user vote status.");
      setCurrentUserVoteType(null);
      // Optionally set an error state here if it's critical for UI
      // setErrorState("User information not available for voting.");
      return;
    }
    if (!itemId) {
      console.warn("VoteButtons: itemId prop is missing. Cannot fetch user vote status.");
      setCurrentUserVoteType(null);
      // setErrorState("Item information not available for voting.");
      return;
    }
    if (!itemType) {
      console.warn("VoteButtons: itemType prop is missing. Cannot fetch user vote status.");
      setCurrentUserVoteType(null);
      // setErrorState("Item type not available for voting.");
      return;
    }

    const fetchUserVote = async () => {
      setIsLoading(true);
      setErrorState(null);
      try {
        let query = clientDB
          .from('user_item_votes')
          .select('vote_type')
          .eq('user_id', userId)
          .eq('item_type', itemType);

        // Dynamically add the correct item ID condition
        if (itemType === 'hacks') {
          query = query.eq('hack_id', itemId);
        } else if (itemType === 'deals') {
          query = query.eq('deal_id', itemId);
        } else if (itemType === 'events') {
          query = query.eq('event_id', itemId);
        } else {
          throw new Error(`Unknown itemType: ${itemType}`);
        }

        const { data, error } = await query.single();

        if (error && error.code !== 'PGRST116') { // PGRST116: Searched for a single row, but found 0 rows
          throw error;
        }
        setCurrentUserVoteType(data ? data.vote_type : null);
      } catch (err) {
        console.error('Error fetching user vote:', err);
        setErrorState('Could not fetch your vote status.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserVote();
  }, [userId, itemId, itemType]);


  const recordVoteInDB = async (newUpvotes, newDownvotes, voteTypeToRecord) => {
    if (!userId) {
      console.error("VoteButtons: User ID is missing for vote recording.");
      setErrorState("Cannot record vote: User ID is missing. Please ensure you are logged in.");
      return false;
    }
    if (!itemId) {
      console.error("VoteButtons: Item ID is missing for vote recording.");
      setErrorState("Cannot record vote: Item ID is missing.");
      return false;
    }
    if (!itemType) {
      console.error("VoteButtons: Item type is missing for vote recording.");
      setErrorState("Cannot record vote: Item type is missing.");
      return false;
    }

    setIsLoading(true);
    setErrorState(null);
    try {
      // 1. Update item's total votes
      const { error: itemUpdateError } = await clientDB
        .from(itemType) // This should still be 'hacks', 'deals', or 'events' for the item table itself
        .update({ upvotes: newUpvotes, downvotes: newDownvotes })
        .eq('id', itemId); // Assuming the primary ID column in 'hacks', 'deals', 'events' tables is 'id'

      if (itemUpdateError) throw itemUpdateError;

      // 2. Record the user's specific vote in the 'user_item_votes' table
      const userVoteData = {
        user_id: userId,
        item_type: itemType,
        vote_type: voteTypeToRecord,
      };

      // Dynamically set the correct item ID field
      if (itemType === 'hacks') {
        userVoteData.hack_id = itemId;
      } else if (itemType === 'deals') {
        userVoteData.deal_id = itemId;
      } else if (itemType === 'events') {
        userVoteData.event_id = itemId;
      } else {
        // This case should ideally be caught earlier or handled more gracefully
        console.error(`Unknown itemType for vote recording: ${itemType}`);
        throw new Error(`Unknown itemType: ${itemType}`);
      }

      const { error: userVoteError } = await clientDB
        .from('user_item_votes')
        .insert(userVoteData);

      if (userVoteError) {
        // This indicates a potential inconsistency.
        // The item count was updated, but the user's vote wasn't recorded.
        // Ideally, this would be a transaction.
        console.error('Critical: User vote not recorded, but item counts may have changed.', userVoteError);
        // Attempt to revert item count? This is complex without transactions.
        // For now, throw the error to trigger the main catch.
        throw userVoteError;
      }
      return true;

    } catch (error) {
      console.error('Error recording vote:', error);
      setErrorState('Failed to record your vote. Please try again.');
      // Revert optimistic local state changes because DB operation failed
      // No need to revert localUpvotes/localDownvotes if success is false, handleUpvote/Downvote will.
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading || currentUserVoteType) return; // Already voted or an operation is in progress

    const originalLocalUpvotes = localUpvotes;
    const newUpvotes = localUpvotes + 1;
    
    setLocalUpvotes(newUpvotes);
    setCurrentUserVoteType('upvoted'); // Optimistic update
    
    const success = await recordVoteInDB(newUpvotes, localDownvotes, 'upvote');
    
    if (!success) {
      // Revert optimistic UI update if DB operation failed
      setLocalUpvotes(originalLocalUpvotes);
      setCurrentUserVoteType(null); 
      // Error message is set by recordVoteInDB
    }
  };

  const handleDownvote = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading || currentUserVoteType) return; // Already voted or an operation is in progress

    const originalLocalDownvotes = localDownvotes;
    const newDownvotes = localDownvotes + 1;

    setLocalDownvotes(newDownvotes);
    setCurrentUserVoteType('downvoted'); // Optimistic update

    const success = await recordVoteInDB(localUpvotes, newDownvotes, 'downvote');

    if (!success) {
      setLocalDownvotes(originalLocalDownvotes);
      setCurrentUserVoteType(null);
      // Error message is set by recordVoteInDB
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center space-x-1.5 bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] px-3 py-0.5 rounded-lg shadow-md">
        <button
          onClick={handleUpvote}
          aria-label="Upvote"
          className="p-0.5 rounded hover:bg-[#EADDCA] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || currentUserVoteType !== null}
        >
          <ArrowUpIcon 
            className={`h-5 w-5 ${currentUserVoteType === 'upvoted' ? 'text-[#639751]' : ''}`}
            strokeWidth={currentUserVoteType === 'upvoted' ? 2.5 : 1.5} 
          />
        </button>
        <span className="font-medium min-w-[1ch] text-center text-base">{localUpvotes - localDownvotes}</span>
        <button
          onClick={handleDownvote}
          aria-label="Downvote"
          className="p-0.5 rounded hover:bg-[#EADDCA] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || currentUserVoteType !== null}
        >
          <ArrowDownIcon 
            className={`h-5 w-5 ${currentUserVoteType === 'downvoted' ? 'text-red-500' : ''}`}
            strokeWidth={currentUserVoteType === 'downvoted' ? 2.5 : 1.5} 
          />
        </button>
      </div>
      {errorState && <p className="text-red-500 text-xs mt-1">{errorState}</p>}
    </div>
  );
};

VoteButtons.propTypes = {
  upvotes: PropTypes.number.isRequired,
  downvotes: PropTypes.number.isRequired,
  itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  itemType: PropTypes.oneOf(['hacks', 'deals', 'events']).isRequired,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Can be null if user not logged in
};

export default VoteButtons;
