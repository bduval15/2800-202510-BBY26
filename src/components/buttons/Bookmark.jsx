'use client'

import React, { useState, useEffect } from 'react';
import { BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { clientDB } from '@/supabaseClient';

/**
 * Bookmark.jsx
 * Loaf Life - Bookmark Button
 * 
 * This component is used to add or remove a bookmark for a hack or deal.
 * It interacts with the 'saved_items' table in Supabase.
 * Now uses specific hack_id or deal_id based on props.
 * 
 * @author: Nathan O
 * 
 * Written with assistance from Google Gemini 2.5 Flash & Google Gemini 2.5 Pro
 * @author https://gemini.google.com/app
 */

const BookmarkButton = ({ hackId, dealId }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  // Derive itemId and itemType from new props
  const itemId = hackId || dealId;
  const itemType = hackId ? 'hack' : (dealId ? 'deal' : null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoading(true); // Set loading true at the start of user fetch
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
        //isLoading false will be handled by the bookmark check effect or if no itemid
        if (!itemId) setIsLoading(false); 
      }
    };
    fetchCurrentUser();
  }, []); // Runs once to get user

  useEffect(() => {
    if (!userId || !itemId || !itemType) {
      setIsBookmarked(false);
      // If user is loaded but no item, ensure loading is false
      if (userId && !itemId) setIsLoading(false);
      return;
    }

    const checkIfBookmarked = async () => {
      setIsLoading(true); // Ensure loading is true before the check
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
        } else {
          // Should not happen if itemId and itemType are derived correctly
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

  const handleBookmarkClick = async () => {
    if (!userId) {
      setError("You must be logged in to bookmark items.");
      return;
    }
    if (!itemId || !itemType) { // Should be caught by button disabled state
      setError("Cannot bookmark item: ID or type is missing.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isBookmarked) {
        // Remove bookmark
        let deleteQuery = clientDB
          .from('saved_items')
          .delete()
          .eq('user_id', userId);

        if (itemType === 'hack') {
          deleteQuery = deleteQuery.eq('hack_id', itemId);
        } else if (itemType === 'deal') {
          deleteQuery = deleteQuery.eq('deal_id', itemId);
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
        // Add bookmark
        const itemToInsert = {
          user_id: userId,
          created_at: new Date().toISOString(),
        };

        if (itemType === 'hack') {
          itemToInsert.hack_id = itemId;
        } else if (itemType === 'deal') {
          itemToInsert.deal_id = itemId;
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

  // Disable if loading or if no valid item id is derived (neither hackId nor dealId provided)
  const isDisabled = isLoading || !itemId;

  return (
    <button
      onClick={handleBookmarkClick}
      disabled={isDisabled} 
      aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
      className="p-1 rounded-lg bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] hover:bg-[#EADDCA] shadow-md ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isBookmarked ? (
        <BookmarkSolidIcon className="h-6 w-6" />
      ) : (
        <BookmarkOutlineIcon className="h-6 w-6" />
      )}
    </button>
  );
};

import PropTypes from 'prop-types';

BookmarkButton.propTypes = {
  hackId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dealId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // It's implied that one of these should be provided by the calling component.
  // A runtime check could be added inside the component if strict enforcement is needed:
  // if (!hackId && !dealId && process.env.NODE_ENV === 'development') {
  //   console.warn('BookmarkButton: hackId or dealId prop is required.');
  // }
};

export default BookmarkButton;
