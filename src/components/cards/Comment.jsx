/**
 * File: Comment.jsx
 *
 * Loaf Life
 *   Displays a single comment, including user avatar, username, timestamp, and content.
 *   Provides edit functionality for the comment author, allowing them to update or cancel
 *   their changes. Interacts with Supabase to persist comment updates.
 *   Utilizes Next.js Image component and Heroicons.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author https://gemini.google.com/app
 *
 * Main Component:
 *   @function Comment
 *   @description Renders an individual comment. It shows the author's avatar and username,
 *                the time the comment was posted, and the comment text. If the current user
 *                is the author, an edit button is shown. When editing, the user can save
 *                or cancel their changes. Saving updates the comment in Supabase.
 *   @param {object} props - The component's props.
 *   @param {object} props.comment - The comment object. (Required)
 *   @param {string} props.comment.id - The unique ID of the comment.
 *   @param {string} props.comment.message - The text content of the comment.
 *   @param {string} props.comment.user_id - The ID of the user who authored the comment.
 *   @param {object} [props.comment.user_profiles] - Profile information of the comment author.
 *   @param {string} [props.comment.user_profiles.username] - The username of the author.
 *   @param {string} [props.comment.user_profiles.avatar_url] - URL of the author's avatar.
 *   @param {string} props.currentUserId - The ID of the currently logged-in user. (Required)
 *   @param {function} [props.onCommentUpdated] - Callback invoked after a comment is saved.
 *   @param {string} props.timestampFormated - Pre-formatted timestamp string. (Required)
 *   @returns {JSX.Element} A div element representing the comment.
 *
 * Helper Functions / Hooks / Logic Blocks:
 *
 *   @function handleEdit
 *   @description Sets the component to edit mode. It initializes the `editedText` state
 *                with the current comment message and clears any previous edit errors.
 *
 *   @function handleCancel
 *   @description Exits edit mode. It resets `editedText` to the original message and clears
 *                any edit errors.
 *
 *   @function handleSave
 *   @description Saves the edited comment. If the text is unchanged or empty, it handles
 *                these cases appropriately. Otherwise, it attempts to update the comment
 *                in the Supabase 'comment' table. On success, it exits edit mode and calls
 *                `onCommentUpdated`. Errors are caught and displayed.
 *   @async
 */


import React, { useState } from 'react';
import Image from 'next/image';
import { PencilIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { clientDB } from '@/supabaseClient';


const Comment = ({ comment, currentUserId, onCommentUpdated, timestampFormated }) => {
  const { id: commentId, message, user_id: commentAuthorId, user_profiles } = comment;
  // Safely destructure user_profiles, defaulting to an empty object if undefined
  const { username, avatar_url } = user_profiles || {};

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState(null);

  // Determine if the current user is the author of the comment
  const canEdit = currentUserId && currentUserId === commentAuthorId;

  const handleEdit = () => {
    setEditedText(message); // Reset text to original message
    setEditError(null); // Clear any previous errors
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedText(message); // Revert to original message
    setEditError(null); // Clear any previous errors
  };

  const handleSave = async () => {
    // If the message hasn't changed, just exit edit mode
    if (editedText.trim() === message) {
      setIsEditing(false);
      return;
    }
    // Prevent saving an empty comment
    if (!editedText.trim()) {
        setEditError("Comment cannot be empty.");
        return;
    }

    setIsSaving(true);
    setEditError(null);
    try {
      // Update the comment in the database
      const { error } = await clientDB
        .from('comment')
        .update({ message: editedText.trim() })
        .eq('id', commentId)
        .eq('user_id', currentUserId); // Ensure only the author can update

      if (error) {
        console.error("Error updating comment:", error);
        throw new Error(error.message || 'Failed to save comment.');
      }
      setIsEditing(false);
      // Notify parent component that the comment has been updated
      if (onCommentUpdated) {
        onCommentUpdated();
      }
    } catch (err) {
      setEditError(err.message);
      console.error('Save error:', err);
    } finally {
      setIsSaving(false); // Ensure loading state is reset
    }
  };

  return (
    <div className="bg-[#FDFAF5] p-2 rounded-lg border border-[#8B4C24]/30 shadow-md mb-2">
      <div className="flex items-start space-x-1">
        {/* Avatar Section */}
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

        {/* Comment Content Section */}
        <div className="flex-1">
          {/* Comment Header: Username, Timestamp, Edit Button */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-[#8B4C24] text-sm">{username || 'Anonymous'}</span>
              <span className="text-xs text-[#8B4C24]/70">•</span>
              <span className="text-xs text-[#8B4C24]/70">{timestampFormated}</span>
            </div>
            {/* Edit Button (visible if user can edit and not currently editing) */}
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

          {/* Conditional Rendering: Edit Mode or Display Mode */}
          {isEditing ? (
            // Edit Mode
            <div className="space-y-2">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full p-2 border border-[#8B4C24]/50 rounded-md focus:ring-[#A0522D] focus:border-[#A0522D] text-[#8B4C24] bg-[#F5EFE6] text-sm"
                rows="3"
                disabled={isSaving}
              />
              {editError && <p className="text-xs text-red-500">{editError}</p>}
              {/* Edit Actions: Cancel and Save Buttons */}
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
            // Display Mode
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
