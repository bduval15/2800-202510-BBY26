import React, { useState } from 'react';
import Image from 'next/image';
import { PencilIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { clientDB } from '@/supabaseClient';

/**
 * Comment.jsx
 * Loaf Life - Comment Card Component
 *
 * This component displays a comment with a user avatar, username,
 * timestamp, and comment text. It includes an edit functionality
 * for the comment author to update the message.
 *
 * Modified with assistance from Google Gemini 2.5 Flash
 *
 * @author: Nathan O
 * @author: https://gemini.google.com/app
 */

const Comment = ({ comment, currentUserId, onCommentUpdated, timestampFormated }) => {
  const { id: commentId, message, user_id: commentAuthorId, user_profiles } = comment;
  const { username, avatar_url } = user_profiles || {};

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState(null);

  const canEdit = currentUserId && currentUserId === commentAuthorId;

  const handleEdit = () => {
    setEditedText(message);
    setEditError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedText(message);
    setEditError(null);
  };

  const handleSave = async () => {
    if (editedText.trim() === message) {
      setIsEditing(false);
      return;
    }
    if (!editedText.trim()) {
        setEditError("Comment cannot be empty.");
        return;
    }

    setIsSaving(true);
    setEditError(null);
    try {
      const { error } = await clientDB
        .from('comment')
        .update({ message: editedText.trim() })
        .eq('id', commentId)
        .eq('user_id', currentUserId);

      if (error) {
        console.error("Error updating comment:", error);
        throw new Error(error.message || 'Failed to save comment.');
      }
      setIsEditing(false);
      if (onCommentUpdated) {
        onCommentUpdated();
      }
    } catch (err) {
      setEditError(err.message);
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#FDFAF5] p-2 rounded-lg border border-[#8B4C24]/30 shadow-md mb-2">
      <div className="flex items-start space-x-1">
        {avatar_url ? (
          <Image
            src={avatar_url}
            alt={`${username || 'User'}'s avatar`}
            width={32}
            height={32}
            className="rounded-full mt-1"
          />
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden mt-1">
            <img src="/images/profile.png" alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-[#8B4C24] text-sm">{username || 'Anonymous'}</span>
              <span className="text-xs text-[#8B4C24]/70">•</span>
              <span className="text-xs text-[#8B4C24]/70">{timestampFormated}</span>
            </div>
            {canEdit && !isEditing && (
              <button
                onClick={handleEdit}
                className="text-[#A0522D] hover:text-[#8B4C24] p-1"
                aria-label="Edit comment"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full p-2 border border-[#8B4C24]/50 rounded-md focus:ring-[#A0522D] focus:border-[#A0522D] text-[#8B4C24] bg-[#F5EFE6] text-sm"
                rows="3"
                disabled={isSaving}
              />
              {editError && <p className="text-xs text-red-500">{editError}</p>}
              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-2 py-1 text-xs text-[#8B4C24] hover:bg-[#EADDCA] rounded-md"
                >
                  <XMarkIcon className="h-4 w-4 inline mr-1"/> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !editedText.trim()}
                  className="px-3 py-1.5 text-xs bg-[#639751] text-white rounded-lg hover:bg-[#538741] disabled:opacity-50 flex items-center"
                >
                  {isSaving ? (
                     <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                     </>
                  ) : (
                    <><CheckIcon className="h-4 w-4 inline mr-1"/> Save</>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[#8B4C24]/90 text-sm whitespace-pre-wrap break-words">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
