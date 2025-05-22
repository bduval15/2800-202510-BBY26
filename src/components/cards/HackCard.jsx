/**
 * File: HackCard.jsx
 *
 * Loaf Life
 *   Displays a single hack card, showcasing its title and creation timestamp.
 *   Integrates interactive elements like voting, bookmarking, and comment counts.
 *   Utilizes Next.js for routing, React for UI, and `BaseCard` for consistent styling.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author https://gemini.google.com/app
 *
 * Main Component:
 *   @function HackCard
 *   @description Renders an individual card for a hack. It primarily displays the hack's title
 *                and when it was created. The card links to a detailed page for the specific
 *                hack. It includes `VoteButtons`, `CommentCount`, and `BookmarkButton` for
 *                user interactions. `BaseCard` provides the foundational visual structure.
 *   @param {object} props - The component's props.
 *   @param {string|number} props.id - Unique ID of the hack. (Required)
 *   @param {string} [props.href] - Optional custom link for the card.
 *   @param {string} props.title - Title of the hack. (Required)
 *   @param {number} props.upvotes - Number of upvotes for the hack. (Required)
 *   @param {number} props.downvotes - Number of downvotes for the hack. (Required)
 *   @param {string[]} [props.tags=[]] - Array of tags associated with the hack.
 *   @param {string} [props.className=''] - Optional additional CSS classes for the `BaseCard`.
 *   @param {string} [props.createdAt] - ISO string timestamp of when the hack was created.
 *   @param {string|number} [props.userId] - ID of the current user (for voting/bookmarking).
 *   @returns {JSX.Element} A Next.js Link component wrapping a `BaseCard` displaying hack info.
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


const HackCard = ({ id, href, title, upvotes, downvotes, tags = [], className = '', createdAt, userId }) => {
  return (
    <Link href={href || `/hacks-page/${id}`} passHref>
      <BaseCard className={`flex-col items-start bg-[#F5E3C6] border border-[#D1905A] ${className}`}>
        {/* Title wrapped in Link */}
        <div className="w-full mb-2 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#8B4C24] hover:underline cursor-pointer mr-2">{toTitleCase(title)}</h3>
          {createdAt && (
            <span className="text-xs text-gray-500 whitespace-nowrap">{formatTimeAgo(createdAt)}</span>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="w-full mb-2 flex flex-wrap">
            {[<Tag key="hack-type-tag" label="Hack" />, ...tags.slice(0, 2)].map((tagComponent, index) =>
              tagComponent.key === "hack-type-tag" ? tagComponent : <Tag key={index} label={toTitleCase(tagComponent)} />
            )}
          </div>
        )}

        {/* Interactions */}
        <div className="flex items-center space-x-2 text-xs w-full justify-start mt-2">
          {/* Upvotes / Downvotes Group */}
          <VoteButtons
            itemId={id}
            itemType="hacks"
            upvotes={upvotes}
            downvotes={downvotes}
            userId={userId}
          />

          {/* Comments Group - uses default 0 if comments not provided */}
          <CommentCount
            entityId={id}
            entityType="hack"
          />

          {/* Bookmark Button */}
          <BookmarkButton hackId={id} />
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
  tags: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  createdAt: PropTypes.string,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default HackCard;
