/**
 * Tag.jsx
 * Loaf Life – Displays a styled tag with an optional emoji.
 *
 * This component renders a tag with a label and an associated emoji. The emoji
 * is determined by the `getEmojiForTag` utility function based on the tag's
 * label. It is used to visually represent tags in various parts of the
 * application, such as on post cards or in tag selection interfaces.
 *
 * Features:
 * - Displays a tag label.
 * - Shows an emoji corresponding to the tag label (if available).
 * - Styled for consistent appearance across the application.
 *
 * Written with assistance from Google Gemini 2.5 Flash.
 *
 * @author Nathan Oloresisimo
 * @author https://gemini.google.com/app
 */

import React from 'react';
import PropTypes from 'prop-types';
import { getEmojiForTag } from '../utils/tagEmojis';

const Tag = ({ label }) => {
  const emoji = getEmojiForTag(label);
  return (
    <span
      className="bg-white border border-gray-300 px-2 py-0.5 rounded-full flex items-center gap-1 text-xs text-stone-700 shadow-sm"
    >
      {emoji && <span className="text-sm">{emoji}</span>}
      <span>{label}</span>
    </span>
  );
};

Tag.propTypes = {
  label: PropTypes.string.isRequired,  
};

Tag.defaultProps = {  
};

export default Tag;
