/**
 * page.jsx (EditEventPage)
 *
 * Loaf Life
 *   Allows users to edit their created events. Utilizes Next.js for routing and React for UI
 *   components. Integrates with Supabase for data fetching and updating, and Google Places API
 *   for location autocomplete.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author Conner Ponton
 *   @author https://chatgpt.com
 *
 * Main Component:
 *   @function EditEventPage
 *   @description Enables authenticated users to modify details of their events (title,
 *                description, tags, location). Fetches existing event data from Supabase and
 *                populates a form. Includes input validation, a confirmation modal for
 *                unsaved changes, and location autocomplete. Updates event data in the
 *                Supabase 'events' table. This page was converted from an earlier
 *                'EditHackPage' component.
 *   @param {object} params - The parameters passed to the page, containing `eventId`.
 *   @returns {JSX.Element} The rendered edit event page.
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

// Main Component: EditEventPage
export default function EditEventPage({ params }) {
  // -- State Management & Hooks --

  // Resolved event ID from URL parameters.
  const resolvedParams = use(params);
  // Event ID from resolved parameters.
  const eventId = resolvedParams.eventId;
  // Next.js router instance for navigation.
  const router = useRouter();

  // State for the event title.
  const [title, setTitle] = useState('');
  // State for the event description.
  const [description, setDescription] = useState('');
  // State for the event's selected tags.
  const [currentTags, setCurrentTags] = useState([]);
  // State to manage loading indicators.
  const [isLoading, setIsLoading] = useState(true);
  // State for displaying errors during data fetching.
  const [error, setError] = useState(null);
  // State for displaying errors during form submission.
  const [submitError, setSubmitError] = useState(null);
  // State for the current authenticated user's ID.
  const [currentUserId, setCurrentUserId] = useState(null);
  // State for the event author's ID.
  const [eventAuthorId, setEventAuthorId] = useState(null);
  // State for the event location's address string.
  const [locationAddress, setLocationAddress] = useState('');
  // State for the selected location object (including lat/lng).
  const [selectedLocation, setSelectedLocation] = useState(null);
  // State to force re-render of location autocomplete component.
  const [locationKey, setLocationKey] = useState(0);
  // State to control visibility of cancel confirmation modal.
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);

  // Initial state for unsaved changes detection
  // Initial event title for unsaved changes detection.
  const [initialTitle, setInitialTitle] = useState('');
  // Initial event description for unsaved changes detection.
  const [initialDescription, setInitialDescription] = useState('');
  // Initial event tags for unsaved changes detection.
  const [initialTags, setInitialTags] = useState([]);
  // Initial location address for unsaved changes detection.
  const [initialLocationAddress, setInitialLocationAddress] = useState('');
  // Initial selected location for unsaved changes detection.
  const [initialSelectedLocation, setInitialSelectedLocation] = useState(null);

  // -- Effects --
  /**
   * useEffect: Fetch Current User and Event Data
   * @description Fetches the current user's session and the event details from Supabase.
   *              It populates the form fields with existing event data. It also sets initial
   *              values for detecting unsaved changes. Runs when `eventId` changes.
   *              Redirects to login if no session. Checks for event ID and authorization.
   */
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
  /**
   * @function hasUnsavedChanges
   * @description Checks if any form fields (title, description, tags, location) have been
   *              modified from their initial values.
   * @returns {boolean} True if unsaved changes exist, false otherwise.
   */
  const hasUnsavedChanges = () => {
    if (title !== initialTitle) return true;
    if (description !== initialDescription) return true;
    if (JSON.stringify(currentTags.sort()) !== JSON.stringify(initialTags.sort())) return true;
    if (locationAddress !== initialLocationAddress) return true;
    if (JSON.stringify(selectedLocation) !== JSON.stringify(initialSelectedLocation)) return true;
    return false;
  };

  // -- Event Handlers --
  /**
   * @function handleCancel
   * @description Handles the cancel action. If unsaved changes exist, it shows a confirmation
   *              modal. Otherwise, it navigates back to the event detail page.
   */
  const handleCancel = () => {
    // If there are unsaved changes, show a confirmation modal before navigating
    if (hasUnsavedChanges()) {
      setShowCancelConfirmModal(true);
    } else {
      router.push(`/events-page/${eventId}`);
    }
  };

  /**
   * @function confirmCancelAndRedirect
   * @description Confirms cancellation and redirects to the event detail page after closing the modal.
   */
  const confirmCancelAndRedirect = () => {
    setShowCancelConfirmModal(false);
    router.push(`/events-page/${eventId}`);
  };

  /**
   * @function cancelAndKeepEditing
   * @description Closes the cancel confirmation modal, allowing the user to continue editing.
   */
  const cancelAndKeepEditing = () => {
    setShowCancelConfirmModal(false);
  };

  /**
   * @function handleClear
   * @description Clears all form fields (title, description, tags, location) and resets any
   *              submission errors. Increments `locationKey` to force re-render of the
   *              LocationAutocomplete component.
   */
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

  /**
   * @function handleSelectTag
   * @description Toggles the selection of a tag. Adds a tag if not selected and under the
   *              `MAX_TAGS` limit, or removes it if already selected. Updates submission
   *              error if tag limit is reached.
   * @param {string} tagValueFromButton - The value of the tag to be selected/deselected.
   */
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

  /**
   * @function handleSelectLocation
   * @description Updates the selected location and location address based on the data from the
   *              location autocomplete component. Resets submission error.
   * @param {object|null} locationData - The location data object from autocomplete, or null.
   */
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

  /**
   * @function handleSubmit
   * @description Handles form submission. Performs validation on title, description, and tags.
   *              Checks user authorization. Prepares location data as a JSON string.
   *              Attempts to update the event in the Supabase 'events' table. Navigates
   *              to the event detail page on success or displays an error.
   * @async
   * @param {Event} e - The form submission event.
   */
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
  // Loading state while event data is being fetched and title is not yet set.
  if (isLoading && !title) {
    return <div className="max-w-md mx-auto p-6 text-center">Loading event editor...</div>;
  }
  // Error state if data fetching failed.
  if (error) {
    return <div className="max-w-md mx-auto p-6 text-red-500 text-center">Error: {error}</div>;
  }
  // Authorization check: if current user is not the event author.
  if (eventAuthorId && currentUserId !== eventAuthorId) {
    return <div className="max-w-md mx-auto p-6 text-red-500 text-center">You cannot edit this event.</div>;
  }

  return (
    // Main container with bottom padding
    <div className="pb-6">
      {/* Centered content container */}
      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Sticky top navigation bar */}
        <StickyNavbar />
        {/* Form container with styling */}
        <div className="bg-[#FDFAF5] p-4 rounded-lg border border-[#8B4C24]/30 pt-16">
          {/* Header section for the form */}
          <div className="flex justify-between items-start mb-1">
            {/* Form title */}
            <h1 className="text-2xl font-bold text-[#8B4C24]">Edit Event</h1>
            {/* Clear Form button */}
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-gray-700 focus:outline-none px-2 py-1 rounded hover:bg-gray-100 transition-colors duration-150 ease-in-out whitespace-nowrap"
            >
              Clear Form
            </button>
          </div>
          {/* Helper text for required fields */}
          <p className="text-xs text-gray-600 mb-6">* Indicates a required field</p>
          
          {/* Main form for editing event details */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title input field */}
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

            {/* Description textarea field */}
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

            {/* Location Autocomplete section */}
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

            {/* Tags selection section */}
            <div>
              <label className="block text-sm font-medium text-[#6A401F] mb-1">
                Tags (select up to {MAX_TAGS})*
              </label>
              {/* Container for tag buttons */}
              <div className="mt-1 flex flex-wrap gap-2 p-2.5 border border-[#D1905A] rounded-lg shadow-sm bg-white min-h-[40px]">
                {/* Map through available tags to create buttons */}
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

            {/* Display submission error message, if any */}
            {submitError && <p className="text-sm text-red-600 mt-2">{submitError}</p>}

            {/* Action buttons: Save Changes and Cancel */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#77A06B] hover:bg-[#668d5b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#77A06B] transition duration-150 ease-in-out disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              {/* Cancel button */}
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

        {/* Page footer */}
        <Footer />
      </div>
      {/* Bottom navigation bar for mobile */}
      <BottomNav />
      {/* Confirmation modal for unsaved changes on cancel */}
      <ConfirmCancelModal
        isOpen={showCancelConfirmModal}
        onConfirm={confirmCancelAndRedirect}
        onCancel={cancelAndKeepEditing}
      />
    </div>
  );
}