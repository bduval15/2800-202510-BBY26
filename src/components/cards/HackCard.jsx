import React from 'react';
import PropTypes from 'prop-types';
import BaseCard from './BaseCard'; 
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';



const HackCard = ({ title, upvotes, downvotes, comments, className = '' }) => {

  return (
    <BaseCard className={`flex-col items-start bg-[#F5E3C6] border border-[#D1905A] ${className}`}> 
      {/* Top section: Title Only */}
      <div className="w-full mb-2"> 
        <h3 className="text-lg font-semibold text-[#8B4C24]">{title}</h3> 
      </div>

      {/* Bottom section: Interactions */}
      <div className="flex items-center space-x-4 text-[#8B4C24] text-sm w-full justify-start"> 
        {/*Upvotes / Downvotes*/}
        <div className="flex items-center space-x-1">
          <button 
            aria-label="Upvote" 
            className="p-1 rounded hover:bg-[#e0d5b8] hover:text-[#639751]"
          >
            <ArrowUpIcon className="h-5 w-5" />
          </button>
          <span className="font-medium">{upvotes}</span> 
          <button 
            aria-label="Downvote" 
            className="p-1 rounded hover:bg-[#e0d5b8] hover:text-[#639751]"
          >
            <ArrowDownIcon className="h-5 w-5" />
          </button>
          <span className="font-medium">{downvotes}</span>
        </div>
        {/* Comments */}
        <div className="flex items-center space-x-2">
          <button
            aria-label="View Comments"
            className="px-2 py-1 rounded hover:bg-[#e0d5b8] hover:text-[#639751]"
          >
            Comments
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
