'use client'

import React from 'react';
import BaseCard from './BaseCard';
import Link from 'next/link';
import Tag from '../Tag';
import BookmarkButton from '../buttons/Bookmark';

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
const DealCard = ({ id, title, location, price, tags, expirationDate }) => {
  return (
    <Link href={`/deals-page/${id}`} passHref>
      <BaseCard className="flex-col items-start bg-[#F5E3C6] border border-[#D1905A] mb-4">
        <div className="w-full">
          <div className="w-full mb-2">
            <h3 className="text-lg font-semibold text-[#8B4C24] hover:underline cursor-pointer">{title}</h3>
          </div>
          {location && (
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-medium text-[#6A4C3C]">Location:</span> {location}
            </p>
          )}
          {price !== null && price !== undefined && (
            <p className={`text-sm text-gray-700 ${expirationDate ? 'mb-1' : 'mb-2'}`}>
              <span className="font-medium text-[#6A4C3C]">Price:</span> ${typeof price === 'number' ? price.toFixed(2) : price}
            </p>
          )}
          {expirationDate && (
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium text-[#6A4C3C]">Expires:</span> {expirationDate}
            </p>
          )}
          <div className="flex justify-between items-end w-full mt-2 mb-2">
            {tags && tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 3).map((tag, index) => (
                  <Tag key={index} label={tag} />
                ))}
              </div>
            ) : (
              <div />
            )}
            <div className="shrink-0">
              <BookmarkButton dealId={id} />
            </div>
          </div>
        </div>
      </BaseCard>
    </Link>
  );
};

export default DealCard; 