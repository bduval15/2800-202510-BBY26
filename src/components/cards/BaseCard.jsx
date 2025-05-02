import React from 'react';
// Import PropTypes for type-checking props - Nate
import PropTypes from 'prop-types';

/**
 * A reusable base card component providing common styling.
 * Features rounded corners, padding, shadow, and flex layout for content alignment.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to display inside the card.
 * @param {string} [props.className] - Optional additional CSS classes for customization.
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
