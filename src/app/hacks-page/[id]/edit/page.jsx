'use client';

import React, { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { clientDB } from '@/supabaseClient';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import StickyNavbar from '@/components/StickyNavbar';

/**
 * EditHackPage.jsx
 * Loaf Life - Edit Hack Page
 * 
 * This page allows users to edit a hack.
 * 
 * Modified with assistance from Google Gemini 2.5 Flash
 * 
 * @author: Nathan O
 * @author https://gemini.google.com/app
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

export default function EditHackPage({ params }) {
  const resolvedParams = use(params);
  const hackId = resolvedParams.id;
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentTags, setCurrentTags] = useState([]);
  const [locationAddress, setLocationAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [hackAuthorId, setHackAuthorId] = useState(null);
  const originalHackLocationRef = useRef(null);

  useEffect(() => {
    const fetchCurrentUserAndHack = async () => {
      setIsLoading(true);
      setError(null);

      const { data: { session }, error: sessionError } = await clientDB.auth.getSession();
      if (sessionError) {
        setError('Error fetching user session.');
        console.error('Error fetching session:', sessionError);
        setIsLoading(false);
        return;
      }
      if (session && session.user) {
        setCurrentUserId(session.user.id);
      } else {
        router.push('/login');
        return;
      }

      if (!hackId) {
        setError("Hack ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const { data: hackData, error: fetchError } = await clientDB
          .from('hacks')
          .select('title, description, tags, user_id, location')
          .eq('id', hackId)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError("Hack not found or you don't have permission to edit it.");
          } else {
            throw fetchError;
          }
          setIsLoading(false);
          return;
        }
        
        if (!hackData) {
          setError("Hack not found.");
          setIsLoading(false);
          return;
        }

        if (hackData.user_id !== session.user.id) {
            setError("You are not authorized to edit this hack.");
            setIsLoading(false);
            return;
        }
        
        setHackAuthorId(hackData.user_id);
        setTitle(hackData.title || '');
        setDescription(hackData.description || '');
        setCurrentTags(hackData.tags || []);
        originalHackLocationRef.current = hackData.location;
        if (hackData.location) {
          try {
            const parsedLocation = JSON.parse(hackData.location);
            setLocationAddress(parsedLocation.address || '');
          } catch (e) {
            console.error("Error parsing location JSON from DB:", e);
            setLocationAddress('');
          }
        } else {
          setLocationAddress('');
        }

      } catch (err) {
        console.error(`Error fetching hack ${hackId} for edit:`, err);
        setError(err.message || "An unexpected error occurred while fetching hack details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUserAndHack();
  }, [hackId, router]);

  const handleSelectTag = (tagValue) => {
    setSubmitError(null); 
    setCurrentTags(prevSelectedTags => {
      if (prevSelectedTags.includes(tagValue)) {
        return prevSelectedTags.filter(t => t !== tagValue);
      } else {
        if (prevSelectedTags.length < MAX_TAGS) {
          return [...prevSelectedTags, tagValue];
        } else {
          setSubmitError(`You can select a maximum of ${MAX_TAGS} tags.`);
          return prevSelectedTags; 
        }
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsLoading(true);

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

    if (currentUserId !== hackAuthorId) {
        setSubmitError("Authorization error. You cannot edit this hack.");
        setIsLoading(false);
        return;
    }

    let updatedLocationJson = null;
    if (locationAddress.trim()) {
      const newAddress = locationAddress.trim();
      let lat = null;
      let lng = null;
      if (originalHackLocationRef.current) {
        try {
          const originalLocationParsed = JSON.parse(originalHackLocationRef.current);
          lat = originalLocationParsed.lat;
          lng = originalLocationParsed.lng;
        } catch (e) {
          console.warn("Could not parse original location to preserve lat/lng:", e);
        }
      }
      updatedLocationJson = JSON.stringify({ address: newAddress, lat, lng });
    }

    try {
      const { data, error: updateError } = await clientDB
        .from('hacks')
        .update({ 
            title, 
            description,
            tags: currentTags,
            location: updatedLocationJson,
        })
        .eq('id', hackId)
        .eq('user_id', currentUserId);

      if (updateError) {
        throw updateError;
      }

      router.push(`/hacks-page/${hackId}`);
    } catch (err) {
      console.error('Error updating hack:', err);
      setSubmitError(err.message || "Failed to update hack. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !title) { 
    return <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center">Loading hack editor...</div>;
  }

  if (error) {
    return <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center text-red-500">Error: {error}</div>;
  }
  
  if (hackAuthorId && currentUserId !== hackAuthorId) {
    return <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center text-red-500">Error: You are not authorized to edit this hack.</div>;
  }


  return (
    <div className="pb-6">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <StickyNavbar />
        <div className="bg-[#FDFAF5] p-4 rounded-lg border border-[#8B4C24]/30 pt-16">
          <h1 className="text-3xl font-bold mb-6 text-[#8B4C24]">Edit Hack</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#6A401F] mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm bg-white placeholder-gray-400 text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[#6A401F] mb-1">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows="6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm bg-white placeholder-gray-400 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6A401F] mb-1">
                Tags (select up to {MAX_TAGS})
              </label>
              <div className="mt-1 flex flex-wrap gap-2 p-2.5 border border-[#D1905A] rounded-lg shadow-sm bg-white min-h-[40px]">
                {availableTags.map(tag => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleSelectTag(tag)}
                    className={`py-2 px-4 rounded-full text-xs font-semibold focus:outline-none transition-all duration-200 ease-in-out whitespace-nowrap ${currentTags.includes(tag)
                        ? 'bg-[#8B4C24] text-white hover:bg-[#7a421f]'
                        : 'bg-white text-[#8B4C24] hover:bg-gray-100 ring-1 ring-inset ring-[#D1905A]'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="locationAddress" className="block text-sm font-medium text-[#6A401F] mb-1">
                Location (Optional)
              </label>
              <input
                type="text"
                name="locationAddress"
                id="locationAddress"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm bg-white placeholder-gray-400 text-gray-900"
                placeholder="e.g., 123 Main St, Anytown, USA"
              />
            </div>

            {submitError && <p className="text-sm text-red-600 mt-2">{submitError}</p>}

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button
                    type="submit"
                              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#77A06B] hover:bg-[#668d5b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A0522D] transition duration-150 ease-in-out disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              <button
                type="button"
                onClick={() => router.back()} 
                className="w-full flex justify-center py-3 px-4 border border-[#D1905A] rounded-lg shadow-sm text-sm font-medium text-[#8B4C24] bg-transparent hover:bg-[#F5E3C6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B4C24] transition duration-150 ease-in-out"
                disabled={isLoading}
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