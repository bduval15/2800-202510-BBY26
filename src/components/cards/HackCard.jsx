import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import BaseCard from './BaseCard';
import BookmarkButton from '../buttons/Bookmark';
import VoteButtons from '../buttons/VoteButtons';
import CommentDisplay from '../buttons/CommentCount';
import Tag from '../Tag';

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

const HackCard = ({ id, href, title, upvotes, downvotes, comments = 0, tags = [], className = '' }) => {
  return (
    <Link href={href || `/hacks-page/${id}`} passHref>
      <BaseCard className={`flex-col items-start bg-[#F5E3C6] border border-[#D1905A] ${className} cursor-pointer`}>
        {/* Title */}
        <div className="w-full mb-2">
          <h3 className="text-lg font-semibold text-[#8B4C24] hover:underline">{title}</h3>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="w-full mb-2 flex flex-wrap">
            {tags.slice(0, 3).map((tag, index) => (
              <Tag key={index} label={tag} />
            ))}
          </div>
        )}

        {/* Interactions */}
        <div className="flex items-center space-x-2 text-xs w-full justify-start mt-2">
          {/* Upvotes / Downvotes Group */}
          <VoteButtons hackId={id} upvotes={upvotes} downvotes={downvotes} />

          {/* Comments Group - uses default 0 if comments not provided */}
          <CommentDisplay count={comments} />

          {/* Bookmark Button */}
          <BookmarkButton />
        </div>
      </BaseCard>
    </Link>
  );
};

HackCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  href: PropTypes.string,
  title: PropTypes.string.isRequired,
  upvotes: PropTypes.number.isRequired,
  downvotes: PropTypes.number.isRequired,
  comments: PropTypes.number,
  tags: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
};

export default HackCard;
