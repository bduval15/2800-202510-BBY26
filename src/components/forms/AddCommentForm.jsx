'use client';

import React, { useState } from 'react';

/**
 * AddCommentForm.jsx
 * Loaf Life - Add Comment Form
 *
 * This component allows users to add a comment to a hack.
 *
 * @author: Nathan O
 *
 * Modified with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */

export default function AddCommentForm() {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle comment submission logic here
    console.log('Comment submitted:', commentText);
    setCommentText(''); // Clear textarea after submission
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add a comment..."
        className="w-full p-2 border border-[#8B4C24]/30 rounded-lg focus:ring-[#A0522D] focus:border-[#A0522D] text-[#8B4C24] bg-[#F5EFE6]"
        rows="2"
      ></textarea>
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          className="px-3 py-1.5 bg-[#639751] text-white rounded-lg hover:bg-[#538741] focus:outline-none focus:ring-2 focus:ring-[#639751] focus:ring-opacity-50"
        >
          Post Comment
        </button>
      </div>
    </form>
  );
} 