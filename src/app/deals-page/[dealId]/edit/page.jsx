'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { clientDB } from '@/supabaseClient';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import StickyNavbar from '@/components/StickyNavbar';

/**
 * EditDealPage.jsx
 * Loaf Life - Edit Deal Page
 * 
 * This page allows users to edit a deal.
 * Adapted from EditHackPage.jsx
 *
 * @author: Nathan O
 * @author https://gemini.google.com/app
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

export default function EditDealPage({ params }) {
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
        setTitle(dealData.title || '');
        setDescription(dealData.description || '');
        setPrice(dealData.price !== null ? dealData.price.toString() : ''); // Ensure price is a string for input

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
        setCurrentTags(dealData.tags || []);

      } catch (err) {
        console.error(`Error fetching deal ${dealId} for edit:`, err);
        setError(err.message || "An unexpected error occurred while fetching deal details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUserAndDeal();
  }, [dealId, router, supabase]);

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
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setSubmitError("Please enter a valid price (must be a non-negative number).");
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
          title,
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

  // Initial loading state before data is fetched
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
          <h1 className="text-3xl font-bold mb-6 text-[#8B4C24]">Edit Deal</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
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

            {/* Description Field */}
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

            {/* Price Field */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-[#6A401F] mb-1">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                step="0.01"
                min="0"
                placeholder="e.g., 4.99"
                className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm bg-white placeholder-gray-400 text-gray-900"
              />
            </div>

            {/* Location Field */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-[#6A401F] mb-1">
                Location (e.g. UBC Bookstore, Irving K. Barber Library)
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="Enter address or landmark"
                className="mt-1 block w-full px-4 py-2.5 border border-[#D1905A] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B4C24] focus:border-[#8B4C24] sm:text-sm bg-white placeholder-gray-400 text-gray-900"
              />
            </div>

            {/* Tags Field */}
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
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()} // Or router.push(`/deals-page/${dealId}`)
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B87333]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading} // Disable button when loading to prevent multiple submissions
                className="px-6 py-2.5 bg-[#8B4C24] text-white rounded-lg text-sm font-medium hover:bg-[#7a421f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B4C24] disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
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