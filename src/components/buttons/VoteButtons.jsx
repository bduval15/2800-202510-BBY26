/**
 * VoteButtons.jsx
 *
 * Loaf Life
 *   Displays interactive upvote/downvote buttons and the net vote count for items.
 *   Users can cast, change, or remove their votes. Votes are persisted to Supabase,
 *   updating 'user_item_votes' and item-specific tables (e.g., 'hacks', 'deals', 'events').
 *   Integrates with Supabase for data persistence.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author https://gemini.google.com/app (Portions of styling and logic)
 *
 * Main Component:
 *   @function VoteButtons
 *   @description Renders upvote and downvote buttons, displays the net vote count,
 *                allows users to manage their votes, highlights the user's current vote status,
 *                and handles loading/error states for vote actions.
 *   @returns {JSX.Element} The vote buttons component.
 */

'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { clientDB } from '@/supabaseClient';

/**
 * @function VoteButtons
 * @description Component for displaying and managing upvote/downvote actions on an item.
 *   It handles vote casting, changing, and retracting, reflecting the user's current
 *   vote and the total vote count. Changes are synchronized with the Supabase database.
 * @param {object} props - The component's props.
 * @param {string|number} props.itemId - The unique ID of the item being voted on.
 * @param {string} props.itemType - The type of item ('hacks', 'deals', 'events').
 * @param {string|number} props.userId - The ID of the current user.
 * @param {number} props.upvotes - Initial number of upvotes for the item.
 * @param {number} props.downvotes - Initial number of downvotes for the item.
 * @param {string|number} [props.hackId] - Optional hack ID, used if itemId and itemType are not set.
 * @param {string|number} [props.dealId] - Optional deal ID, used if itemId and itemType are not set.
 * @param {string|number} [props.eventId] - Optional event ID, used if itemId and itemType are not set.
 * @returns {JSX.Element} The vote buttons UI.
 */
const VoteButtons = ({ itemId, itemType, userId, upvotes: initialUpvotes, downvotes: initialDownvotes, hackId, dealId, eventId }) => {
  // State for the local count of upvotes, initialized from props.
  const [localUpvotes, setLocalUpvotes] = useState(Number(initialUpvotes) || 0);
  // State for the local count of downvotes, initialized from props.
  const [localDownvotes, setLocalDownvotes] = useState(Number(initialDownvotes) || 0);
  // State for the current user's vote type ('upvoted', 'downvoted', or null).
  const [currentUserVoteType, setCurrentUserVoteType] = useState(null);
  // State to indicate if a vote operation is currently in progress.
  const [isLoading, setIsLoading] = useState(false);
  // State to store any error messages related to voting.
  const [errorState, setErrorState] = useState(null);

  /**
   * useEffect: Sync local vote counts with props.
   * @description Updates the local upvote and downvote counts if the initial props change.
   *              This ensures the component reflects the most current vote data from its parent.
   */
  useEffect(() => {
    setLocalUpvotes(Number(initialUpvotes) || 0);
    setLocalDownvotes(Number(initialDownvotes) || 0);
  }, [initialUpvotes, initialDownvotes]);

  /**
   * useEffect: Fetch User's Vote Status.
   * @description Fetches the current user's vote status for the item when the component mounts
   *              or when relevant identifiers (userId, itemId, itemType, etc.) change.
   *              It queries the 'user_item_votes' table in Supabase.
   */
  useEffect(() => {
    // Fetches the current user's vote status for this item when component mounts or
    // dependencies change.
    if (!userId) {
      setCurrentUserVoteType(null);
      return;
    }

    // Determine the current item's ID and type from the provided props.
    const currentItemId = itemId || hackId || dealId || eventId;
    const currentItemType = itemType || (hackId ? 'hacks' : dealId ? 'deals' : eventId ? 'events' : null);

    if (!currentItemId) {
      setCurrentUserVoteType(null);
      return;
    }
    if (!currentItemType) {
      setCurrentUserVoteType(null);
      return;
    }
    setErrorState(null);

    /**
     * @function fetchUserVote
     * @description Fetches the vote type (upvoted/downvoted) for the current user and item.
     *              It queries the 'user_item_votes' table and updates the component's state.
     * @async
     */
    const fetchUserVote = async () => {
      setIsLoading(true);
      try {
        let query = clientDB
          .from('user_item_votes')
          .select('vote_type')
          .eq('user_id', userId)
          .eq('item_type', currentItemType);

        if (currentItemType === 'hacks') query = query.eq('hack_id', currentItemId);
        else if (currentItemType === 'deals') query = query.eq('deal_id', currentItemId);
        else if (currentItemType === 'events') query = query.eq('event_id', currentItemId);
        else throw new Error(`Unknown itemType: ${currentItemType} during fetch.`);
        
        const { data, error } = await query.single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116: row not found
        setCurrentUserVoteType(data ? data.vote_type : null);
      } catch (err) {
        console.error('Error fetching user vote:', err);
        setErrorState('Could not fetch your vote status.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserVote();
  }, [userId, itemId, itemType, hackId, dealId, eventId]);

  /**
   * @function syncVoteWithDB
   * @description Persists vote changes to the Supabase database. It updates the total
   *              upvotes/downvotes on the item's specific table (e.g., 'hacks') and then
   *              updates or creates a record in 'user_item_votes' for the user's vote.
   * @async
   * @param {number} newItemUpvotes - The new total upvotes for the item.
   * @param {number} newItemDownvotes - The new total downvotes for the item.
   * @param {string|null} nextVoteType - The user's next vote type ('upvoted', 'downvoted', or null).
   * @returns {Promise<boolean>} True if the sync was successful, false otherwise.
   */
  const syncVoteWithDB = async (newItemUpvotes, newItemDownvotes, nextVoteType) => {
    // Persists vote changes to the database.
    // Updates the total upvotes/downvotes on the item's specific table (e.g., 'hacks').
    // Then, updates or creates a record in 'user_item_votes' to reflect the user's vote.
    const currentItemId = itemId || hackId || dealId || eventId;
    const currentItemType = itemType || (hackId ? 'hacks' : dealId ? 'deals' : eventId ? 'events' : null);

    if (!userId) {
      setErrorState("Cannot vote: User ID is missing. Please log in.");
      return false;
    }
    if (!currentItemId || !currentItemType) {
        setErrorState("Cannot vote: Item information is missing.");
        return false;
    }

    setIsLoading(true);
    setErrorState(null);

    try {
      // 1. Update item's total votes in its specific table (e.g., 'hacks', 'deals', 'events')
      const { error: itemUpdateError } = await clientDB
        .from(currentItemType)
        .update({ upvotes: newItemUpvotes, downvotes: newItemDownvotes })
        .eq('id', currentItemId);
      if (itemUpdateError) throw itemUpdateError;

      // 2. Manage the specific user's vote in 'user_item_votes'
      const itemIdentifierColumn = 
          currentItemType === 'hacks' ? 'hack_id' :
          currentItemType === 'deals' ? 'deal_id' :
          currentItemType === 'events' ? 'event_id' :
          null;

      if (!itemIdentifierColumn) {
        throw new Error(`Unknown itemType for DB sync: ${currentItemType}`);
      }

      // Simplifies vote management by first deleting any existing vote for this user/item,
      // then inserting a new one if the user is casting/changing a vote.
      await clientDB
        .from('user_item_votes')
        .delete()
        .eq('user_id', userId)
        .eq(itemIdentifierColumn, currentItemId);

      // Then, if nextVoteType is not null (i.e., user is casting a new vote or changing vote), insert the new vote.
      // If nextVoteType is null, it means the user is removing their vote, so we only performed the delete above.
      if (nextVoteType) {
        const voteToInsert = {
          user_id: userId,
          item_type: currentItemType,
          vote_type: nextVoteType,
          [itemIdentifierColumn]: currentItemId 
          // The 'id' column of 'user_item_votes' should be auto-generated by the database (e.g., with DEFAULT gen_random_uuid())
          // So, we do not provide it here.
        };

        const { error: insertError } = await clientDB
          .from('user_item_votes')
          .insert(voteToInsert);
        
        if (insertError) {
            // Check if the error is about the 'id' column specifically
            if (insertError.message.includes('null value in column "id"')) {
                console.error("Critical DB Setup Error: The 'id' column in 'user_item_votes' might not be auto-generating UUIDs. Please check table definition in Supabase.", insertError);
                setErrorState("Database configuration error. Could not save vote. (Admin notified)");
            } else if (insertError.code === '23505') { 
                 console.error("Error: Unique constraint violation during vote insert. This might indicate an issue with the delete-then-insert logic or concurrent operations.", insertError);
                 setErrorState("Could not record vote due to a conflict. Please try again.");
            } else {
                throw insertError;
            }
        }
      }
      return true;
    } catch (error) {
      console.error('Error syncing vote with DB:', error);
      setErrorState('Failed to update vote. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @function handleVote
   * @description Handles a vote action (upvote or downvote). It updates the UI optimistically,
   *              then attempts to sync the vote with the database via `syncVoteWithDB`.
   *              If the database sync fails, it reverts the UI changes.
   * @async
   * @param {Event} e - The click event object.
   * @param {string} voteAction - The type of vote action ('upvote' or 'downvote').
   */
  const handleVote = async (e, voteAction) => {
    // Handles a vote action (upvote or downvote).
    // Updates UI optimistically, then attempts to sync with the database.
    // Reverts UI changes if DB sync fails.
    e.stopPropagation();
    e.preventDefault();

    if (isLoading || !userId) {
      if(!userId) setErrorState("Please log in to vote.");
      return;
    }

    // Store original state for potential rollback in case of DB error.
    const originalLocalUpvotes = localUpvotes;
    const originalLocalDownvotes = localDownvotes;
    const originalUserVoteType = currentUserVoteType;

    let newLocalUpvotes = localUpvotes;
    let newLocalDownvotes = localDownvotes;
    let nextUserVoteType = null;

    // Determine new vote counts and user's vote type based on the action and current state.
    if (voteAction === 'upvote') {
      if (currentUserVoteType === 'upvoted') {
        // User is removing their existing upvote.
        newLocalUpvotes = localUpvotes - 1;
        nextUserVoteType = null;
      } else if (currentUserVoteType === 'downvoted') {
        // User is changing from a downvote to an upvote.
        newLocalUpvotes = localUpvotes + 1;
        newLocalDownvotes = localDownvotes - 1;
        nextUserVoteType = 'upvoted';
      } else {
        // User is casting a new upvote (was previously null).
        newLocalUpvotes = localUpvotes + 1;
        nextUserVoteType = 'upvoted';
      }
    } else if (voteAction === 'downvote') {
      if (currentUserVoteType === 'downvoted') {
        // User is removing their existing downvote.
        newLocalDownvotes = localDownvotes - 1;
        nextUserVoteType = null;
      } else if (currentUserVoteType === 'upvoted') {
        // User is changing from an upvote to a downvote.
        newLocalDownvotes = localDownvotes + 1;
        newLocalUpvotes = localUpvotes - 1;
        nextUserVoteType = 'downvoted';
      } else {
        // User is casting a new downvote (was previously null).
        newLocalDownvotes = localDownvotes + 1;
        nextUserVoteType = 'downvoted';
      }
    }

    // Optimistic UI update: Apply changes locally before DB confirmation.
    setLocalUpvotes(newLocalUpvotes);
    setLocalDownvotes(newLocalDownvotes);
    setCurrentUserVoteType(nextUserVoteType);

    const success = await syncVoteWithDB(newLocalUpvotes, newLocalDownvotes, nextUserVoteType);

    // If DB sync fails, revert optimistic UI updates to original state.
    if (!success) {
      setLocalUpvotes(originalLocalUpvotes);
      setLocalDownvotes(originalLocalDownvotes);
      setCurrentUserVoteType(originalUserVoteType);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Container for vote buttons and count */}
      <div className="flex items-center space-x-1.5 bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] px-3 py-0.5 rounded-lg shadow-md">
        {/* Upvote button */}
        <button
          onClick={(e) => handleVote(e, 'upvote')}
          aria-label="Upvote"
          className="p-0.5 rounded hover:bg-[#EADDCA] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !userId}
        >
          <ArrowUpIcon 
            className={`h-5 w-5 ${currentUserVoteType === 'upvoted' ? 'text-[#639751]' : ''}`}
            strokeWidth={currentUserVoteType === 'upvoted' ? 2.5 : 1.5} 
          />
        </button>
        {/* Net vote count display */}
        <span className="font-medium min-w-[1ch] text-center text-base tabular-nums">
            {localUpvotes - localDownvotes}
        </span>
        {/* Downvote button */}
        <button
          onClick={(e) => handleVote(e, 'downvote')}
          aria-label="Downvote"
          className="p-0.5 rounded hover:bg-[#EADDCA] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !userId}
        >
          <ArrowDownIcon 
            className={`h-5 w-5 ${currentUserVoteType === 'downvoted' ? 'text-red-500' : ''}`}
            strokeWidth={currentUserVoteType === 'downvoted' ? 2.5 : 1.5} 
          />
        </button>
      </div>
      {/* Error message display area */}
      {errorState && <p className="text-red-500 text-xs mt-1 px-1 text-center">{errorState}</p>}
    </div>
  );
};

VoteButtons.propTypes = {
  /** Initial number of upvotes for the item. */
  upvotes: PropTypes.number.isRequired,
  /** Initial number of downvotes for the item. */
  downvotes: PropTypes.number.isRequired,
  /** The unique ID of the item being voted on. Used if specific item type IDs are not provided. */
  itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** The type of the item, e.g., 'hacks', 'deals', 'events'. */
  itemType: PropTypes.oneOf(['hacks', 'deals', 'events']),
  /** The ID of the current user. Required for voting. */
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** The ID of the hack, if the item is a hack. */
  hackId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** The ID of the deal, if the item is a deal. */
  dealId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** The ID of the event, if the item is an event. */
  eventId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default VoteButtons;
