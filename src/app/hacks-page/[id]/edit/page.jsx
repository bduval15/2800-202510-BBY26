/**
 * page.jsx (EditHackPage)
 *
 * Loaf Life
 *   Enables authenticated authors to edit their created hacks.
 *   Fetches hack data (title, description, tags, location), populates an editable form,
 *   and handles updates. Integrates with Supabase for data and Google Maps for location
 *   autocomplete.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author https://gemini.google.com/app (for portions of logic and structure)
 */

'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { clientDB } from '@/supabaseClient';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import StickyNavbar from '@/components/StickyNavbar';
import LocationAutocomplete from '@/components/mapComponents/LocationAutoComplete';
import { tags } from '@/lib/tags';
import ConfirmCancelModal from '@/components/ConfirmCancelModal';

// Maximum number of tags a user can select for a hack.
const MAX_TAGS = 5;

/**
 * @function EditHackPage
 * @description Main component for editing an existing hack.
 *   It fetches the hack's current details, populates a form, allows modification of
 *   title, description, tags, and location. It handles input validation, unsaved changes
 *   confirmation, location autocomplete via Google Maps, and restricts editing access
 *   to the hack's original author.
 * @param {object} params - Contains the route parameters, specifically the hack ID.
 * @returns {JSX.Element} The UI for the hack editing page.
 */
export default function EditHackPage({ params }) {
  // -- State & Hooks --
  const resolvedParams = use(params);
  const hackId = resolvedParams.id;
  const router = useRouter();

  // State for the hack title.
  const [title, setTitle] = useState('');
  // State for the hack description.
  const [description, setDescription] = useState('');
  // State for the currently selected tags for the hack.
  const [currentTags, setCurrentTags] = useState([]);
  // State for the hack's location address string.
  const [locationAddress, setLocationAddress] = useState('');
  // State for the selected location object (includes address, lat, lng).
  const [selectedLocation, setSelectedLocation] = useState(null);
  // State to indicate if data is currently being loaded.
  const [isLoading, setIsLoading] = useState(true);
  // State to store any error messages during data fetching.
  const [error, setError] = useState(null);
  // State to store any error messages during form submission.
  const [submitError, setSubmitError] = useState(null);
  // State for the ID of the currently logged-in user.
  const [currentUserId, setCurrentUserId] = useState(null);
  // State for the ID of the author of the hack being edited.
  const [hackAuthorId, setHackAuthorId] = useState(null);
  // State to manage re-rendering of the LocationAutocomplete component.
  const [locationKey, setLocationKey] = useState(0);
  // State to control the visibility of the cancel confirmation modal.
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);

  // State to store initial hack values for detecting unsaved changes.
  const [initialTitle, setInitialTitle] = useState('');
  const [initialDescription, setInitialDescription] = useState('');
  const [initialTags, setInitialTags] = useState([]);
  const [initialLocationAddress, setInitialLocationAddress] = useState('');
  const [initialSelectedLocation, setInitialSelectedLocation] = useState(null);

  /**
   * useEffect: Fetch Current User and Hack Details
   * @description Fetches the current user's session and the details of the hack to be
   *   edited. It populates the form fields with existing data and sets initial values
   *   for unsaved changes detection. It also handles authorization, ensuring only the
   *   hack author can edit.
   * @async
   */
  useEffect(() => {
    const fetchCurrentUserAndHack = async () => {
      setIsLoading(true);
      setError(null);

      // Fetch current user session
      const { data: { session }, error: sessionError } = await clientDB.auth.getSession();
      if (sessionError) {
        setError('Error fetching user session.');
        console.error('Error fetching session:', sessionError);
        setIsLoading(false);
        return;
      }
      // Redirect to login if no active session
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
        // Fetch hack details from the database
        const { data: hackData, error: fetchError } = await clientDB
          .from('hacks')
          .select('title, description, tags, user_id, location')
          .eq('id', hackId)
          .single();

        if (fetchError) {
          // Handle specific Supabase error for 'item not found'
          if (fetchError.code === 'PGRST116') {
            setError("Hack not found or you don't have permission to edit it.");
          } else {
            throw fetchError; // Rethrow other errors
          }
          setIsLoading(false);
          return;
        }
        
        if (!hackData) {
          setError("Hack not found.");
          setIsLoading(false);
          return;
        }

        // Authorization check: ensure current user is the hack author
        if (hackData.user_id !== session.user.id) {
            setError("You are not authorized to edit this hack.");
            setIsLoading(false);
            return;
        }
        
        setHackAuthorId(hackData.user_id);
        // Populate form fields with fetched hack data
        setTitle(hackData.title ? hackData.title.trim() : '');
        setDescription(hackData.description || '');
        setCurrentTags(hackData.tags ? hackData.tags.map(t => String(t).toLowerCase()) : []);

        // Store initial values for detecting unsaved changes
        setInitialTitle(hackData.title ? hackData.title.trim() : '');
        setInitialDescription(hackData.description || '');
        setInitialTags(hackData.tags ? hackData.tags.map(t => String(t).toLowerCase()) : []);

        // Parse location data if it exists (it's stored as a JSON string)
        if (hackData.location) {
          try {
            const parsedLocation = JSON.parse(hackData.location);
            setLocationAddress(parsedLocation.address || '');
            setInitialLocationAddress(parsedLocation.address || '');
            if (parsedLocation.address && parsedLocation.lat && parsedLocation.lng) {
              setSelectedLocation(parsedLocation);
              setInitialSelectedLocation(parsedLocation);
            } else {
              // Handle cases where location might only have an address
              setSelectedLocation({ address: parsedLocation.address || '', lat: null, lng: null });
              setInitialSelectedLocation({ address: parsedLocation.address || '', lat: null, lng: null });
            }
          } catch (e) {
            console.error("Error parsing location JSON from DB:", e);
            // Reset location fields if parsing fails
            setLocationAddress('');
            setInitialLocationAddress('');
            setSelectedLocation(null);
            setInitialSelectedLocation(null);
          }
        } else {
          // Reset location fields if no location data
          setLocationAddress('');
          setInitialLocationAddress('');
          setSelectedLocation(null);
          setInitialSelectedLocation(null);
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

  /**
   * @function hasUnsavedChanges
   * @description Checks if any of the form fields have been modified from their initial
   *   values. This is used to prompt the user before discarding changes.
   * @returns {boolean} True if there are unsaved changes, false otherwise.
   */
  const hasUnsavedChanges = () => {
    if (title !== initialTitle) return true;
    if (description !== initialDescription) return true;
    if (JSON.stringify(currentTags.sort()) !== JSON.stringify(initialTags.sort())) return true;
    // For location, check both address string and the selectedLocation object structure
    if (locationAddress !== initialLocationAddress) return true;
    if (JSON.stringify(selectedLocation) !== JSON.stringify(initialSelectedLocation)) return true;
    return false;
  };

  // -- Event Handlers --
  /**
   * @function handleCancel
   * @description Handles the click event for the 'Cancel' button. If there are unsaved
   *   changes, it shows a confirmation modal. Otherwise, it navigates back to the
   *   hack detail page.
   */
  const handleCancel = () => {
    // If there are unsaved changes, show a confirmation modal
    if (hasUnsavedChanges()) {
      setShowCancelConfirmModal(true);
    } else {
      router.push(`/hacks-page/${hackId}`);
    }
  };

  /**
   * @function confirmCancelAndRedirect
   * @description Confirms the cancellation of edits and redirects the user to the hack
   *   detail page. Hides the confirmation modal.
   */
  const confirmCancelAndRedirect = () => {
    setShowCancelConfirmModal(false);
    router.push(`/hacks-page/${hackId}`);
  };

  /**
   * @function cancelAndKeepEditing
   * @description Hides the cancel confirmation modal, allowing the user to continue
   *   editing.
   */
  const cancelAndKeepEditing = () => {
    setShowCancelConfirmModal(false);
  };

  /**
   * @function handleClear
   * @description Clears all form fields (title, description, tags, location) and resets
   *   any submission errors. It also forces a re-render of the LocationAutocomplete
   *   component if necessary.
   */
  const handleClear = () => {
    setTitle('');
    setDescription('');
    setCurrentTags([]);
    setLocationAddress('');
    setSelectedLocation(null);
    setSubmitError(null);
    // Increment key to force re-render of LocationAutocomplete component if needed
    setLocationKey(prevKey => prevKey + 1);
  };

  /**
   * @function handleSelectTag
   * @description Handles the selection or deselection of a tag. Adds the tag to the
   *   `currentTags` array if not present and under the `MAX_TAGS` limit, or removes it
   *   if already present.
   * @param {string} tagValueFromButton - The value of the tag selected/deselected.
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
          setSubmitError(`You can select a maximum of ${MAX_TAGS} tags.`);
          return prevLowercaseTags;
        }
      }
    });
  };
  
  /**
   * @function handleSelectLocation
   * @description Callback for the LocationAutocomplete component. Updates the
   *   `selectedLocation` and `locationAddress` states based on the user's selection.
   * @param {object|null} locationData - The location object from the autocomplete
   *   (containing address, lat, lng) or null if cleared.
   */
  const handleSelectLocation = (locationData) => {
    setSubmitError(null);
    if (locationData) {
      setSelectedLocation(locationData);
      setLocationAddress(locationData.address || '');
    } else {
      // Clear location if no data is provided (e.g., user clears the input)
      setSelectedLocation(null);
      setLocationAddress('');
    }
  };

  /**
   * @function handleSubmit
   * @description Handles the form submission for editing the hack. It performs
   *   validation, prepares the data (including location JSON), and makes an API call
   *   to Supabase to update the hack. Redirects to the hack detail page on success.
   * @async
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsLoading(true);

    const trimmedTitle = title.trim();
    // Basic form validation
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

    // Authorization check: ensure current user is the hack author
    if (currentUserId !== hackAuthorId) {
        setSubmitError("Authorization error. You cannot edit this hack.");
        setIsLoading(false);
        return;
    }

    let updatedLocationJson = null;
    // Prepare location data for Supabase
    // Case 1: Full location data (address, lat, lng) is available
    if (selectedLocation && selectedLocation.address && selectedLocation.lat !== null && selectedLocation.lng !== null) {
      updatedLocationJson = JSON.stringify({
        address: selectedLocation.address,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng
      });
    // Case 2: Only address is available from selectedLocation (lat/lng might be missing)
    } else if (selectedLocation && selectedLocation.address && (!selectedLocation.lat || !selectedLocation.lng)) {
      updatedLocationJson = JSON.stringify({ address: selectedLocation.address, lat: null, lng: null });
    // Case 3: No selectedLocation object, but there's a manually typed address
    } else if (!selectedLocation && locationAddress.trim()) {
        updatedLocationJson = JSON.stringify({ address: locationAddress.trim(), lat: null, lng: null });
    }

    try {
      // Update hack in Supabase
      const { data, error: updateError } = await clientDB
        .from('hacks')
        .update({ 
            title: trimmedTitle, 
            description, // Using original description as trim is handled by validation
            tags: currentTags,
            location: updatedLocationJson,
        })
        .eq('id', hackId)
        .eq('user_id', currentUserId); // Ensure only the author can update

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

  // -- Conditional Renders --
  // Display loading message if data is being fetched and title is not yet set.
  if (isLoading && !title) { 
    return <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center">Loading hack editor...</div>;
  }

  // Display error message if an error occurred during data fetching.
  if (error) {
    return <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center text-red-500">Error: {error}</div>;
  }
  
  // Display authorization error if the current user is not the hack author.
  if (hackAuthorId && currentUserId !== hackAuthorId) {
    return <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center text-red-500">Error: You are not authorized to edit this hack.</div>;
  }

  return (
    <div className="pb-6">
      {/* Main Content Area: Contains the sticky navbar and the form container */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Sticky top navigation bar */}
        <StickyNavbar />
        {/* Form Container: Houses the entire edit form */}
        <div className="bg-[#FDFAF5] p-4 rounded-lg border border-[#8B4C24]/30 pt-16">
          {/* Form Header: Title and Clear Form button */}
          <div className="flex justify-between items-start mb-1">
            <h1 className="text-2xl font-bold text-[#8B4C24]">Edit Hack</h1>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-gray-700 focus:outline-none px-2 py-1 rounded hover:bg-gray-100 transition-colors duration-150 ease-in-out whitespace-nowrap"
            >
              Clear Form
            </button>
          </div>
          <p className="text-xs text-gray-600 mb-6">* Indicates a required field</p>
          
          {/* Edit Form: Main form element for hack details */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input Section */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#6A401F] mb-1">
                Title*
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

            {/* Description Input Section */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[#6A401F] mb-1">
                Description*
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

            {/* Location Input Section with Autocomplete */}
            <div>
              <label className="block text-sm font-medium text-[#6A401F] mb-1">
                Location (Optional)
              </label>
              <LocationAutocomplete
                key={locationKey} // Key to re-mount component for clearing
                initialValue={locationAddress}
                onSelect={handleSelectLocation}
                placeholder="e.g., Library, Room SE06"
              />
            </div>

            {/* Tags Input Section */}
            <div>
              <label className="block text-sm font-medium text-[#6A401F] mb-1">
                Tags (select up to {MAX_TAGS})*
              </label>
              {/* Container for tag buttons */}
              <div className="mt-1 flex flex-wrap gap-2 p-2.5 border border-[#D1905A] rounded-lg shadow-sm bg-white min-h-[40px]">
                {/* Map through available tags to create buttons */}
                {tags.map(tag => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleSelectTag(tag)}
                    className={`py-2 px-4 rounded-full text-xs font-semibold focus:outline-none transition-all duration-200 ease-in-out whitespace-nowrap ${currentTags.includes(String(tag).toLowerCase())
                        ? 'bg-[#8B4C24] text-white hover:bg-[#7a421f]'
                        : 'bg-white text-[#8B4C24] hover:bg-gray-100 ring-1 ring-inset ring-[#D1905A]'}`}
                  >
                    {tag} {/* Display tag name */}
                  </button>
                ))}
              </div>
            </div>
          
           
            {/* Submit Error Display: Shows errors from form submission */}
            {submitError && <p className="text-sm text-red-600 mt-2">{submitError}</p>}

            {/* Action Buttons: Save Changes and Cancel */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#77A06B] hover:bg-[#668d5b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#77A06B] transition duration-150 ease-in-out disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="w-full flex justify-center py-3 px-4 border border-[#D1905A] rounded-lg shadow-sm text-sm font-medium text-[#8B4C24] bg-transparent hover:bg-[#F5E3C6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B4C24] transition duration-150 ease-in-out"
                disabled={isLoading}
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
      {/* Confirmation Modal for unsaved changes when cancelling */}
      <ConfirmCancelModal
        isOpen={showCancelConfirmModal}
        onConfirm={confirmCancelAndRedirect}
        onCancel={cancelAndKeepEditing}
      />
    </div>
  );
}