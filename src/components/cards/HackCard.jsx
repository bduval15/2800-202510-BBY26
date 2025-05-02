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
