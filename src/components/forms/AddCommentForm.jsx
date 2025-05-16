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

// AddCommentForm.jsx
'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { clientDB } from '@/supabaseClient';

export default function AddCommentForm({ postType, postId, onCommentPosted }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const foreignKey =
    postType === 'hack' ? 'hack_id' :
    postType === 'event' ? 'event_id' :
    postType === 'deal' ? 'deal_id' :
    null;

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  console.log('1. Submission started'); // Debug

  if (!text.trim() || !foreignKey) {
    console.log('2. Validation failed - text/foreignKey missing');
    return;
  }

  try {
    console.log('3. Checking user session');
    const { data: { user }, error: authError } = await clientDB.auth.getUser();
    
    if (authError) {
      console.log('4. Auth error:', authError); 
      throw authError;
    }
    
    if (!user) {
      console.log('5. No user session');
      setError('Please log in to comment');
      return;
    }

    setLoading(true);
    console.log('6. Loading state set to true');

    const insertObj = {
      user_id: user.id,
      message: text.trim(),
      [foreignKey]: postId, // Ensure this matches your table column name
    };

    console.log('7. Insert object:', insertObj);

    // Critical Fix: Add proper error handling for the insert
    const { data, error: insertError } = await clientDB
      .from('comment')
      .insert(insertObj)
      .select(`
        id,
        user_id,
        message,
        created_at,
        user:user_id (id, username)  // Join user data
      `)
      .single();

    if (insertError) {
      console.log('8. Insert error:', insertError);
      throw insertError;
    }

    console.log('9. Insert successful:', data);
    
    setText(''); // Clear input
    onCommentPosted?.(data); // Send full comment data to parent

  } catch (error) {
    console.log('10. Catch block error:', error);
    setError(error.message || 'Failed to post. Check console.');
  } finally {
    setLoading(false);
    console.log('11. Final cleanup - loading false');
  }
};


  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}
      
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add a comment..."
        className="w-full p-2 border border-[#8B4C24]/30 rounded-lg focus:ring-[#A0522D] focus:border-[#A0522D] text-[#8B4C24] bg-[#F5EFE6]"
        rows={2}
        disabled={loading}
      />
      
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1.5 bg-[#639751] text-white rounded-lg hover:bg-[#538741] disabled:opacity-50 transition-colors"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
}

AddCommentForm.propTypes = {
  postType: PropTypes.oneOf(['hack','event','deal']).isRequired,
  postId: PropTypes.string.isRequired,
  onCommentPosted: PropTypes.func,
};