import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import BaseCard from './BaseCard';
import BookmarkButton from '../buttons/Bookmark';
import VoteButtons from '../buttons/VoteButtons';
import CommentDisplay from '../buttons/CommentDisplay';

/**
 * HackCard.jsx
 * Loaf Life - Hack Card
 * 
 * This component displays a hack card.
 * 
 * @author: Nathan O
 * 
 * Written with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */

const HackCard = ({ id, title, upvotes, downvotes, comments, className = '' }) => {
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
        <VoteButtons upvotes={upvotes} downvotes={downvotes} />

        {/* Comments Group */}
        <CommentDisplay count={comments} />

        {/* Bookmark Button */}
        <BookmarkButton />
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
