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
const toTitleCase = (str) => {
  if (!str) return '';
  const minorWords = new Set([
    "a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "from", "by", "of", "in", "into", "near", "over", "past", "through", "up", "upon", "with", "without"
  ]);
  const words = String(str).toLowerCase().split(' ');
  return words.map((word, index) => {
    if (index === 0 || index === words.length - 1 || !minorWords.has(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
  }).join(' ');
};

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
  createdAt,
  startDate,
  endDate
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

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString + 'T00:00:00'); // Ensure date is interpreted as local
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  let displayDate = null;
  if (formattedStartDate) {
    if (formattedEndDate && formattedStartDate !== formattedEndDate) {
      displayDate = `📅 ${formattedStartDate} - ${formattedEndDate}`;
    } else {
      displayDate = `📅 ${formattedStartDate}`;
    }
  }

  const handleButtonClick = (e) => {
    e.stopPropagation();
  };

  return (
    <Link href={href || `/events-page/${id}`} passHref>
      <BaseCard className={`flex-col items-start bg-[#F5E3C6] border border-[#D1905A] hover:shadow-lg transition-shadow duration-200 ease-in-out cursor-pointer ${className}`}>
        <div className="w-full mb-2 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#8B4C24] group-hover:underline mr-2">
            {toTitleCase(title)}
          </h3>
          {createdAt && (
              <span className="text-xs text-gray-500 whitespace-nowrap">{formatTimeAgo(createdAt)}</span>
          )}
        </div>

        {/* Location & Price */}
        <div className="w-full mb-2 text-sm text-[#8B4C24]/80">
          {parsedLocation.address && <span>📍 {parsedLocation.address}</span>}
          {price != null && (
            <span className="ml-2">💵 {typeof price === 'number' ? price.toFixed(2) : price}</span>
          )}
        </div>

        {/* Event Dates */}
        {displayDate && (
          <div className="w-full mb-2 text-sm text-[#8B4C24]/80">
            <span>{displayDate}</span>
          </div>
        )}

         {/* Tags */}
         {tags && tags.length > 0 && (
          <div className="w-full mb-2 flex flex-wrap">
            {[<Tag key="event-type-tag" label="Event" />, ...tags.slice(0, 2)].map((tagComponent, index) => 
              tagComponent.key === "event-type-tag" ? tagComponent : <Tag key={index} label={toTitleCase(tagComponent)} />
            )}
          </div>
        )}

        {/* Interactions */}
        <div className="flex items-center space-x-2 text-xs w-full mt-2">
          <div onClick={handleButtonClick}>
            <VoteButtons
                itemId={id}
                itemType="events"
                upvotes={upvotes}
                downvotes={downvotes}
                userId={userId}
            />
          </div>
          <CommentCount
              entityId={id}
              entityType="event"
          />
          <div onClick={handleButtonClick} className="ml-auto">
            <BookmarkButton eventId={id} userId={userId} />
          </div>
        </div>
      </BaseCard>
    </Link>
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
  createdAt: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

export default EventCard;