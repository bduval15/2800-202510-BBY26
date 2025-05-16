import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import BaseCard from './BaseCard';
import BookmarkButton from '../buttons/Bookmark';
import VoteButtons from '../buttons/VoteButtons';
import CommentDisplay from '../buttons/CommentDisplay';
import Tag from '../Tag';

/**
 * HackCard.jsx
 * Loaf Life - Hack Card
 * 
 * This component displays a hack card. 
 * 
 * @author: Nathan O
 * @author: Conner P
 * 
 * Converted from HackCard with table changes for 'events'
 * Written with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */
const titleCase = (str) =>
str.charAt(0).toUpperCase() + str.slice(1);
const EventCard = ({
  id,
  href,
  title,
  location,
  price,
  upvotes,
  downvotes,
  comments = 0,
  tags = [],
  className = ''
}) => {
  let parsedLocation = {};
  try {
    parsedLocation = JSON.parse(location);
  } catch (error) {
    console.error("Error parsing location JSON:", error);
    // Handle the error appropriately, maybe set a default or show an error message
    parsedLocation = { address: "Error: Invalid location data" };
  }

  return (
    <BaseCard className={`flex-col items-start bg-[#F5E3C6] border border-[#D1905A] ${className}`}>
      {/* Title */}
      <div className="w-full mb-1">
        <Link href={href || `/events-page/${id}`} passHref>
          <h3 className="text-lg font-semibold text-[#8B4C24] hover:underline cursor-pointer">
            {title}
          </h3>
        </Link>
      </div>

      {/* Location & Price */}
      <div className="w-full mb-2 text-sm text-[#8B4C24]/80">
        <span>📍 {parsedLocation.address}</span>
        {price != null && (
          <span className="ml-4">💵 {price.toFixed(2)}</span>
        )}
      </div>

       {/* Tags */}
       {tags && tags.length > 0 && (
        <div className="w-full mb-2 flex flex-wrap">
          {tags.slice(0, 3).map((tag, index) => (
            <Tag key={index} label={titleCase(tag)} />
          ))}
        </div>
      )}
      

      {/* Interactions */}
      <div className="flex items-center space-x-2 text-xs w-full mt-2">
        <VoteButtons eventId={id} upvotes={upvotes} downvotes={downvotes} />
        <CommentDisplay count={comments} />
        <BookmarkButton eventId={id} />
      </div>
    </BaseCard>
  );
};

EventCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  href: PropTypes.string,
  title: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  price: PropTypes.number,
  upvotes: PropTypes.number.isRequired,
  downvotes: PropTypes.number.isRequired,
  comments: PropTypes.number,
  tags: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
};

export default EventCard;