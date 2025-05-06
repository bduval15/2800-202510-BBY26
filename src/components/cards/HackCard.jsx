import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import BaseCard from './BaseCard';
import { ArrowUpIcon, ArrowDownIcon, ChatBubbleOvalLeftEllipsisIcon, BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

/**
 * HackCard.jsx
 * Loaf Life - Hack Card
 * 
 * This component displays a hack card.
 * 
 * @author: Nathan O
 * 
 */

const HackCard = ({ id, title, upvotes, downvotes, comments, className = '' }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Construct the detail page URL
  const detailPageUrl = `/hacks-page/${id}`; 

  return (
    <BaseCard className={`flex-col items-start bg-[#F5E3C6] border border-[#D1905A] ${className}`}>
      {/* Title wrapped in Link */}
      <div className="w-full mb-2">
        <Link href={detailPageUrl} passHref>
          <h3 className="text-lg font-semibold text-[#8B4C24] hover:underline cursor-pointer">{title}</h3>
        </Link>
      </div>

      {/* Interactions */}
      <div className="flex items-center space-x-2 text-xs w-full justify-start mt-2">
        {/* Upvotes / Downvotes Group */}
        <div className="flex items-center space-x-1.5 bg-[#d1905a] text-[#FFE2B6] px-2 py-1 rounded-full">
          <button
            aria-label="Upvote"
            className="p-0.5 rounded bg-[#d1905a]"
          >
            <ArrowUpIcon className="h-5 w-5" />
          </button>
          <span className="font-medium min-w-[1ch] text-center text-base">{upvotes - downvotes}</span>
          <button
            aria-label="Downvote"
            className="p-0.5 rounded bg-[#d1905a]"
          >
            <ArrowDownIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Comments Group */}
        <div className="flex items-center space-x-1 bg-[#d1905a] text-[#FFE2B6] px-2 py-1 rounded-full">
          <button
            aria-label="View Comments"
            className="p-0.5 rounded bg-[#d1905a]"
          >
            <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
          </button>
          <span className="font-medium text-base">{comments}</span>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmarkClick}
          aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
          className="p-1.5 rounded-full bg-[#d1905a] text-[#FFE2B6] ml-auto" // Use ml-auto to push to the right
        >
          {isBookmarked ? (
            <BookmarkSolidIcon className="h-5 w-5" />
          ) : (
            <BookmarkOutlineIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </BaseCard>
  );
};

HackCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  upvotes: PropTypes.number.isRequired,
  downvotes: PropTypes.number.isRequired,
  comments: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default HackCard;
