'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { clientDB } from '@/supabaseClient';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import StickyNavbar from '@/components/StickyNavbar';
import LocationAutocomplete from '@/components/mapComponents/LocationAutoComplete';

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
  'Animal Care',
  'Art',
  'Board Games',
  'Comedy',
  'Coding',
  'Cooking',
  'Cycling',
  'Esports',
  'Entrepreneurship',
  'Fitness',
  'Football',
  'Gaming',
  'Hiking',
  'Investing',
  'Mental Health',
  'Movies',
  'Music',
  'Photography',
  'Public Speaking',
  'Reading',
  'Study Groups',
  'Sustainability',
  'Yoga'
];

export default function EditEventPage({ params }) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.eventId;
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentTags, setCurrentTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [eventAuthorId, setEventAuthorId] = useState(null);
  const [locationAddress, setLocationAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationKey, setLocationKey] = useState(0);

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
          .from('events')            
          .select('title, description, tags, user_id, location') 
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
        setTitle(eventData.title ? eventData.title.trim() : '');
        setDescription(eventData.description || '');
        setCurrentTags(eventData.tags ? eventData.tags.map(t => String(t).toLowerCase()) : []);
        if (eventData.location) { // Parse and set location
          try {
            const parsedLocation = JSON.parse(eventData.location);
            setLocationAddress(parsedLocation.address || '');
            if (parsedLocation.address && parsedLocation.lat && parsedLocation.lng) {
              setSelectedLocation(parsedLocation);
            } else {
              setSelectedLocation({ address: parsedLocation.address || '', lat: null, lng: null });
            }
          } catch (e) {
            console.error("Error parsing event location JSON from DB:", e);
            setLocationAddress('');
            setSelectedLocation(null);
          }
        } else {
          setLocationAddress('');
          setSelectedLocation(null);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Unexpected error.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUserAndEvent();
  }, [eventId, router]);

  const handleClear = () => {
    setTitle('');
    setDescription('');
    setCurrentTags([]);
    setLocationAddress('');
    setSelectedLocation(null);
    setSubmitError(null);
    setLocationKey(prevKey => prevKey + 1); 
  };

  const handleSelectTag = (tagValueFromButton) => {
    setSubmitError(null);
    setCurrentTags(prevLowercaseTags => {
      const lowerTagValue = String(tagValueFromButton).toLowerCase();
      if (prevLowercaseTags.includes(lowerTagValue)) {
        return prevLowercaseTags.filter(t => t !== lowerTagValue);
      } else {
        if (prevLowercaseTags.length < MAX_TAGS) {
          return [...prevLowercaseTags, lowerTagValue];
        } else {
          setSubmitError(`You can select up to ${MAX_TAGS} tags.`);
          return prevLowercaseTags;
        }
      }
    });
  };

  const handleSelectLocation = (locationData) => {
    setSubmitError(null);
    if (locationData) {
      setSelectedLocation(locationData);
      setLocationAddress(locationData.address || '');
    } else {
      setSelectedLocation(null);
      setLocationAddress('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsLoading(true);

    // same validations
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
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

    let updatedLocationJson = null;
    if (selectedLocation && selectedLocation.address && selectedLocation.lat !== null && selectedLocation.lng !== null) {
      updatedLocationJson = JSON.stringify({
        address: selectedLocation.address,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng
      });
    } else if (selectedLocation && selectedLocation.address && (!selectedLocation.lat || !selectedLocation.lng)) {
      // If lat/lng are missing but address is there, save address only
      updatedLocationJson = JSON.stringify({ address: selectedLocation.address, lat: null, lng: null });
    } else if (!selectedLocation && locationAddress.trim()) {
        // If no selected location object but address string is present (manual input not fully geocoded)
        updatedLocationJson = JSON.stringify({ address: locationAddress.trim(), lat: null, lng: null });
    }

    // update
    try {
      const { error: updateError } = await clientDB
        .from('events')          
        .update({
          title: trimmedTitle,
          description,
          tags: currentTags,
          location: updatedLocationJson, 
        })
        .eq('id', eventId)
        .eq('user_id', currentUserId);

      if (updateError) throw updateError;

      router.push(`/events-page/${eventId}`);  
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
          <div className="flex justify-between items-start mb-1">
            <h1 className="text-2xl font-bold text-[#8B4C24]">Edit Event</h1>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-gray-700 focus:outline-none px-2 py-1 rounded hover:bg-gray-100 transition-colors duration-150 ease-in-out whitespace-nowrap"
            >
              Clear Form
            </button>
          </div>
          <p className="text-xs text-gray-600 mb-6">* Indicates a required field</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#6A401F] mb-1">
                Title*
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm bg-white placeholder-gray-400 text-gray-900"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[#6A401F] mb-1">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm bg-white placeholder-gray-400 text-gray-900"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-[#6A401F] mb-1">
                Location (Optional)
              </label>
              <LocationAutocomplete
                key={locationKey}
                initialValue={locationAddress}
                onSelect={handleSelectLocation}
                placeholder="e.g., Library, Room SE06"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-[#6A401F] mb-1">
                Tags (select up to {MAX_TAGS})*
              </label>
              <div className="mt-1 flex flex-wrap gap-2 p-2.5 border border-[#D1905A] rounded-lg shadow-sm bg-white min-h-[40px]">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleSelectTag(tag)}
                    className={`py-2 px-4 rounded-full text-xs font-semibold focus:outline-none transition-all duration-200 ease-in-out whitespace-nowrap ${currentTags.includes(String(tag).toLowerCase())
                        ? 'bg-[#8B4C24] text-white hover:bg-[#7a421f]'
                        : 'bg-white text-[#8B4C24] hover:bg-gray-100 ring-1 ring-inset ring-[#D1905A]'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {submitError && <p className="text-sm text-red-600 mt-2">{submitError}</p>}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#77A06B] hover:bg-[#668d5b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#77A06B] transition duration-150 ease-in-out disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => router.push(`/events-page/${eventId}`)} // Adjusted cancel route
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-[#D1905A] rounded-lg shadow-sm text-sm font-medium text-[#8B4C24] bg-transparent hover:bg-[#F5E3C6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B4C24] transition duration-150 ease-in-out"
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