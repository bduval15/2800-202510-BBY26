import React from 'react';
import Image from 'next/image'; 

/**
 * Comment.jsx
 * Loaf Life - Comment Card Component
 *
 * This component displays a comment with a user avatar, username, timestamp, and comment text.
 *
 * @author: Nathan O
 *
 * Modified with assistance from Google Gemini 2.5 Flash
 * @author https://gemini.google.com/app
 */

const Comment = ({ avatarSrc, username, timestamp, commentText }) => {
  return (
    <div className="bg-[#FDFAF5] p-2 rounded-lg border border-[#8B4C24]/30 shadow-md mb-2">
      <div className="flex items-start space-x-1">
        {/* Avatar */}
        {avatarSrc ? (
          <Image
            src={avatarSrc}
            alt={`${username}'s avatar`}
            width={32} 
            height={32} 
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden">
            <img src="/images/profile.png" alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Comment Content */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold text-[#8B4C24] text-sm">{username}</span>
            <span className="text-xs text-[#8B4C24]/70">•</span>
            <span className="text-xs text-[#8B4C24]/70">{timestamp}</span>
          </div>
          <p className="text-[#8B4C24]/90 text-sm">
            {commentText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
