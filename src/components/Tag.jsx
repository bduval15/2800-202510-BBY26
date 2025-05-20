import React from 'react';
import PropTypes from 'prop-types';
import { getEmojiForTag } from '../utils/tagEmojis';

/**
 * Tag.jsx
 * Loaf Life - Tag Component
 * 
 * This component displays a tag.
 * 
 * @author: Nathan O
 * 
 * Written with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */

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
