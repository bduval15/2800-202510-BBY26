/**
 * page.jsx (EventDetailPage)
 *
 * Loaf Life
 *   Displays detailed information for a specific event. Fetches and displays details for a
 *   specific event from Supabase, identified by an ID in the URL. Shows title, description,
 *   location, dates, tags, and author. Authenticated creators can edit or delete their
 *   events. Users can vote on and bookmark events. Utilizes Next.js and React. Integrates
 *   with Supabase for data fetching and user interactions.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author Conner Ponton
 *   @author https://gemini.google.com/app (Assisted with code)
 *   @author https://chatgpt.com (Assisted with code)
 *
 * Main Component:
 *   @function EventDetailPage
 *   @description Renders the detailed view of a specific event. Fetches event data from
 *                Supabase based on `eventId` from params. Displays event title, description,
 *                location (with map option), dates, tags, author, and interaction buttons
 *                (vote, bookmark). Allows event creators to edit or delete their event.
 *                Includes a comment section.
 *   @param {object} params - The parameters passed to the page, containing `eventId`.
 *   @returns {JSX.Element} The rendered event detail page.
 */

'use client';

import React, { useState, useEffect, useRef, use } from 'react';
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
import ShowOnMapButton from '@/components/mapComponents/ShowOnMapButton';
import { formatTimeAgo } from '@/utils/formatTimeAgo';
import toTitleCase from '@/utils/toTitleCase';

export default function EventDetailPage({ params }) {
  // -- State & Hooks --
  // Resolved event ID from URL parameters.
  const resolvedParams = use(params);
  // Event ID from resolved parameters.
  const eventId = resolvedParams.eventId;
  // State for the fetched event object.
  const [event, setEvent] = useState(null);
  // State to manage loading indicator for event data fetching.
  const [isLoading, setIsLoading] = useState(true);
  // State for displaying errors during data fetching.
  const [error, setError] = useState(null);
  // State for the current authenticated user's ID.
  const [currentUserId, setCurrentUserId] = useState(null);
  // State to control visibility of the event options menu (edit/delete).
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  // State to control visibility of the delete confirmation modal.
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // State for the event's location coordinates (lat/lng) for map display.
  const [locationCoords, setLocationCoords] = useState(null);
  // Next.js router instance for navigation.
  const router = useRouter();
  // Ref for the options menu dropdown to detect outside clicks.
  const optionsMenuRef = useRef(null);

  // -- Effects --
  /**
   * useEffect: Fetch Current User
   * @description Fetches the current user's session from Supabase to get their ID. Sets the
   *              `currentUserId` state. Runs once on component mount.
   */
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { session }, error: sessionError } = await clientDB.auth.getSession();
      if (sessionError) {
        console.error('Error fetching session:', sessionError);
        return;
      }
      if (session?.user) setCurrentUserId(session.user.id);
    };
    fetchCurrentUser();
  }, []);

  /**
   * useEffect: Fetch Event Details
   * @description Fetches detailed information for the specific event from Supabase using the
   *              `eventId`. It selects various fields including user profile name. Populates
   *              the `event` state and `locationCoords`. Handles loading and error states.
   *              Runs when `eventId` changes.
   * @async
   */
  useEffect(() => {
    if (!eventId) {
      setIsLoading(false);
      setError("Event ID is missing.");
      return;
    }

    const fetchEventDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: eventData, error: fetchError } = await clientDB
          .from('events')  
          .select(
            'id, title, description, location, created_at, user_id, tags, upvotes, downvotes, user_profiles(name), start_date, end_date'
          )
          .eq('id', eventId)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError("Event not found.");
            setEvent(null);
          } else {
            throw fetchError;
          }
        } else if (!eventData) {
          setError("Event not found.");
        } else {
          setEvent(eventData);
          // Parse location for lat/lng
          if (eventData.location) {
            let parsedLat = null;
            let parsedLng = null;
            try {
              const parsedLocation = JSON.parse(eventData.location);
              if (parsedLocation && typeof parsedLocation.lat === 'number' && typeof parsedLocation.lng === 'number') {
                parsedLat = parsedLocation.lat;
                parsedLng = parsedLocation.lng;
              }
            } catch (e) {
              console.warn("Failed to parse location JSON for event detail:", eventData.location, e);
              // If parsing fails, lat/lng will remain null, and button won't show, which is fine.
            }
            if (parsedLat !== null && parsedLng !== null) {
              setLocationCoords({ lat: parsedLat, lng: parsedLng });
            } else {
              setLocationCoords(null);
            }
          } else {
            setLocationCoords(null);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error(`Error fetching event ${eventId}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  /**
   * useEffect: Close Options Menu on Outside Click
   * @description Adds an event listener to detect clicks outside the options menu. If a click
   *              occurs outside, it closes the menu. Runs when `isOptionsMenuOpen` changes.
   */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(e.target)) {
        setIsOptionsMenuOpen(false);
      }
    };
    if (isOptionsMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOptionsMenuOpen]);

  // -- Conditional Renders --
  // Loading state while event details are being fetched.
  if (isLoading) {
    return <div className="max-w-md mx-auto px-4 py-8 text-center text-lg">Loading event details...</div>;
  }

  // Error state if data fetching failed.
  if (error) {
    return <div className="max-w-md mx-auto px-4 py-8 text-center text-red-500 text-lg">Error: {error}</div>;
  }

  // State if event is not found after fetching attempt.
  if (!event) {
    return <div className="max-w-md mx-auto px-4 py-8 text-center text-lg">Event not found.</div>;
  }

  /**
   * @function formatDateMMDDYYYY
   * @description Formats a date string (YYYY-MM-DD) into MM/DD/YYYY format.
   *              Ensures the date is interpreted in the local timezone.
   * @param {string} dateString - The date string to format.
   * @returns {string|null} The formatted date string or null if input is invalid.
   */
  const formatDateMMDDYYYY = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString + 'T00:00:00'); // Ensure date is interpreted as local
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // -- Handlers --
  /**
   * @function handleDelete
   * @description Opens the delete confirmation modal and closes the options menu.
   */
  const handleDelete = () => {
    setIsOptionsMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  /**
   * @function confirmDeleteEvent
   * @description Deletes the current event from Supabase. Closes the delete modal.
   *              Shows an alert on success/failure and navigates to the events page on success.
   * @async
   */
  const confirmDeleteEvent = async () => {
    setIsDeleteModalOpen(false);
    try {
      const { error: deleteError } = await clientDB
        .from('events')
        .delete()
        .eq('id', eventId);

      if (deleteError) throw deleteError;

      alert('Event deleted successfully!');
      router.push('/events-page');
    } catch (err) {
      console.error('Error deleting event:', err);
      alert(`Error deleting event: ${err.message}`);
    }
  };

  return (
    // Main container with bottom padding
    <div className="pb-6">
      {/* Centered content container */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Sticky top navigation bar */}
        <StickyNavbar />

        {/* Main event details card */}
        <div className="bg-[#FDFAF5] p-4 rounded-lg border border-[#8B4C24]/30 pt-16 relative">
          {/* Header section with back button and options menu */}
          <div className="flex justify-between items-center mb-4">
            {/* Back button to navigate to the previous page */}
            <button
              onClick={() => router.back()}
              className="bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] hover:bg-[#EADDCA] px-3 py-1.5 rounded-lg shadow-md"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>

            {/* Options menu (Edit/Delete), visible only to event author */}
            {event.user_id === currentUserId && (
              <div className="relative" ref={optionsMenuRef}>
                {/* Button to toggle options menu visibility */}
                <button
                  onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
                  className="bg-[#F5EFE6] hover:bg-[#EADDCA] text-[#A0522D] border-2 border-[#A0522D] p-2 rounded-lg shadow-md"
                  aria-label="Options"
                >
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
                {/* Options menu dropdown */}
                {isOptionsMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                    {/* Edit event button */}
                    <button
                      onClick={() => {
                        router.push(`/events-page/${eventId}/edit`);
                        setIsOptionsMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <PencilIcon className="h-5 w-5 mr-2" /> Edit
                    </button>
                    {/* Delete event button */}
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <TrashIcon className="h-5 w-5 mr-2" /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Event Title */}
          <h1 className="text-3xl font-bold mb-2 text-[#8B4C24]">{toTitleCase(event.title)}</h1>

          {/* Event Tags section */}
          <div className="mb-6 flex flex-wrap gap-2">
            {/* Map through event tags and render Tag component for each */}
            {event.tags?.map((tag, i) => (
              <Tag key={i} label={toTitleCase(tag)} />
            ))}
          </div>
        
          {/* Event Location. Parses location JSON string. */}
          <p className="text-base mb-4 text-[#8B4C24]">
            <span className="font-bold">📍 Location:</span> {
              (() => {
                try {
                  const parsedLocation = JSON.parse(event.location);
                  return parsedLocation.address || "Address not available";
                } catch (e) {
                  console.error("Error parsing event location:", e);
                  return "Invalid location data";
                }
              })()
            }
          </p>

          {/* Event Dates (Start and End) */}
          {(event.start_date || event.end_date) && (
            <div className="mb-4 text-base text-[#8B4C24]">
              <p>
                <span className="font-bold">📅 Dates: </span>
                {/* Display start date, formatted */}
                {formatDateMMDDYYYY(event.start_date)}
                {/* Display end date if it exists and is different from start date */}
                {event.end_date && formatDateMMDDYYYY(event.start_date) !== formatDateMMDDYYYY(event.end_date) && (
                  ` - ${formatDateMMDDYYYY(event.end_date)}`
                )}
              </p>
            </div>
          )}

          {/* Event Description */}
          <p className="mb-6 text-[#8B4C24]">{event.description}</p>

          {/* Author and Timestamp information */}
          <p className="text-sm text-[#8B4C24]/80 mb-6">
            By {event.user_profiles?.name || 'Unknown'} – {formatTimeAgo(event.created_at)}
          </p>
          {/* Votes, Bookmark, and Show on Map buttons container */}
          <div className="flex items-center mb-6">
            {/* VoteButtons component for upvoting/downvoting */}
            <VoteButtons eventId={event.id} itemType="events" userId={currentUserId} upvotes={event.upvotes} downvotes={event.downvotes} />
            {/* ShowOnMapButton, visible if location coordinates are available */}
            {locationCoords && (
                          <ShowOnMapButton
                            id={event.id}
                            children="Show on Map"
                          />
                        )}
            {/* BookmarkButton component for bookmarking the event */}
            <BookmarkButton eventId={event.id} />          
          </div>
        </div>

        {/* Comment Section for the event */}
        <CommentSection entityId={event.id} entityType="event" />
        {/* Page Footer */}
        <Footer />
      </div>

      {/* Bottom Navigation Bar for mobile */}
      <BottomNav />
      {/* Confirmation modal for deleting the event */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteEvent}
        itemName="event"
      />
    </div>
  );
}
