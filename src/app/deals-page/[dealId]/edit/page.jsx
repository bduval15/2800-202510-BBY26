/**
 * File: src/app/deals-page/[dealId]/edit/page.jsx
 *
 * Loaf Life
 *   Allows authenticated users to edit details of their previously created deals.
 *   It fetches existing deal data, populates a form, and handles updates.
 *   Utilizes Next.js for routing and React for UI components.
 *   Integrates with Supabase for data fetching and updates.
 *
 * Authorship:
 *   @author Nathan O
 *   @author https://gemini.google.com/app (Assisted with code)
 */
'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { clientDB } from '@/supabaseClient';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import StickyNavbar from '@/components/StickyNavbar';
import LocationAutoComplete from '@/components/mapComponents/LocationAutoComplete';
import { tags as availableTags } from '@/lib/tags';
import ConfirmCancelModal from '@/components/ConfirmCancelModal';


// Maximum number of tags a user can select for a deal.
const MAX_TAGS = 5;

/**
 * @function EditDealPage
 * @description This page component allows users to edit an existing deal.
 *   It fetches the deal's current data, populates a form with this data,
 *   and allows the user to modify fields like title, description, price,
 *   location, and tags. It includes input validation and a confirmation
 *   modal for unsaved changes if the user attempts to navigate away or cancel.
 * @param {{ params: { dealId: string } }} props - The component props,
 *   containing the dealId from the route.
 * @returns {JSX.Element} The JSX for the edit deal page.
 */
export default function EditDealPage({ params }) {
  // -- State Management & Hooks --
  // Resolved route parameters, primarily used to get `dealId`.
  const resolvedParams = use(params);
  // The ID of the deal being edited.
  const dealId = resolvedParams.dealId;
  // Next.js router instance for navigation.
  const router = useRouter();
  // Supabase client instance for database interactions.
  const supabase = clientDB; 

  // State for the deal's title.
  const [title, setTitle] = useState('');
  // State for the deal's description.
  const [description, setDescription] = useState('');
  // State for the deal's price.
  const [price, setPrice] = useState('');
  // State for the deal's location (address string).
  const [location, setLocation] = useState('');
  // State for the currently selected tags for the deal.
  const [currentTags, setCurrentTags] = useState([]);
  // State to indicate if data is currently being loaded.
  const [isLoading, setIsLoading] = useState(true);
  // State for storing any general error messages during data fetching.
  const [error, setError] = useState(null);
  // State for storing form submission-specific error messages.
  const [submitError, setSubmitError] = useState(null);
  // State for storing the ID of the currently authenticated user.
  const [currentUserId, setCurrentUserId] = useState(null);
  // State for storing the ID of the author of the deal.
  const [dealAuthorId, setDealAuthorId] = useState(null);
  // State to force re-render of LocationAutoComplete component.
  const [locationKey, setLocationKey] = useState(0);
  // State to control the visibility of the cancel confirmation modal.
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);

  // Initial state for detecting unsaved changes: Title.
  const [initialTitle, setInitialTitle] = useState('');
  // Initial state for detecting unsaved changes: Description.
  const [initialDescription, setInitialDescription] = useState('');
  // Initial state for detecting unsaved changes: Price.
  const [initialPrice, setInitialPrice] = useState('');
  // Initial state for detecting unsaved changes: Location.
  const [initialLocation, setInitialLocation] = useState('');
  // Initial state for detecting unsaved changes: Tags.
  const [initialTags, setInitialTags] = useState([]);

  // -- Effects --
  /**
   * useEffect: Fetch Current User and Deal Data
   * @description Fetches the current authenticated user's session and the details
   *   of the deal to be edited. It performs authorization checks to ensure
   *   the current user is the author of the deal. Populates form fields
   *   with existing deal data and sets initial values for unsaved changes detection.
   *   Redirects to login if user is not authenticated. Sets loading and error states.
   */
  useEffect(() => {
    const fetchCurrentUserAndDeal = async () => {
      setIsLoading(true);
      setError(null);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        setError('Error fetching user session.');
        console.error('Error fetching session:', sessionError);
        setIsLoading(false);
        return;
      }
      if (session && session.user) {
        setCurrentUserId(session.user.id);
      } else {
        router.push('/login'); // Redirect to login if not authenticated
        return;
      }

      if (!dealId) {
        setError("Deal ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const { data: dealData, error: fetchError } = await supabase
          .from('deals')
          .select('title, description, price, location, tags, user_id')
          .eq('id', dealId)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError("Deal not found or you don't have permission to edit it.");
          } else {
            throw fetchError;
          }
          setIsLoading(false);
          return;
        }

        if (!dealData) {
          setError("Deal not found.");
          setIsLoading(false);
          return;
        }

        // Authorization check
        if (dealData.user_id !== session.user.id) {
          setError("You are not authorized to edit this deal.");
          setIsLoading(false);
          return;
        }

        setDealAuthorId(dealData.user_id);
        setTitle(dealData.title ? dealData.title.trim() : '');
        setDescription(dealData.description || '');
        setPrice(dealData.price !== null ? dealData.price.toString() : ''); // Ensure price is a string for input

        // Set initial values for comparison
        setInitialTitle(dealData.title ? dealData.title.trim() : '');
        setInitialDescription(dealData.description || '');
        setInitialPrice(dealData.price !== null ? dealData.price.toString() : '');

        // Handle location: could be string or object
        let displayLocation = '';
        if (dealData.location) {
          if (typeof dealData.location === 'string') {
            try {
              const parsedLoc = JSON.parse(dealData.location);
              displayLocation = parsedLoc.address || dealData.location;
            } catch (e) {
              displayLocation = dealData.location; // If not JSON, use as is
            }
          } else if (typeof dealData.location === 'object' && dealData.location.address) {
            displayLocation = dealData.location.address;
          }
        }
        setLocation(displayLocation);
        setCurrentTags(dealData.tags ? dealData.tags.map(t => String(t).toLowerCase()) : []); // Normalize to lowercase

        setInitialLocation(displayLocation); // Store initial location
        setInitialTags(dealData.tags ? dealData.tags.map(t => String(t).toLowerCase()) : []); // Store initial tags

      } catch (err) {
        console.error(`Error fetching deal ${dealId} for edit:`, err);
        setError(err.message || "An unexpected error occurred while fetching deal details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUserAndDeal();
  }, [dealId, router, supabase]);

  // -- Helper Functions --
  /**
   * @function hasUnsavedChanges
   * @description Checks if any of the form fields (title, description, price,
   *   location, tags) have been modified from their initial values.
   * @returns {boolean} True if there are unsaved changes, false otherwise.
   */
  const hasUnsavedChanges = () => {
    if (title !== initialTitle) return true;
    if (description !== initialDescription) return true;
    if (price !== initialPrice) return true;
    if (location !== initialLocation) return true;
    if (JSON.stringify(currentTags.sort()) !== JSON.stringify(initialTags.sort())) return true;
    return false;
  };

  // -- Event Handlers --
  /**
   * @function handleCancel
   * @description Handles the cancel button click. If there are unsaved changes,
   *   it shows a confirmation modal. Otherwise, it navigates back to the deal
   *   detail page.
   */
  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      setShowCancelConfirmModal(true);
    } else {
      router.push(`/deals-page/${dealId}`);
    }
  };

  /**
   * @function confirmCancelAndRedirect
   * @description Confirms the cancellation of edits (when unsaved changes exist)
   *   and redirects the user to the deal detail page. Hides the confirmation modal.
   */
  const confirmCancelAndRedirect = () => {
    setShowCancelConfirmModal(false);
    router.push(`/deals-page/${dealId}`);
  };

  /**
   * @function cancelAndKeepEditing
   * @description Dismisses the cancel confirmation modal, allowing the user
   *   to continue editing the deal.
   */
  const cancelAndKeepEditing = () => {
    setShowCancelConfirmModal(false);
  };

  /**
   * @function handleClear
   * @description Resets all form fields to their empty/default states, clears
   *   any submission errors, and forces a re-render of the location input.
   */
  const handleClear = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setLocation('');
    setCurrentTags([]);
    setSubmitError(null);
    setLocationKey(prevKey => prevKey + 1);
  };

  /**
   * @function handleSelectTag
   * @description Toggles the selection of a tag. If the tag is already selected,
   *   it's removed. If not, it's added, provided the maximum tag limit (MAX_TAGS)
   *   is not exceeded. Clears submission errors.
   * @param {string} tagValueFromButton - The value of the tag to be toggled.
   */
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

  /**
   * @function handleSubmit
   * @description Handles the form submission for updating the deal.
   *   Performs input validation for required fields (title, description, tags, price, location).
   *   Double-checks user authorization. On successful validation, it prepares the data
   *   (e.g., trimming title, parsing price, stringifying location) and sends an update
   *   request to Supabase. Navigates to the deal detail page on success or displays an error.
   * @async
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsLoading(true);

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
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0 || parsedPrice > 1000000) {
      setSubmitError("Price must be a valid number between 0 and 1,000,000.");
      setIsLoading(false);
      return;
    }
    if (!location.trim()) {
      setSubmitError("Location cannot be empty.");
      setIsLoading(false);
      return;
    }

    // Double check authorization before submitting
    if (currentUserId !== dealAuthorId) {
      setSubmitError("Authorization error. You cannot edit this deal.");
      setIsLoading(false);
      return;
    }

    // Prepare location data (store as JSON string with address field)
    const locationToStore = JSON.stringify({ address: location });

    try {
      const { error: updateError } = await supabase
        .from('deals')
        .update({
          title: trimmedTitle,
          description,
          price: parsedPrice,
          location: locationToStore,
          tags: currentTags,
        })
        .eq('id', dealId)
        .eq('user_id', currentUserId); // Ensure only the author can update

      if (updateError) {
        throw updateError;
      }

      router.push(`/deals-page/${dealId}`); // Redirect to the deal detail page
    } catch (err) {
      console.error('Error updating deal:', err);
      setSubmitError(err.message || "Failed to update deal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // -- Conditional Rendering: Loading and Error States --
  if (isLoading && !title && !error) {
    return <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center">Loading deal editor...</div>;
  }

  // Error display if initial data fetching failed
  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center text-red-500">
        {/* Sticky navigation bar */}
        <StickyNavbar />
        <div className="pt-16">
          Error: {error}
        </div>
        {/* Page footer */}
        <Footer />
        {/* Bottom navigation bar for mobile */}
        <BottomNav />
      </div>
    );
  }

  // Specific authorization error message if IDs don't match after fetching
  if (dealAuthorId && currentUserId !== dealAuthorId) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center text-red-500">
        {/* Sticky navigation bar */}
        <StickyNavbar />
        <div className="pt-16">
          Error: You are not authorized to edit this deal.
        </div>
        {/* Page footer */}
        <Footer />
        {/* Bottom navigation bar for mobile */}
        <BottomNav />
      </div>
    );
  }

  // Main page structure
  return (
    <div className="pb-6">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Sticky navigation bar */}
        <StickyNavbar />
        {/* Form container with custom styling */}
        <div className="bg-[#FDFAF5] p-4 rounded-lg border border-[#8B4C24]/30 pt-16">
          {/* Header section for the form */}
          <div className="flex justify-between items-start mb-1">
            <h1 className="text-2xl font-bold text-[#8B4C24]">Edit Deal</h1>
            {/* Button to clear all form fields */}
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-gray-700 focus:outline-none px-2 py-1 rounded hover:bg-gray-100 transition-colors duration-150 ease-in-out whitespace-nowrap"
            >
              Clear Form
            </button>
          </div>
          {/* Subtext indicating required fields */}
          <p className="text-xs text-gray-600 mb-6">* Indicates a required field</p>

          {/* Edit Deal Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
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

            {/* Description Field */}
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

            {/* Price Field */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-[#6A401F] mb-1">
                Price (CAD)*
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 10.99"
                step="0.01"
                min="0"
                max="1000000"
                className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm bg-white placeholder-gray-400 text-gray-900"
                required
              />
            </div>

            {/* Location Field */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-[#6A401F] mb-1">
                Location*
              </label>
              {/* Autocomplete component for location input */}
              <LocationAutoComplete
                key={locationKey}
                initialValue={location}
                onSelect={({ address }) => setLocation(address)}
                placeholder="Enter address or landmark"
              />
            </div>

            {/* Tags Field */}
            <div>
              <label className="block text-sm font-medium text-[#6A401F] mb-1">
                Tags (select up to {MAX_TAGS})*
              </label>
              {/* Container for tag selection buttons */}
              <div className="mt-1 flex flex-wrap gap-2 p-2.5 border border-[#D1905A] rounded-lg shadow-sm bg-white min-h-[40px]">
                {/* Iterate over available tags to create selection buttons */}
                {availableTags.map(tag => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleSelectTag(tag)}
                    className={`py-2 px-4 rounded-full text-xs font-semibold focus:outline-none transition-all duration-200 ease-in-out whitespace-nowrap ${currentTags.includes(String(tag).toLowerCase()) // Compare lowercase
                        ? 'bg-[#8B4C24] text-white hover:bg-[#7a421f]'
                        : 'bg-white text-[#8B4C24] hover:bg-gray-100 ring-1 ring-inset ring-[#D1905A]'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Display submission error messages, if any */}
            {submitError && (
              <p className="text-sm text-red-600">Error: {submitError}</p>
            )}

            {/* Submit and Cancel Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#77A06B] hover:bg-[#668d5b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#77A06B] disabled:opacity-50 transition duration-150 ease-in-out"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              {/* Cancel button */}
              <button
                type="button"
                onClick={handleCancel}
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
      {/* Modal to confirm cancellation if there are unsaved changes */}
      <ConfirmCancelModal
        isOpen={showCancelConfirmModal}
        onConfirm={confirmCancelAndRedirect}
        onCancel={cancelAndKeepEditing}
      />
    </div>
  );
} 