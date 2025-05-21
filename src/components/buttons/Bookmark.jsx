/**
 * File: Bookmark.jsx
 *
 * Loaf Life
 *   Provides a button for users to bookmark or unbookmark items (hacks, deals, events).
 *   It visually reflects the bookmark status and updates the Supabase 'saved_items' table.
 *   Utilizes React for UI and Supabase for data persistence.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author https://gemini.google.com/app (Portions of styling and logic)
 *
 * Main Component:
 *   @function BookmarkButton
 *   @description Renders a bookmark button that allows users to save or unsave items.
 *                It fetches the user's ID and the item's initial bookmark status.
 *                Clicking toggles status and updates the backend.
 *   @returns {JSX.Element} A button element for bookmarking.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { clientDB } from '@/supabaseClient';
import PropTypes from 'prop-types';

/**
 * @function BookmarkButton
 * @description A button component that allows users to bookmark or unbookmark an item.
 *   It handles fetching the current bookmark status and updating it in the Supabase
 *   'saved_items' table upon user interaction.
 * @param {object} props - The component's props.
 * @param {string|number} [props.hackId] - The ID of the hack to bookmark.
 * @param {string|number} [props.dealId] - The ID of the deal to bookmark.
 * @param {string|number} [props.eventId] - The ID of the event to bookmark.
 * @returns {JSX.Element} The bookmark button UI.
 */
const BookmarkButton = ({ hackId, dealId, eventId }) => {
  // State for whether the item is currently bookmarked by the user.
  const [isBookmarked, setIsBookmarked] = useState(false);
  // State to indicate if a bookmark operation is in progress.
  const [isLoading, setIsLoading] = useState(false);
  // State for the current user's ID.
  const [userId, setUserId] = useState(null);
  // State to store any error messages related to bookmarking.
  const [error, setError] = useState(null);

  // Determine itemId and itemType based on which prop (hackId, dealId, eventId) is provided.
  const itemId = hackId || dealId || eventId;
  const itemType = hackId ? 'hack' : (dealId ? 'deal' : (eventId ? 'event' : null));

  /**
   * useEffect: Fetch Current User Session.
   * @description Fetches the current user's session data on component mount to get the user ID.
   *              This is necessary to check and manage user-specific bookmarks.
   */
  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data: { session }, error: sessionError } = await clientDB.auth.getSession();
        if (sessionError) {
          throw sessionError;
        }
        if (session && session.user) {
          setUserId(session.user.id);
        } else {
          setUserId(null);
        }
      } catch (err) {
        console.error('Error fetching user session:', err);
        setError('Could not fetch user session.');
        setUserId(null);
      } finally {
        if (!itemId) setIsLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  /**
   * useEffect: Check Initial Bookmark Status.
   * @description Fetches the initial bookmark status of the item for the current user once
   *              the user ID, item ID, and item type are available. It queries the
   *              'saved_items' table in Supabase.
   */
  useEffect(() => {
    if (!userId || !itemId || !itemType) {
      setIsBookmarked(false);
      if (userId && !itemId) setIsLoading(false);
      return;
    }

    /**
     * @function checkIfBookmarked
     * @description Queries Supabase to determine if the current item is bookmarked by the user.
     *              Updates `isBookmarked` state based on the query result.
     * @async
     */
    const checkIfBookmarked = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let query = clientDB
          .from('saved_items')
          .select('id')
          .eq('user_id', userId);

        if (itemType === 'hack') {
          query = query.eq('hack_id', itemId);
        } else if (itemType === 'deal') {
          query = query.eq('deal_id', itemId);
        } else if (itemType === 'event') {
          query = query.eq('event_id', itemId);
        } else {
          console.error('Bookmark check: Invalid item type derived.');
          setIsLoading(false);
          return;
        }

        const { data, error: fetchError } = await query.maybeSingle();

        if (fetchError) {
          throw fetchError;
        }
        setIsBookmarked(!!data);
      } catch (err) {
        console.error('Error checking bookmark status:', err);
        setError('Could not check bookmark status.');
      } finally {
        setIsLoading(false);
      }
    };

    checkIfBookmarked();
  }, [userId, itemId, itemType]);

  /**
   * @function handleBookmarkClick
   * @description Toggles the bookmark status of the item. If the item is bookmarked,
   *              it unbookmarks it (deletes from 'saved_items'). If not bookmarked,
   *              it bookmarks it (inserts into 'saved_items'). Handles loading states
   *              and errors during the Supabase operations.
   * @async
   * @param {Event} e - The click event object.
   */
  const handleBookmarkClick = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents event bubbling, useful if button is inside other clickable elements.
    if (!userId) {
      setError("You must be logged in to bookmark items.");
      return;
    }
    if (!itemId || !itemType) {
      setError("Cannot bookmark item: ID or type is missing.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isBookmarked) {
        // If already bookmarked, delete the entry from 'saved_items'.
        let deleteQuery = clientDB
          .from('saved_items')
          .delete()
          .eq('user_id', userId);

        if (itemType === 'hack') {
          deleteQuery = deleteQuery.eq('hack_id', itemId);
        } else if (itemType === 'deal') {
          deleteQuery = deleteQuery.eq('deal_id', itemId);
        } else if (itemType === 'event') {
          deleteQuery = deleteQuery.eq('event_id', itemId);
        } else {
           console.error('Delete bookmark: Invalid item type.');
           setError('Failed to update bookmark due to invalid item type.');
           setIsLoading(false);
           return;
        }
        
        const { error: deleteError } = await deleteQuery;

        if (deleteError) {
          throw deleteError;
        }
        setIsBookmarked(false);
      } else {
        // If not bookmarked, insert a new entry into 'saved_items'.
        const itemToInsert = {
          user_id: userId,
          created_at: new Date().toISOString(), // Record the time of bookmarking.
        };

        if (itemType === 'hack') {
          itemToInsert.hack_id = itemId;
        } else if (itemType === 'deal') {
          itemToInsert.deal_id = itemId;
        } else if (itemType === 'event') {
          itemToInsert.event_id = itemId;
        } else {
          console.error('Add bookmark: Invalid item type.');
          setError('Failed to update bookmark due to invalid item type.');
          setIsLoading(false);
          return;
        }

        const { error: insertError } = await clientDB
          .from('saved_items')
          .insert([itemToInsert]);

        if (insertError) {
          throw insertError;
        }
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error(`Error updating bookmark for item ${itemId}. Raw error:`, JSON.stringify(err, null, 2));
      let displayErrorMessage = 'Failed to update bookmark.';
      if (err && typeof err === 'object') {
        if (err.message) {
          displayErrorMessage += ` Message: ${err.message}`;
        }
        if (err.details) {
          displayErrorMessage += ` Details: ${err.details}`;
        }
        if (err.hint) {
          displayErrorMessage += ` Hint: ${err.hint}`;
        }
        if (err.code) {
          displayErrorMessage += ` Code: ${err.code}`;
        }
      } else if (typeof err === 'string') {
        displayErrorMessage = err;
      }
      setError(displayErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Disable the button if loading, or if there's no valid item ID.
  const isDisabled = isLoading || !itemId;

  return (
    // Bookmark button element
    <button
      onClick={handleBookmarkClick}
      disabled={isDisabled}
      aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
      className="p-1 rounded-lg bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] hover:bg-[#EADDCA] shadow-md ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {/* Conditionally render solid or outline icon based on bookmark status */}
      {isBookmarked ? (
        <BookmarkSolidIcon className="h-6 w-6" />
      ) : (
        <BookmarkOutlineIcon className="h-6 w-6" />
      )}
    </button>
  );
};

BookmarkButton.propTypes = {
  /** The ID of the hack item, if applicable. */
  hackId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** The ID of the deal item, if applicable. */
  dealId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** The ID of the event item, if applicable. */
  eventId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default BookmarkButton;
