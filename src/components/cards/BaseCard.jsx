/**
 * BaseCard.jsx
 * Loaf Life – A reusable base card component.
 *
 * This component provides a consistent visual foundation for displaying
 * content in cards. It includes common styling such as rounded corners,
 * padding, and a shadow. It uses a flex layout to align content items.
 *
 * Features:
 * - Provides reusable base styling for cards.
 * - Implements rounded corners and a shadow effect.
 * - Uses flex layout for easy content alignment.
 *
 * Written with assistance from Google Gemini 2.5 Pro.
 *
 * @author Nathan Oloresisimo
 * @author https://gemini.google.com/app
 */

import React from 'react';
import PropTypes from 'prop-types';


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
