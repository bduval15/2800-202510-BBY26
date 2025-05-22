/**
 * File: BaseCard.jsx
 *
 * Loaf Life
 *   A reusable base card component. It provides a consistent visual foundation for displaying
 *   content in cards, including common styling like rounded corners, padding, and a shadow.
 *   Uses flex layout for content alignment.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author https://gemini.google.com/app
 *
 * Main Component:
 *   @function BaseCard
 *   @description This component serves as a foundational UI element for card-based content.
 *                It applies common styling (rounded corners, padding, shadow) and uses
 *                a flex layout to align its children. It accepts children and an optional
 *                className for further customization.
 *   @param {object} props - The component's props.
 *   @param {React.ReactNode} props.children - Content to render inside the card. (Required)
 *   @param {string} [props.className=''] - Optional CSS classes for custom styling.
 *   @returns {JSX.Element} A styled div element wrapping the children.
 *
 * Helper Functions / Hooks / Logic Blocks:
 *   N/A
 *
 * State Variables (Within Components):
 *   N/A
 *
 * useEffect Hooks (Within Components):
 *   N/A
 *
 * Constants and Static Data:
 *   N/A
 *
 * JSX Structure:
 *   The component renders a single div element.
 *   - This div acts as the card container.
 *   - It applies Tailwind CSS classes for background, rounded corners, shadow, padding, margin,
 *     and flexbox alignment (items-center).
 *   - Any additional classes passed via the `className` prop are appended.
 *   - The `children` prop is rendered directly within this div.
 *
 * General Notes:
 *  - This component is designed for reusability across different card types.
 *  - Styling is primarily managed through Tailwind CSS.
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
