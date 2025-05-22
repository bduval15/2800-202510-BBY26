/**
 * File: EventCard.jsx
 *
 * Loaf Life
 *   Displays a single event card with details like title, location, price, dates, and creation time.
 *   It integrates voting, bookmarking, and comment counts. Originally adapted from HackCard.
 *   Uses Next.js for routing, React for UI, and `BaseCard` for styling.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author Conner Ponton
 *   @author https://gemini.google.com/app
 *
 * Main Component:
 *   @function EventCard
 *   @description Renders an individual card for an event. It shows event title, location, price,
 *                start/end dates, and creation timestamp. The card links to a detailed event page.
 *                Interactive elements include `VoteButtons`, `BookmarkButton`, and `CommentCount`.
 *                It uses `BaseCard` for its base styling and structure.
 *   @param {object} props - The component's props.
 *   @param {string|number} props.id - Unique ID of the event. (Required)
 *   @param {string} [props.href] - Optional custom link for the card.
 *   @param {string} props.title - Title of the event. (Required)
 *   @param {string|object} [props.location] - Location of the event (string or object with address).
 *   @param {number} [props.price] - Price of the event.
 *   @param {number} props.upvotes - Number of upvotes. (Required)
 *   @param {number} props.downvotes - Number of downvotes. (Required)
 *   @param {string[]} [props.tags=[]] - Array of tags associated with the event.
 *   @param {string} [props.className=''] - Optional additional CSS classes.
 *   @param {string|number} [props.userId] - ID of the current user.
 *   @param {string} [props.createdAt] - ISO string timestamp of event creation.
 *   @param {string} [props.startDate] - Start date of the event (YYYY-MM-DD).
 *   @param {string} [props.endDate] - End date of the event (YYYY-MM-DD).
 *   @returns {JSX.Element} A Next.js Link component wrapping a `BaseCard` for the event.
 *
 * Helper Functions / Hooks / Logic Blocks:
 *
 *   @function formatDate
 *   @description Formats a date string (YYYY-MM-DD) into MM/DD/YYYY format.
 *                Appends 'T00:00:00' to ensure local timezone interpretation.
 *   @param {string} dateString - The date string to format.
 *   @returns {string|null} Formatted date string or null if input is invalid.
 *
 *   @function handleButtonClick
 *   @description Prevents click event propagation to the parent `Link` component when
 *                interacting with buttons inside the card (e.g., `VoteButtons`).
 *   @param {React.MouseEvent} e - The click event object.
 */
 

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import BaseCard from './BaseCard';
import BookmarkButton from '../buttons/Bookmark';
import VoteButtons from '../buttons/VoteButtons';
import CommentCount from '../buttons/CommentCount';
import Tag from '../Tag';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import toTitleCase from '../../utils/toTitleCase';


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
  let parsedLocation = { address: '' }

  if (typeof location === 'string') {
    // 1) If it *looks* like JSON, try to parse it…
    const trimmed = location.trim()
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const obj = JSON.parse(trimmed)
        // if that object has an address field, use it, otherwise treat
        // the whole string as the address
        parsedLocation.address = obj.address ?? location
      } catch (e) {
        // malformed JSON → treat the raw string as the address
        parsedLocation.address = location
      }
    } else {
      // not JSON at all → raw string is your address
      parsedLocation.address = location
    }

  } else if (location && typeof location === 'object') {
    // already an object, just pick its address (or blank if missing)
    parsedLocation.address = location.address ?? ''
  }

  // Formats a date string to MM/DD/YYYY.
  const formatDate = (dateString) => {
    if (!dateString) return null;
    // Appending T00:00:00 ensures the date is interpreted in the local timezone,
    // rather than UTC, preventing off-by-one day errors.
    const date = new Date(dateString + 'T00:00:00');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  let displayDate = null;
  // Determine how to display the event date(s).
  if (formattedStartDate) {
    if (formattedEndDate && formattedStartDate !== formattedEndDate) {
      // If there's a different end date, display a range.
      displayDate = `📅 ${formattedStartDate} - ${formattedEndDate}`;
    } else {
      // Otherwise, display only the start date.
      displayDate = `📅 ${formattedStartDate}`;
    }
  }

  // Prevents click event from propagating to the parent Link component
  // when interacting with buttons inside the card (e.g., VoteButtons).
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