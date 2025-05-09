'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Comment from '@/components/cards/Comment';
import AddCommentForm from '@/components/forms/AddCommentForm';

/**
 * CommentSection.jsx
 * Loaf Life - Comment Section
 *
 * This component displays the comment section for a hack,
 * allowing users to view and add comments.
 *
 * @author: Nathan O (Initially in HackDetailPage)
 *
 * Modified with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */
export default function CommentSection() {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-[#FDFAF5] p-4 rounded-lg border border-[#8B4C24]/30 mt-4">
      <button
        onClick={() => setShowComments(!showComments)}
        className="w-full flex justify-between items-center text-xl font-semibold text-[#8B4C24] focus:outline-none"
      >
        <span>Comments</span>
        {showComments ? (
          <ChevronUpIcon className="h-6 w-6 text-[#A0522D]" />
        ) : (
          <ChevronDownIcon className="h-6 w-6 text-[#A0522D]" />
        )}
      </button>

      {showComments && (
        <div className="mt-4" id="comments-section">
          {/* Placeholder for actual comments iteration */}
          <Comment
            avatarSrc={null}
            username="ToastedBagel"
            timestamp="4h ago"
            commentText="I love this hack!"
          />
          <AddCommentForm />
        </div>
      )}
    </div>
  );
} 