/**
 * page.jsx (HackDetailPage)
 *
 * Loaf Life
 *   Displays detailed information for a specific hack, including title, description,
 *   tags, location, author, and creation timestamp. Allows authors to edit or delete
 *   their posts. Users can vote on or bookmark hacks. Includes a comment section.
 *   Utilizes Next.js for routing and React for UI. Interacts with Supabase for data.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author https://gemini.google.com/app (for portions of logic and structure)
 */

'use client';

import React, { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import BookmarkButton from '@/components/buttons/Bookmark';
import VoteButtons from '@/components/buttons/VoteButtons';
import { ArrowLeftIcon, PencilIcon, TrashIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import Tag from '@/components/Tag';
import BottomNav from '@/components/BottomNav';
import CommentSection from '@/components/sections/CommentSection';
import StickyNavbar from '@/components/StickyNavbar';
import { clientDB } from '@/supabaseClient';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import  toTitleCase from '@/utils/toTitleCase';
import ShowOnMapButton from '@/components/mapComponents/ShowOnMapButton';
import { formatTimeAgo } from '@/utils/formatTimeAgo';

/**
 * @function HackDetailPage
 * @description Main component for displaying the details of a specific hack.
 *   It fetches and renders the hack's content, handles user interactions like voting
 *   and bookmarking, and provides author-specific actions like editing or deleting.
 * @param {object} params - Contains the route parameters, specifically the hack ID.
 * @returns {JSX.Element} The UI for the hack detail page.
 */
export default function HackDetailPage({ params }) {
  // -- State & Hooks --
  const resolvedParams = use(params); 
  const hackId = resolvedParams.id;
  // State for the hack data fetched from the database.
  const [hack, setHack] = useState(null);
  // State to indicate if data is currently being loaded.
  const [isLoading, setIsLoading] = useState(true);
  // State to store any error messages during data fetching.
  const [error, setError] = useState(null);
  // State for the ID of the currently logged-in user.
  const [currentUserId, setCurrentUserId] = useState(null);
  // State to control the visibility of the options menu (edit/delete).
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  // State to control the visibility of the delete confirmation modal.
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // State for storing the latitude and longitude of the hack's location.
  const [locationCoords, setLocationCoords] = useState(null);
  const router = useRouter();
  const optionsMenuRef = useRef(null);

  // -- Effects --
  /**
   * useEffect: Fetch Current User ID
   * @description Fetches the current user's ID from the session on component mount.
   *   This is used to determine if the user is the author of the hack for edit/delete
   *   permissions and for voting/bookmarking functionality.
   * @async
   */
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { session }, error: sessionError } = await clientDB.auth.getSession();
      if (sessionError) {
        console.error('Error fetching session:', sessionError);
        return;
      }
      if (session && session.user) {
        setCurrentUserId(session.user.id);
      }
    };
    fetchCurrentUser();
  }, []);

  /**
   * useEffect: Fetch Hack Details
   * @description Fetches the details of the specific hack from Supabase when the hackId
   *   changes. It populates the `hack` state with the fetched data and extracts location
   *   coordinates if available.
   * @async
   */
  useEffect(() => {
    if (!hackId) {
      setIsLoading(false);
      setError("Hack ID is missing.");
      return;
    }

    const fetchHackDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data: hackData, error: fetchError } = await clientDB
          .from('hacks')
          .select('id, title, description, created_at, user_id, tags, upvotes, downvotes, location, user_profiles(name)')
          .eq('id', hackId)
          .single();

        if (fetchError) {
          // Handle specific Supabase error for 'item not found' (PostgREST error code)
          if (fetchError.code === 'PGRST116') {
            setError("Hack not found.");
            setHack(null);
          } else {
            throw fetchError; // Re-throw other errors
          }
        } else if (!hackData) {
          setError("Hack not found.");
        } else {
          setHack(hackData);
          // Initialize latitude and longitude
          let parsedLat = null;
          let parsedLng = null;

          // Process location data if available
          if (hackData.location) {
            let tempCoords = null;
            // Case 1: Location is a JSON string
            if (typeof hackData.location === 'string') {
              try {
                const parsedJson = JSON.parse(hackData.location);
                if (parsedJson && typeof parsedJson.lat === 'number' && typeof parsedJson.lng === 'number') {
                  tempCoords = { lat: parsedJson.lat, lng: parsedJson.lng };
                }
              } catch (e) {
                // Log warning if JSON parsing fails
                console.warn("Failed to parse location JSON for hack detail:", hackData.location, e);
              }
            // Case 2: Location is an object (already parsed or structured differently)
            } else if (typeof hackData.location === 'object' && hackData.location.address) {
              if (typeof hackData.location.lat === 'number' && typeof hackData.location.lng === 'number') {
                tempCoords = { lat: hackData.location.lat, lng: hackData.location.lng };
              }
            }
            // Assign coordinates if successfully parsed
            if (tempCoords) {
              parsedLat = tempCoords.lat;
              parsedLng = tempCoords.lng;
            }
          }

          // Set location coordinates state if both lat and lng are valid
          if (parsedLat !== null && parsedLng !== null) {
            setLocationCoords({ lat: parsedLat, lng: parsedLng });
          } else {
            setLocationCoords(null); // Reset if coordinates are not valid
          }
        }
      } catch (err) {
        setError(err.message);
        console.error(`Error fetching hack ${hackId}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHackDetails();
  }, [hackId]);

  /**
   * useEffect: Handle Click Outside Options Menu
   * @description Closes the options menu (edit/delete) if a click occurs outside of it.
   *   This enhances user experience by providing an intuitive way to dismiss the menu.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is outside the options menu, close it
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setIsOptionsMenuOpen(false);
      }
    };
    if (isOptionsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    // Cleanup event listener on component unmount or when menu closes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOptionsMenuOpen]);

  // -- Conditional Renders --
  if (isLoading) {
    return <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center">Loading hack details...</div>;
  }

  if (error) {
    return <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center text-red-500">Error: {error}</div>;
  }

  if (!hack) {
    return <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-center">Hack not found.</div>;
  }

  // -- Handlers --
  /**
   * @function handleDelete
   * @description Initiates the hack deletion process by closing the options menu
   *   and opening the delete confirmation modal.
   */
  const handleDelete = async () => {
    setIsOptionsMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  /**
   * @function confirmDeleteHack
   * @description Confirms and executes the deletion of the hack from Supabase.
   *   Redirects to the main hacks page on successful deletion, or shows an alert on error.
   * @async
   */
  const confirmDeleteHack = async () => {
    setIsDeleteModalOpen(false);
    try {
      const { error: deleteError } = await clientDB
        .from('hacks')
        .delete()
        .eq('id', hackId);

      if (deleteError) {
        throw deleteError;
      }

      alert('Hack deleted successfully!');
      router.push('/hacks-page');
    } catch (err) {
      console.error('Error deleting hack:', err);
      alert(`Error deleting hack: ${err.message}`);
    }
  };

  return (
    <div className="pb-6">
      {/* Main Content Area: Contains sticky navbar and hack details card */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Sticky top navigation bar */}
        <StickyNavbar />
        {/* Hack Details Card: Contains all information about the hack */}
        <div className="bg-[#FDFAF5] p-4 rounded-lg border border-[#8B4C24]/30 pt-16">
          {/* Header: Back Button and Options Menu Button */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => router.back()}
              className="bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] hover:bg-[#EADDCA] px-3 py-1.5 rounded-lg shadow-md"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>

            {/* Options Menu Button and Dropdown - visible only to the author */}
            {hack && currentUserId && hack.user_id === currentUserId && (
              <div className="relative" ref={optionsMenuRef}>
                <button
                  onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
                  className="bg-[#F5EFE6] hover:bg-[#EADDCA] text-[#A0522D] border-2 border-[#A0522D] p-2 rounded-lg shadow-md"
                  aria-label="Options"
                >
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
                {isOptionsMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    {/* Edit Hack Button */}
                    <button
                      onClick={() => { router.push(`/hacks-page/${hackId}/edit`); setIsOptionsMenuOpen(false); }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <PencilIcon className="h-5 w-5 mr-2" /> Edit
                    </button>
                    {/* Delete Hack Button */}
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5 mr-2" /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hack Title */}
          <h1 className="text-3xl font-bold mb-2 text-[#8B4C24]">{toTitleCase(hack.title)}</h1>

          {/* Tags Display */}
          {hack.tags && hack.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {/* Render each tag associated with the hack */}
              {hack.tags.map((tag, index) => (
                <Tag key={index} label={toTitleCase(tag)} />
              ))}
            </div>
          )}

          {/* Location Display */}
          {hack.location &&
            (() => {
              let displayLocation;
              try {
                const parsedLocation = JSON.parse(hack.location);
                displayLocation = parsedLocation.address;
              } catch (e) {
                // If parsing fails or address is not found, location won't be displayed
                return null;
              }
              // Only render the location div if displayLocation is truthy
              if (displayLocation) {
                return (
                  <div className="mb-6 text-base text-[#8B4C24]">
                    <p><span className="font-bold">📍 Location:</span> {displayLocation}</p>
                  </div>
                );
              }
              return null;
            })()
          }

          {/* Description Section */}
          <div className="mb-6">
            <p className="text-[#8B4C24]">{hack.description}</p>
          </div>

          {/* Author and Timestamp: Displays author name and time since creation */}
          <p className="text-sm text-[#8B4C24]/80 mb-8">
            By {hack.user_profiles && hack.user_profiles.name ? hack.user_profiles.name : 'Unknown'} - {formatTimeAgo(hack.created_at)}
          </p>

          {/* Vote and Bookmark Buttons Row */}
          <div className="flex items-center mb-6">
            {/* Vote buttons component for upvoting/downvoting */}
            <VoteButtons
              itemId={hack.id}
              itemType="hacks"
              upvotes={hack.upvotes || 0}
              downvotes={hack.downvotes || 0}
              userId={currentUserId} />
            {/* Show on Map button, visible if location coordinates are available */}
            {locationCoords && (
                          <ShowOnMapButton
                            id={hack.id}
                            children="Show on Map"
                          />
                        )}
            {/* Bookmark button component */}
            <BookmarkButton hackId={hack.id} />
          </div>
        </div>
        {/* Comment Section: For user discussions related to the hack */}
        <CommentSection entityId={hack.id} entityType="hack" />
        {/* Page Footer */}
        <Footer />
      </div>
      {/* Bottom Navigation Bar for mobile */}
      <BottomNav />
      {/* Confirm Delete Modal: Asks for confirmation before deleting a hack */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteHack}
        itemName="hack"
      />
    </div>
  );
}
