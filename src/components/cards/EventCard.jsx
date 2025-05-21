import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import BaseCard from './BaseCard';
import BookmarkButton from '../buttons/Bookmark';
import VoteButtons from '../buttons/VoteButtons';
import CommentCount from '../buttons/CommentCount';
import Tag from '../Tag';
import { formatTimeAgo } from '../../utils/formatTimeAgo';

/**
 * EventCard.jsx
 * Loaf Life - Event Card
 * 
 * This component displays an event card. 
 * 
 * @author: Nathan O
 * @author: Conner P
 * 
 * Converted from HackCard with table changes for 'events'
 * Written with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */
const titleCase = (str) =>
str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

const EventCard = ({
  id,
  href,
  title,
  location,
  price,
  upvotes,
  downvotes,
  tags = [],
  className = '',
  userId,
  createdAt
}) => {
  let parsedLocation = {};
  try {
    if (typeof location === 'string') {
      parsedLocation = JSON.parse(location);
    } else if (location && typeof location === 'object') {
      parsedLocation = location;
    }
  } catch (error) {
    console.error("Error parsing location JSON:", error);
    parsedLocation = { address: "Invalid location" };
  }

  return (
    <BaseCard className={`flex-col items-start bg-[#F5E3C6] border border-[#D1905A] ${className}`}>
      <div className="w-full mb-2 flex justify-between items-center">
        <Link href={href || `/events-page/${id}`} passHref>
          <h3 className="text-lg font-semibold text-[#8B4C24] hover:underline cursor-pointer mr-2">
            {titleCase(title)}
          </h3>
        </Link>
        {createdAt && (
            <span className="text-xs text-gray-500 whitespace-nowrap">{formatTimeAgo(createdAt)}</span>
        )}
      </div>

      {/* Location & Price */}
      <div className="w-full mb-2 text-sm text-[#8B4C24]/80">
        {parsedLocation.address && <span>📍 {parsedLocation.address}</span>}
        {price != null && (
          <span className="ml-4">💵 {typeof price === 'number' ? price.toFixed(2) : price}</span>
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
        <VoteButtons 
            itemId={id}
            itemType="events" 
            upvotes={upvotes} 
            downvotes={downvotes} 
            userId={userId} 
        />
        <CommentCount 
            entityId={id} 
            entityType="event" 
        />
        <BookmarkButton eventId={id} userId={userId} />
      </div>
    </BaseCard>
  );
};

EventCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  href: PropTypes.string,
  title: PropTypes.string.isRequired,
  location: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  price: PropTypes.number,
  upvotes: PropTypes.number.isRequired,
  downvotes: PropTypes.number.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  createdAt: PropTypes.string
};

export default EventCard;