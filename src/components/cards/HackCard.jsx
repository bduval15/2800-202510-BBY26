import React from 'react';
import PropTypes from 'prop-types';
import BaseCard from './BaseCard'; 



const HackCard = ({ title, upvotes, downvotes, comments, className = '' }) => {

  return (
    <BaseCard className={`flex-col items-start ${className}`}> 
      {/* Top section: Title Only */}
      <div className="w-full mb-2"> 
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3> 
      </div>

      {/* Bottom section: Interactions */}
      <div className="flex items-center space-x-4 text-gray-600 text-sm w-full justify-start"> 
        {/*Upvotes / Downvotes*/}
        <div className="flex items-center space-x-2"> 
          <button 
            aria-label="Upvote" 
            className="px-2 py-1 rounded hover:bg-gray-200 hover:text-orange-500"
          >
            Upvote
          </button>
          <span className="font-medium">{upvotes}</span> 
          <button 
            aria-label="Downvote" 
            className="px-2 py-1 rounded hover:bg-gray-200 hover:text-blue-500"
          >
            Downvote
          </button>
          <span className="font-medium">{downvotes}</span>
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
