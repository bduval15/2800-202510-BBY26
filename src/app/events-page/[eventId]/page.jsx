/**
 * EventDetails.jsx
 * Loaf Life - Event Details Page
 *
 * This page displays the details of a specific event.
 * Fetches data from Supabase based on event ID.
 * It includes the event title, description, hack details, author, timestamp, and location.
 * It also includes a button to save the event.
 *
 * Converted from HackPage with table changes for 'events'
 * @author: Nathan O
 * @author: Conner P
 * @author: ChatGPT used to simplify conversion 
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
import ShowOnMapButton from '@/components/map-components/ShowOnMapButton';

export default function EventDetailPage({ params }) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.eventId;
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [locationCoords, setLocationCoords] = useState(null);
  const router = useRouter();
  const optionsMenuRef = useRef(null);

  // Fetch current user session
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

  // Fetch event details
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

  // Close options menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(e.target)) {
        setIsOptionsMenuOpen(false);
      }
    };
    if (isOptionsMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOptionsMenuOpen]);

  if (isLoading) {
    return <div className="max-w-md mx-auto px-4 py-8 text-center text-lg">Loading event details...</div>;
  }

  if (error) {
    return <div className="max-w-md mx-auto px-4 py-8 text-center text-red-500 text-lg">Error: {error}</div>;
  }

  if (!event) {
    return <div className="max-w-md mx-auto px-4 py-8 text-center text-lg">Event not found.</div>;
  }

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'N/A';
    const now = new Date();
    const past = new Date(timestamp);
    const diff = Math.floor((now - past) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins} minutes ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hours ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)} weeks ago`;
  };

  const formatDateMMDDYYYY = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString + 'T00:00:00'); // Ensure date is interpreted as local
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString(undefined, options);
  };

  const toTitleCase = (str) => {
    if (!str) return '';
    const minorWords = new Set([
      "a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "from", "by", "of", "in", "into", "near", "over", "past", "through", "up", "upon", "with", "without"
    ]);
    const words = String(str).toLowerCase().split(' ');
    return words.map((word, index) => {
      if (index === 0 || index === words.length - 1 || !minorWords.has(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    }).join(' ');
  };

  const handleDelete = () => {
    setIsOptionsMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

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
    <div className="pb-6">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <StickyNavbar />

        <div className="bg-[#FDFAF5] p-4 rounded-lg border border-[#8B4C24]/30 pt-16 relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => router.back()}
              className="bg-[#F5EFE6] border-2 border-[#A0522D] text-[#A0522D] hover:bg-[#EADDCA] px-3 py-1.5 rounded-lg shadow-md"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>

            {event.user_id === currentUserId && (
              <div className="relative" ref={optionsMenuRef}>
                <button
                  onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
                  className="bg-[#F5EFE6] hover:bg-[#EADDCA] text-[#A0522D] border-2 border-[#A0522D] p-2 rounded-lg shadow-md"
                  aria-label="Options"
                >
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
                {isOptionsMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                    <button
                      onClick={() => {
                        router.push(`/events-page/${eventId}/edit`);
                        setIsOptionsMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <PencilIcon className="h-5 w-5 mr-2" /> Edit
                    </button>
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

          {/* Title */}
          <h1 className="text-3xl font-bold mb-2 text-[#8B4C24]">{toTitleCase(event.title)}</h1>

          {/* Tags */}
          <div className="mb-6 flex flex-wrap gap-2">
            {event.tags?.map((tag, i) => (
              <Tag key={i} label={toTitleCase(tag)} />
            ))}
          </div>
        
          {/* Location */}
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

          {/* Event Dates */}
          {(event.start_date || event.end_date) && (
            <div className="mb-4 text-base text-[#8B4C24]">
              <p>
                <span className="font-bold">📅 Dates: </span>
                {formatDateMMDDYYYY(event.start_date)}
                {event.end_date && formatDateMMDDYYYY(event.start_date) !== formatDateMMDDYYYY(event.end_date) && (
                  ` - ${formatDateMMDDYYYY(event.end_date)}`
                )}
              </p>
            </div>
          )}

          {/* Description */}
          <p className="mb-6 text-[#8B4C24]">{event.description}</p>

          {/* Author & Timestamp */}
          <p className="text-sm text-[#8B4C24]/80 mb-6">
            By {event.user_profiles?.name || 'Unknown'} – {formatTimeAgo(event.created_at)}
          </p>
          {/* Votes & Bookmark */}
          <div className="flex items-center mb-6">
            <VoteButtons eventId={event.id} itemType="events" userId={currentUserId} upvotes={event.upvotes} downvotes={event.downvotes} />
            {locationCoords && (
              <ShowOnMapButton lat={locationCoords.lat} lng={locationCoords.lng} />
            )}
            <BookmarkButton eventId={event.id} />          
          </div>
        </div>

        <CommentSection entityId={event.id} entityType="event" />
        <Footer />
      </div>

      <BottomNav />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteEvent}
        itemName="event"
      />
    </div>
  );
}
