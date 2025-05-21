/**
 * page.jsx (EditEventPage)
 * Loaf Life – Allows users to edit their created events.
 *
 * This page enables authenticated users to modify details of their events.
 * It fetches existing event data (title, description, tags, location)
 * from Supabase and populates a form. Users can update these fields.
 * The page includes input validation, a confirmation modal for unsaved
 * changes, and location autocomplete. This page was converted from an
 * earlier 'EditHackPage' component, adapting it for 'events'.
 *
 * Features:
 * - Fetches event data from Supabase.
 * - Form for editing event details (title, description, tags, location).
 * - Input validation for form fields.
 * - Tag management (selection up to 5 tags).
 * - Location autocomplete using Google Places API.
 * - Unsaved changes confirmation modal.
 * - Updates event data in the Supabase 'events' table.
 *
 * Portions of logic assisted by ChatGPT.
 * Modified with assistance from ChatGPT (for conversion from EditHackPage).
 *
 * @author Nathan Oloresisimo
 * @author Conner Ponton
 * @author https://chatgpt.com
 */

'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { clientDB } from '@/supabaseClient';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import StickyNavbar from '@/components/StickyNavbar';
import LocationAutocomplete from '@/components/mapComponents/LocationAutoComplete';
import { tags as availableTags } from '@/lib/tags';
import ConfirmCancelModal from '@/components/ConfirmCancelModal';


const MAX_TAGS = 5;

export default function EditEventPage({ params }) {
  // -- State Management & Hooks --
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
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);

  // Initial state for unsaved changes detection
  const [initialTitle, setInitialTitle] = useState('');
  const [initialDescription, setInitialDescription] = useState('');
  const [initialTags, setInitialTags] = useState([]);
  const [initialLocationAddress, setInitialLocationAddress] = useState('');
  const [initialSelectedLocation, setInitialSelectedLocation] = useState(null);

  // -- Effects --
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

        // Set initial state for comparison
        setInitialTitle(eventData.title ? eventData.title.trim() : '');
        setInitialDescription(eventData.description || '');
        setInitialTags(eventData.tags ? eventData.tags.map(t => String(t).toLowerCase()) : []);

        if (eventData.location) {
          try {
            // Location data is expected to be a JSON string
            const parsedLocation = JSON.parse(eventData.location);
            setLocationAddress(parsedLocation.address || '');
            setInitialLocationAddress(parsedLocation.address || '');

            // Check if full coordinates are available in the parsed location
            if (parsedLocation.address && parsedLocation.lat && parsedLocation.lng) {
              setSelectedLocation(parsedLocation);
              setInitialSelectedLocation(parsedLocation);
            } else {
              // If not, store address with null coordinates (or just address if that's all there is)
              setSelectedLocation({ address: parsedLocation.address || '', lat: null, lng: null });
              setInitialSelectedLocation({ address: parsedLocation.address || '', lat: null, lng: null });
            }
          } catch (e) {
            console.error("Error parsing event location JSON from DB:", e);
            setLocationAddress('');
            setInitialLocationAddress('');
            setSelectedLocation(null);
            setInitialSelectedLocation(null);
          }
        } else {
          // Initialize location fields if no location data from DB
          setLocationAddress('');
          setInitialLocationAddress('');
          setSelectedLocation(null);
          setInitialSelectedLocation(null);
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

  // -- Helper Functions --
  const hasUnsavedChanges = () => {
    if (title !== initialTitle) return true;
    if (description !== initialDescription) return true;
    if (JSON.stringify(currentTags.sort()) !== JSON.stringify(initialTags.sort())) return true;
    if (locationAddress !== initialLocationAddress) return true;
    if (JSON.stringify(selectedLocation) !== JSON.stringify(initialSelectedLocation)) return true;
    return false;
  };

  // -- Event Handlers --
  const handleCancel = () => {
    // If there are unsaved changes, show a confirmation modal before navigating
    if (hasUnsavedChanges()) {
      setShowCancelConfirmModal(true);
    } else {
      router.push(`/events-page/${eventId}`);
    }
  };

  const confirmCancelAndRedirect = () => {
    setShowCancelConfirmModal(false);
    router.push(`/events-page/${eventId}`);
  };

  const cancelAndKeepEditing = () => {
    setShowCancelConfirmModal(false);
  };

  const handleClear = () => {
    setTitle('');
    setDescription('');
    setCurrentTags([]);
    setLocationAddress('');
    setSelectedLocation(null);
    setSubmitError(null);
    // Increment key to force re-render of LocationSearchInput if it relies on a key
    setLocationKey(prevKey => prevKey + 1); 
  };

  const handleSelectTag = (tagValueFromButton) => {
    setSubmitError(null);
    setCurrentTags(prevLowercaseTags => {
      const lowerTagValue = String(tagValueFromButton).toLowerCase();
      // Toggle tag selection
      if (prevLowercaseTags.includes(lowerTagValue)) {
        return prevLowercaseTags.filter(t => t !== lowerTagValue);
      } else {
        // Add tag if under max limit
        if (prevLowercaseTags.length < MAX_TAGS) {
          return [...prevLowercaseTags, lowerTagValue];
        } else {
          setSubmitError(`You can select up to ${MAX_TAGS} tags.`);
          return prevLowercaseTags; // Do not add tag if limit reached
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

    // Basic form validations
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
    // Authorization check
    if (currentUserId !== eventAuthorId) {
      setSubmitError("Authorization error.");
      setIsLoading(false);
      return;
    }

    let updatedLocationJson = null;
    // Prepare location data for DB storage
    if (selectedLocation && selectedLocation.address && selectedLocation.lat !== null && selectedLocation.lng !== null) {
      // Case 1: Full location data (address + lat/lng) from geocoding selection
      updatedLocationJson = JSON.stringify({
        address: selectedLocation.address,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng
      });
    } else if (selectedLocation && selectedLocation.address && (!selectedLocation.lat || !selectedLocation.lng)) {
      // Case 2: Address selected, but lat/lng might be missing (e.g. partial geocode or just address)
      updatedLocationJson = JSON.stringify({ address: selectedLocation.address, lat: null, lng: null });
    } else if (!selectedLocation && locationAddress.trim()) {
      // Case 3: No selected location object, but address string is present (manual input not fully geocoded)
      updatedLocationJson = JSON.stringify({ address: locationAddress.trim(), lat: null, lng: null });
    }

    // Attempt to update the event in the database
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
        .eq('user_id', currentUserId); // Ensure only the author can update

      if (updateError) throw updateError;

      router.push(`/events-page/${eventId}`);  // Navigate to event page on success
    } catch (err) {
      console.error("Error updating event:", err);
      setSubmitError(err.message || "Failed to save event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // -- Conditional Renders --
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
                onClick={handleCancel}
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
      <ConfirmCancelModal
        isOpen={showCancelConfirmModal}
        onConfirm={confirmCancelAndRedirect}
        onCancel={cancelAndKeepEditing}
      />
    </div>
  );
}