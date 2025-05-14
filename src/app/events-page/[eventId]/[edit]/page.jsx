'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { clientDB } from '@/supabaseClient';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import StickyNavbar from '@/components/StickyNavbar';

/**
 * EditEventPage.jsx
 * Loaf Life - Edit Event Page
 * 
 * This page allows users to edit an event.
 * 
 * Converted from EditHackPage with table changes for 'events'
 * @author: Nathan O
 * @author: Conner P
 * @author: ChatGPT used to simplify conversion 
 */

const MAX_TAGS = 5;

const availableTags = [
  "Campus Life",
  "Health & Wellness",
  "Study Tips",
  "Food",
  "Career",
  "Finance",
  "Technology",
  "Social"
];

export default function EditEventPage({ params }) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentTags, setCurrentTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [eventAuthorId, setEventAuthorId] = useState(null);

  useEffect(() => {
    const fetchCurrentUserAndEvent = async () => {
      setIsLoading(true);
      setError(null);

      // 1. get session & user
      const { data: { session }, error: sessionError } = await clientDB.auth.getSession();
      if (sessionError) {
        setError('Error fetching user session.');
        setIsLoading(false);
        return;
      }
      if (!session?.user) {
        router.push('/login');
        return;
      }
      setCurrentUserId(session.user.id);

      // 2. ensure we have an ID
      if (!eventId) {
        setError("Event ID is missing.");
        setIsLoading(false);
        return;
      }

      // 3. fetch the event row
      try {
        const { data: eventData, error: fetchError } = await clientDB
          .from('events')             // ← only table name changed
          .select('title, description, tags, user_id')
          .eq('id', eventId)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError("Event not found or you don't have permission to edit it.");
          } else {
            throw fetchError;
          }
          setIsLoading(false);
          return;
        }
        if (!eventData) {
          setError("Event not found.");
          setIsLoading(false);
          return;
        }
        // 4. authorization
        if (eventData.user_id !== session.user.id) {
          setError("You are not authorized to edit this event.");
          setIsLoading(false);
          return;
        }

        // 5. populate form
        setEventAuthorId(eventData.user_id);
        setTitle(eventData.title || '');
        setDescription(eventData.description || '');
        setCurrentTags(eventData.tags || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Unexpected error.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUserAndEvent();
  }, [eventId, router]);

  const handleSelectTag = (tagValue) => {
    setSubmitError(null);
    setCurrentTags(prev => {
      if (prev.includes(tagValue)) return prev.filter(t => t !== tagValue);
      if (prev.length >= MAX_TAGS) {
        setSubmitError(`You can select up to ${MAX_TAGS} tags.`);
        return prev;
      }
      return [...prev, tagValue];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsLoading(true);

    // same validations
    if (!title.trim()) {
      setSubmitError("Title cannot be empty.");
      setIsLoading(false);
      return;
    }
    if (!description.trim()) {
      setSubmitError("Description cannot be empty.");
      setIsLoading(false);
      return;
    }
    if (currentTags.length === 0) {
      setSubmitError("Please select at least one tag.");
      setIsLoading(false);
      return;
    }
    if (currentUserId !== eventAuthorId) {
      setSubmitError("Authorization error.");
      setIsLoading(false);
      return;
    }

    // update
    try {
      const { error: updateError } = await clientDB
        .from('events')            // ← only table name changed
        .update({
          title,
          description,
          tags: currentTags,
        })
        .eq('id', eventId)
        .eq('user_id', currentUserId);

      if (updateError) throw updateError;

      router.push(`/events-page/${eventId}`);  // ← route adjusted
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "Failed to save.");
    } finally {
      setIsLoading(false);
    }
  };

  // loading / error guards unchanged:
  if (isLoading && !title) {
    return <div className="max-w-md mx-auto p-6 text-center">Loading event editor...</div>;
  }
  if (error) {
    return <div className="max-w-md mx-auto p-6 text-red-500 text-center">Error: {error}</div>;
  }
  if (eventAuthorId && currentUserId !== eventAuthorId) {
    return <div className="max-w-md mx-auto p-6 text-red-500 text-center">You cannot edit this event.</div>;
  }

  return (
    <div className="pb-6">
      <div className="max-w-md mx-auto p-6 space-y-6">
        <StickyNavbar />
        <div className="bg-[#FDFAF5] p-4 rounded-lg border border-[#8B4C24]/30 pt-16">
          <h1 className="text-3xl font-bold mb-6 text-[#8B4C24]">Edit Event</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#6A401F] mb-1">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="mt-1 block w-full border-[#D1905A] rounded-lg px-4 py-2.5 focus:ring-[#8B4C24]"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[#6A401F] mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                className="mt-1 block w-full border-[#D1905A] rounded-lg px-4 py-2.5 focus:ring-[#8B4C24]"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-[#6A401F] mb-1">
                Tags (up to {MAX_TAGS})
              </label>
              <div className="mt-1 flex flex-wrap gap-2 p-2.5 border-[#D1905A] rounded-lg min-h-[40px]">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleSelectTag(tag)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold ${currentTags.includes(tag)
                      ? 'bg-[#8B4C24] text-white'
                      : 'bg-white ring-1 ring-[#D1905A] text-[#8B4C24]'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {submitError && <p className="text-sm text-red-600">{submitError}</p>}

            {/* Actions */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 rounded-lg bg-[#77A06B] text-white disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isLoading}
                className="flex-1 py-3 rounded-lg border border-[#D1905A] text-[#8B4C24]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <Footer />
      </div>
      <BottomNav />
    </div>
  );
}