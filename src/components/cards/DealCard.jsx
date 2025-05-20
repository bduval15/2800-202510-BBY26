'use client'

import React from 'react';
import BaseCard from './BaseCard';
import Link from 'next/link';
import Tag from '../Tag';
import BookmarkButton from '../buttons/Bookmark';
import VoteButtons from '../buttons/VoteButtons';
import PropTypes from 'prop-types';
import { formatTimeAgo } from '../../utils/formatTimeAgo';

/**
 * DealCard.jsx
 * Loaf Life - Deal Card Component
 *
 * Displays a single deal with its details.
 *
 * Modified with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 * @author Nate O
 */
const DealCard = ({ id, title, location, price, tags, expirationDate, upvotes = 0, downvotes = 0, createdAt, userId }) => {
  const titleCase = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

  return (
    <Link href={`/deals-page/${id}`} passHref>
      <BaseCard className="flex-col items-start bg-[#F5E3C6] border border-[#D1905A] mb-4">
        {/* Title */}
        <div className="w-full mb-2 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#8B4C24] hover:underline cursor-pointer mr-2">{title}</h3>
          {createdAt && (
            <span className="text-xs text-gray-500 whitespace-nowrap">{formatTimeAgo(createdAt)}</span>
          )}
        </div>

        {/* Location */}
        {location && (
          <p className="text-sm text-gray-700 mb-1">
            <span className="font-medium text-[#6A4C3C]">Location:</span> {location}
          </p>
        )}

        {/* Price */}
        {price !== null && price !== undefined && (
          <p className={`text-sm text-gray-700 ${expirationDate ? 'mb-1' : 'mb-2'}`}>
            <span className="font-medium text-[#6A4C3C]">Price:</span> ${typeof price === 'number' ? price.toFixed(2) : price}
          </p>
        )}

        {/* Expiration Date */}
        {expirationDate && (
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-medium text-[#6A4C3C]">Expires:</span> {expirationDate}
          </p>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="w-full mb-2 flex flex-wrap">
            {tags.slice(0, 3).map((tag, index) => (
              <Tag key={index} label={titleCase(tag)} />
            ))}
          </div>
        )}

        {/* Interactions Row */}
        <div className="flex items-center space-x-2 text-xs w-full justify-start mt-2">
          <VoteButtons 
            itemId={id} 
            itemType="deals" 
            upvotes={upvotes} 
            downvotes={downvotes} 
            userId={userId}
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