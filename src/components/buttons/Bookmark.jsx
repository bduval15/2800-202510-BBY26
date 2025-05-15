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
 * 
 * Written with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */

const BookmarkButton = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  return (
    <button
      onClick={handleBookmarkClick}
      aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
      className="p-1 rounded-lg bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] hover:bg-[#EADDCA] shadow-md ml-auto"
    >
      {isBookmarked ? (
        <BookmarkSolidIcon className="h-6 w-6" />
      ) : (
        <BookmarkOutlineIcon className="h-6 w-6" />
      )}
    </button>
  );
};

export default BookmarkButton;
