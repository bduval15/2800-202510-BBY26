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

/**
 * EditDealPage.jsx
 * Loaf Life - Edit Deal Page
 * 
 * This page allows authenticated users to edit the details of a deal they
 * previously created. It fetches existing deal data, populates a form,
 * and allows updates to fields like title, description, price, location,
 * and tags. Includes input validation and a confirmation modal for
 * unsaved changes if the user attempts to cancel.
 * 
 * Adapted from 'Edit Hack Page'
 *
 * Written with assistance from Google Gemini 2.5
 * 
 * @author: Nathan O
 * @author: https://gemini.google.com/app
 */

const MAX_TAGS = 5;

export default function EditDealPage({ params }) {
  // -- State Management & Hooks --
  const resolvedParams = use(params);
  const dealId = resolvedParams.dealId;
  const router = useRouter();
  const supabase = clientDB; 

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [currentTags, setCurrentTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [dealAuthorId, setDealAuthorId] = useState(null);
  const [locationKey, setLocationKey] = useState(0);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);

  // Initial state for unsaved changes detection
  const [initialTitle, setInitialTitle] = useState('');
  const [initialDescription, setInitialDescription] = useState('');
  const [initialPrice, setInitialPrice] = useState('');
  const [initialLocation, setInitialLocation] = useState('');
  const [initialTags, setInitialTags] = useState([]);

  // -- Effects --
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
  const hasUnsavedChanges = () => {
    if (title !== initialTitle) return true;
    if (description !== initialDescription) return true;
    if (price !== initialPrice) return true;
    if (location !== initialLocation) return true;
    if (JSON.stringify(currentTags.sort()) !== JSON.stringify(initialTags.sort())) return true;
    return false;
  };

  // -- Event Handlers --
  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      setShowCancelConfirmModal(true);
    } else {
      router.push(`/deals-page/${dealId}`);
    }
  };

  const confirmCancelAndRedirect = () => {
    setShowCancelConfirmModal(false);
    router.push(`/deals-page/${dealId}`);
  };

  const cancelAndKeepEditing = () => {
    setShowCancelConfirmModal(false);
  };

  const handleClear = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setLocation('');
    setCurrentTags([]);
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

  // Error display
  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center text-red-500">
        <StickyNavbar />
        <div className="pt-16">
          Error: {error}
        </div>
        <Footer />
        <BottomNav />
      </div>
    );
  }

  // Specific authorization error message if IDs don't match after fetching
  if (dealAuthorId && currentUserId !== dealAuthorId) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center text-red-500">
        <StickyNavbar />
        <div className="pt-16">
          Error: You are not authorized to edit this deal.
        </div>
        <Footer />
        <BottomNav />
      </div>
    );
  }

  
  return (
    <div className="pb-6">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <StickyNavbar />
        <div className="bg-[#FDFAF5] p-4 rounded-lg border border-[#8B4C24]/30 pt-16">
          <div className="flex justify-between items-start mb-1">
            <h1 className="text-2xl font-bold text-[#8B4C24]">Edit Deal</h1>
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
              <div className="mt-1 flex flex-wrap gap-2 p-2.5 border border-[#D1905A] rounded-lg shadow-sm bg-white min-h-[40px]">
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

            {submitError && (
              <p className="text-sm text-red-600">Error: {submitError}</p>
            )}

            {/* Submit and Cancel Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#77A06B] hover:bg-[#668d5b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#77A06B] disabled:opacity-50 transition duration-150 ease-in-out"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
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