import React from 'react';
import PropTypes from 'prop-types';
import BaseCard from './BaseCard'; 
import { ArrowUpIcon, ArrowDownIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';


const HackCard = ({ title, upvotes, downvotes, comments, className = '' }) => {

  return (
    <BaseCard className={`flex-col items-start bg-[#F5E3C6] border border-[#D1905A] ${className}`}> 
      {/* Top section: Title Only */}
      <div className="w-full mb-2"> 
        <h3 className="text-lg font-semibold text-[#8B4C24]">{title}</h3> 
      </div>

      {/* Bottom section: Interactions */}
      <div className="flex items-center space-x-2 text-xs w-full justify-start mt-2"> 
        {/* Upvotes / Downvotes Group */} 
        <div className="flex items-center space-x-1.5 bg-[#d1905a] text-[#F5E3C6] px-2 py-1 rounded-full"> 
          <button 
            aria-label="Upvote" 
            className="p-0.5 rounded bg-[#d1905a] hover:text-[#FFE2B6]"
          >
            <ArrowUpIcon className="h-4 w-4" />
          </button>
          <span className="font-medium min-w-[1ch] text-center">{upvotes - downvotes}</span> 
          <button 
            aria-label="Downvote" 
            className="p-0.5 rounded bg-[#d1905a] hover:text-[#FFE2B6]"
          >
            <ArrowDownIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Comments Group */} 
        <div className="flex items-center space-x-1 bg-[#d1905a] text-[#F5E3C6] px-2 py-1 rounded-full">
          <button
            aria-label="View Comments"
            className="p-0.5 rounded bg-[#d1905a] hover:text-[#FFE2B6]"
          >
            <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4" />
          </button>
          <span className="font-medium">{comments}</span>
        </div>
      </div>
    </BaseCard>
  );
};

HackCard.propTypes = {
  title: PropTypes.string.isRequired,
  upvotes: PropTypes.number.isRequired,
  downvotes: PropTypes.number.isRequired, 
  comments: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default HackCard;
