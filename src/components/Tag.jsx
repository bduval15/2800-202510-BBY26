/**
 * File: Tag.jsx
 *
 * Loaf Life
 *   Displays a styled tag with an optional emoji. This component renders a tag
 *   with a label and an associated emoji, determined by the `getEmojiForTag`
 *   utility function. It's used for visual representation of tags.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author https://gemini.google.com/app
 */

import React from 'react';
import PropTypes from 'prop-types';
import { getEmojiForTag } from '../utils/tagEmojis';

/**
 * Main Component: Tag
 *   @function Tag
 *   @description Renders a tag with a label and a corresponding emoji.
 *                The emoji is fetched based on the label.
 *   @returns {JSX.Element} A span element representing the tag.
 */
const Tag = ({ label }) => {
  // Fetches emoji for the given tag label
  const emoji = getEmojiForTag(label);
  return (
    <span
      className="bg-white border border-gray-300 px-2 py-0.5 rounded-full flex items-center gap-1 text-xs text-stone-700 shadow-sm"
    >
      {/* Display emoji if available */}
      {emoji && <span className="text-sm">{emoji}</span>}
      {/* Display tag label */}
      <span>{label}</span>
    </span>
  );
};

Tag.propTypes = {
  // The text label for the tag
  label: PropTypes.string.isRequired,
};

Tag.defaultProps = {
};

export default Tag;
