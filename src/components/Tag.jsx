import React from 'react';
import PropTypes from 'prop-types';

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
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.25em 0.4em',
      fontSize: '75%',
      fontWeight: '700',
      lineHeight: '1',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      verticalAlign: 'baseline',
      borderRadius: '0.25rem',
      backgroundColor: '#8B4C24', 
      color: '#F5E3C6', 
      marginRight: '0.5rem', 
      marginBottom: '0.25rem', 
    }}>
      {label}
    </span>
  );
};

Tag.propTypes = {
  label: PropTypes.string.isRequired,
};

export default Tag;
