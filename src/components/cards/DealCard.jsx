/**
 * File: DealCard.jsx
 *
 * Loaf Life
 *   Displays a single deal card with its details, including title, location, price, and creation
 *   timestamp. Integrates interactive elements like voting and comment counts. Utilizes Next.js
 *   for routing and React for UI components. It uses `BaseCard` for consistent styling.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author https://gemini.google.com/app
 *
 * Main Component:
 *   @function DealCard
 *   @description Renders an individual card for a deal. It showcases the deal's title,
 *                location, price, and when it was created. Users can click the card to
 *                navigate to a more detailed page. It includes `VoteButtons`,
 *                `CommentCount`, and `BookmarkButton` for user interactions.
 *                The `BaseCard` component provides the foundational visual structure.
 *   @param {object} props - The component's props.
 *   @param {string|number} props.id - Unique ID of the deal. (Required)
 *   @param {string} props.title - Title of the deal. (Required)
 *   @param {string} [props.location] - Location of the deal.
 *   @param {string|number} [props.price] - Price of the deal.
 *   @param {string[]} [props.tags] - Array of tags associated with the deal.
 *   @param {string} [props.expirationDate] - Expiration date of the deal (currently not used for display).
 *   @param {number} [props.upvotes=0] - Number of upvotes for the deal.
 *   @param {number} [props.downvotes=0] - Number of downvotes for the deal.
 *   @param {string} [props.createdAt] - ISO string timestamp of when the deal was created.
 *   @param {string|number} [props.userId] - ID of the current user (for voting/bookmarking).
 *   @returns {JSX.Element} A Next.js Link component wrapping a `BaseCard` that displays deal info.
 */
 

'use client';

import React from 'react';
import BaseCard from './BaseCard';
import Link from 'next/link';
import Tag from '../Tag';
import BookmarkButton from '../buttons/Bookmark';
import VoteButtons from '../buttons/VoteButtons';
import CommentCount from '../buttons/CommentCount';
import PropTypes from 'prop-types';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import toTitleCase from '../../utils/toTitleCase';


const DealCard = ({ id, title, location, price, tags, expirationDate, upvotes = 0, downvotes = 0, createdAt, userId }) => {

  return (
    <Link href={`/deals-page/${id}`} passHref>
      <BaseCard className="flex-col items-start bg-[#F5E3C6] border border-[#D1905A] mb-4">
        {/* Title */}
        <div className="w-full mb-2 flex justify-between items-center">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-[#8B4C24] hover:underline cursor-pointer mr-2">{toTitleCase(title)}</h3>
          </div>
          {createdAt && (
            <span className="text-xs text-gray-500 whitespace-nowrap">{formatTimeAgo(createdAt)}</span>
          )}
        </div>

        {/* Location */}
        {location && (
          <p className="text-sm text-[#8B4C24]/80 mb-1">
            <span className="font-medium text-[#6A4C3C]">📍</span> {location}
          </p>
        )}

        {/* Price */}
        {price !== null && price !== undefined && (
          <p className={`text-sm text-gray-700 ${expirationDate ? 'mb-1' : 'mb-2'}`}>
            <span className="font-medium text-[#6A4C3C]">💲</span> {typeof price === 'number' ? price.toFixed(2) : price}
          </p>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="w-full mb-2 flex flex-wrap">
            {[<Tag key="deal-type-tag" label="Deal" />, ...tags.slice(0, 2)].map((tagComponent, index) =>
              tagComponent.key === "deal-type-tag" ? tagComponent : <Tag key={index} label={toTitleCase(tagComponent)} />
            )}
          </div>
        )}

        {/* Interactions */}
        <div className="flex items-center space-x-2 text-xs w-full justify-start mt-2">
          <VoteButtons
            itemId={id}
            itemType="deals"
            upvotes={upvotes}
            downvotes={downvotes}
            userId={userId}
          />
          <CommentCount
            entityId={id}
            entityType="deal"
          />
          <BookmarkButton dealId={id} />
        </div>
      </BaseCard>
    </Link>
  );
};

DealCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  location: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tags: PropTypes.arrayOf(PropTypes.string),
  expirationDate: PropTypes.string,
  upvotes: PropTypes.number,
  downvotes: PropTypes.number,
  createdAt: PropTypes.string,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default DealCard; 