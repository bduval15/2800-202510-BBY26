import React, { useState } from 'react';
import { BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

/**
 * Bookmark.jsx
 * Loaf Life - Bookmark Button
 * 
 * This component is used to add a bookmark to a hack or deal.
 * 
 * @author: Nathan O
 */

const BookmarkButton = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <button
      onClick={handleBookmarkClick}
      aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
      className="p-1.5 rounded-full bg-[#d1905a] text-[#FFE2B6] ml-auto" 
    >
      {isBookmarked ? (
        <BookmarkSolidIcon className="h-5 w-5" />
      ) : (
        <BookmarkOutlineIcon className="h-5 w-5" />
      )}
    </button>
  );
};

export default BookmarkButton;
