/**
 * page.jsx (EditHackPage)
 * Loaf Life – Enables users to edit their created hacks.
 *
 * This page allows authenticated authors to modify their existing hacks.
 * It fetches hack data (title, description, tags, location), populates an
 * editable form, and handles updates. Integrates with Supabase for data
 * and Google Maps for location autocomplete.
 *
 * Features:
 * - Fetches and displays existing hack details for editing.
 * - Allows modification of title, description, tags, and location.
 * - Validates user input before submission.
 * - Provides unsaved changes confirmation.
 * - Utilizes location autocomplete for address input.
 * - Restricts editing access to the hack's author.
 *
 * Portions of logic and component structure assisted by Google Gemini 2.5 Flash.
 * Modified with assistance from Google Gemini 2.5 Flash.
 *
 * @author Nathan Oloresisimo
 * @author https://gemini.google.com/app
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

const MAX_TAGS = 5; 

export default function EditHackPage({ params }) {
  // -- State & Hooks --
  const resolvedParams = use(params);
  const hackId = resolvedParams.id;
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentTags, setCurrentTags] = useState([]);
  const [locationAddress, setLocationAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [hackAuthorId, setHackAuthorId] = useState(null);
  const [locationKey, setLocationKey] = useState(0);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);

  // State to store initial values for comparison
  const [initialTitle, setInitialTitle] = useState('');
  const [initialDescription, setInitialDescription] = useState('');
  const [initialTags, setInitialTags] = useState([]);
  const [initialLocationAddress, setInitialLocationAddress] = useState('');
  const [initialSelectedLocation, setInitialSelectedLocation] = useState(null);

  // -- Effects --
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

  // -- Helper Functions --
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
  const handleCancel = () => {
    // If there are unsaved changes, show a confirmation modal
    if (hasUnsavedChanges()) {
      setShowCancelConfirmModal(true);
    } else {
      router.push(`/hacks-page/${hackId}`);
    }
  };

  const confirmCancelAndRedirect = () => {
    setShowCancelConfirmModal(false);
    router.push(`/hacks-page/${hackId}`);
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
    // Increment key to force re-render of LocationAutocomplete component if needed
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
          setSubmitError(`You can select a maximum of ${MAX_TAGS} tags.`);
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
      // Clear location if no data is provided (e.g., user clears the input)
      setSelectedLocation(null);
      setLocationAddress('');
    }
  };

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
      {/* Main Content Area */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <StickyNavbar />
        {/* Form Container */}
        <div className="bg-[#FDFAF5] p-4 rounded-lg border border-[#8B4C24]/30 pt-16">
          {/* Form Header */}
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
          
          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
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

            {/* Description Input */}
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

            {/* Location Input */}
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

            {/* Tags Input */}
            <div>
              <label className="block text-sm font-medium text-[#6A401F] mb-1">
                Tags (select up to {MAX_TAGS})*
              </label>
              <div className="mt-1 flex flex-wrap gap-2 p-2.5 border border-[#D1905A] rounded-lg shadow-sm bg-white min-h-[40px]">
                {tags.map(tag => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleSelectTag(tag)}
                    className={`py-2 px-4 rounded-full text-xs font-semibold focus:outline-none transition-all duration-200 ease-in-out whitespace-nowrap ${currentTags.includes(String(tag).toLowerCase())
                        ? 'bg-[#8B4C24] text-white hover:bg-[#7a421f]'
                        : 'bg-white text-[#8B4C24] hover:bg-gray-100 ring-1 ring-inset ring-[#D1905A]'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          
           
            {/* Submit Error Display */}
            {submitError && <p className="text-sm text-red-600 mt-2">{submitError}</p>}

            {/* Action Buttons */}
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
        <Footer />
      </div>
      <BottomNav />
      {/* Confirmation Modal */}
      <ConfirmCancelModal
        isOpen={showCancelConfirmModal}
        onConfirm={confirmCancelAndRedirect}
        onCancel={cancelAndKeepEditing}
      />
    </div>
  );
}