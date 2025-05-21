import React from 'react';
// Import PropTypes for type-checking props - Nate
import PropTypes from 'prop-types';

/**
 * BaseCard.jsx
 * Loaf Life - Base Card
 *
 * A reusable base card component providing common styling.
 * Features rounded corners, padding, shadow, and flex layout for content alignment.
 *
 * Written with assistance from Google Gemini 2.5 Pro
 * @author: Nathan O
 * @author: https://gemini.google.com/app
 */

const BaseCard = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-4 m-3 flex items-center ${className}`}
    >
      {children}
    </div>
  );
};

BaseCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};


export default BaseCard;
