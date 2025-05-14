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
 * 
 * @author: Nathan O
 * 
 * Written with assistance from Google Gemini 2.5 Flash & Google Gemini 2.5 Pro
 * @author https://gemini.google.com/app
 */

const BookmarkButton = ({ itemId, itemType }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

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
        setIsLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!userId || !itemId || !itemType) {
      setIsBookmarked(false);
      return;
    }

    const checkIfBookmarked = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await clientDB
          .from('saved_items')
          .select('id')
          .eq('user_id', userId)
          .eq('item_id', itemId)
          .eq('item_type', itemType)
          .maybeSingle();

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
    if (!itemId || !itemType) {
      setError("Cannot bookmark item: ID or type is missing.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isBookmarked) {
        // Remove bookmark
        const { error: deleteError } = await clientDB
          .from('saved_items')
          .delete()
          .eq('user_id', userId)
          .eq('item_id', itemId)
          .eq('item_type', itemType);

        if (deleteError) {
          throw deleteError;
        }
        setIsBookmarked(false);
      } else {
        // Add bookmark
        const { error: insertError } = await clientDB
          .from('saved_items')
          .insert([{ user_id: userId, item_id: itemId, item_type: itemType, created_at: new Date().toISOString() }]);

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


  return (
    <button
      onClick={handleBookmarkClick}
      disabled={isLoading || !itemId || !itemType}
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
  itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  itemType: PropTypes.string.isRequired,
};

export default BookmarkButton;
