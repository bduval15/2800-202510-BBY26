'use client'

import React from 'react';
import BaseCard from './BaseCard';
import Link from 'next/link';
import Tag from '../Tag';
import BookmarkButton from '../buttons/Bookmark';
import VoteButtons from '../buttons/VoteButtons';
import CommentCount from '../buttons/CommentCount';
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
          <p className="text-sm text-gray-700 mb-1">
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
        
        {/* Interactions Row */}
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